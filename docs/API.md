# Digital Krishii Backend API Documentation

## Base URL

```txt
http://localhost:5000/api
```

---

## Authentication

Most protected APIs require a JWT token.

```txt
Authorization: Bearer <JWT_TOKEN>
```

Example:

```txt
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## Roles

The system currently supports these roles:

```txt
FARMER
BUYER
ADMIN
```

Public registration allows only:

```txt
FARMER
BUYER
```

Admin users are created through seed/admin setup, not public registration.

---

## Common Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Common Error Response

```json
{
  "success": false,
  "status": "fail",
  "message": "Error message"
}
```

---

## Pagination Response Format

List APIs return pagination metadata.

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 50,
  "totalPages": 5,
  "data": []
}
```

---

# Auth APIs

## Register User

```txt
POST /auth/register
```

### Body

```json
{
  "firstName": "Yash",
  "lastName": "Yadav",
  "email": "yash@test.com",
  "password": "123456",
  "role": "FARMER"
}
```

### Allowed Roles

```txt
FARMER
BUYER
```

### Notes

Admin registration is not allowed from public API.

---

## Login User

```txt
POST /auth/login
```

### Body

```json
{
  "email": "yash@test.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "user-id",
      "firstName": "Yash",
      "lastName": "Yadav",
      "email": "yash@test.com",
      "roles": ["FARMER"]
    }
  }
}
```

---

## Get Current User

```txt
GET /auth/me
```

### Auth Required

```txt
Yes
```

### Response

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "yash@test.com",
    "roles": ["FARMER"]
  }
}
```

---

# Profile APIs

## Get My Profile

```txt
GET /profile
```

### Auth Required

```txt
Yes
```

---

## Update My Profile

```txt
PUT /profile
```

### Auth Required

```txt
Yes
```

### Body

```json
{
  "phone": "9876543210",
  "address": "Bhopal, Madhya Pradesh",
  "pincode": "462021",
  "profileImage": "https://res.cloudinary.com/..."
}
```

### Notes

The logged-in user can update only their own profile.

---

# Land APIs

## Create Land Listing

```txt
POST /lands
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Body

```json
{
  "title": "10 Acre Wheat Farming Land in Bhopal",
  "description": "Fertile land suitable for wheat farming.",
  "area": 10,
  "areaUnit": "acre",
  "price": 40000,
  "priceUnit": "PER_ACRE",
  "listingType": "CONTRACT_FARMING",
  "imageUrl": "https://res.cloudinary.com/...",
  "address": "Near Indrapuri, Bhopal",
  "district": "Bhopal",
  "state": "Madhya Pradesh",
  "pincode": "462021"
}
```

### Allowed `listingType`

```txt
CONTRACT_FARMING
RENT
```

### Allowed `priceUnit`

```txt
PER_ACRE
PER_MONTH
```

---

## Get Land Listings

```txt
GET /lands?page=1&limit=10
```

### Auth Required

```txt
Yes
```

### Query Parameters

```txt
page=1
limit=10
listingType=CONTRACT_FARMING
status=AVAILABLE
district=Bhopal
state=Madhya Pradesh
```

### Example

```txt
GET /lands?page=1&limit=10&district=Bhopal
```

---

## Get My Lands

```txt
GET /lands/my
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

---

## Get Single Land

```txt
GET /lands/:id
```

### Auth Required

```txt
Yes
```

---

## Update Land Listing

```txt
PUT /lands/:id
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Body

```json
{
  "price": 45000,
  "description": "Updated land description."
}
```

### Notes

Farmer can update only their own land listing.

---

## Delete Land Listing

```txt
DELETE /lands/:id
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Notes

This is a soft delete. Land is not removed permanently. Its status becomes:

```txt
INACTIVE
```

---

# Equipment APIs

## Create Equipment Listing

```txt
POST /equipment
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Body

```json
{
  "title": "Mahindra Tractor for Rent",
  "equipmentType": "Tractor",
  "description": "Powerful tractor suitable for ploughing and farming work.",
  "brand": "Mahindra",
  "modelName": "575 DI",
  "condition": "Good",
  "rentPrice": 1500,
  "priceUnit": "PER_DAY",
  "imageUrl": "https://res.cloudinary.com/...",
  "address": "Near Indrapuri, Bhopal",
  "district": "Bhopal",
  "state": "Madhya Pradesh",
  "pincode": "462021"
}
```

### Allowed `priceUnit`

```txt
PER_HOUR
PER_DAY
PER_WEEK
PER_MONTH
```

---

## Get Equipment Listings

```txt
GET /equipment?page=1&limit=10
```

### Auth Required

```txt
Yes
```

### Query Parameters

```txt
page=1
limit=10
equipmentType=Tractor
status=AVAILABLE
district=Bhopal
state=Madhya Pradesh
```

