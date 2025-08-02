from pydantic import BaseModel, Field
from typing import List


class Expense(BaseModel):
    """Expsense model"""

    id: int = Field(description="Expense ID")
    amount: float = Field(description="Expense amount")
    category: str = Field(description="Expense category")


class Deposit(BaseModel):
    """Expsense model"""

    id: int = Field(description="Deposite ID")
    amount: float = Field(description="Deposit amount")
    category: str = Field(description="Deposit category")


class Account:
    """Account model"""

    id: int = Field(description="Account ID")
    name: str = Field(description="Account name")
    expenses: List[Expense] = Field(description="Account expenses")
    deposits: List[Deposit] = Field(description="Account Deposits")
    balance: float = Field(description="Account balance")


class User(BaseModel):
    id: int = Field(description="User ID")
    accounts: List[Account] = Field(description="User accounts")
