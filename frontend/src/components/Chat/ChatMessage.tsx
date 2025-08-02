import type { Message } from "../Chat/ChatInterface";
import ThinkingBlock from "../Chat/ThinkingBlock";
import ToolBlock from "../Chat/ToolBlock";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] bg-blue-600 text-white rounded-lg px-4 py-2">
          <p className="whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs text-blue-100 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] bg-white rounded-lg border border-gray-200 overflow-hidden">
        {message.isLoading ? (
          <div className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Thinking...</span>
            </div>
          </div>
        ) : message.response ? (
          <div className="space-y-0">
            {message.response.blocks.map((block, index) => {
              switch (block.type) {
                case "thinking":
                case "redacted_thinking":
                  return (
                    <ThinkingBlock
                      key={index}
                      content={block.content || ""}
                      isRedacted={block.type === "redacted_thinking"}
                      iteration={block.iteration}
                    />
                  );
                case "tool_use":
                  return (
                    <ToolBlock
                      key={index}
                      type="use"
                      toolName={block.tool_name || ""}
                      toolInput={block.tool_input}
                      iteration={block.iteration}
                    />
                  );
                case "tool_result":
                  return (
                    <ToolBlock
                      key={index}
                      type="result"
                      toolName={block.tool_name || ""}
                      toolInput={block.tool_input}
                      toolResult={block.tool_result}
                      iteration={block.iteration}
                    />
                  );
                case "text":
                  return (
                    <div key={index} className="px-4 py-3 border-t border-gray-100">
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-gray-900">{block.content}</p>
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Completed in {message.response.total_iterations} iteration{message.response.total_iterations !== 1 ? 's' : ''} • {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3">
            <p className="text-gray-900">{message.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
