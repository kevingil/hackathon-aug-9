import { useState } from "react";

interface ThinkingBlockProps {
  content: string;
  isRedacted?: boolean;
  iteration?: number;
}

const ThinkingBlock = ({ content, isRedacted = false, iteration }: ThinkingBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayContent = isExpanded ? content : content.slice(0, 200);
  const shouldTruncate = content.length > 200;

  return (
    <div className="border-t border-gray-100 bg-gray-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded">
              🧠 {isRedacted ? "REDACTED THINKING" : "THINKING"}
            </span>
            {iteration && (
              <span className="text-xs text-gray-500">Iteration {iteration}</span>
            )}
          </div>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        <div className="text-sm text-gray-700 font-mono bg-white rounded border p-3">
          {isRedacted ? (
            <span className="italic text-gray-500">[Thinking content has been redacted]</span>
          ) : (
            <>
              <pre className="whitespace-pre-wrap">{displayContent}</pre>
              {shouldTruncate && !isExpanded && (
                <span className="text-gray-400">...</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingBlock;