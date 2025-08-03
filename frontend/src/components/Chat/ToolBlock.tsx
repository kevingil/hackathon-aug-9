import { useState } from "react";

// Types matching the Python artifacts schema
interface PriceMovement {
  movement?: "Up" | "Down" | "Neutral";
  percentage?: number;
  value?: number;
}

interface MarketResult {
  type: "market";
  name?: string;
  link?: string;
  stock?: string;
  price?: number;
  price_movement?: PriceMovement;
  serpapi_link?: string;
  region?: string;
}

interface OrganicResult {
  type: "organic";
  title?: string;
  link?: string;
  displayed_link?: string;
  snippet?: string;
  source?: string;
  date?: string;
  favicon?: string;
  position?: number;
  redirect_link?: string;
}

interface ForumAnswer {
  link?: string;
  snippet?: string;
  extensions?: string[];
}

interface ForumResult {
  type: "forum";
  title?: string;
  link?: string;
  source?: string;
  date?: string;
  extensions: string[];
  answers: ForumAnswer[];
}

interface AIPreviewResult {
  type: "ai_overview";
}

interface SearchResults {
  ai_overview?: AIPreviewResult;
  organic_results?: OrganicResult[];
  discussions_and_forums?: ForumResult[];
  markets?: Record<string, MarketResult[]>;
}

interface UnifiedSearchResponse {
  search_results: {
    search_results: SearchResults;
  };
}

// User Analysis Artifact Types
interface AccountAnalysis {
  id: string;
  name: string;
  analysis: string;
  error: boolean;
  balance?: number;
  expense_count?: number;
  deposit_count?: number;
  account_type?: string;
}

interface FinancialRecommendation {
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action_items: string[];
}

interface UserAnalysis {
  id: string;
  name: string;
  account_analysis: AccountAnalysis[];
  overall_analysis: string;
  error: boolean;
  recommendations?: FinancialRecommendation[];
  total_balance?: number;
  total_accounts?: number;
  monthly_expenses?: number;
  savings_rate?: number;
}

interface UserAnalysisResponse {
  user_analysis: UserAnalysis;
}

interface ToolBlockProps {
  type: "use" | "result";
  toolName: string;
  toolInput?: any;
  toolResult?: any;
}

