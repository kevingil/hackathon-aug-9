import anthropic  # type: ignore
import json
from app.agent.tools.example import weather  # type: ignore
from app.agent.tools.functions import analyze_results, analyze_user_account  # type: ignore
from app.agent.tools.definitions import tool_definitions  # type: ignore
from composio import Composio  # type: ignore


class ChatService:
    def __init__(self):
        # Initialize the Anthropic client
        self.client = anthropic.Anthropic()
        self.model_name = "claude-sonnet-4-20250514"
        self.max_tokens = 4000
        self.thinking_budget_tokens = 2000

        # Initialize Composio
        self.composio = Composio()
        self.user_id = "0000-1111-2222"

        # Define tools (same as agent.py)
        self.tools = tool_definitions

    def process_message(self, user_message):
        """
        Process a user message using the agent's multiple_tool_calls_with_thinking logic.
        Returns structured response data for the frontend.
        """
        print("\n=== CHAT SERVICE: Processing new message ===")
        print(f"User message: {user_message}")
        print(f"Model: {self.model_name}")
        print(f"Max tokens: {self.max_tokens}")

        try:
            # Initial request (same structure as agent.py)
            print("\n--- Making initial API call to Claude ---")
            response = self.client.messages.create(
                model=self.model_name,
                max_tokens=self.max_tokens,
                thinking={
                    "type": "enabled",
                    "budget_tokens": self.thinking_budget_tokens,
                },
                tools=self.tools,
                messages=[{"role": "user", "content": user_message}],
            )

            print(f"Initial response stop_reason: {response.stop_reason}")
            print(f"Initial response content blocks: {len(response.content)}")

            # Process the response and handle tool calls
            conversation_history = [{"role": "user", "content": user_message}]
            print(
                f"Starting conversation history with {len(conversation_history)} messages"
            )

            final_response = self._handle_response_chain(response, conversation_history)

            print("\n=== CHAT SERVICE: Processing complete ===")
            print(f"Final response blocks: {len(final_response.get('blocks', []))}")
            print(f"Total iterations: {final_response.get('total_iterations', 0)}")
            print(f"Stop reason: {final_response.get('stop_reason', 'unknown')}")

            return {"success": True, "response": final_response}

        except Exception as e:
            print("\n!!! CHAT SERVICE ERROR !!!")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            import traceback

            print(f"Traceback: {traceback.format_exc()}")
            return {"success": False, "error": str(e)}

    def _handle_response_chain(self, response, conversation_history):
        """
        Handle the full response chain including tool calls, following agent.py logic.
        Returns structured response data.
        """
        print("\n--- Starting response chain handling ---")
        response_blocks = []
        iteration = 0

        while response.stop_reason == "tool_use":
            iteration += 1
            print(f"\n*** ITERATION {iteration} ***")
            print(f"Stop reason: {response.stop_reason}")
            print(f"Content blocks in response: {len(response.content)}")

            # Log block types in this response
            block_types = [block.type for block in response.content]
            print(f"Block types: {block_types}")

            # Extract blocks from current response
            current_blocks = []
            for block in response.content:
                if block.type == "thinking":
                    current_blocks.append(
                        {
                            "type": "thinking",
                            "content": block.thinking,
                            "iteration": iteration,
                        }
                    )
                elif block.type == "redacted_thinking":
                    current_blocks.append(
                        {
                            "type": "redacted_thinking",
                            "content": "[Thinking content redacted]",
                            "iteration": iteration,
                        }
                    )
                elif block.type == "text":
                    current_blocks.append(
                        {"type": "text", "content": block.text, "iteration": iteration}
                    )
                elif block.type == "tool_use":
                    current_blocks.append(
                        {
                            "type": "tool_use",
                            "tool_name": block.name,
                            "tool_input": block.input,
                            "tool_id": block.id,
                            "iteration": iteration,
                        }
                    )

            response_blocks.extend(current_blocks)
            print(f"Added {len(current_blocks)} blocks to response")

            # Add assistant response to conversation history
            assistant_blocks = []
            for block in response.content:
                if block.type in ["thinking", "redacted_thinking", "tool_use"]:
                    assistant_blocks.append(block)

            conversation_history.append(
                {"role": "assistant", "content": assistant_blocks}
            )
            print("Added assistant message to conversation history")

            # Execute ALL tool_use blocks if there are any
            tool_use_blocks = [
                block for block in response.content if block.type == "tool_use"
            ]
            if tool_use_blocks:
                print(f"*** TOOL EXECUTION ({len(tool_use_blocks)} tools) ***")

                # Collect all tool results
                tool_results_content = []

                for tool_use_block in tool_use_blocks:
                    print(f"Tool name: {tool_use_block.name}")
                    print(f"Tool input: {tool_use_block.input}")
                    print(f"Tool ID: {tool_use_block.id}")

                    # Execute the tool
                    tool_result = self._execute_tool(
                        tool_use_block.name, tool_use_block.input
                    )
                    print(f"Tool execution result: {tool_result}")

                    # Add tool result to response blocks
                    response_blocks.append(
                        {
                            "type": "tool_result",
                            "tool_name": tool_use_block.name,
                            "tool_input": tool_use_block.input,
                            "tool_result": tool_result,
                            "iteration": iteration,
                        }
                    )

                    # Collect tool result for conversation history
                    tool_results_content.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_use_block.id,
                            "content": json.dumps(tool_result),
                        }
                    )

                print("Added all tool results to response blocks")

                # Add ALL tool results to conversation in a single message
                conversation_history.append(
                    {
                        "role": "user",
                        "content": tool_results_content,
                    }
                )
                print(
                    f"Added {len(tool_results_content)} tool results to conversation history. Total messages: {len(conversation_history)}"
                )

                # Continue the conversation
                print("*** CONTINUING CONVERSATION AFTER TOOL USE ***")
                response = self.client.messages.create(
                    model=self.model_name,
                    max_tokens=self.max_tokens,
                    thinking={
                        "type": "enabled",
                        "budget_tokens": self.thinking_budget_tokens,
                    },
                    tools=self.tools,
                    messages=conversation_history,
                )
            else:
                print("No tool_use block found, breaking loop")
                break

        # Handle final response (no more tool use)
        print("\n*** FINAL RESPONSE PROCESSING ***")
        print(f"Final stop reason: {response.stop_reason}")
        if response.stop_reason != "tool_use":
            final_blocks = []
            for block in response.content:
                if block.type == "thinking":
                    final_blocks.append(
                        {
                            "type": "thinking",
                            "content": block.thinking,
                            "iteration": iteration + 1,
                        }
                    )
                elif block.type == "redacted_thinking":
                    final_blocks.append(
                        {
                            "type": "redacted_thinking",
                            "content": "[Thinking content redacted]",
                            "iteration": iteration + 1,
                        }
                    )
                elif block.type == "text":
                    final_blocks.append(
                        {
                            "type": "text",
                            "content": block.text,
                            "iteration": iteration + 1,
                        }
                    )

            response_blocks.extend(final_blocks)
            print(f"Added {len(final_blocks)} final blocks to response")

        print("\n--- Response chain handling complete ---")
        print(f"Total response blocks: {len(response_blocks)}")
        print(f"Total iterations: {iteration + 1}")

        return {
            "blocks": response_blocks,
            "stop_reason": response.stop_reason,
            "total_iterations": iteration + 1,
        }

    def _execute_tool(self, tool_name, tool_input):
        """Execute a tool and return the result."""
        print(f"\n+++ EXECUTING TOOL: {tool_name} +++")
        print(f"Tool input: {tool_input}")
        print(f"Tool input type: {type(tool_input)}")

        try:
            if tool_name == "analyze_user_account":
                result = analyze_user_account(tool_input["user"])
                return {"search_results": result}
            elif tool_name == "analyze_results":
                result = analyze_results(tool_input["results"])
                return {"search_results": result}
            print("Executing Composio tool for non-weather request")
            print(f"User ID: {self.user_id}")
            composio = Composio()
            result = composio.tools.execute(
                slug=tool_name,
                user_id=self.user_id,
                arguments=tool_input,
            )
            result = result.get("search_results", {}).get("data", {}).get("results", {})
            print(f"Composio Search results: {result}")
            print(f"Composio result type: {type(result)}")

            return {"search_results": result}

        except Exception as e:
            error_msg = f"Tool execution failed: {str(e)}"
            print("!!! TOOL EXECUTION EXCEPTION !!!")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            import traceback

            print(f"Traceback: {traceback.format_exc()}")
            return {"error": error_msg}
