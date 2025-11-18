# EcoLeaders Platform - Setup Guide

## Prerequisites

- Node.js v18+ installed
- MongoDB running locally or remote instance
- Gmail account for email service (with App Password)
- pnpm package manager (or npm/yarn)

---

## Step 1: Install Dependencies

### Server Dependencies
```bash
cd server
pnpm install
```

This installs:
- express, mongoose, cors, helmet
- nodemailer (email service)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- cookie-parser (session management)

### Client Dependencies
```bash
cd client
pnpm install
```

This installs:
- React 19, Vite
- Zustand (state management)
- Radix UI components
- TailwindCSS
- Lucide icons

---

## Step 2: Configure Environment Variables

### Server Environment (.env)

Create `server/.env`:

```bash
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/ecoleaders

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password

# Client URL (for CORS and email links)
CLIENT_URL=http://localhost:5173

# Company Information
COMPANY_NAME=EcoLeaders Platform
SUPPORT_EMAIL=support@ecoleaders.com
```

#### Getting Gmail App Password:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password

### Client Environment (.env)

Create `client/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

---

## Step 3: Start MongoDB

### Local MongoDB
```bash
# macOS/Linux
sudo mongod

# Windows
mongod.exe

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update MONGO_URL in server/.env

---

## Step 4: Seed Email Templates

### Option 1: Via API Call
After starting the server, make a POST request:

```bash
curl -X POST http://localhost:5000/api/emails/templates/seed
```

### Option 2: Via Frontend
Create a simple admin UI that calls the seed endpoint on first run.

---

## Step 5: Start Development Servers

### Terminal 1 - Backend Server
```bash
cd server
pnpm run dev
```

Expected output:
```
Server is running in development mode on port 5000
MongoDB connected successfully
Email transporter is ready
```

### Terminal 2 - Frontend Client
```bash
cd client
pnpm run dev
```

Expected output:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 6: Create First Admin User

### Manual Database Setup
Connect to MongoDB and create the first admin:

```javascript
use ecoleaders

// First, create an organization
db.organizations.insertOne({
  name: "Platform Administration",
  uniqueOrgId: "ORG-ADMIN-001",
  type: "ngo",
  primaryContact: null, // Will update after creating leader
  location: {
    county: "Nairobi",
    geo: { type: "Point", coordinates: [36.8219, -1.2921] }
  },
  contactInfo: {
    email: "admin@ecoleaders.com"
  },
  isActive: true,
  verificationStatus: "verified"
})

// Copy the _id from the organization created above
// Then create admin user
db.leaders.insertOne({
  uniqueUserId: "LDR-0001-ADMIN",
  firstName: "Admin",
  lastName: "User",
  email: "admin@ecoleaders.com",
  password: "$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Use bcrypt to hash
  organizationId: ObjectId("paste_organization_id_here"),
  role: "admin",
  isEmailVerified: true,
  isActive: true,
  ecoScore: {
    total: 0,
    knowledge: 0,
    skill: 0,
    consistency: 0
  }
})
```

### Generate Password Hash
```bash
cd server
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123', 10, (e,h) => console.log(h));"
```

---

## Step 7: Test the System

### 1. Test Admin Login
```bash
# Request login code
curl -X POST http://localhost:5000/api/auth/admin/request-code \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoleaders.com"}'

# Check email for 6-digit code, then verify
curl -X POST http://localhost:5000/api/auth/admin/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoleaders.com","code":"123456"}'
```

### 2. Test Leader Registration
```bash
curl -X POST http://localhost:5000/api/leaders/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "organizationId": "your_org_id_here",
    "role": "student"
  }'
```

Check email for verification code.

### 3. Test Email Verification
```bash
curl -X POST http://localhost:5000/api/leaders/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","code":"123456"}'
```

Check email for welcome message.

### 4. Test Team Creation
```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Green Warriors",
    "organizationId": "your_org_id",
    "leaderId": "your_leader_id"
  }'
```

---

## Common Issues & Solutions

### Issue: "Email transporter verification failed"
**Solution:**
- Verify EMAIL_USER and EMAIL_APP_PASSWORD are correct
- Ensure you're using App Password, not regular Gmail password
- Check if 2FA is enabled on Gmail account

### Issue: "MongoDB connection error"
**Solution:**
- Check if MongoDB is running: `ps aux | grep mongod`
- Verify MONGO_URL in .env
- Check MongoDB logs for errors

### Issue: "JWT token invalid"
**Solution:**
- Verify JWT_SECRET is set in .env
- Check token format in Authorization header: `Bearer <token>`
- Ensure token hasn't expired

