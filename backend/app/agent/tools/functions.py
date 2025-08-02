import anthropic  # type: ignore
from typing import Optional
from app.chat.accounts.schemas import ( # type: ignore
    User,
    ToolResults,
    ToolResultsAnalysis,
    UserAnalysis,
)
from app.agent.tools.artifacts import ( # type: ignore
    UnifiedSearchResponse,
    SearchResults,
    OrganicResult,
    ForumResult,
    ForumAnswer,
    AIPreviewResult,
    MarketResult,
    PriceMovement,
)

CLIENT = anthropic.Anthropic()


def format_user_account_to_markdown(user: User) -> str:
    output = []
    for idx, account in enumerate(user.accounts, 1):
        account_entry = f"""## Account {idx}: {account.name}

        - **Balance:** ${account.balance:.2f}  
        - **Expenses:** {len(account.expenses)}  
        - **Deposits:** {len(account.deposits)}  

        **Expenses:**  
        """
        for expense_idx, expense in enumerate(account.expenses, 1):
            expense_entry = f"""    - **Expense {expense_idx}:**  
            - **Amount:** ${expense.amount:.2f}  
            - **Category:** {expense.category}  
            - **Date:** {expense.date}  
            - **Description:** {expense.description}  

            """
            account_entry += expense_entry
        account_entry += "\n\n**Deposits:**\n"
        for deposit_idx, deposit in enumerate(account.deposits, 1):
            deposit_entry = f"""    - **Deposit {deposit_idx}:**  
            - **Amount:** ${deposit.amount:.2f}  
            - **Category:** {deposit.category}  
            - **Date:** {deposit.date}  
            - **Description:** {deposit.description}  

            """
            account_entry += deposit_entry
        output.append(account_entry.strip())
    user_entry = f"""## User: {user.id}

    {"".join(output)}
    """
    return user_entry


def format_tool_results_to_markdown(tool_results: ToolResults) -> str:
    """Format tool results to markdown."""
    output = []
    tool_entry = f"""
    ## Tool: {tool_results.name}
    - **Result:** {tool_results.result}  
    - **Error:** {tool_results.error}  

    """
    output.append(tool_entry.strip())
    tool_results_entry = f"""## Tool Results

    {"".join(output)}
    """
    return tool_results_entry


def analyze_results(results: ToolResults):
    """Analyze the results of a tool call."""
    results_formated = format_tool_results_to_markdown(results)
    response = CLIENT.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=4000,
        thinking={
            "type": "enabled",
            "budget_tokens": 2000,
        },
        messages=[
            {
                "role": "user",
                "content": f"Analyzse these tool results to see what relavent decisions can be made: {results_formated}",
            }
        ],
        response_model=ToolResultsAnalysis,
    )
    return response


def analyze_user_account(user: User) -> str:
    """Analyze a user account."""
    user_formated = format_user_account_to_markdown(user)
    response = CLIENT.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=4000,
        thinking={
            "type": "enabled",
            "budget_tokens": 2000,
        },
        messages=[
            {
                "role": "user",
                "content": f"analyze my finances to provide useful advice on how to improve my finances: {user_formated}",
            }
        ],
        response_model=UserAnalysis,
    )
    return response


def parse_composio_search_results(composio_result: dict) -> UnifiedSearchResponse:
    """Parse COMPOSIO_SEARCH_SEARCH results into UnifiedSearchResponse format."""
    search_data = composio_result.get("search_results", {}).get("data", {}).get("results", {})
    
    # Parse AI Overview
    ai_overview = None
    if search_data.get("ai_overview"):
        ai_overview = AIPreviewResult()
    
    # Parse Organic Results
    organic_results = []
    organic_data = search_data.get("organic_results", [])
    for result in organic_data:
        organic_result = OrganicResult(
            title=result.get("title"),
            link=result.get("link"),
            displayed_link=result.get("displayed_link"),
            snippet=result.get("snippet"),
            source=result.get("source"),
            date=result.get("date"),
            favicon=result.get("favicon"),
            position=result.get("position"),
            redirect_link=result.get("redirect_link")
        )
        organic_results.append(organic_result)
    
    # Parse Discussions and Forums
    forums = []
    forum_data = search_data.get("discussions_and_forums", [])
    for forum in forum_data:
        # Parse forum answers
        answers = []
        for answer_data in forum.get("answers", []):
            answer = ForumAnswer(
                link=answer_data.get("link"),
                snippet=answer_data.get("snippet"),
                extensions=answer_data.get("extensions")
            )
            answers.append(answer)
        
        forum_result = ForumResult(
            title=forum.get("title"),
            link=forum.get("link"),
            source=forum.get("source"),
            date=forum.get("date"),
            extensions=forum.get("extensions", []),
            answers=answers
        )
        forums.append(forum_result)
    
    # Build the unified response
    search_results = SearchResults(
        ai_overview=ai_overview,
        organic_results=organic_results if organic_results else None,
        discussions_and_forums=forums if forums else None,
        markets=None  # Not present in the COMPOSIO results
    )
    
    return UnifiedSearchResponse(search_results=search_results)


