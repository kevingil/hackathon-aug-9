from app.chat.accounts.schemas import User, Expense, Account, Deposit # type: ignore

# Create some mock data
mock_user_data = [
    User(
        id=1,
        accounts=[
            Account(
                id=1,
                name="Checkings Account",
                expenses=[
                    Expense(id=1, amount=100.0, category="food"),
                    Expense(id=2, amount=200.0, category="rent"),
                    Expense(id=3, amount=50.0, category="entertainment"),
                ],
                deposits=[
                    Deposit(id=1, amount=500.0, category="work"),
                    Deposit(id=2, amount=200.0, category="gift"),
                ],
                balance=450.0,
            ),
            Account(
                id=2,
                name="Savings Account",
                expenses=[
                    Expense(id=1, amount=20.0, category="savings"),
                ],
                deposits=[
                    Deposit(id=1, amount=1000.0, category="work"),
                    Deposit(id=2, amount=500.0, category="gift"),
                ],
                balance=1480.0,
            ),
        ],
    ),
    User(
        id=2,
        accounts=[
            Account(
                id=3,
                name="Checkings Account",
                expenses=[
                    Expense(id=1, amount=150.0, category="food"),
                    Expense(id=2, amount=300.0, category="rent"),
                    Expense(id=3, amount=75.0, category="entertainment"),
                ],
                deposits=[
                    Deposit(id=1, amount=600.0, category="work"),
                    Deposit(id=2, amount=300.0, category="gift"),
                ],
                balance=375.0,
            ),
            Account(
                id=4,
                name="Savings Account",
                expenses=[
                    Expense(id=1, amount=30.0, category="savings"),
                ],
                deposits=[
                    Deposit(id=1, amount=1200.0, category="work"),
                    Deposit(id=2, amount=600.0, category="gift"),
                ],
                balance=1770.0,
            ),
        ],
    ),
    User(
        id=3,
        accounts=[
            Account(
                id=5,
                name="Checkings Account",
                expenses=[
                    Expense(id=1, amount=200.0, category="food"),
                    Expense(id=2, amount=400.0, category="rent"),
                    Expense(id=3, amount=100.0, category="entertainment"),
                ],
                deposits=[
                    Deposit(id=1, amount=700.0, category="work"),
                    Deposit(id=2, amount=400.0, category="gift"),
                ],
                balance=300.0,
            ),
            Account(
                id=6,
                name="Savings Account",
                expenses=[
                    Expense(id=1, amount=40.0, category="savings"),
                ],
                deposits=[
                    Deposit(id=1, amount=1400.0, category="work"),
                    Deposit(id=2, amount=700.0, category="gift"),
                ],
                balance=2060.0,
            ),
        ],
    ),
    User(
        id=4,
        accounts=[
            Account(
                id=7,
                name="Checkings Account",
                expenses=[
                    Expense(id=1, amount=250.0, category="food"),
                    Expense(id=2, amount=500.0, category="rent"),
                    Expense(id=3, amount=125.0, category="entertainment"),
                ],
                deposits=[
                    Deposit(id=1, amount=800.0, category="work"),
                    Deposit(id=2, amount=500.0, category="gift"),
                ],
                balance=225.0,
            ),
            Account(
                id=8,
                name="Savings Account",
                expenses=[
                    Expense(id=1, amount=50.0, category="savings"),
                ],
                deposits=[
                    Deposit(id=1, amount=1600.0, category="work"),
                    Deposit(id=2, amount=800.0, category="gift"),
                ],
                balance=2350.0,
            ),
        ],
    ),
    User(
        id=5,
        accounts=[
            Account(
                id=9,
                name="Checkings Account",
                expenses=[
                    Expense(id=1, amount=300.0, category="food"),
                    Expense(id=2, amount=600.0, category="rent"),
                    Expense(id=3, amount=150.0, category="entertainment"),
                ],
                deposits=[
                    Deposit(id=1, amount=900.0, category="work"),
                    Deposit(id=2, amount=600.0, category="gift"),
                ],
                balance=150.0,
            )
        ],
    ),
]
