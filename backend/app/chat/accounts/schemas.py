from pydantic import BaseModel, Field # type: ignore
from datetime import datetime
from typing import Optional


class Expense(BaseModel):
    """Expense model"""

    id: int = Field(description="Expense ID")
    amount: float = Field(description="Expense amount")
    category: str = Field(description="Expense category")
    date: Optional[str] = Field(description="Transaction date", default=None)
    description: Optional[str] = Field(description="Transaction description", default=None)


class Deposit(BaseModel):
    """Deposit model"""

    id: int = Field(description="Deposit ID")
    amount: float = Field(description="Deposit amount")
    category: str = Field(description="Deposit category")
    date: Optional[str] = Field(description="Transaction date", default=None)
    description: Optional[str] = Field(description="Transaction description", default=None)


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
