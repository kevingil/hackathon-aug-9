import { useState, useRef, useEffect } from "react";
import ChatMessage from "../Chat/ChatMessage";
import ChatInput from "../Chat/ChatInput";
import FinancialDashboard from "../Financial/FinancialDashboard";
import Logo from "../Logo";
import { BASE_URL } from "../../api/const";

export interface ChatBlock {
  type: "thinking" | "redacted_thinking" | "text" | "tool_use" | "tool_result";
  content?: string;
  tool_name?: string;
  tool_input?: any;
  tool_result?: any;
  tool_id?: string;
  iteration?: number;
}

export interface ChatResponse {
  blocks: ChatBlock[];
  stop_reason: string;
  total_iterations: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: ChatResponse;
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFinancialPanel, setShowFinancialPanel] = useState(true);
  const [isFinancialCollapsed, setIsFinancialCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: assistantMessageId,
      role: "assistant", 
      content: "Thinking...",
      timestamp: new Date(),
      isLoading: true,
      isStreaming: false,
      response: {
        blocks: [],
        stop_reason: "",
        total_iterations: 0,
      }
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      // Create a unique URL for this request to avoid caching issues
      const streamUrl = `${BASE_URL}/api/chat/message/stream?t=${Date.now()}`;
      
      // Send the message content via POST to get a streaming response
      const response = await fetch(streamUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response body as a stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let buffer = "";
      let firstBlockReceived = false;
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ""; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6));
              
              if (eventData.type === "block") {
                // Add the new block to the assistant message
                setMessages(prev => {
                  const newMessages = [...prev];
                  const assistantIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
                  
                  if (assistantIndex !== -1) {
                    const updatedMessage = { ...newMessages[assistantIndex] };
                    if (updatedMessage.response) {
                      updatedMessage.response = {
                        ...updatedMessage.response,
                        blocks: [...updatedMessage.response.blocks, eventData.block]
                      };
                    }
                    // Remove thinking state on first block and start streaming indicator
                    if (!firstBlockReceived) {
                      updatedMessage.isLoading = false;
                      updatedMessage.isStreaming = true;
                      updatedMessage.content = "Assistant response";
                      setIsLoading(false);
                    }
                    newMessages[assistantIndex] = updatedMessage;
                  }
                  
                  return newMessages;
                });
                
                // Mark that we've received the first block
                if (!firstBlockReceived) {
                  firstBlockReceived = true;
                }
              } else if (eventData.type === "complete") {
                // Mark the response as complete
                setMessages(prev => {
                  const newMessages = [...prev];
                  const assistantIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
                  
                  if (assistantIndex !== -1) {
                    const updatedMessage = { ...newMessages[assistantIndex] };
                    if (updatedMessage.response) {
                      updatedMessage.response = {
                        ...updatedMessage.response,
                        stop_reason: eventData.stop_reason,
                        total_iterations: eventData.total_iterations
                      };
                    }
                    // Ensure loading state is false and stop streaming indicator
                    updatedMessage.isLoading = false;
                    updatedMessage.isStreaming = false;
                    updatedMessage.content = "Assistant response";
                    newMessages[assistantIndex] = updatedMessage;
                  }
                  
                  return newMessages;
                });
                // Ensure global loading state is false (should already be false from first block)
                setIsLoading(false);
              } else if (eventData.type === "error") {
                throw new Error(eventData.error);
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        const assistantIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
        
        if (assistantIndex !== -1) {
          newMessages[assistantIndex] = {
            ...newMessages[assistantIndex],
            content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
            isLoading: false,
            isStreaming: false,
          };
        }
        
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  const toggleFinancialPanel = () => {
    if (isFinancialCollapsed) {
      setIsFinancialCollapsed(false);
    } else {
      setShowFinancialPanel(!showFinancialPanel);
    }
  };

  const toggleFinancialCollapsed = () => {
    setIsFinancialCollapsed(!isFinancialCollapsed);
  };

  return (
    <div className="flex h-[calc(100vh-0px)] bg-white">
      {/* Chat Section */}
      <div className={`flex flex-col transition-all duration-300 min-w-[500px] w-[500px]`}>
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#eceaff] rounded-lg flex items-center justify-center p-1">
                <Logo size="sm" className="" />
              </div>
                <p className="text-xl p-0 m-0 font-semibold text-gray-900">Rocket Agent</p>
            </div>
            <div className="flex items-center space-x-3">
              {!showFinancialPanel && (
                <button
                  onClick={toggleFinancialPanel}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Show Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center p-0">
                  <Logo  className=" w-48 h-48 " />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Personal Financial Assistant</h2>
                <p className="text-gray-600 mb-2 max-w-md mx-auto">I can help you analyze your finances, plan budgets, and make smart financial decisions.</p>
                <p className="text-sm text-gray-500 mb-8">Ask me about your spending patterns, savings goals, or investment advice!</p>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>

      {/* Financial Panel - Right Side */}

        <div className={`bg-gray-50 border-l border-gray-100 transition-all duration-300 w-full overflow-y-auto`}>
          <div className="h-full ">
            <div className="p-6">
              <FinancialDashboard 
                onToggle={toggleFinancialCollapsed}
                isCollapsed={isFinancialCollapsed}
              />
            </div>
          </div>
        </div>
    </div>
  );
};

export default ChatInterface;
