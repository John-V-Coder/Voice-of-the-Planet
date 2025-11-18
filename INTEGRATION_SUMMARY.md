# EcoLeaders Platform - Integration Summary

## Overview
This document provides a comprehensive overview of the server-client integration for the EcoLeaders Platform, ensuring email configuration, data structures, and API endpoints are properly aligned.

---

## Server Configuration

### Required Dependencies Added
```json
{
  "bcryptjs": "^2.4.3",
  "cookie-parser": "^1.4.7",
  "crypto": "^1.0.1",
  "jsonwebtoken": "^9.0.2",
  "nodemailer": "^6.9.16"
}
```

### Environment Variables (.env)
```bash
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/ecoleaders
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password-here
CLIENT_URL=http://localhost:5173
COMPANY_NAME=EcoLeaders Platform
SUPPORT_EMAIL=support@ecoleaders.com
```

### Data Models Structure

#### 1. Leaders Model
- **uniqueUserId**: Auto-generated (LDR-XXXX-ORGID)
- **Email Integration**: Sends verification codes and welcome emails
- **Fields**: firstName, lastName, email, password, organizationId, teamId, role, ecoScore, badges
- **Roles**: student, instructor, alumni, team_leader, admin

#### 2. Organization Model
- **uniqueOrgId**: Unique identifier
- **Primary Contact**: Links to Leaders model
- **Fields**: name, type, location, contactInfo, stats, verificationStatus
- **Types**: school, club, community, alumni, ngo

#### 3. Team Model
- **uniqueTeamCode**: 6-character code for joining
- **Fields**: name, organizationId, leaderId, stats
- **Email Integration**: Team invitation with codes

#### 4. Email Template Model
- **Categories**: welcome, verification, team_invite_code, notification, support
- **Variable Replacement**: Dynamic content using {{variableName}} syntax
- **Templates**: 5 pre-configured templates

---

## Email Service Configuration

### Email Flow Architecture

1. **Registration Flow**
   - User registers → Verification code generated
   - Email: `registration-verification-code` template
   - Variables: firstName, uniqueUserId, verificationCode, expiryMinutes

2. **Welcome Flow**
   - Email verified → Welcome email sent
   - Email: `welcome-onboarding` template
   - Variables: firstName, organizationName, uniqueUserId, role, loginUrl

3. **Team Invitation Flow**
   - Team leader sends invite → Email with team code
   - Email: `team-invitation-code` template
   - Variables: firstName, inviterName, teamName, teamCode, organizationName

4. **Admin Login Flow**
   - Admin requests code → 6-digit code sent
   - Email: `generic-notification` template (reused)
   - JWT token generated on verification

### Email Templates Available
1. `registration-verification-code` - Account verification
2. `welcome-onboarding` - Post-verification welcome
3. `team-invitation-code` - Team invites
4. `generic-notification` - System notifications
5. `support-ticket-update` - Support updates

---

## Client-Side Architecture

### Directory Structure
```
client/src/
├── config/
│   └── api.js                 # API endpoints & headers
├── services/
│   ├── authService.js         # Authentication operations
│   ├── leaderService.js       # Leader CRUD operations
│   ├── teamService.js         # Team management
│   ├── organizationService.js # Organization management
│   └── emailService.js        # Email template operations
└── store/
    ├── authStore.js           # Auth state management
    ├── leaderStore.js         # Leader state
    ├── teamStore.js           # Team state
    ├── organizationStore.js   # Organization state
    └── store.js               # Export hub
```

### State Management (Zustand)

#### Auth Store
```javascript
{
  user, token, isAuthenticated, loading, error,
  requestAdminCode, verifyAdminCode, checkAuth, logout
}
```

#### Leader Store
```javascript
{
  leaders, currentLeader, loading, error,
  registerLeader, verifyEmail, getLeaderById, updateLeader, updateLeaderScore
}
```

#### Team Store
```javascript
{
  teams, currentTeam, teamMembers, loading, error,
  createTeam, joinTeamByCode, getTeamMembers, sendTeamInvite
}
```

#### Organization Store
```javascript
{
  organizations, currentOrganization, loading, error,
  createOrganization, getAllOrganizations, getOrganizationById,
  updateOrganization, deleteOrganization, updatePrimaryContact
}
```

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/admin/request-code` - Request admin login code
- `POST /api/auth/admin/verify-code` - Verify code & get JWT
- `GET /api/auth/check` - Check authentication status

### Leaders
- `POST /api/leaders/register` - Register new leader
- `POST /api/leaders/verify-email` - Verify email with code
- `GET /api/leaders/:id` - Get leader by ID
- `PATCH /api/leaders/:id` - Update leader profile
- `PATCH /api/leaders/:id/score` - Update EcoScore

### Teams
- `POST /api/teams` - Create team
- `POST /api/teams/join` - Join team by code
- `GET /api/teams/:id/members` - Get team members
- `POST /api/teams/:id/invite` - Send team invitation

### Organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `PATCH /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Suspend organization
- `PATCH /api/organizations/:id/contact` - Update primary contact

