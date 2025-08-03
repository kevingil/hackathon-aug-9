from pydantic import BaseModel, Field  # type: ignore
from typing import Optional, List


class Expense(BaseModel):
    """Expense model"""

    id: int = Field(description="Expense ID")
    amount: float = Field(description="Expense amount")
    category: str = Field(description="Expense category")
    date: Optional[str] = Field(description="Transaction date", default=None)
    description: Optional[str] = Field(
        description="Transaction description", default=None
    )


class Deposit(BaseModel):
    """Deposit model"""

    id: int = Field(description="Deposit ID")
    amount: float = Field(description="Deposit amount")
    category: str = Field(description="Deposit category")
    date: Optional[str] = Field(description="Transaction date", default=None)
    description: Optional[str] = Field(
        description="Transaction description", default=None
    )


class Account(BaseModel):
    """Account model"""

    id: int = Field(description="Account ID")
    name: str = Field(description="Account name")
    expenses: list[Expense] = Field(description="Account expenses")
    deposits: list[Deposit] = Field(description="Account Deposits")
    balance: float = Field(description="Account balance")


class User(BaseModel):
    id: int = Field(description="User ID")
    accounts: list[Account] = Field(description="User accounts")


class ToolResults(BaseModel):
    """Results model."""

    name: str = Field(description="Tool name")
    result: str = Field(description="The results of the tool calls")
    error: bool = Field(description="Error flag")


class ToolResultsAnalysis(BaseModel):
    """"""

    results: List[ToolResults] = Field(description="The analysis of the results")


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
    account_analysis: List[AccountAnalysis] = Field(description="Analysis for each account")
    overall_analysis: str = Field(description="Overall financial analysis and recommendations")
    error: bool = Field(description="Error flag")
