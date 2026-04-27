# Academix - AI-Powered Academic Collaboration & Peer-Matching Platform

Academix is a full-stack academic collaboration platform. Students register and log in through a React frontend, the Express/Node.js backend handles authentication and data management, MongoDB stores user profiles and collaboration records, and a TensorFlow.js-powered AI layer matches peers based on academic interests and activity.

## Core Capabilities

- Student registration, login, and authenticated dashboard access
- AI-powered peer matching using TensorFlow.js
- Real-time chat between matched peers
- Project collaboration workspace with active collaboration tracking
- Study group creation and management
- Event management for academic activities
- Query board for student questions and answers
- Admin dashboard for user and platform oversight
- Role-based access control for students and administrators
- MongoDB-backed persistence with indexes for users, projects, and events

## Architecture

```
User -> React UI -> Express API -> MongoDB -> TensorFlow.js Peer Matching -> Dashboard
```

### Why this architecture

- The frontend handles all presentation, routing, and user interaction.
- The Express API owns authentication, data validation, and business rules.
- MongoDB stores flexible document-shaped data such as user profiles, projects, study groups, and events.
- TensorFlow.js enables in-process AI peer matching without an external model server.
- Real-time chat is handled directly in the React layer for simplicity at project scale.

## Technology Stack

- **Frontend:** React 19, React Router v7, Framer Motion, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, Mongoose, Nodemailer
- **AI / ML:** TensorFlow.js
- **Database:** MongoDB (Atlas or local)
- **Testing:** React Testing Library, Jest

## Project Structure

```
academix/
│
├── src/                          # React frontend application
│   ├── components/               # Page-level and shared components
│   │   ├── LandingPage.js        # Public landing / hero page
│   │   ├── loginpage.js          # Student login
│   │   ├── SignupPage.js         # Student registration
│   │   ├── Dashboard.js          # Main student dashboard
│   │   ├── AdminDashboard.js     # Administrator oversight panel
│   │   ├── StudentDetails.js     # Individual student profile view
│   │   ├── Chat.js               # Real-time peer chat
│   │   ├── authContext.js        # Global authentication context
│   │   └── ui/                   # Reusable UI primitives
│   ├── dashboard/                # Dashboard feature modules
│   │   ├── project.js            # Project collaboration workspace
│   │   ├── activecollabrations.js # Active collaboration tracker
│   │   ├── studygroup.js         # Study group management
│   │   ├── QueriesWritten.js     # Student query board
│   │   ├── profilesettings.js    # User profile settings
│   │   ├── accountmanagement.js  # Account management
│   │   ├── EventManagement.js    # Academic event management
│   │   ├── Activity.js           # Activity feed
│   │   ├── Peers.js              # AI peer suggestions
│   │   └── Card.js               # Shared card component
│   ├── App.js                    # Application entry point & routing
│   └── index.js                  # React DOM bootstrap
│
├── database/                     # Backend server & data layer
│   ├── server.js                 # Express server entry point
│   ├── database.js               # MongoDB connection helper
│   ├── seed.js                   # Database seeding script
│   └── automationTest.js         # Automated integration tests
│
├── public/                       # Static assets
├── build/                        # Production build output
├── package.json                  # Node.js dependencies & scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── .env.example                  # Environment variable template
└── README.md                     # This file
```

## Local Setup

### Prerequisites

- Node.js 16+
- MongoDB running locally or reachable via Atlas connection string

### Frontend & Backend

```bash
# Install all dependencies
npm install

# Start the React development server (port 3000)
npm start

# Start the Express backend server
npm run server
```

