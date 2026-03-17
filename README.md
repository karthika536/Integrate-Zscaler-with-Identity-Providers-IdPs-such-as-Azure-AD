# Zscaler IdP Fusion — Zero Trust Access Governance Platform

> Final Year B.Tech Project | Computer Science & Engineering

A full-stack demonstration platform for **Zero Trust Network Access (ZTNA)** integrating Zscaler with Azure AD, Okta, and Active Directory for unified enterprise identity federation.

---

## 🚀 Live Demo

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:5000/api

### Demo Login Credentials (Password for all: `Password@123`)

| Email | Role | Access |
|---|---|---|
| superadmin@nimbus.com | Super Admin | Full platform |
| security.admin@nimbus.com | Security Admin | Policies + Logs + Providers |
| it.admin@nimbus.com | IT Admin | Users + Providers + Logs |
| employee@nimbus.com | Employee | Dashboard only |
| auditor@nimbus.com | Auditor | Logs + Reports (read-only) |

---

## ✨ Features

- 🌐 **Multi-IdP SSO Simulation** — Azure AD (OAuth2), Okta (SAML), Active Directory (LDAP)
- 🔑 **JWT Authentication** — Stateless sessions with 8h expiry and bcrypt password hashing
- 🛡 **5-Role RBAC** — Granular permissions with route-level enforcement
- ⚙️ **Zscaler Policy Engine** — ALLOW/DENY rules with MFA, device posture & segmentation
- 📋 **3-Layer Logging** — Auth logs, access decision logs, and admin audit trail
- 📄 **Compliance Reporting** — Generate and download PDF/CSV compliance snapshots
- 📊 **Analytics Dashboard** — KPI cards, access trend charts, provider health monitoring
- 👥 **User Management** — Create, edit, delete users with role and provider assignment

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Express.js + JWT + bcryptjs |
| Database | In-memory JS store (no MongoDB needed) |
| Charts | Recharts |
| Auth | jsonwebtoken + bcryptjs |
| UI Icons | Lucide React |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+

### Install & Run

```bash
# Install all dependencies
npm install

# Start backend (port 5000)
node server.js

# In a new terminal — start frontend (port 5173)
npx vite

# Or run both together
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

The project uses a **flat file structure** — all source files are in the root directory for simplicity.

```
D:\P2\
├── index.html          # Vite HTML entry
├── main.jsx            # React app root
├── App.jsx             # Routes
├── server.js           # Express entry
├── app.js              # Express app setup
├── store.js            # In-memory database
├── *Page.jsx           # All page components
├── *Controller.js      # API controllers
├── *Routes.js          # Express routes
├── styles.css          # Global CSS
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🔐 Architecture

```
User → React SPA → JWT Guard → Express API → RBAC Middleware → Policy Engine → In-Memory Store
                                                                      ↓
                                                               Audit Log Capture
```

---

## 📝 Project Context

This project was built as a final year computer science project to demonstrate:
- How enterprise Zero Trust models work in practice
- Multi-IdP federation concepts (SAML, OAuth2, LDAP)
- Role-based access control implementation
- Security event logging and compliance reporting

---

*Built with ❤️ as a Final Year B.Tech Project · 2025–26*