def parse_composio_finance_search_results(composio_result: dict) -> UnifiedSearchResponse:
    """Parse COMPOSIO_SEARCH_FINANCE_SEARCH results into UnifiedSearchResponse format."""
    search_data = composio_result.get("search_results", {}).get("data", {}).get("results", {})
    
    def create_market_result(item: dict, region: Optional[str] = None) -> MarketResult:
        """Helper function to create a MarketResult from an item."""
        # Handle price - use extracted_price if available, otherwise try to parse price string
        price = item.get("extracted_price")
        if price is None and item.get("price"):
            price_str = str(item["price"]).replace(",", "").replace("$", "")
            try:
                price = float(price_str)
            except (ValueError, TypeError):
                price = None
        
        # Create price movement
        price_movement = None
        movement_data = item.get("price_movement")
        if movement_data:
            price_movement = PriceMovement(
                movement=movement_data.get("movement"),
                percentage=movement_data.get("percentage"),
                value=movement_data.get("value")
            )
        
        return MarketResult(
            name=item.get("name"),
            link=item.get("link"),
            stock=item.get("stock"),
            price=price,
            price_movement=price_movement,
            serpapi_link=item.get("serpapi_link"),
            region=region
        )
    
    # Parse markets data by region
    markets = {}
    markets_data = search_data.get("markets", {})
    
    for region, items in markets_data.items():
        market_results = []
        for item in items:
            market_result = create_market_result(item, region)
            market_results.append(market_result)
        markets[region] = market_results
    
    # Parse discover_more items as "featured" region
    discover_more_data = search_data.get("discover_more", [])
    if discover_more_data:
        featured_results = []
        for section in discover_more_data:
            items = section.get("items", [])
            for item in items:
                market_result = create_market_result(item, "featured")
                featured_results.append(market_result)
        if featured_results:
            markets["featured"] = featured_results
    
    # Build the unified response (finance search typically doesn't have organic results, forums, or AI overview)
    search_results = SearchResults(
        ai_overview=None,
        organic_results=None,
        discussions_and_forums=None,
        markets=markets if markets else None
    )
    
    return UnifiedSearchResponse(search_results=search_results)


def parse_composio_news_search_results(composio_result: dict) -> UnifiedSearchResponse:
    """Parse COMPOSIO_SEARCH_NEWS_SEARCH results into UnifiedSearchResponse format."""
    search_data = composio_result.get("search_results", {}).get("data", {}).get("results", {})
    
    # Parse News Results as Organic Results
    organic_results = []
    news_data = search_data.get("news_results", [])
    for news_item in news_data:
        organic_result = OrganicResult(
            title=news_item.get("title"),
            link=news_item.get("link"),
            displayed_link=None,  # Not provided in news results
            snippet=news_item.get("snippet"),
            source=news_item.get("source"),
            date=news_item.get("date"),
            favicon=news_item.get("favicon"),
            position=news_item.get("position"),
            redirect_link=None, 
        )
        organic_results.append(organic_result)
    
    # Build the unified response (news search typically doesn't have AI overview, forums, or markets)
    search_results = SearchResults(
        ai_overview=None,
        organic_results=organic_results if organic_results else None,
        discussions_and_forums=None,
        markets=None
    )
    
    return UnifiedSearchResponse(search_results=search_results)


def parse_composio_event_search_results(composio_result: dict) -> UnifiedSearchResponse:
    """Parse COMPOSIO_SEARCH_EVENT_SEARCH results into UnifiedSearchResponse format.
    
    Event search results have the same structure as news results, so we reuse the same parsing logic.
    """
    # Event search returns the same structure as news search, so we can reuse the logic
    return parse_composio_news_search_results(composio_result)