---

## Get My Equipment Listings

```txt
GET /equipment/my
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

---

## Get Single Equipment Listing

```txt
GET /equipment/:id
```

### Auth Required

```txt
Yes
```

---

## Update Equipment Listing

```txt
PUT /equipment/:id
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Body

```json
{
  "rentPrice": 1800,
  "condition": "Very Good"
}
```

---

## Delete Equipment Listing

```txt
DELETE /equipment/:id
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Notes

This is a soft delete. Equipment status becomes:

```txt
INACTIVE
```

---

# Equipment Rental APIs

## Create Equipment Rental Request

```txt
POST /equipment/rentals
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Body

```json
{
  "equipmentId": "equipment-id",
  "startDate": "2026-08-01",
  "endDate": "2026-08-04",
  "message": "I want to rent this tractor for field preparation."
}
```

### Notes

A farmer cannot rent their own equipment.

---

## Get My Equipment Rental Requests

```txt
GET /equipment/rentals/my
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Notes

Returns rental requests sent by the logged-in farmer.

---

## Get Rental Requests Received For My Equipment

```txt
GET /equipment/rentals/received
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Notes

Returns rental requests received for equipment owned by the logged-in farmer.

---

## Update Equipment Rental Request Status

```txt
PATCH /equipment/rentals/:id/status
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Body

```json
{
  "status": "APPROVED"
}
```

### Allowed Status Values

```txt
APPROVED
REJECTED
```

### Notes

Only the equipment owner can approve or reject rental requests.

When a request is approved:

```txt
Rental status becomes APPROVED
Equipment status becomes BOOKED
Other pending requests for the same equipment are rejected
```

---

# Contract Template APIs

## Get Contract Templates

```txt
GET /contracts/templates
```

### Auth Required

```txt
Yes
```

### Response

Returns active contract templates:

```txt
MARKET_SPECIFICATION
RESOURCE_PROVIDING
PRODUCTION_MANAGEMENT
SHARED_RISK
VERTICAL_INTEGRATION
CROP_INSURANCE
```

---

## Get Single Contract Template

```txt
GET /contracts/templates/:id
```

### Auth Required

```txt
Yes
```

---

# Contract Request APIs

## Create Contract Request

```txt
POST /contracts/requests
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
BUYER
```

### Body

```json
{
  "templateId": "contract-template-id",
  "landId": "land-id",
  "cropName": "Wheat",
  "quantity": "50 quintals",
  "proposedPrice": 40000,
  "startDate": "2026-07-20",
  "endDate": "2026-12-20",
  "message": "I want to create a market specification contract for wheat farming."
}
```

### Notes

Contract requests can be created only for land with:

```txt
listingType = CONTRACT_FARMING
status = AVAILABLE
```

A buyer cannot create a contract request for their own land.

---

## Get Sent Contract Requests

```txt
GET /contracts/requests/sent
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
BUYER
```

### Notes

Returns contract requests sent by logged-in buyer.

---

## Get Received Contract Requests

```txt
GET /contracts/requests/received
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Notes

Returns contract requests received for the farmer’s land.

---

## Get Single Contract Request

```txt
GET /contracts/requests/:id
```

### Auth Required

```txt
Yes
```

### Notes

Only buyer or farmer involved in the contract request can view it.

---

## Update Contract Request Status

```txt
PATCH /contracts/requests/:id/status
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
FARMER
```

### Body

```json
{
  "status": "ACCEPTED"
}
```

### Allowed Status Values

```txt
ACCEPTED
REJECTED
```

### Notes

Only the farmer who owns the land can accept or reject the request.

When a request is accepted:

```txt
Contract request status becomes ACCEPTED
Land status becomes UNDER_CONTRACT
Other pending requests for same land are rejected
```

---

## Cancel Contract Request

```txt
PATCH /contracts/requests/:id/cancel
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
BUYER
```

### Body

```json
{
  "reason": "I no longer want this contract."
}
```

### Notes

Only pending requests can be cancelled.

---

# Notification APIs

## Get My Notifications

```txt
GET /notifications
```

### Auth Required

```txt
Yes
```

### Query Parameters

```txt
isRead=true
isRead=false
```

---

## Get Unread Notification Count

```txt
GET /notifications/unread-count
```

### Auth Required

```txt
Yes
```

---

## Mark Notification As Read

```txt
PATCH /notifications/:id/read
```

### Auth Required

```txt
Yes
```

### Notes

User can mark only their own notification as read.

---

## Mark All Notifications As Read

```txt
PATCH /notifications/read-all
```

### Auth Required

```txt
Yes
```

---

# Upload APIs

## Upload Image

```txt
POST /uploads/image
```

### Auth Required

```txt
Yes
```

### Body Type

```txt
form-data
```

### Field

