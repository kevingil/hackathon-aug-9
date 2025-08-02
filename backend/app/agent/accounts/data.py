from schemas import User, Expense, Account, Deposit


# Create some mock data
mock_user_data = [
    User(
        id=1,
        accounts=[
            Account(
                id=1,
                name="Checkings Account",
                expenses=[
                    Expense(id=1, amount=10.99, category="food"),
                    Expense(id=2, amount=10.99, category="food"),
                    Expense(id=3, amount=10.99, category="food"),
                    Expense(id=4, amount=10.99, category="food"),
                    Expense(id=5, amount=10.99, category="food"),
                ],
                despoits=[
                    Deposit(id=1, amount=10.99, category="food"),
                    Deposit(id=2, amount=10.99, category="food"),
                    Deposit(id=3, amount=10.99, category="food"),
                    Deposit(id=4, amount=10.99, category="food"),
                    Deposit(id=5, amount=10.99, category="food"),
                ],
            ),
            Account(
                id=2,
                name="Savings Account",
                expenses=[
                    Expense(id=1, amount=10.99, category="food"),
                    Expense(id=2, amount=10.99, category="food"),
                    Expense(id=3, amount=10.99, category="food"),
                    Expense(id=4, amount=10.99, category="food"),
                    Expense(id=5, amount=10.99, category="food"),
                ],
                despoits=[
                    Deposit(id=1, amount=10.99, category="food"),
                    Deposit(id=2, amount=10.99, category="food"),
                    Deposit(id=3, amount=10.99, category="food"),
                    Deposit(id=4, amount=10.99, category="food"),
                    Deposit(id=5, amount=10.99, category="food"),
                ],
            ),
        ],
    ),
]
