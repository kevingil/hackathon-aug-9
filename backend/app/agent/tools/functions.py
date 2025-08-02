import anthropic  # type: ignore
from app.chat.schemas import User
from app.agent.tools.definitions import tool_definitions  # type: ignore

from pydantic import BaseModel, Field
from typing import List

CLIENT = anthropic.Anthropic()


class ToolResults(BaseModel):
    """Results model."""

    name: str = Field(description="Tool name")
    result: str = Field(description="The results of the tool calls")
    error: bool = Field(description="Error flag")


class ToolResultsAnalysis(BaseModel):
    """"""

    results = List[ToolResults] = Field(description="The analysis of the results")


class AccountAnalysis(BaseModel):
    """Account analysis model."""

    id: str = Field(description="The account ID")
    name: str = Field(description="Account name")
    analysis: str = Field(description="The analysis of the account")
    error: bool = Field(description="Error flag")


class UserAnalysis(BaseModel):
    """User analysis model."""

    id: str = Field(description="The user ID")
    name: str = Field(description="User name")
    accounnt_analysis: List[AccountAnalysis] = Field(description="")
    overall_analysis: str = Field(description="Tool response")
    error: bool = Field(description="Error flag")


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
        model="claude-3-7-sonnet-20250219",
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
