# Digital Krishii

Digital Krishii is a contract farming platform that connects farmers and buyers through land listings, equipment rentals, contract requests, notifications, reviews, and admin management.

The project is built as a production-style PERN application with role-based authentication and modular backend architecture.

---

## Tech Stack
  
### Frontend

```txt
React
Vite
Tailwind CSS
```

### Backend
Node.js
Express.js
PostgreSQL
Prisma ORM
JWT Authentication
Zod Validation
Cloudinary
Multer
Helmet
Express Rate Limit

### Main Roles
FARMER
BUYER
ADMIN

### Farmers 
Farmers Can:
Create land listings
Create equipment rental listings
Receive contract requests
Approve or reject equipment rental requests
Manage profile
Receive notifications
Give and receive reviews

### Buyer
Buyers Can:
View land listings
Create contract requests
Track sent contract requests
Cancel pending contract requests
Give and receive reviews

### Admin 
Admins Can:
View dashboard statistics
View all users
Search and filter users
Block users
Unblock users
Upload contract PDFs

### Backend Features
JWT authentication
Role-based authorization
Profile management
Land listing management
Equipment listing management
Equipment rental workflow
Contract template system
Contract request workflow
Notification system
Image and PDF upload
Rating and review system
Admin dashboard APIs
Pagination for list APIs
Global error handling
Request validation using Zod
Basic API security middleware

### Project Structure
Digital_Krishii
├── client
├── server
│   ├── prisma
│   ├── src
│   │   ├── config
│   │   ├── constants
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── validations
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
├── docs
│   ├── API.md
│   └── postman
└── README.md

### Contract Request Workflow
Buyer sends contract request
Farmer receives request
Farmer accepts or rejects request
If accepted, land status becomes UNDER_CONTRACT
Other pending requests for the same land are rejected
Buyer receives notification

### Equipmental Rental Workflow
Farmer sends equipment rental request
Equipment owner receives request
Owner approves or rejects request
If approved, equipment status becomes BOOKED
Other pending requests for the same equipment are rejected
Requester receives notification

### Review Wokflow
Only users involved in a deal can review
User cannot review himself
One user can review the same deal only once
Rating must be between 1 and 5

### Security Features
JWT authentication
Role-based authorization
Helmet security headers
Rate limiting
CORS configuration
Request body size limit
Zod validation
Global error handling
Blocked user protection
Soft delete for land and equipment

### Git Convention
feat      → new feature
fix       → bug fix
refactor  → code structure improvement
chore     → tooling/config/security maintenance
docs      → documentation