### Issue: "CORS error in browser"
**Solution:**
- Verify CLIENT_URL in server/.env matches your frontend URL
- Check CORS configuration in server.js
- Clear browser cache

### Issue: "Cannot find module"
**Solution:**
- Delete node_modules and pnpm-lock.yaml
- Run `pnpm install` again
- Check for typos in import paths

---

## Production Deployment Checklist

### Server
- [ ] Change NODE_ENV to "production"
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Use production MongoDB instance
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origin
- [ ] Configure rate limiting
- [ ] Set up logging service
- [ ] Configure email service for production
- [ ] Set up monitoring (PM2, New Relic, etc.)

### Client
- [ ] Update VITE_API_URL to production API
- [ ] Build optimized bundle: `npm run build`
- [ ] Deploy to CDN or static hosting
- [ ] Enable caching headers
- [ ] Set up error tracking (Sentry)

### Database
- [ ] Enable MongoDB authentication
- [ ] Set up regular backups
- [ ] Create database indexes
- [ ] Configure replica sets (if needed)
- [ ] Monitor performance

### Security
- [ ] Enable rate limiting on sensitive routes
- [ ] Implement refresh token rotation
- [ ] Add input validation on all endpoints
- [ ] Set up security headers (Helmet.js)
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## Folder Structure Overview

```
ecoleaders-platform/
├── server/
│   ├── config/
│   │   └── email.js              # Email configuration
│   ├── controllers/
│   │   ├── admin-auth/
│   │   │   └── authController.js # Admin authentication
│   │   ├── email/
│   │   │   └── emailController.js # Email operations
│   │   └── profile/
│   │       ├── leaderController.js
│   │       ├── organizationController.js
│   │       └── teamcontroller.js
│   ├── models/
│   │   ├── Counter.js            # Sequence generator
│   │   ├── EmailTemplate.js      # Email templates
│   │   ├── Leaders.js            # User model
│   │   ├── Organization.js       # Organization model
│   │   └── Team.js               # Team model
│   ├── routes/
│   │   ├── admin-auth_routes/
│   │   ├── email_routes/
│   │   ├── leader_routes/
│   │   ├── organization_routes/
│   │   └── team-routes/
│   ├── services/
│   │   ├── emailServices.js      # Email service logic
│   │   └── idGenerator.js        # ID generation
│   ├── utils/
│   │   └── emailTemplete.js      # Default templates
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Main entry point
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/               # Reusable UI components
│   │   ├── config/
│   │   │   └── api.js            # API configuration
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── leaderService.js
│   │   │   ├── teamService.js
│   │   │   ├── organizationService.js
│   │   │   └── emailService.js
│   │   ├── store/
│   │   │   ├── authStore.js      # Auth state
│   │   │   ├── leaderStore.js    # Leader state
│   │   │   ├── teamStore.js      # Team state
│   │   │   ├── organizationStore.js
│   │   │   └── store.js          # Store exports
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── INTEGRATION_SUMMARY.md        # This file
└── SETUP_GUIDE.md                # Setup instructions
```

---

## Development Workflow

1. **Feature Development**
   - Create branch: `git checkout -b feature/feature-name`
   - Develop feature
   - Test locally
   - Commit changes: `git commit -m "Add feature"`
   - Push: `git push origin feature/feature-name`

2. **Testing**
   - Unit tests (if configured)
   - Integration tests with Postman/Insomnia
   - Manual UI testing
   - Email flow testing

3. **Code Review**
   - Create pull request
   - Review changes
   - Merge to main

4. **Deployment**
   - Build production bundle
   - Deploy to staging
   - Test on staging
   - Deploy to production

---

## Useful Commands

### Server Commands
```bash
# Start development server
pnpm run dev

# Start production server
pnpm start

# Check for issues
node server.js
```

### Client Commands
```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint
```

### Database Commands
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use ecoleaders database
use ecoleaders

# Show collections
show collections

# Query leaders
db.leaders.find().pretty()

# Count documents
db.leaders.countDocuments()
```

---

## Support & Resources

- MongoDB Documentation: https://docs.mongodb.com
- Express.js Guide: https://expressjs.com
- React Documentation: https://react.dev
- Nodemailer: https://nodemailer.com
- Zustand: https://github.com/pmndrs/zustand

For project-specific issues, check:
- Server logs in terminal
- Browser console for client errors
- MongoDB logs for database issues
- Email service logs for delivery problems