### Production Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/academix?retryWrites=true&w=majority
```

Optional variables for email notifications and AI configuration can be added as needed.

## Main Workflows

### Student flow

1. Register an account or log in.
2. Complete your profile with academic interests.
3. Browse AI-suggested peers on the Peers panel.
4. Start a chat with a matched peer.
5. Create or join a study group.
6. Submit or browse queries on the query board.
7. Collaborate on projects in the project workspace.
8. Register for and manage academic events.

### Admin flow

1. Log in with administrator credentials.
2. Access the Admin Dashboard.
3. View all registered students and their details.
4. Manage platform content and events.
5. Monitor activity across the platform.

## Technical Notes

- Authentication tokens are stored in `localStorage` and validated on every protected route.
- Passwords are hashed before storage; protected endpoints require a valid auth token.
- The TensorFlow.js peer-matching model runs entirely in the Node.js process.
- MongoDB Atlas is used in production; a local MongoDB instance works for development.

## Testing

```bash
# Run frontend unit tests
npm test
```

The repository also includes an automation test suite in `database/automationTest.js` covering backend data flows.

## Limitations

- The AI peer-matching model is heuristic-assisted and works best with complete student profiles.
- Real-time chat is session-based and does not persist message history across page reloads in the current implementation.
- The platform is suited to department- or institution-scale deployments.

## Future Improvements

- Replace the heuristic peer-matcher with a trained recommendation model
- Add WebSocket-based persistent real-time chat with message history
- Introduce notification emails for new matches, events, and query responses
- Add OAuth (Google / GitHub) for single sign-on
- Support file attachments in project collaboration and chat

## 📄 License

MIT License

---

## 📘 Repository Architecture & System Documentation

### 1. Project Overview

Academix is a production-grade Academic Collaboration Management System designed for universities and educational institutions to help students find peers, collaborate on projects, join study groups, and manage academic events. It bridges the gap between isolated student work and active peer-driven learning using AI-powered matching technology.

Unlike traditional static course forums, Academix leverages TensorFlow.js-based peer recommendation to automatically suggest compatible collaborators based on academic interests, activity, and profile data. The system then facilitates project collaboration, group study, query resolution, and event participation through an integrated dashboard.

**Key Technologies:**

- **AI / ML:** TensorFlow.js (Peer Matching & Recommendations)
- **Backend Architecture:** Express.js (RESTful API), Mongoose (ODM)
- **Frontend Interface:** React 19 + Tailwind CSS (Responsive dashboard, mobile-optimized student portal)
- **Infrastructure:** MongoDB Atlas / Local MongoDB, JWT Authentication

---

### 2. Repository Structure & File Responsibilities

```
academix/
│
├── src/                           # React Frontend
│   ├── components/                # Page-level components
│   │   ├── LandingPage.js         # Public-facing hero & feature overview
│   │   ├── loginpage.js           # Student authentication (login)
│   │   ├── SignupPage.js          # New student registration
│   │   ├── Dashboard.js           # Primary student hub with activity & peers
│   │   ├── AdminDashboard.js      # Admin control panel
│   │   ├── StudentDetails.js      # Detailed student profile view
│   │   ├── Chat.js                # Peer-to-peer chat interface
│   │   └── authContext.js         # React context for global auth state
│   ├── dashboard/                 # Feature modules rendered inside Dashboard
│   │   ├── project.js             # Project listing & collaboration workspace
│   │   ├── activecollabrations.js # Live collaboration session tracker
│   │   ├── studygroup.js          # Study group creation & management
│   │   ├── QueriesWritten.js      # Query board (ask & answer)
│   │   ├── profilesettings.js     # Edit personal academic profile
│   │   ├── accountmanagement.js   # Account security & preferences
│   │   ├── EventManagement.js     # Academic event calendar & RSVP
│   │   ├── Activity.js            # Recent activity feed widget
│   │   ├── Peers.js               # AI-suggested peer list widget
│   │   └── Card.js                # Generic card layout component
│   └── App.js                     # Route definitions & AuthProvider wrapper
│
├── database/                      # Node.js Backend
│   ├── server.js                  # Express app & MongoDB connection
│   ├── database.js                # Mongoose connect helper
│   ├── seed.js                    # Sample data seeder for development
│   └── automationTest.js          # End-to-end backend test runner
```

---

### 3. Environment Variables & Configuration

The system follows 12-Factor App principles with all configuration via `.env` file.

| Variable | Type | Required | Description |
|---|---|---|---|
| `MONGODB_URI` | Connection String | **YES** | MongoDB Atlas or local connection string |
| `JWT_SECRET` | String | No | Secret key for signing JWT tokens |
| `EMAIL_USER` | String | No | Sender email address for Nodemailer |
| `EMAIL_PASS` | String | No | Sender email password / app password |
| `PORT` | Integer | No | Express server port (Default: 5000) |

---

### 4. Dependency Analysis

**Backend Core:**

- `express`: Fast, minimalist web framework for the REST API
- `mongoose`: MongoDB ODM for schema definition and queries
- `nodemailer`: Email notifications for events and matches
- `cors`: Cross-origin resource sharing middleware
- `body-parser`: Request body parsing for JSON and form data
- `dotenv`: Environment variable loading from `.env`

**AI / ML:**

- `@tensorflow/tfjs`: In-process machine learning for peer-matching recommendations

**Frontend:**

- `react@19`, `react-dom`: UI framework
- `react-router-dom@7`: Client-side routing with nested routes
- `axios`: HTTP client with request/response interceptors
- `framer-motion`: Smooth UI animations and transitions
- `react-toastify`: User-facing toast notification system
- `@shadcn/ui`: Accessible, composable UI component library
- `tailwindcss`: Utility-first CSS framework

---

### 5. System & Machine Configuration Requirements

**Minimum Requirements:**

| Component | Requirement |
|---|---|
| OS | Windows 10/11, Linux (Ubuntu 20.04+), macOS |
| CPU | Intel Core i5 (8th Gen) / AMD Ryzen 5 |
| RAM | 4 GB |
| Storage | 1 GB free space |
| Node.js | 16.x or higher |
| MongoDB | Local instance or Atlas account |

**Recommended Requirements:**

| Component | Requirement |
|---|---|
| CPU | Intel Core i7 (10th Gen+) / AMD Ryzen 7 |
| RAM | 8 GB DDR4 |
| Node.js | 18.x LTS |
| Browser | Chrome / Edge (latest) for best TensorFlow.js performance |

---

### 6. Application Execution Flow

**Initialization Phase:**

1. `npm run server` starts the Express backend and connects to MongoDB.
2. `npm start` launches the React development server on port 3000.
3. `.env` variables are loaded and validated on startup.

**Request Processing Flow:**

1. **Student Registration / Login:** User submits credentials via `/signup` or `/login`.
2. **Auth Token Issued:** Express returns a JWT stored in `localStorage`.
3. **Dashboard Load:** React fetches activity, peers, and profile data from the API.
4. **AI Peer Matching:** TensorFlow.js model scores and ranks compatible peers.
5. **Collaboration:** Student initiates chat, joins study group, or creates a project.
6. **Event / Query:** Student registers for events or posts queries to the board.
7. **Admin Review:** Admin logs in to the Admin Dashboard to manage users and content.

---

### 7. Setup & Installation Best Practices

- **Node Version:** Use `nvm` to manage Node.js versions and ensure 16+ is active.
- **Dependencies:** Run `npm install` from the project root to install all packages.
- **Database:** Configure `MONGODB_URI` in `.env` before starting the server.
- **Seeding:** Run `node database/seed.js` to populate sample data for development.
- **Frontend:** The React app proxies API calls to the Express server during development.
- **Configuration:** Never commit `.env` to version control — use `.env.example` as a template.

---

### 8. Security & Best Practices

- **Secret Management:** Never commit `.env` to version control.
- **Authentication:** JWT tokens required for all dashboard and API access.
- **Input Validation:** All user inputs validated via Mongoose schemas and Express middleware.
- **Password Security:** Passwords are hashed before storage.
- **CORS:** Cross-origin requests restricted to authorized frontend origins.
- **HTTPS:** Enable in production via a reverse proxy (Nginx / Apache).
- **Rate Limiting:** Recommended for production API deployments to prevent abuse.

---

📄 *Documentation generated by repository analysis. All project-specific details adapted to the Academix academic collaboration platform.*