```txt
image: File
```

### Allowed File Types

```txt
JPG
JPEG
PNG
WEBP
```

### Max File Size

```txt
2 MB
```

### Response

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "digital-krishii/images/..."
  }
}
```

---

## Upload PDF

```txt
POST /uploads/pdf
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
ADMIN
```

### Body Type

```txt
form-data
```

### Field

```txt
pdf: File
```

### Allowed File Type

```txt
PDF
```

### Max File Size

```txt
5 MB
```

### Response

```json
{
  "success": true,
  "message": "PDF uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "digital-krishii/pdfs/..."
  }
}
```

---

# Review APIs

## Create Review

```txt
POST /reviews
```

### Auth Required

```txt
Yes
```

---

## Contract Review Body

```json
{
  "targetType": "CONTRACT_REQUEST",
  "contractRequestId": "contract-request-id",
  "revieweeId": "user-id",
  "rating": 5,
  "comment": "Good farmer and smooth contract farming deal."
}
```

---

## Equipment Review Body

```json
{
  "targetType": "EQUIPMENT_RENTAL",
  "equipmentRentalId": "equipment-rental-id",
  "revieweeId": "user-id",
  "rating": 5,
  "comment": "Equipment was in good condition."
}
```

### Rules

```txt
Rating must be between 1 and 5.
User cannot review himself.
Only users involved in the deal can review.
One user can review the same deal only once.
```

---

## Get Reviews Received By Me

```txt
GET /reviews/received
```

### Auth Required

```txt
Yes
```

---

## Get Reviews Given By Me

```txt
GET /reviews/given
```

### Auth Required

```txt
Yes
```

---

## Get User Rating Summary

```txt
GET /reviews/summary/:userId
```

### Auth Required

```txt
Yes
```

### Response

```json
{
  "success": true,
  "data": {
    "averageRating": 5,
    "totalReviews": 2
  }
}
```

---

# Admin APIs

All admin APIs require:

```txt
ADMIN role
```

Admin APIs use:

```txt
Route → Controller → Service → Repository → Prisma
```

---

## Get Admin Dashboard Stats

```txt
GET /admin/stats
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
ADMIN
```

### Response

```json
{
  "success": true,
  "data": {
    "totalUsers": 4,
    "totalFarmers": 2,
    "totalBuyers": 1,
    "totalLands": 3,
    "totalEquipment": 2,
    "totalContractRequests": 2,
    "totalEquipmentRentals": 2
  }
}
```

---

## Get All Users

```txt
GET /admin/users?page=1&limit=10
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
ADMIN
```

### Query Parameters

```txt
page=1
limit=10
role=FARMER
status=ACTIVE
search=yash
```

### Example

```txt
GET /admin/users?role=FARMER&page=1&limit=10
```

---

## Get User Details

```txt
GET /admin/users/:id
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
ADMIN
```

---

## Block User

```txt
PATCH /admin/users/:id/block
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
ADMIN
```

### Notes

Admin cannot block:

```txt
Their own account
Another admin account
```

Blocked users cannot login or access protected APIs.

---

## Unblock User

```txt
PATCH /admin/users/:id/unblock
```

### Auth Required

```txt
Yes
```

### Role Required

```txt
ADMIN
```

---

# Security Features

The backend uses:

```txt
helmet
express-rate-limit
CORS configuration
JSON body size limit
JWT authentication
Role-based authorization
Zod request validation
Global error handling
Soft delete for important resources
```

---

# Important Notes

## Soft Delete

Land and equipment are not permanently deleted.

Instead:

```txt
status = INACTIVE
```

---

## Decimal Values

Prisma returns `Decimal` values as strings.

Example:

```json
{
  "price": "40000",
  "rentPrice": "1500"
}
```

This is expected behavior and helps avoid money precision issues.

---

## Blocked Users

If admin blocks a user:

```txt
User cannot login
User cannot access protected APIs using old token
```

---

# Development Commands

## Start Backend

```powershell
cd server
npm run dev
```

## Run Prisma Migration

```powershell
npx prisma migrate dev --name migration_name
```

## Generate Prisma Client

```powershell
npx prisma generate
```

## Run Seed

```powershell
npx prisma db seed
```

## Open Prisma Studio

```powershell
npx prisma studio
```

---

# Git Commit Convention Used

```txt
feat      → new feature
fix       → bug fix
refactor  → code structure improvement
chore     → tooling/config/security maintenance
docs      → documentation
```

Examples:

```txt
feat(auth): implement JWT authentication
feat(land): implement farmer land listing APIs
feat(equipment): implement equipment listing and rental APIs
feat(contract): implement contract template and request APIs
feat(notification): implement user notification APIs
feat(review): implement rating and review APIs
chore(security): add basic API security middleware
docs(api): add backend API documentation
```