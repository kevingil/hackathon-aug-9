from app.chat.accounts.schemas import User, Expense, Account, Deposit # type: ignore

# Create comprehensive mock transaction data
mock_user_data = [
    User(
        id=1,
        accounts=[
            Account(
                id=1,
                name="Checkings Account",
                expenses=[
                    # Regular monthly expenses
                    Expense(id=1, amount=1200.0, category="rent", date="2024-01-01", description="Monthly rent payment"),
                    Expense(id=2, amount=1200.0, category="rent", date="2024-02-01", description="Monthly rent payment"),
                    Expense(id=3, amount=1200.0, category="rent", date="2024-03-01", description="Monthly rent payment"),
                    
                    # Food expenses
                    Expense(id=4, amount=89.50, category="food", date="2024-01-05", description="Grocery shopping - Whole Foods"),
                    Expense(id=5, amount=45.20, category="food", date="2024-01-12", description="Lunch - Downtown Bistro"),
                    Expense(id=6, amount=156.78, category="food", date="2024-01-18", description="Weekly groceries"),
                    Expense(id=7, amount=23.40, category="food", date="2024-01-25", description="Coffee shop"),
                    Expense(id=8, amount=112.30, category="food", date="2024-02-03", description="Grocery shopping"),
                    Expense(id=9, amount=67.80, category="food", date="2024-02-14", description="Valentine's dinner"),
                    Expense(id=10, amount=134.50, category="food", date="2024-02-20", description="Weekly groceries"),
                    Expense(id=11, amount=98.20, category="food", date="2024-03-05", description="Grocery shopping"),
                    
                    # Utilities
                    Expense(id=12, amount=85.40, category="utilities", date="2024-01-15", description="Electric bill"),
                    Expense(id=13, amount=65.20, category="utilities", date="2024-01-20", description="Internet bill"),
                    Expense(id=14, amount=92.80, category="utilities", date="2024-02-15", description="Electric bill"),
                    Expense(id=15, amount=65.20, category="utilities", date="2024-02-20", description="Internet bill"),
                    Expense(id=16, amount=78.90, category="utilities", date="2024-03-15", description="Electric bill"),
                    
                    # Transportation
                    Expense(id=17, amount=45.00, category="transportation", date="2024-01-08", description="Gas station"),
                    Expense(id=18, amount=12.50, category="transportation", date="2024-01-15", description="Subway card refill"),
                    Expense(id=19, amount=52.30, category="transportation", date="2024-02-05", description="Gas station"),
                    Expense(id=20, amount=18.75, category="transportation", date="2024-02-12", description="Uber ride"),
                    Expense(id=21, amount=48.60, category="transportation", date="2024-03-08", description="Gas station"),
                    
                    # Entertainment
                    Expense(id=22, amount=15.99, category="entertainment", date="2024-01-01", description="Netflix subscription"),
                    Expense(id=23, amount=45.50, category="entertainment", date="2024-01-10", description="Movie tickets"),
                    Expense(id=24, amount=89.20, category="entertainment", date="2024-01-22", description="Concert tickets"),
                    Expense(id=25, amount=15.99, category="entertainment", date="2024-02-01", description="Netflix subscription"),
                    Expense(id=26, amount=34.80, category="entertainment", date="2024-02-18", description="Bowling night"),
                    Expense(id=27, amount=15.99, category="entertainment", date="2024-03-01", description="Netflix subscription"),
                    
                    # Healthcare
                    Expense(id=28, amount=25.00, category="healthcare", date="2024-01-20", description="Pharmacy copay"),
                    Expense(id=29, amount=150.00, category="healthcare", date="2024-02-10", description="Doctor visit copay"),
                    
                    # Shopping
                    Expense(id=30, amount=89.99, category="shopping", date="2024-01-28", description="Clothing purchase"),
                    Expense(id=31, amount=234.50, category="shopping", date="2024-02-25", description="Electronics - headphones"),
                    Expense(id=32, amount=67.80, category="shopping", date="2024-03-12", description="Home supplies"),
                ],
                deposits=[
                    # Salary deposits
                    Deposit(id=1, amount=3200.0, category="salary", date="2024-01-01", description="Monthly salary"),
                    Deposit(id=2, amount=3200.0, category="salary", date="2024-02-01", description="Monthly salary"),
                    Deposit(id=3, amount=3200.0, category="salary", date="2024-03-01", description="Monthly salary"),
                    
                    # Other income
                    Deposit(id=4, amount=500.0, category="freelance", date="2024-01-15", description="Freelance project payment"),
                    Deposit(id=5, amount=150.0, category="refund", date="2024-01-25", description="Insurance refund"),
                    Deposit(id=6, amount=750.0, category="freelance", date="2024-02-20", description="Freelance project payment"),
                    Deposit(id=7, amount=200.0, category="gift", date="2024-02-14", description="Birthday gift"),
                    Deposit(id=8, amount=300.0, category="freelance", date="2024-03-10", description="Small freelance project"),
                ],
                balance=2845.67,
            ),
            Account(
                id=2,
                name="Savings Account",
                expenses=[
                    Expense(id=33, amount=500.0, category="transfer", date="2024-01-02", description="Transfer to checking"),
                    Expense(id=34, amount=1000.0, category="investment", date="2024-02-15", description="Stock market investment"),
                ],
                deposits=[
                    Deposit(id=9, amount=1000.0, category="transfer", date="2024-01-05", description="Automatic savings"),
                    Deposit(id=10, amount=1000.0, category="transfer", date="2024-02-05", description="Automatic savings"),
                    Deposit(id=11, amount=1000.0, category="transfer", date="2024-03-05", description="Automatic savings"),
                    Deposit(id=12, amount=2500.0, category="bonus", date="2024-01-31", description="Year-end bonus"),
                ],
                balance=4000.0,
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
                    # Rent and utilities
                    Expense(id=35, amount=1800.0, category="rent", date="2024-01-01", description="Monthly rent"),
                    Expense(id=36, amount=1800.0, category="rent", date="2024-02-01", description="Monthly rent"),
                    Expense(id=37, amount=1800.0, category="rent", date="2024-03-01", description="Monthly rent"),
                    Expense(id=38, amount=120.50, category="utilities", date="2024-01-10", description="Electric and gas"),
                    Expense(id=39, amount=75.00, category="utilities", date="2024-01-15", description="Internet and cable"),
                    Expense(id=40, amount=135.20, category="utilities", date="2024-02-10", description="Electric and gas"),
                    Expense(id=41, amount=75.00, category="utilities", date="2024-02-15", description="Internet and cable"),
                    
                    # Food and dining
                    Expense(id=42, amount=245.80, category="food", date="2024-01-07", description="Weekly grocery shopping"),
                    Expense(id=43, amount=89.50, category="food", date="2024-01-14", description="Dinner out"),
                    Expense(id=44, amount=198.30, category="food", date="2024-01-21", description="Grocery shopping"),
                    Expense(id=45, amount=156.70, category="food", date="2024-01-28", description="Family dinner"),
                    Expense(id=46, amount=267.40, category="food", date="2024-02-04", description="Grocery shopping"),
                    Expense(id=47, amount=78.90, category="food", date="2024-02-11", description="Lunch meeting"),
                    Expense(id=48, amount=203.50, category="food", date="2024-02-18", description="Grocery shopping"),
                    
                    # Transportation
                    Expense(id=49, amount=350.00, category="transportation", date="2024-01-05", description="Car payment"),
                    Expense(id=50, amount=85.40, category="transportation", date="2024-01-12", description="Gas"),
                    Expense(id=51, amount=350.00, category="transportation", date="2024-02-05", description="Car payment"),
                    Expense(id=52, amount=92.80, category="transportation", date="2024-02-12", description="Gas"),
                    Expense(id=53, amount=65.00, category="transportation", date="2024-02-20", description="Car wash and maintenance"),
                    
                    # Healthcare and insurance
                    Expense(id=54, amount=245.00, category="healthcare", date="2024-01-15", description="Health insurance premium"),
                    Expense(id=55, amount=245.00, category="healthcare", date="2024-02-15", description="Health insurance premium"),
                    Expense(id=56, amount=45.00, category="healthcare", date="2024-01-25", description="Pharmacy"),
                    
                    # Entertainment and subscriptions
                    Expense(id=57, amount=12.99, category="entertainment", date="2024-01-01", description="Spotify premium"),
                    Expense(id=58, amount=15.99, category="entertainment", date="2024-01-01", description="Netflix"),
                    Expense(id=59, amount=89.99, category="entertainment", date="2024-01-18", description="Concert tickets"),
                    Expense(id=60, amount=12.99, category="entertainment", date="2024-02-01", description="Spotify premium"),
                    Expense(id=61, amount=15.99, category="entertainment", date="2024-02-01", description="Netflix"),
                ],
                deposits=[
                    Deposit(id=13, amount=4500.0, category="salary", date="2024-01-01", description="Bi-weekly salary"),
                    Deposit(id=14, amount=4500.0, category="salary", date="2024-01-15", description="Bi-weekly salary"),
                    Deposit(id=15, amount=4500.0, category="salary", date="2024-02-01", description="Bi-weekly salary"),
                    Deposit(id=16, amount=4500.0, category="salary", date="2024-02-15", description="Bi-weekly salary"),
                    Deposit(id=17, amount=4500.0, category="salary", date="2024-03-01", description="Bi-weekly salary"),
                    Deposit(id=18, amount=800.0, category="side_hustle", date="2024-01-20", description="Consulting work"),
                    Deposit(id=19, amount=1200.0, category="side_hustle", date="2024-02-25", description="Consulting project"),
                ],
                balance=3234.56,
            ),
            Account(
                id=4,
                name="Savings Account",
                expenses=[
                    Expense(id=62, amount=2000.0, category="investment", date="2024-01-30", description="401k contribution"),
                    Expense(id=63, amount=2000.0, category="investment", date="2024-02-28", description="401k contribution"),
                ],
                deposits=[
                    Deposit(id=20, amount=1500.0, category="transfer", date="2024-01-05", description="Monthly savings transfer"),
                    Deposit(id=21, amount=1500.0, category="transfer", date="2024-02-05", description="Monthly savings transfer"),
                    Deposit(id=22, amount=1500.0, category="transfer", date="2024-03-05", description="Monthly savings transfer"),
                    Deposit(id=23, amount=5000.0, category="bonus", date="2024-02-15", description="Performance bonus"),
                ],
                balance=5000.0,
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
                    # Housing
                    Expense(id=64, amount=950.0, category="rent", date="2024-01-01", description="Monthly rent"),
                    Expense(id=65, amount=950.0, category="rent", date="2024-02-01", description="Monthly rent"),
                    Expense(id=66, amount=950.0, category="rent", date="2024-03-01", description="Monthly rent"),
                    
                    # Food
                    Expense(id=67, amount=78.90, category="food", date="2024-01-03", description="Grocery store"),
                    Expense(id=68, amount=89.50, category="food", date="2024-01-10", description="Weekly groceries"),
                    Expense(id=69, amount=45.60, category="food", date="2024-01-17", description="Restaurant dinner"),
                    Expense(id=70, amount=123.40, category="food", date="2024-01-24", description="Grocery shopping"),
                    Expense(id=71, amount=67.80, category="food", date="2024-01-31", description="Takeout food"),
                    Expense(id=72, amount=156.70, category="food", date="2024-02-07", description="Weekly groceries"),
                    Expense(id=73, amount=234.50, category="food", date="2024-02-14", description="Valentine's day dinner"),
                    Expense(id=74, amount=89.20, category="food", date="2024-02-21", description="Grocery shopping"),
                    
                    # Utilities
                    Expense(id=75, amount=89.30, category="utilities", date="2024-01-12", description="Electric bill"),
                    Expense(id=76, amount=55.00, category="utilities", date="2024-01-18", description="Internet"),
                    Expense(id=77, amount=95.20, category="utilities", date="2024-02-12", description="Electric bill"),
                    Expense(id=78, amount=55.00, category="utilities", date="2024-02-18", description="Internet"),
                    
                    # Transportation
                    Expense(id=79, amount=120.00, category="transportation", date="2024-01-01", description="Monthly metro pass"),
                    Expense(id=80, amount=120.00, category="transportation", date="2024-02-01", description="Monthly metro pass"),
                    Expense(id=81, amount=25.50, category="transportation", date="2024-01-15", description="Uber ride"),
                    Expense(id=82, amount=18.75, category="transportation", date="2024-02-08", description="Taxi"),
                    
                    # Entertainment
                    Expense(id=83, amount=45.99, category="entertainment", date="2024-01-05", description="Video game purchase"),
                    Expense(id=84, amount=89.50, category="entertainment", date="2024-01-20", description="Concert tickets"),
                    Expense(id=85, amount=12.99, category="entertainment", date="2024-02-01", description="Streaming service"),
                    
                    # Personal care
                    Expense(id=86, amount=45.00, category="personal_care", date="2024-01-22", description="Haircut"),
                    Expense(id=87, amount=23.50, category="personal_care", date="2024-02-05", description="Pharmacy items"),
                ],
                deposits=[
                    Deposit(id=24, amount=2800.0, category="salary", date="2024-01-01", description="Monthly salary"),
                    Deposit(id=25, amount=2800.0, category="salary", date="2024-02-01", description="Monthly salary"),
                    Deposit(id=26, amount=2800.0, category="salary", date="2024-03-01", description="Monthly salary"),
                    Deposit(id=27, amount=450.0, category="freelance", date="2024-01-18", description="Graphic design project"),
                    Deposit(id=28, amount=320.0, category="freelance", date="2024-02-22", description="Logo design"),
                    Deposit(id=29, amount=100.0, category="cashback", date="2024-01-30", description="Credit card cashback"),
                ],
                balance=1567.89,
            ),
            Account(
                id=6,
                name="Savings Account",
                expenses=[
                    Expense(id=88, amount=300.0, category="transfer", date="2024-02-28", description="Emergency fund withdrawal"),
                ],
                deposits=[
                    Deposit(id=30, amount=500.0, category="transfer", date="2024-01-05", description="Monthly savings"),
                    Deposit(id=31, amount=500.0, category="transfer", date="2024-02-05", description="Monthly savings"),
                    Deposit(id=32, amount=500.0, category="transfer", date="2024-03-05", description="Monthly savings"),
                    Deposit(id=33, amount=1000.0, category="gift", date="2024-01-15", description="Tax refund"),
                ],
                balance=2200.0,
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
                    # Housing
                    Expense(id=89, amount=2200.0, category="rent", date="2024-01-01", description="Monthly rent"),
                    Expense(id=90, amount=2200.0, category="rent", date="2024-02-01", description="Monthly rent"),
                    Expense(id=91, amount=2200.0, category="rent", date="2024-03-01", description="Monthly rent"),
                    
                    # Premium food and dining
                    Expense(id=92, amount=345.80, category="food", date="2024-01-05", description="Whole Foods grocery shopping"),
                    Expense(id=93, amount=189.50, category="food", date="2024-01-12", description="Fine dining restaurant"),
                    Expense(id=94, amount=267.40, category="food", date="2024-01-19", description="Organic grocery shopping"),
                    Expense(id=95, amount=456.70, category="food", date="2024-01-26", description="Dinner party catering"),
                    Expense(id=96, amount=378.90, category="food", date="2024-02-02", description="Premium grocery shopping"),
                    Expense(id=97, amount=234.60, category="food", date="2024-02-09", description="Restaurant dinner"),
                    Expense(id=98, amount=298.50, category="food", date="2024-02-16", description="Grocery shopping"),
                    
                    # Utilities
                    Expense(id=99, amount=156.70, category="utilities", date="2024-01-10", description="Electric and gas"),
                    Expense(id=100, amount=89.99, category="utilities", date="2024-01-15", description="Premium internet plan"),
                    Expense(id=101, amount=45.00, category="utilities", date="2024-01-20", description="Water bill"),
                    Expense(id=102, amount=189.50, category="utilities", date="2024-02-10", description="Electric and gas"),
                    Expense(id=103, amount=89.99, category="utilities", date="2024-02-15", description="Premium internet plan"),
                    
                    # Transportation
                    Expense(id=104, amount=650.0, category="transportation", date="2024-01-05", description="Car payment - luxury vehicle"),
                    Expense(id=105, amount=156.80, category="transportation", date="2024-01-12", description="Premium gas"),
                    Expense(id=106, amount=650.0, category="transportation", date="2024-02-05", description="Car payment"),
                    Expense(id=107, amount=189.40, category="transportation", date="2024-02-12", description="Premium gas"),
                    Expense(id=108, amount=450.0, category="transportation", date="2024-02-20", description="Car maintenance - luxury service"),
                    
                    # Premium entertainment
                    Expense(id=109, amount=289.99, category="entertainment", date="2024-01-08", description="Theater season tickets"),
                    Expense(id=110, amount=156.50, category="entertainment", date="2024-01-15", description="Premium streaming services"),
                    Expense(id=111, amount=450.0, category="entertainment", date="2024-01-25", description="Wine tasting event"),
                    Expense(id=112, amount=189.99, category="entertainment", date="2024-02-05", description="Concert VIP tickets"),
                    
                    # Shopping and lifestyle
                    Expense(id=113, amount=789.99, category="shopping", date="2024-01-18", description="Designer clothing"),
                    Expense(id=114, amount=1200.0, category="shopping", date="2024-02-14", description="Jewelry purchase"),
                    Expense(id=115, amount=345.50, category="personal_care", date="2024-01-30", description="Spa treatment"),
                    Expense(id=116, amount=189.00, category="personal_care", date="2024-02-22", description="Premium salon"),
                ],
                deposits=[
                    Deposit(id=34, amount=8500.0, category="salary", date="2024-01-01", description="Monthly executive salary"),
                    Deposit(id=35, amount=8500.0, category="salary", date="2024-02-01", description="Monthly executive salary"),
                    Deposit(id=36, amount=8500.0, category="salary", date="2024-03-01", description="Monthly executive salary"),
                    Deposit(id=37, amount=2500.0, category="bonus", date="2024-01-15", description="Performance bonus"),
                    Deposit(id=38, amount=1800.0, category="investment", date="2024-01-25", description="Stock dividend"),
                    Deposit(id=39, amount=3200.0, category="bonus", date="2024-02-15", description="Quarterly bonus"),
                    Deposit(id=40, amount=1200.0, category="investment", date="2024-02-28", description="Investment returns"),
                ],
                balance=8934.12,
            ),
            Account(
                id=8,
                name="Savings Account",
                expenses=[
                    Expense(id=117, amount=5000.0, category="investment", date="2024-01-15", description="Stock market investment"),
                    Expense(id=118, amount=10000.0, category="investment", date="2024-02-15", description="Real estate investment fund"),
                    Expense(id=119, amount=2500.0, category="transfer", date="2024-02-25", description="Emergency fund allocation"),
                ],
                deposits=[
                    Deposit(id=41, amount=3000.0, category="transfer", date="2024-01-05", description="Monthly savings transfer"),
                    Deposit(id=42, amount=3000.0, category="transfer", date="2024-02-05", description="Monthly savings transfer"),
                    Deposit(id=43, amount=3000.0, category="transfer", date="2024-03-05", description="Monthly savings transfer"),
                    Deposit(id=44, amount=15000.0, category="bonus", date="2024-01-31", description="Year-end executive bonus"),
                    Deposit(id=45, amount=5000.0, category="investment", date="2024-02-10", description="Investment portfolio gains"),
                ],
                balance=11500.0,
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
                    # Basic expenses - student budget
                    Expense(id=120, amount=800.0, category="rent", date="2024-01-01", description="Shared apartment rent"),
                    Expense(id=121, amount=800.0, category="rent", date="2024-02-01", description="Shared apartment rent"),
                    Expense(id=122, amount=800.0, category="rent", date="2024-03-01", description="Shared apartment rent"),
                    
                    # Food - budget conscious
                    Expense(id=123, amount=67.80, category="food", date="2024-01-04", description="Budget grocery shopping"),
                    Expense(id=124, amount=12.50, category="food", date="2024-01-11", description="Fast food lunch"),
                    Expense(id=125, amount=45.30, category="food", date="2024-01-18", description="Grocery shopping"),
                    Expense(id=126, amount=23.90, category="food", date="2024-01-25", description="Pizza delivery"),
                    Expense(id=127, amount=89.40, category="food", date="2024-02-01", description="Monthly grocery budget"),
                    Expense(id=128, amount=15.60, category="food", date="2024-02-08", description="Campus cafeteria"),
                    Expense(id=129, amount=34.70, category="food", date="2024-02-15", description="Grocery shopping"),
                    
                    # Utilities
                    Expense(id=130, amount=45.00, category="utilities", date="2024-01-15", description="Shared electric bill"),
                    Expense(id=131, amount=25.00, category="utilities", date="2024-01-20", description="Internet share"),
                    Expense(id=132, amount=52.00, category="utilities", date="2024-02-15", description="Shared electric bill"),
                    Expense(id=133, amount=25.00, category="utilities", date="2024-02-20", description="Internet share"),
                    
                    # Transportation
                    Expense(id=134, amount=89.00, category="transportation", date="2024-01-01", description="Student bus pass"),
                    Expense(id=135, amount=89.00, category="transportation", date="2024-02-01", description="Student bus pass"),
                    Expense(id=136, amount=15.50, category="transportation", date="2024-01-20", description="Ride share"),
                    
                    # Education
                    Expense(id=137, amount=450.0, category="education", date="2024-01-10", description="Textbooks"),
                    Expense(id=138, amount=25.00, category="education", date="2024-02-05", description="Lab fee"),
                    Expense(id=139, amount=89.99, category="education", date="2024-02-12", description="Online course"),
                    
                    # Entertainment - budget
                    Expense(id=140, amount=9.99, category="entertainment", date="2024-01-01", description="Student Spotify"),
                    Expense(id=141, amount=12.99, category="entertainment", date="2024-01-01", description="Netflix student"),
                    Expense(id=142, amount=25.00, category="entertainment", date="2024-01-22", description="Movie night"),
                    Expense(id=143, amount=9.99, category="entertainment", date="2024-02-01", description="Student Spotify"),
                    Expense(id=144, amount=12.99, category="entertainment", date="2024-02-01", description="Netflix student"),
                ],
                deposits=[
                    Deposit(id=46, amount=1200.0, category="financial_aid", date="2024-01-01", description="Student loan disbursement"),
                    Deposit(id=47, amount=1200.0, category="financial_aid", date="2024-02-01", description="Student loan disbursement"),
                    Deposit(id=48, amount=1200.0, category="financial_aid", date="2024-03-01", description="Student loan disbursement"),
                    Deposit(id=49, amount=800.0, category="work", date="2024-01-15", description="Part-time job - campus library"),
                    Deposit(id=50, amount=800.0, category="work", date="2024-02-15", description="Part-time job - campus library"),
                    Deposit(id=51, amount=400.0, category="family", date="2024-01-20", description="Family support"),
                    Deposit(id=52, amount=600.0, category="family", date="2024-02-25", description="Family support"),
                    Deposit(id=53, amount=300.0, category="tutoring", date="2024-01-30", description="Tutoring income"),
                    Deposit(id=54, amount=450.0, category="tutoring", date="2024-02-28", description="Tutoring income"),
                ],
                balance=1234.50,
            ),
            Account(
                id=10,
                name="Savings Account", 
                expenses=[
                    Expense(id=145, amount=200.0, category="transfer", date="2024-02-20", description="Emergency textbook fund"),
                ],
                deposits=[
                    Deposit(id=55, amount=150.0, category="transfer", date="2024-01-05", description="Small monthly savings"),
                    Deposit(id=56, amount=150.0, category="transfer", date="2024-02-05", description="Small monthly savings"),
                    Deposit(id=57, amount=150.0, category="transfer", date="2024-03-05", description="Small monthly savings"),
                    Deposit(id=58, amount=500.0, category="gift", date="2024-01-15", description="Birthday money"),
                    Deposit(id=59, amount=250.0, category="refund", date="2024-02-10", description="Course fee refund"),
                ],
                balance=1000.0,
            ),
        ],
    ),
]