const MarketCard = ({ result }: { result: MarketResult }) => {
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return price.toFixed(2);
  };

  return (
    <div className="bg-white border rounded p-1.5 mb-1 text-xs">
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-900 truncate" style={{fontSize: '11px'}}>{result.name || result.stock}</div>
        {result.price && (
          <div className="flex items-center space-x-1 ml-2">
            <span className="font-bold text-gray-900" style={{fontSize: '11px'}}>${formatPrice(result.price)}</span>
            {result.price_movement && (
              <span className={`px-1 py-0.5 rounded ${
                result.price_movement.movement === "Up" 
                  ? "bg-green-100 text-green-700" 
                  : result.price_movement.movement === "Down" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-gray-100 text-gray-700"
              }`} style={{fontSize: '9px'}}>
                {result.price_movement.movement === "Up" ? "↗" : result.price_movement.movement === "Down" ? "↘" : "→"}
                {result.price_movement.percentage && ` ${result.price_movement.percentage.toFixed(1)}%`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const OrganicCard = ({ result }: { result: OrganicResult }) => (
  <div className="bg-white border rounded p-1.5 mb-1">
    <div className="mb-0.5">
      {result.link ? (
        <a href={result.link} target="_blank" rel="noopener noreferrer" 
           className="font-medium text-blue-600 hover:text-blue-800 underline" style={{fontSize: '11px'}}>
          {result.title}
        </a>
      ) : (
        <div className="font-medium text-gray-900" style={{fontSize: '11px'}}>{result.title}</div>
      )}
    </div>
    {result.snippet && (
      <p className="text-gray-600 mb-0.5 line-clamp-2" style={{fontSize: '10px'}}>{result.snippet}</p>
    )}
    <div className="flex items-center space-x-1 text-gray-500" style={{fontSize: '9px'}}>
      {result.source && <span>{result.source}</span>}
      {result.date && <span>• {result.date}</span>}
    </div>
  </div>
);

const ForumCard = ({ result }: { result: ForumResult }) => (
  <div className="bg-white border rounded p-1.5 mb-1">
    <div className="mb-0.5">
      {result.link ? (
        <a href={result.link} target="_blank" rel="noopener noreferrer" 
           className="font-medium text-blue-600 hover:text-blue-800 underline" style={{fontSize: '11px'}}>
          {result.title}
        </a>
      ) : (
        <div className="font-medium text-gray-900" style={{fontSize: '11px'}}>{result.title}</div>
      )}
    </div>
    <div className="flex items-center space-x-1 text-gray-500 mb-1" style={{fontSize: '9px'}}>
      {result.source && <span>📋 {result.source}</span>}
      {result.date && <span>• {result.date}</span>}
    </div>
    {result.answers && result.answers.length > 0 && (
      <div className="space-y-0.5">
        {result.answers.slice(0, 1).map((answer, idx) => (
          <div key={idx} className="bg-gray-50 rounded p-1">
            {answer.snippet && (
              <p className="text-gray-700 line-clamp-1" style={{fontSize: '10px'}}>{answer.snippet}</p>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const SearchResultsArtifact = ({ results }: { results: UnifiedSearchResponse }) => {
  const search_results = results.search_results.search_results;
  
  const getRegionDisplayName = (region: string) => {
    const regionMap: Record<string, string> = {
      'asia': 'Asian Markets',
      'us': 'US Markets', 
      'europe': 'European Markets',
      'crypto': 'Crypto',
      'currencies': 'Currencies',
      'futures': 'Futures',
      'featured': 'Featured'
    };
    return regionMap[region] || region.charAt(0).toUpperCase() + region.slice(1);
  };
  
  return (
    <div className="space-y-2">
      {/* Markets */}
      {search_results.markets && Object.entries(search_results.markets).map(([region, marketResults]) => (
        <div key={region}>
          <p className="font-semibold text-gray-700 mb-1" style={{fontSize: '12px'}}>📈 {getRegionDisplayName(region)}</p>
          <div className="grid grid-cols-2 gap-1">
            {marketResults.slice(0, 8).map((result, idx) => (
              <MarketCard key={idx} result={result} />
            ))}
          </div>
        </div>
      ))}
      
      {/* Organic Results */}
      {search_results.organic_results && search_results.organic_results.length > 0 && (
        <div>
          <p className="font-semibold text-gray-700 mb-1" style={{fontSize: '12px'}}>🔍 Search Results</p>
          {search_results.organic_results.slice(0, 2).map((result, idx) => (
            <OrganicCard key={idx} result={result} />
          ))}
        </div>
      )}
      
      {/* Forum Results */}
      {search_results.discussions_and_forums && search_results.discussions_and_forums.length > 0 && (
        <div>
          <p className="font-semibold text-gray-700 mb-1" style={{fontSize: '12px'}}>💬 Discussions</p>
          {search_results.discussions_and_forums.slice(0, 1).map((result, idx) => (
            <ForumCard key={idx} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

const AccountCard = ({ account }: { account: AccountAnalysis }) => {
  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };

  const parseAccountDetails = (analysis: string) => {
    const balanceMatch = analysis.match(/balance \$?([\d,]+\.?\d*)/);
    const expenseMatch = analysis.match(/(\d+) expenses?/);
    const depositMatch = analysis.match(/(\d+) deposits?/);
    
    return {
      balance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : account.balance,
      expenses: expenseMatch ? parseInt(expenseMatch[1]) : account.expense_count,
      deposits: depositMatch ? parseInt(depositMatch[1]) : account.deposit_count
    };
  };

  const details = parseAccountDetails(account.analysis);

  return (
    <div className="bg-white border rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900" style={{fontSize: '13px'}}>{account.name}</h4>
        {details.balance && (
          <span className="font-bold text-green-600" style={{fontSize: '13px'}}>
            {formatBalance(details.balance)}
          </span>
        )}
      </div>
      
      {(details.expenses || details.deposits) && (
        <div className="flex space-x-4 mb-2">
          {details.expenses && (
            <div className="flex items-center space-x-1">
              <span className="text-red-500" style={{fontSize: '10px'}}>↗</span>
              <span className="text-gray-600" style={{fontSize: '10px'}}>{details.expenses} expenses</span>
            </div>
          )}
          {details.deposits && (
            <div className="flex items-center space-x-1">
              <span className="text-green-500" style={{fontSize: '10px'}}>↙</span>
              <span className="text-gray-600" style={{fontSize: '10px'}}>{details.deposits} deposits</span>
            </div>
          )}
        </div>
      )}
      
      <p className="text-gray-700" style={{fontSize: '11px'}}>{account.analysis}</p>
    </div>
  );
};

const RecommendationCard = ({ recommendation }: { recommendation: FinancialRecommendation }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900" style={{fontSize: '13px'}}>{recommendation.title}</h4>
        <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(recommendation.priority)}`}>
          {recommendation.priority}
        </span>
      </div>
      <p className="text-gray-600 mb-2" style={{fontSize: '11px'}}>{recommendation.description}</p>
      {recommendation.action_items.length > 0 && (
        <ul className="space-y-1">
          {recommendation.action_items.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5" style={{fontSize: '10px'}}>•</span>
              <span className="text-gray-700" style={{fontSize: '10px'}}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const UserAnalysisArtifact = ({ results }: { results: UserAnalysisResponse }) => {
  const { user_analysis } = results;
  
  // Parse recommendations from overall_analysis if not provided
  const parseRecommendations = (text: string): FinancialRecommendation[] => {
    const sections = text.split(/\d+\.\s+\*\*([^*]+)\*\*:/);
    const recommendations: FinancialRecommendation[] = [];
    
    for (let i = 1; i < sections.length; i += 2) {
      const category = sections[i].trim();
      const content = sections[i + 1]?.trim() || '';
      
      // Extract key points as action items
      const actionItems = content
        .split(/[-•]\s+/)
        .slice(1)
        .map(item => item.trim().replace(/\n.*/s, ''))
        .filter(item => item.length > 0);

      recommendations.push({
        category,
        title: category,
        description: content.split(/[-•]/)[0]?.trim() || '',
        priority: "medium" as const,
        action_items: actionItems.slice(0, 3) // Limit to 3 items
      });
    }
    
    return recommendations;
  };

  const recommendations = user_analysis.recommendations || parseRecommendations(user_analysis.overall_analysis);
  
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="font-semibold text-blue-900 mb-1" style={{fontSize: '14px'}}>
          💰 Financial Analysis for {user_analysis.name}
        </h3>
        <div className="flex space-x-4 text-blue-700" style={{fontSize: '11px'}}>
          <span>📊 {user_analysis.account_analysis.length} accounts</span>
          {user_analysis.total_balance && (
            <span>💵 Total: ${user_analysis.total_balance.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Account Analysis */}
      {user_analysis.account_analysis.length > 0 && (
        <div>
          <p className="font-semibold text-gray-700 mb-2" style={{fontSize: '12px'}}>🏦 Account Overview</p>
          {user_analysis.account_analysis.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <p className="font-semibold text-gray-700 mb-2" style={{fontSize: '12px'}}>💡 Key Recommendations</p>
          {recommendations.slice(0, 3).map((recommendation, idx) => (
            <RecommendationCard key={idx} recommendation={recommendation} />
          ))}
        </div>
      )}
    </div>
  );
};

const ToolBlock = ({ type, toolName, toolInput, toolResult }: ToolBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getToolIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('search') || lowerName.includes('finance')) {
      return "🔍";
    }
    if (lowerName.includes('analyze_user_account') || lowerName.includes('user_analysis')) {
      return "💰";
    }
    switch (lowerName) {
      case "weather":
        return "🌤️";
      case "news":
        return "📰";
      default:
        return "🔧";
    }
  };

  // Check if toolResult matches UnifiedSearchResponse schema
  const isSearchResult = (result: any): result is UnifiedSearchResponse => {
    return result && 
           typeof result === 'object' && 
           'search_results' in result &&
           typeof result.search_results === 'object' &&
           'search_results' in result.search_results &&
           typeof result.search_results.search_results === 'object';
  };

  // Check if toolResult matches UserAnalysisResponse schema
  const isUserAnalysisResult = (result: any): result is UserAnalysisResponse => {
    return result && 
           typeof result === 'object' && 
           'user_analysis' in result &&
           typeof result.user_analysis === 'object' &&
           'account_analysis' in result.user_analysis &&
           Array.isArray(result.user_analysis.account_analysis);
  };

  const shouldShowArtifact = type === "result" && (isSearchResult(toolResult) || isUserAnalysisResult(toolResult));

  return (
    <div className="border-t border-gray-100 bg-gray-50">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          {((type === "use" && toolInput && !(toolInput.q || toolInput.query) && toolName !== "analyze_user_account" && toolName !== "analyze_results") || (type === "result" && !shouldShowArtifact)) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-300 hover:text-gray-400 transition-all"
            >
              {isExpanded ? "▼" : "◀"}
            </button>
          )}
        </div>

        {type === "use" && (
          <div className="text-xs text-gray-500 mt-1">
            {toolInput && (toolInput.q || toolInput.query) ? (
              <div className="text-gray-600" style={{fontSize: '11px'}}>
                {getToolIcon(toolName)} Looking for <span className="italic">{toolInput.q || toolInput.query}</span>
              </div>
            ) : toolName === "analyze_user_account" ? (
              <div className="text-gray-600" style={{fontSize: '11px'}}>
                {getToolIcon(toolName)} Analyzing your financial data...
              </div>
            ) : toolName === "analyze_results" ? (
              <div className="text-gray-600" style={{fontSize: '11px'}}>
                {getToolIcon(toolName)} Processing analysis results...
              </div>
            ) : (
              isExpanded && (
                <div className="bg-white rounded border p-1.5 text-gray-600 font-mono" style={{fontSize: '10px'}}>
                  {JSON.stringify(toolInput, null, 2)}
                </div>
              )
            )}
          </div>
        )}

        {type === "result" && (
          <>
            {shouldShowArtifact ? (
              <div className="mt-2">
                {isSearchResult(toolResult) ? (
                  <SearchResultsArtifact results={toolResult} />
                ) : isUserAnalysisResult(toolResult) ? (
                  <UserAnalysisArtifact results={toolResult} />
                ) : null}
              </div>
            ) : (
              isExpanded && (
                <div className="text-xs text-gray-500 mt-1">
                  {toolInput && (
                    <div className="mb-1">
                      <p className="text-gray-400 mb-0.5" style={{fontSize: '10px'}}>Input:</p>
                      <div className="bg-white rounded border p-1.5 text-gray-600 font-mono" style={{fontSize: '10px'}}>
                        {JSON.stringify(toolInput, null, 2)}
                      </div>
                    </div>
                  )}
                  <div className="bg-white rounded border p-1.5 text-gray-600 font-mono" style={{fontSize: '10px'}}>
                    {JSON.stringify(toolResult, null, 2)}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ToolBlock;
