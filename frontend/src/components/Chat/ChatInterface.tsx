import { useState, useRef, useEffect } from "react";
import ChatMessage from "../Chat/ChatMessage";
import ChatInput from "../Chat/ChatInput";
import FinancialDashboard from "../Financial/FinancialDashboard";

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

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant", 
      content: "Thinking...",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Assistant response",
          response: data.response,
          timestamp: new Date(),
        };

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = assistantMessage;
          return newMessages;
        });
      } else {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: `Error: ${data.error}`,
            isLoading: false,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content: `Error: Failed to send message`,
          isLoading: false,
        };
        return newMessages;
      });
    } finally {
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
    <div className="flex h-[calc(100vh-150px)] bg-gray-50">
      {/* Financial Panel */}
      {showFinancialPanel && (
        <div className={`bg-gray-100 border-r border-gray-200 transition-all duration-300 ${
          isFinancialCollapsed ? 'w-80' : 'w-96'
        }`}>
          <div className="h-full overflow-y-auto p-4">
            <FinancialDashboard 
              onToggle={toggleFinancialCollapsed}
              isCollapsed={isFinancialCollapsed}
            />
          </div>
        </div>
      )}

      {/* Chat Section */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Financial Planning Assistant</h2>
            <div className="flex items-center space-x-2">
              {!showFinancialPanel && (
                <button
                  onClick={toggleFinancialPanel}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Show Financial Panel</span>
                </button>
              )}
              {showFinancialPanel && (
                <button
                  onClick={toggleFinancialPanel}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Hide Panel</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <h2 className="text-lg font-medium mb-2">Welcome to Your Financial Planning Assistant</h2>
              <p>I can help you analyze your finances, plan budgets, and make financial decisions.</p>
              <p className="text-sm mt-2">Ask me about your spending patterns, savings goals, or investment advice!</p>
              {!showFinancialPanel && (
                <div className="mt-4">
                  <button
                    onClick={toggleFinancialPanel}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>View Financial Dashboard</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
