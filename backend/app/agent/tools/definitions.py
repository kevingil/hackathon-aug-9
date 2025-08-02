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
        "name": "search",
        "description": "Search the web for information on any topic.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to look up.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "search",
        "description": "Search the web for information on any topic.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to look up.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "search",
        "description": "Search the web for information on any topic.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to look up.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "name": "search",
        "description": "Search the web for information on any topic.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to look up.",
                }
            },
            "required": ["query"],
        },
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_DUCK_DUCK_GO_SEARCH",
            "description": "The duckduckgosearch class utilizes the composio duckduckgo search api to perform searches, focusing on web information and details. it leverages the duckduckgo search engine via the composio duckduckgo search api to retrieve relevant web data based on the provided query.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio DuckDuckGo Search API, specifying the search topic. Please provide a value of type string. This parameter is required.",
                        "examples": ["Python programming"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "DuckDuckGoSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_EVENT_SEARCH",
            "description": "The eventsearch class enables scraping of google events search queries. it conducts an event search using the composio events search api, retrieving information on events such as concerts, festivals, and other activities based on the provided query.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio Events Search API, specifying the event topic. Please provide a value of type string. This parameter is required.",
                        "examples": ["Music concerts in New York City"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "EventSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_EXA_SIMILARLINK",
            "description": "Perform a search to find similar links and retrieve a list of relevant results. the search can optionally return contents.",
            "parameters": {
                "properties": {
                    "category": {
                        "default": None,
                        "description": " A data category to focus on, with higher comprehensivity and data cleanliness. Categories right now include company, research paper, news, github, tweet, movie, song, personal site, and pdf. Please provide a value of type string.",
                        "examples": [
                            "company, research paper, news, github, tweet, movie, song, personal site,pdf"
                        ],
                        "title": "Category",
                        "type": "string",
                    },
                    "endCrawlDate": {
                        "default": None,
                        "description": "Results will include links crawled before this date. For e.g. '2023-01-01T00:00:00Z', '2023-01-15T00:00:00Z', '2023-02-01T00:00:00Z'. Please provide a value of type string.",
                        "examples": [
                            "2023-01-01T00:00:00Z",
                            "2023-01-15T00:00:00Z",
                            "2023-02-01T00:00:00Z",
                        ],
                        "format": "date-time",
                        "title": "End Crawl Date",
                        "type": "string",
                    },
                    "endPublishedDate": {
                        "default": None,
                        "description": "Only links published before this date will be returned. For e.g. '2023-01-01', '2023-01-15', '2023-02-01'. Please provide a value of type string.",
                        "examples": ["2023-01-01", "2023-01-15", "2023-02-01"],
                        "format": "date-time",
                        "title": "End Published Date",
                        "type": "string",
                    },
                    "excludeDomains": {
                        "default": None,
                        "description": "List of domains to exclude in the search. For e.g. ['example.com'], ['news.com'], ['blog.com'].",
                        "examples": ["example.com", "news.com", "blog.com"],
                        "items": {"type": "string"},
                        "title": "Exclude Domains",
                        "type": "array",
                    },
                    "includeDomains": {
                        "default": None,
                        "description": "List of domains to include in the search. For e.g. ['example.com'], ['news.com'], ['blog.com'].",
                        "examples": ["example.com", "news.com", "blog.com"],
                        "items": {"type": "string"},
                        "title": "Include Domains",
                        "type": "array",
                    },
                    "numResults": {
                        "default": None,
                        "description": "Number of search results to return. For e.g. 10, 20, 30. Please provide a value of type integer.",
                        "examples": [10, 20, 30],
                        "title": "Num Results",
                        "type": "integer",
                    },
                    "startCrawlDate": {
                        "default": None,
                        "description": "Results will include links crawled after this date. For e.g. '2023-01-01T00:00:00Z', '2023-01-15T00:00:00Z', '2023-02-01T00:00:00Z'. Please provide a value of type string.",
                        "examples": [
                            "2023-01-01T00:00:00Z",
                            "2023-01-15T00:00:00Z",
                            "2023-02-01T00:00:00Z",
                        ],
                        "format": "date-time",
                        "title": "Start Crawl Date",
                        "type": "string",
                    },
                    "startPublishedDate": {
                        "default": None,
                        "description": "Only links published after this date will be returned. For e.g. '2023-01-01', '2023-01-15', '2023-02-01'. Please provide a value of type string.",
                        "examples": ["2023-01-01", "2023-01-15", "2023-02-01"],
                        "format": "date-time",
                        "title": "Start Published Date",
                        "type": "string",
                    },
                    "type": {
                        "default": None,
                        "description": "The type of search: 'keyword', 'neural', or 'magic'. For e.g. 'neural', 'keyword', 'magic'. Please provide a value of type string.",
                        "examples": ["neural", "keyword", "magic"],
                        "title": "Type",
                        "type": "string",
                    },
                    "url": {
                        "description": "The url for which you would like to find similar links. For e.g. 'https://slatestarcodex.com/2014/07/30/meditations-on-moloch/', 'https://ww.google.com/'. Please provide a value of type string. This parameter is required.",
                        "examples": [
                            "https://slatestarcodex.com/2014/07/30/meditations-on-moloch/",
                            "https://ww.google.com/",
                        ],
                        "title": "Url",
                        "type": "string",
                    },
                    "useAutoprompt": {
                        "default": None,
                        "description": "If true, your query will be converted to an Composio Similarlinks query. For e.g. True, False, True. Please provide a value of type boolean.",
                        "examples": [True, False, True],
                        "title": "Use Autoprompt",
                        "type": "boolean",
                    },
                },
                "required": ["url"],
                "title": "ExaSimilarlinkRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_FINANCE_SEARCH",
            "description": "The financesearch class utilizes the composio finance search api to conduct financial searches, focusing on financial data and stock information. it leverages the google finance search engine via the composio finance search api to retrieve pertinent financial details based on the provided query.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio Finance Search API, specifying the financial topic or stock symbol. Please provide a value of type string. This parameter is required.",
                        "examples": ["Apple Inc"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "FinanceSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_GOOGLE_MAPS_SEARCH",
            "description": "The googlemapssearch class performs a location-specific search using the composio goolge maps search api. this class extends the functionality of the base action class to specifically target locations related to the given query. by utilizing the google maps search engine through the composio goolge maps search api, it fetches the most relevant location data based on the input query. the `googlemapssearch` class is particularly useful for applications that need to retrieve and display location information about a specific area. it leverages the powerful search capabilities of google's maps search engine, ensuring that the returned results are accurate and relevant.",
            "parameters": {
                "properties": {
                    "ll": {
                        "default": None,
                        "description": "GPS coordinates for the search, formatted as '@latitude,longitude,zoom_level'. Required when using pagination. Please provide a value of type string.",
                        "examples": ["@40.7455096,-74.0083012,14z"],
                        "title": "Ll",
                        "type": "string",
                    },
                    "q": {
                        "description": "The query you want to search. Please provide a value of type string. This parameter is required.",
                        "examples": ["pizza", "hotels"],
                        "title": "Q",
                        "type": "string",
                    },
                    "start": {
                        "default": None,
                        "description": "Used for pagination. Please provide a value of type integer.",
                        "examples": ["1", "15"],
                        "title": "Start",
                        "type": "integer",
                    },
                },
                "required": ["q"],
                "title": "GoogleMapsSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_IMAGE_SEARCH",
            "description": "The imagesearch class performs an image search using the composio image search api, to target image data and information. it uses the google images search engine through the composio image search api to fetch relevant image information based on the input query.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio Image Search API, specifying the image topic. Please provide a value of type string. This parameter is required.",
                        "examples": ["Apple"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "ImageSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_NEWS_SEARCH",
            "description": "The newssearch class performs a news-specific search using the composio news search api. this class extends the functionality of the base action class to specifically target news articles related to the given query. by utilizing the google news search engine through the composio news search api, it fetches the most relevant news articles based on the input query. the `newssearch` class is particularly useful for applications that need to retrieve and display the latest news articles about a specific topic. it leverages the powerful search capabilities of google's news search engine, ensuring that the returned results are current and relevant.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio News Search API, specifying the topic for news search. Please provide a value of type string. This parameter is required.",
                        "examples": ["Coffee"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "NewsSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_SCHOLAR_SEARCH",
            "description": "Scholar api allows you to scrape results from a google scholar search query. the scholarsearch class performs an academic search using the composio scholar search api, academic papers and scholarly articles. it uses the google scholar search engine through the serp api to fetch relevant academic information based on the input query.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio Scholar Search API, specifying the academic topic or paper title. Please provide a value of type string. This parameter is required.",
                        "examples": ["Machine Learning"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "ScholarSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_SEARCH",
            "description": "Perform a google search using the composio google search api.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio Google Search API. Please provide a value of type string. This parameter is required.",
                        "examples": ["Coffee"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "SearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_SHOPPING_SEARCH",
            "description": "The shoppingsearch class performs a product search using the composio shopping search api.it specifically target shopping results related to the given query. by utilizing the google shopping search engine through the composio shopping search api, it fetches the most relevant product listings based on the input query. the `shoppingsearch` class is particularly useful for applications that need to retrieve and display the latest product listings and shopping results for a specific item. it leverages the powerful search capabilities of google's shopping search engine, ensuring that the returned results are current and relevant.",
            "parameters": {
                "properties": {
                    "query": {
                        "description": "The search query for the Composio Shopping Search API, specifying the product or item for shopping search. Please provide a value of type string. This parameter is required.",
                        "examples": ["Laptop"],
                        "title": "Query",
                        "type": "string",
                    }
                },
                "required": ["query"],
                "title": "ShoppingSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_TAVILY_SEARCH",
            "description": "The composio llm search class serves as a gateway to the composio llm search api, allowing users to perform searches across a broad range of content with multiple filtering options. it accommodates complex queries, including both keyword and phrase searches, with additional parameters to fine-tune the search results. this class enables a tailored search experience by allowing users to specify the search depth, include images and direct answers, apply domain-specific filters, and control the number of results returned. it is designed to meet various search requirements, from quick lookups to in-depth research.",
            "parameters": {
                "properties": {
                    "exclude_domains": {
                        "default": None,
                        "description": "A list of domain names to exclude from the search results. Results from these domains will not be included, which can help to filter out unwanted content.",
                        "examples": [
                            ["exclude.com", "spam.com"],
                            ["irrelevant.org", "bannedsite.net"],
                        ],
                        "items": {},
                        "title": "Exclude Domains",
                        "type": "array",
                    },
                    "include_answer": {
                        "default": False,
                        "description": "Specifies whether to include direct answers to the query in the search results. Useful for queries that expect a factual answer. Please provide a value of type boolean.",
                        "examples": [True, False],
                        "title": "Include Answer",
                        "type": "boolean",
                    },
                    "include_domains": {
                        "default": None,
                        "description": "A list of domain names to include in the search results. Only results from these specified domains will be returned, allowing for targeted searches.",
                        "examples": [
                            ["example.com", "example.org"],
                            ["mysite.com", "myblog.net"],
                        ],
                        "items": {},
                        "title": "Include Domains",
                        "type": "array",
                    },
                    "include_images": {
                        "default": False,
                        "description": "A flag indicating whether to include images in the search results. When set to true, the response will contain image links related to the query. Please provide a value of type boolean.",
                        "examples": [True, False],
                        "title": "Include Images",
                        "type": "boolean",
                    },
                    "include_raw_content": {
                        "default": False,
                        "description": "If set to true, the search results will include the raw content from the search index, which may contain unprocessed HTML or text. Please provide a value of type boolean.",
                        "examples": [True, False],
                        "title": "Include Raw Content",
                        "type": "boolean",
                    },
                    "max_results": {
                        "default": 5,
                        "description": "The maximum number of search results that the API should return. This limits the size of the result set for the query. Please provide a value of type integer.",
                        "examples": [5, 10, 20],
                        "title": "Max Results",
                        "type": "integer",
                    },
                    "query": {
                        "description": "The primary text used to perform the search. This is the key term or phrase that the search functionality will use to retrieve results. Please provide a value of type string. This parameter is required.",
                        "examples": [
                            "climate change",
                            "quantum computing",
                            "best practices for REST API design",
                        ],
                        "title": "Query",
                        "type": "string",
                    },
                    "search_depth": {
                        "default": "basic",
                        "description": "Determines the thoroughness of the search. A 'basic' search might perform a quick and broad search, while 'advanced' could indicate a more intensive and narrow search. Please provide a value of type string.",
                        "enum": ["basic", "advanced"],
                        "examples": ["basic", "advanced"],
                        "title": "Search Depth",
                        "type": "string",
                    },
                },
                "required": ["query"],
                "title": "TavilySearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
    },
    {
        "function": {
            "name": "COMPOSIO_SEARCH_TRENDS_SEARCH",
            "description": "The trendssearch class performs a trend search using the google trends search api, to target trend data and information. it uses the google trends search engine through the google trends search api to fetch relevant trend information based on the input query.",
            "parameters": {
                "properties": {
                    "data_type": {
                        "default": "TIMESERIES",
                        "description": "Parameter defines the type of search you want to do. Available options: TIMESERIES - Interest over time (default) - Accepts both single and multiple queries per search. GEO_MAP - Compared breakdown by region - Accepts only multiple queries per search. GEO_MAP_0 - Interest by region - Accepts only single query per search. RELATED_TOPICS - Related topics - Accepts only single query per search. RELATED_QUERIES - Related queries - Accepts only single query per search. Please provide a value of type string.",
                        "nullable": True,
                        "title": "Data Type",
                        "type": "string",
                    },
                    "query": {
                        "description": "The search query for the Google Trends Search API, specifying the trend topic. Please provide a value of type string. This parameter is required.",
                        "examples": ["Python programming"],
                        "title": "Query",
                        "type": "string",
                    },
                },
                "required": ["query"],
                "title": "TrendsSearchRequest",
                "type": "object",
            },
            "strict": None,
        },
        "type": "function",
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
