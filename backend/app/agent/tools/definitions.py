tool_definitions = [
    {
        "name": "get_current_news_headlines",
        "description": "Retrieves the current news headlines. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will returns a list of news headlines. It should be used when providing user with financial advice. It will not provide any other information about the news article.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to search on the news",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "analyze_news_articles",
        "description": "Analyses a list of news articles and returns a detailed summary of each of the articles. Will mainly provide whether the article is positive or negative. It should be used when providing user with financial advice. It will not provide any other information about the news article.",
        "input_schema": {
            "type": "object",
            "properties": {
                "news_articles": {
                    "type": "list",
                    "description": "A list of news articles to analyze",
                }
            },
            "required": ["news_articles"],
        },
    },
    {
        "name": "get_stock_data",
        "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {
                    "type": "string",
                    "description": "The stock ticker symbol, e.g. AAPL for Apple Inc.",
                }
            },
            "required": ["ticker"],
        },
    },
    {
        "name": "analyze_stock_data",
        "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {
                    "type": "string",
                    "description": "The stock ticker symbol, e.g. AAPL for Apple Inc.",
                }
            },
            "required": ["ticker"],
        },
    },
    {
        "name": "provide_advice",
        "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
        "input_schema": {
            "type": "object",
            "properties": {
                "information_on_stocks": {
                    "type": "string",
                    "description": "The stock ticker symbol, e.g. AAPL for Apple Inc.",
                }
            },
            "required": ["ticker"],
        },
    },
]



# mock user data 
# all acvounts
# expenses
# expenses by category
# good spender
# bad spender


# analyse accounts
# 