import anthropic  # type: ignore
from typing import Optional
from app.chat.accounts.schemas import (  # type: ignore
    User,
    ToolResults,
    ToolResultsAnalysis,
    UserAnalysis,
)
from app.agent.tools.artifacts import (  # type: ignore
    UnifiedSearchResponse,
    SearchResults,
    OrganicResult,
    ForumResult,
    ForumAnswer,
    AIPreviewResult,
    MarketResult,
    PriceMovement,
)
from app.chat.accounts.data import mock_user_data

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


def analyze_user_account() -> str:
    """Analyze a user account."""
    user_formated = format_user_account_to_markdown(mock_user_data[0])
    response = CLIENT.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=4000,
        thinking={"type": "enabled", "budget_tokens": 2000},
        messages=[
            {
                "role": "user",
                "content": f"analyze my finances to provide useful advice on how to improve my finances: {user_formated}",
            }
        ],
    )
    print(f"RESPONSE: {response}")
    return response


def parse_composio_search_results(composio_result: dict) -> dict:
    """Parse COMPOSIO_SEARCH_SEARCH results into UnifiedSearchResponse format."""
    try:
        search_data = composio_result.get("data", {}).get("results", {})

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
                redirect_link=result.get("redirect_link"),
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
                    extensions=answer_data.get("extensions"),
                )
                answers.append(answer)

            forum_result = ForumResult(
                title=forum.get("title"),
                link=forum.get("link"),
                source=forum.get("source"),
                date=forum.get("date"),
                extensions=forum.get("extensions", []),
                answers=answers,
            )
            forums.append(forum_result)

        # Build the unified response
        search_results = SearchResults(
            ai_overview=ai_overview,
            organic_results=organic_results if organic_results else None,
            discussions_and_forums=forums if forums else None,
            markets=None,  # Not present in the COMPOSIO results
        )

        unified_response = UnifiedSearchResponse(search_results=search_results)
        return unified_response.model_dump()

    except Exception as e:
        import traceback

        print(traceback.format_exc())
        return {"error": f"Failed to parse COMPOSIO search results: {str(e)}"}


def parse_composio_finance_search_results(composio_result: dict) -> dict:
    """Parse COMPOSIO_SEARCH_FINANCE_SEARCH results into UnifiedSearchResponse format."""
    try:
        search_data = composio_result.get("data", {}).get("results", {})

        def create_market_result(item, region: Optional[str] = None) -> MarketResult:
            """Helper function to create a MarketResult from an item."""
            # Handle price - use extracted_price if available, otherwise try to parse price string
            price = item.get("extracted_price")
            if price is None and "price" in item:
                price_val = item["price"]
                if isinstance(price_val, (int, float)):
                    price = float(price_val)
                elif isinstance(price_val, str):
                    price_str = price_val.replace(",", "").replace("$", "")
                    try:
                        price = float(price_str)
                    except (ValueError, TypeError):
                        price = None
                else:
                    price = None

            # Create price movement
            price_movement = None
            movement_data = item.get("price_movement")
            if isinstance(movement_data, dict):
                price_movement = PriceMovement(
                    movement=movement_data.get("movement"),
                    percentage=movement_data.get("percentage"),
                    value=movement_data.get("value"),
                )

            return MarketResult(
                name=item.get("name"),
                link=item.get("link"),
                stock=item.get("stock"),
                price=price,
                price_movement=price_movement,
                serpapi_link=item.get("serpapi_link"),
                region=region,
            )

        # Parse markets data by region
        markets = {}
        markets_data = search_data.get("markets", {})

        # Known market regions to avoid processing metadata
        valid_market_regions = [
            "asia",
            "crypto",
            "currencies",
            "europe",
            "futures",
            "us",
        ]

        for region, items in markets_data.items():
            # Skip non-market regions (like search_metadata, top_news, etc.)
            if region not in valid_market_regions:
                continue

            # Ensure items is a list
            if not isinstance(items, list):
                continue

            market_results = []
            for item in items:
                # Skip non-dict items (like metadata strings)
                if not isinstance(item, dict):
                    continue

                market_result = create_market_result(item, region)
                market_results.append(market_result)

            if market_results:  # Only add if we have valid results
                markets[region] = market_results

        # Parse discover_more items as "featured" region
        discover_more_data = search_data.get("discover_more", [])
        if isinstance(discover_more_data, list):
            featured_results = []
            for section in discover_more_data:
                if not isinstance(section, dict):
                    continue

                items = section.get("items", [])
                if not isinstance(items, list):
                    continue

                for item in items:
                    # Skip non-dict items
                    if not isinstance(item, dict):
                        continue

                    market_result = create_market_result(item, "featured")
                    featured_results.append(market_result)

            if featured_results:
                markets["featured"] = featured_results

        # Build the unified response (finance search typically doesn't have organic results, forums, or AI overview)
        search_results = SearchResults(
            ai_overview=None,
            organic_results=None,
            discussions_and_forums=None,
            markets=markets if markets else None,
        )

        unified_response = UnifiedSearchResponse(search_results=search_results)
        return unified_response.model_dump()

    except Exception as e:
        import traceback

        print(traceback.format_exc())
        return {"error": f"Failed to parse COMPOSIO finance search results: {str(e)}"}


def parse_composio_news_search_results(composio_result: dict) -> dict:
    """Parse COMPOSIO_SEARCH_NEWS_SEARCH results into UnifiedSearchResponse format."""
    try:
        search_data = composio_result.get("data", {}).get("results", {})

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
            markets=None,
        )

        unified_response = UnifiedSearchResponse(search_results=search_results)
        return unified_response.model_dump()

    except Exception as e:
        import traceback

        print(traceback.format_exc())
        return {"error": f"Failed to parse COMPOSIO news search results: {str(e)}"}


def parse_composio_event_search_results(composio_result: dict) -> dict:
    """Parse COMPOSIO_SEARCH_EVENT_SEARCH results into UnifiedSearchResponse format.

    Event search results have the same structure as news results, so we reuse the same parsing logic.
    """
    try:
        # Event search returns the same structure as news search, so we can reuse the logic
        return parse_composio_news_search_results(composio_result)
    except Exception as e:
        return {"error": f"Failed to parse COMPOSIO event search results: {str(e)}"}
