import { useState } from "react";

interface ToolBlockProps {
  type: "use" | "result";
  toolName: string;
  toolInput?: any;
  toolResult?: any;
  iteration?: number;
}

const ToolBlock = ({ type, toolName, toolInput, toolResult, iteration }: ToolBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getToolIcon = (name: string) => {
    switch (name) {
      case "weather":
        return "🌤️";
      case "news":
        return "📰";
      default:
        return "🔧";
    }
  };

  return (
    <div className="border-t border-gray-100 bg-blue-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded">
              {getToolIcon(toolName)} {type === "use" ? "TOOL USE" : "TOOL RESULT"}: {toolName.toUpperCase()}
            </span>
            {iteration && (
              <span className="text-xs text-gray-600">Iteration {iteration}</span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {isExpanded ? "Hide details" : "Show details"}
          </button>
        </div>

        {type === "use" && (
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Calling {toolName} with:</p>
            <div className="bg-white rounded border p-2 text-blue-900 font-mono text-xs">
              {JSON.stringify(toolInput, null, 2)}
            </div>
          </div>
        )}

        {type === "result" && (
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tool {toolName} returned:</p>
            {isExpanded && toolInput && (
              <div className="mb-2">
                <p className="text-xs text-blue-600 mb-1">Input:</p>
                <div className="bg-white rounded border p-2 text-blue-700 font-mono text-xs">
                  {JSON.stringify(toolInput, null, 2)}
                </div>
              </div>
            )}
            <div className="bg-white rounded border p-2 text-green-800 font-mono text-xs">
              {JSON.stringify(toolResult, null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolBlock;