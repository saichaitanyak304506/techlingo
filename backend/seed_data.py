

from sqlalchemy.orm import Session
from models import Term


def seed_terms(db: Session):
    """Seed the database with initial tech terms"""
    
    terms_data = [
        {
            "name": "API",
            "definition": "Application Programming Interface - A set of rules and protocols that allows different software applications to communicate with each other.",
            "category": "Web Development",
            "difficulty": "beginner",
            "code_example": """// Making an API call with fetch
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data));""",
            "real_world_example": "When you use a weather app on your phone, it uses an API to fetch weather data from a remote server and display it to you."
        },
        {
            "name": "JWT",
            "definition": "JSON Web Token - A compact, URL-safe means of representing claims to be transferred between two parties for authentication and information exchange.",
            "category": "Security",
            "difficulty": "intermediate",
            "code_example": """// JWT structure: header.payload.signature
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Decoding (server-side)
const decoded = jwt.verify(token, 'secret_key');""",
            "real_world_example": "When you log into a website, the server gives you a JWT token that proves your identity. It's like a digital wristband at a concert that lets you access VIP areas."
        },
        {
            "name": "Docker",
            "definition": "A platform that uses containerization technology to package applications and their dependencies into isolated containers that can run consistently across different environments.",
            "category": "DevOps",
            "difficulty": "intermediate",
            "code_example": """# Dockerfile example
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]""",
            "real_world_example": "Docker is like a shipping container for software. Just as shipping containers standardize cargo transport, Docker containers ensure your app runs the same way on any computer."
        },
        {
            "name": "REST",
            "definition": "Representational State Transfer - An architectural style for designing networked applications using stateless, client-server communication protocols, typically HTTP.",
            "category": "Web Development",
            "difficulty": "beginner",
            "code_example": """// REST API endpoints example
GET    /api/users      // Get all users
GET    /api/users/1    // Get user by ID
POST   /api/users      // Create new user
PUT    /api/users/1    // Update user
DELETE /api/users/1    // Delete user""",
            "real_world_example": "REST is like a restaurant menu. You (client) look at the menu (API documentation), order specific items (make requests), and the kitchen (server) prepares and delivers your food (response)."
        },
        {
            "name": "SQL",
            "definition": "Structured Query Language - A standardized programming language used to manage and manipulate relational databases.",
            "category": "Database",
            "difficulty": "beginner",
            "code_example": """-- Common SQL operations
SELECT * FROM users WHERE age > 18;
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');
UPDATE users SET name = 'Jane' WHERE id = 1;
DELETE FROM users WHERE id = 1;""",
            "real_world_example": "SQL is like a librarian who can quickly find, organize, and retrieve any book in a massive library based on specific criteria you provide."
        },
        {
            "name": "ORM",
            "definition": "Object-Relational Mapping - A technique that lets you query and manipulate data from a database using an object-oriented paradigm in your programming language.",
            "category": "Database",
            "difficulty": "intermediate",
            "code_example": """# SQLAlchemy ORM example (Python)
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    
# Query using ORM
user = session.query(User).filter_by(name='John').first()""",
            "real_world_example": "ORM is like having a translator who converts between your native language (programming code) and a foreign language (database SQL) automatically."
        },
        {
            "name": "Git",
            "definition": "A distributed version control system that tracks changes in source code during software development, enabling multiple developers to work together.",
            "category": "DevOps",
            "difficulty": "beginner",
            "code_example": """# Common Git commands
git init                  # Initialize repository
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push origin main      # Push to remote
git pull                  # Fetch and merge""",
            "real_world_example": "Git is like a time machine for your code. You can save snapshots (commits), go back in time to any previous version, and create parallel universes (branches) to try new ideas."
        },
        {
            "name": "CI/CD",
            "definition": "Continuous Integration/Continuous Deployment - A method to frequently deliver apps by introducing automation into the stages of app development.",
            "category": "DevOps",
            "difficulty": "advanced",
            "code_example": """# GitHub Actions CI/CD example
name: Deploy
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run build""",
            "real_world_example": "CI/CD is like an assembly line in a factory. Every time you make a change, automated robots (scripts) test, package, and deliver your product to customers without manual intervention."
        },
        {
            "name": "Microservices",
            "definition": "An architectural approach where an application is built as a collection of small, independent services that communicate through well-defined APIs.",
            "category": "Architecture",
            "difficulty": "advanced",
            "code_example": """# Microservices architecture example
User Service    → /api/users
Order Service   → /api/orders  
Payment Service → /api/payments
Notification    → /api/notify

# Each service has its own database and deployment""",
            "real_world_example": "Microservices are like a food court vs a restaurant. Instead of one kitchen handling everything, specialized stalls (services) each focus on one thing and work independently."
        },
        {
            "name": "GraphQL",
            "definition": "A query language for APIs that allows clients to request exactly the data they need, reducing over-fetching and under-fetching of data.",
            "category": "Web Development",
            "difficulty": "intermediate",
            "code_example": """# GraphQL query example
query {
  user(id: "123") {
    name
    email
    posts {
      title
      createdAt
    }
  }
}""",
            "real_world_example": "GraphQL is like ordering a customizable salad. Instead of getting a fixed combo meal (REST), you specify exactly which ingredients you want, and you only get those."
        },
        {
            "name": "WebSocket",
            "definition": "A communication protocol that provides full-duplex communication channels over a single TCP connection, enabling real-time data transfer.",
            "category": "Web Development",
            "difficulty": "intermediate",
            "code_example": """// WebSocket client example
const socket = new WebSocket('ws://example.com/chat');

socket.onmessage = (event) => {
  console.log('Message:', event.data);
};

socket.send('Hello, Server!');""",
            "real_world_example": "WebSocket is like a phone call vs sending letters. Instead of waiting for responses (HTTP), you have an open line where both sides can talk instantly and continuously."
        },
        {
            "name": "Redis",
            "definition": "An in-memory data structure store used as a database, cache, and message broker, known for its high performance and versatility.",
            "category": "Database",
            "difficulty": "intermediate",
            "code_example": """# Redis commands
SET user:1:name "John"    # Store value
GET user:1:name           # Retrieve value
EXPIRE user:1:session 3600  # Set expiry
LPUSH notifications "New message"  # Push to list""",
            "real_world_example": "Redis is like a super-fast sticky note board. You can quickly pin and retrieve notes (data) without digging through filing cabinets (disk storage)."
        },
    ]
    
    for term_data in terms_data:
        term = Term(**term_data)
        db.add(term)
    
    db.commit()
    print(f"Seeded {len(terms_data)} terms successfully!")