### Email Templates
- `POST /api/emails/templates/seed` - Seed default templates
- `GET /api/emails/templates` - Get all templates
- `PUT /api/emails/templates/:name` - Update template
- `POST /api/emails/send/verification-code` - Send verification
- `POST /api/emails/send/welcome` - Send welcome email
- `POST /api/emails/send/team-invite` - Send team invite
- `POST /api/emails/send/notification` - Send notification
- `POST /api/emails/send/support-update` - Send support update

---

## Integration Checklist

### Server Setup
- [x] Install missing dependencies (nodemailer, bcryptjs, jsonwebtoken, cookie-parser)
- [ ] Configure .env file with email credentials
- [ ] Start MongoDB instance
- [ ] Seed email templates: `POST /api/emails/templates/seed`
- [ ] Verify email configuration with test send

### Client Setup
- [x] Install Zustand for state management
- [ ] Create .env file with API_URL
- [ ] Import stores in your components
- [ ] Set up authentication flow
- [ ] Build UI components for registration/login

### Testing Flow
1. Seed email templates via API
2. Register a new leader → Check email for verification code
3. Verify email → Check welcome email received
4. Create organization (admin only)
5. Create team with leader
6. Send team invitation → Check email with team code
7. Join team using code

---

## Usage Examples

### Client-Side Usage

#### Authentication
```javascript
import { useAuthStore } from '@/store/store';

function LoginComponent() {
  const { requestAdminCode, verifyAdminCode, loading } = useAuthStore();

  const handleRequestCode = async (email) => {
    const result = await requestAdminCode(email);
    if (result.success) {
      // Show code input
    }
  };

  const handleVerifyCode = async (email, code) => {
    const result = await verifyAdminCode(email, code);
    if (result.success) {
      // Navigate to dashboard
    }
  };
}
```

#### Leader Registration
```javascript
import { useLeaderStore } from '@/store/store';

function RegisterComponent() {
  const { registerLeader, verifyEmail } = useLeaderStore();

  const handleRegister = async (data) => {
    const result = await registerLeader({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      organizationId: data.organizationId,
      role: 'student'
    });
    // Check email for verification code
  };

  const handleVerify = async (email, code) => {
    const result = await verifyEmail(email, code);
    // User verified, welcome email sent
  };
}
```

#### Team Management
```javascript
import { useTeamStore } from '@/store/store';

function TeamComponent() {
  const { createTeam, joinTeamByCode, sendTeamInvite } = useTeamStore();

  const handleCreateTeam = async (data) => {
    const result = await createTeam({
      name: data.name,
      organizationId: data.organizationId,
      leaderId: data.leaderId
    });
    // Team created with unique code
  };

  const handleInvite = async (teamId, email) => {
    const result = await sendTeamInvite(teamId, email, 'John Doe');
    // Invitation email sent
  };
}
```

---

## Security Considerations

### Authentication
- JWT tokens stored in localStorage
- Admin routes protected with `authMiddleware` and `isAdmin`
- Verification codes expire after 10 minutes
- Max 5 attempts for code verification

### Email Security
- App passwords required for Gmail (not regular password)
- SSL/TLS encryption for email transport
- Verification codes are 6-digit random numbers
- Codes marked as used after successful verification

### Data Protection
- Passwords hashed with bcrypt (10 salt rounds)
- Sensitive fields excluded from API responses
- Rate limiting on API endpoints
- CORS configured for specific origin

---

## Next Steps

1. **Install Dependencies**
   ```bash
   cd server && pnpm install
   cd ../client && pnpm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` in both server and client
   - Add your email credentials and MongoDB URL

3. **Start Services**
   ```bash
   # Terminal 1 - Server
   cd server && pnpm run dev

   # Terminal 2 - Client
   cd client && pnpm run dev
   ```

4. **Initialize System**
   - Seed email templates
   - Create first admin user
   - Create first organization
   - Test email flows

5. **Build UI Components**
   - Registration form
   - Email verification form
   - Admin login with code
   - Team management interface
   - Organization dashboard

---

## Troubleshooting

### Email Not Sending
1. Verify EMAIL_USER and EMAIL_APP_PASSWORD in .env
2. Check Gmail allows "Less secure apps" or use App Password
3. Verify network allows SMTP port 465
4. Check console for detailed error messages

### Authentication Failing
1. Verify JWT_SECRET is set
2. Check token in localStorage
3. Verify user role matches endpoint requirements
4. Check CORS configuration

### Database Connection Issues
1. Verify MongoDB is running
2. Check MONGO_URL in .env
3. Ensure database name is correct
4. Check network/firewall settings

---

## Support

For issues or questions:
- Check server logs for detailed error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Review API response error messages
