import anthropic # type: ignore
import os
import json
from app.agent.tools.example import weather # type: ignore
from composio import Composio
from composio_anthropic import AnthropicProvider


class ChatService:
    def __init__(self):
        # Initialize the Anthropic client
        self.client = anthropic.Anthropic()
        self.model_name = "claude-3-7-sonnet-20250219"
        self.max_tokens = 4000
        self.thinking_budget_tokens = 2000
        
        # Initialize Composio
        self.composio = Composio()
        self.user_id = "0000-1111-2222"
        
        # Define tools (same as agent.py)
        self.tools = [
            {
                "name": "weather",
                "description": "Get current weather information for a location.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The location to get weather for."
                        }
                    },
                    "required": ["location"]
                }
            },
            {
                "name": "search",
                "description": "Search the web for information on any topic.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query to look up."
                        }
                    },
                    "required": ["query"]
                }
            }
        ]

    def process_message(self, user_message):
        """
        Process a user message using the agent's multiple_tool_calls_with_thinking logic.
        Returns structured response data for the frontend.
        """
        try:
            # Initial request (same structure as agent.py)
            response = self.client.messages.create(
                model=self.model_name,
                max_tokens=self.max_tokens,
                thinking={
                    "type": "enabled",
                    "budget_tokens": self.thinking_budget_tokens
                },
                tools=self.tools,
                messages=[{
                    "role": "user",
                    "content": user_message
                }]
            )
            
            # Process the response and handle tool calls
            conversation_history = [{
                "role": "user",
                "content": user_message
            }]
            
            final_response = self._handle_response_chain(response, conversation_history)
            
            return {
                "success": True,
                "response": final_response
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def _handle_response_chain(self, response, conversation_history):
        """
        Handle the full response chain including tool calls, following agent.py logic.
        Returns structured response data.
        """
        response_blocks = []
        iteration = 0
        
        while response.stop_reason == "tool_use":
            iteration += 1
            
            # Extract blocks from current response
            current_blocks = []
            for block in response.content:
                if block.type == "thinking":
                    current_blocks.append({
                        "type": "thinking",
                        "content": block.thinking,
                        "iteration": iteration
                    })
                elif block.type == "redacted_thinking":
                    current_blocks.append({
                        "type": "redacted_thinking", 
                        "content": "[Thinking content redacted]",
                        "iteration": iteration
                    })
                elif block.type == "text":
                    current_blocks.append({
                        "type": "text",
                        "content": block.text,
                        "iteration": iteration
                    })
                elif block.type == "tool_use":
                    current_blocks.append({
                        "type": "tool_use",
                        "tool_name": block.name,
                        "tool_input": block.input,
                        "tool_id": block.id,
                        "iteration": iteration
                    })
            
            response_blocks.extend(current_blocks)
            
            # Add assistant response to conversation history
            assistant_blocks = []
            for block in response.content:
                if block.type in ["thinking", "redacted_thinking", "tool_use"]:
                    assistant_blocks.append(block)
                    
            conversation_history.append({
                "role": "assistant",
                "content": assistant_blocks
            })
            
            # Execute tool if there's a tool_use block
            tool_use_block = next((block for block in response.content if block.type == "tool_use"), None)
            if tool_use_block:
                # Execute the tool
                tool_result = self._execute_tool(tool_use_block.name, tool_use_block.input)
                
                # Add tool result to response blocks
                response_blocks.append({
                    "type": "tool_result",
                    "tool_name": tool_use_block.name,
                    "tool_input": tool_use_block.input,
                    "tool_result": tool_result,
                    "iteration": iteration
                })
                
                # Add tool result to conversation
                conversation_history.append({
                    "role": "user",
                    "content": [{
                        "type": "tool_result",
                        "tool_use_id": tool_use_block.id,
                        "content": json.dumps(tool_result)
                    }]
                })
                
                # Continue the conversation
                response = self.client.messages.create(
                    model=self.model_name,
                    max_tokens=self.max_tokens,
                    thinking={
                        "type": "enabled",
                        "budget_tokens": self.thinking_budget_tokens
                    },
                    tools=self.tools,
                    messages=conversation_history
                )
            else:
                break
        
        # Handle final response (no more tool use)
        if response.stop_reason != "tool_use":
            final_blocks = []
            for block in response.content:
                if block.type == "thinking":
                    final_blocks.append({
                        "type": "thinking",
                        "content": block.thinking,
                        "iteration": iteration + 1
                    })
                elif block.type == "redacted_thinking":
                    final_blocks.append({
                        "type": "redacted_thinking",
                        "content": "[Thinking content redacted]", 
                        "iteration": iteration + 1
                    })
                elif block.type == "text":
                    final_blocks.append({
                        "type": "text",
                        "content": block.text,
                        "iteration": iteration + 1
                    })
            
            response_blocks.extend(final_blocks)
        
        return {
            "blocks": response_blocks,
            "stop_reason": response.stop_reason,
            "total_iterations": iteration + 1
        }

    def _execute_tool(self, tool_name, tool_input):
        """Execute a tool and return the result."""
        try:
            if tool_name == "weather":
                return weather(tool_input["location"])
            elif tool_name == "search":
                # Run search manually using Composio, query is the "q" param
                composio = Composio()
                query = tool_input.get("query", "")
                print(f"Search Query: {query}")

                result = composio.tools.execute(
                    "COMPOSIO_SEARCH_FINANCE_SEARCH",
                    user_id=self.user_id,
                    arguments={"query": query}
                )
                print(f"Composio Search results: {result}")

                return {"search_results": result}
            else:
                return {"error": f"Unknown tool: {tool_name}"}
        except Exception as e:
            return {"error": f"Tool execution failed: {str(e)}"}
