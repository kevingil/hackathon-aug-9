tool_definitions = [
    {
        "name": "weather",
        "description": "Get current weather information for a location.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The location to get weather for.",
                }
            },
            "required": ["location"],
        },
    },
    {
        "name": "COMPOSIO_SEARCH_DUCK_DUCK_GO_SEARCH",
        "description": "The duckduckgosearch class utilizes the composio duckduckgo search api to perform searches, focusing on web information and details. it leverages the duckduckgo search engine via the composio duckduckgo search api to retrieve relevant web data based on the provided query.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query for the Composio DuckDuckGo Search API, specifying the search topic.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "COMPOSIO_SEARCH_EVENT_SEARCH",
        "description": "The eventsearch class enables scraping of google events search queries. it conducts an event search using the composio events search api, retrieving information on events such as concerts, festivals, and other activities based on the provided query.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query for the Composio Events Search API, specifying the event topic.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "COMPOSIO_SEARCH_FINANCE_SEARCH",
        "description": "The financesearch class utilizes the composio finance search api to conduct financial searches, focusing on financial data and stock information. it leverages the google finance search engine via the composio finance search api to retrieve pertinent financial details based on the provided query.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query for the Composio Finance Search API, specifying the financial topic or stock symbol.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "COMPOSIO_SEARCH_NEWS_SEARCH",
        "description": "The newssearch class performs a news-specific search using the composio news search api. this class extends the functionality of the base action class to specifically target news articles related to the given query. by utilizing the google news search engine through the composio news search api, it fetches the most relevant news articles based on the input query. the `newssearch` class is particularly useful for applications that need to retrieve and display the latest news articles about a specific topic. it leverages the powerful search capabilities of google's news search engine, ensuring that the returned results are current and relevant.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query for the Composio News Search API, specifying the topic for news search.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "COMPOSIO_SEARCH_SEARCH",
        "description": "Perform a google search using the composio google search api.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query for the Composio Google Search API.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "analyze_results",
        "description": "Analyze tool results.",
        "input_schema": {
            "type": "object",
            "properties": {
                "results": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the tool.",
                        },
                        "result": {
                            "type": "string",
                            "description": "The result of the tool.",
                        },
                        "error": {
                            "type": "boolean",
                            "description": "Whether an error occurred.",
                        },
                    },
                    "required": ["name", "result", "error"],
                }
            },
            "required": ["results"],
        },
    },
    {
        "name": "analyze_user_account",
        "description": "Analyze the user's finances by going through their accounts.",
        "input_schema": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "description": "User ID"},
                "accounts": {
                    "type": "array",
                    "description": "User accounts",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer", "description": "Account ID"},
                            "name": {"type": "string", "description": "Account name"},
                            "balance": {
                                "type": "number",
                                "description": "Account balance",
                            },
                            "expenses": {
                                "type": "array",
                                "description": "Account expenses",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "integer",
                                            "description": "Expense ID",
                                        },
                                        "amount": {
                                            "type": "number",
                                            "description": "Expense amount",
                                        },
                                        "category": {
                                            "type": "string",
                                            "description": "Expense category",
                                        },
                                        "date": {
                                            "type": "string",
                                            "description": "Transaction date",
                                        },
                                        "description": {
                                            "type": "string",
                                            "description": "Transaction description",
                                        },
                                    },
                                    "required": ["id", "amount", "category"],
                                },
                            },
                            "deposits": {
                                "type": "array",
                                "description": "Account deposits",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "integer",
                                            "description": "Deposit ID",
                                        },
                                        "amount": {
                                            "type": "number",
                                            "description": "Deposit amount",
                                        },
                                        "category": {
                                            "type": "string",
                                            "description": "Deposit category",
                                        },
                                        "date": {
                                            "type": "string",
                                            "description": "Transaction date",
                                        },
                                        "description": {
                                            "type": "string",
                                            "description": "Transaction description",
                                        },
                                    },
                                    "required": ["id", "amount", "category"],
                                },
                            },
                        },
                        "required": ["id", "name", "balance", "expenses", "deposits"],
                    },
                },
            },
            "required": ["id", "accounts"],
        },
    },
]


# analyse accounts
#
