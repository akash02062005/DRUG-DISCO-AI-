<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/ChemBERTa-77M--MTR-FF6F00?style=for-the-badge&logo=huggingface&logoColor=white" />
  <img src="https://img.shields.io/badge/BioGPT-PubMed-blueviolet?style=for-the-badge&logo=microsoft&logoColor=white" />
  <img src="https://img.shields.io/badge/3Dmol.js-Viewer-34d399?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Razorpay-Stripe-0C2451?style=for-the-badge&logo=razorpay&logoColor=white" />
</p>

<h1 align="center">⚗️ DrugDisco AI — AI-Powered Drug Discovery SaaS Platform</h1>

<p align="center">
  <strong>A production-grade, full-stack SaaS platform for AI-driven drug discovery</strong><br/>
  Combining ChemBERTa neural predictions, BioGPT biomedical chatbot, 3D molecular visualization,<br/>
  multi-database knowledge integration, and Razorpay/Stripe billing — all in one unified interface.
</p>

---

## 🧬 Overview

**DrugDisco AI** is an end-to-end drug discovery platform that democratizes access to computational chemistry and AI-powered molecular analysis. Built as a SaaS product with tiered subscription plans, it integrates multiple AI models (ChemBERTa, BioGPT), cheminformatics toolkits (RDKit), and five major biomedical databases into a sleek, dark-themed interface.

Whether you're a pharmaceutical researcher screening lead compounds or a student exploring medicinal chemistry, DrugDisco AI provides the tools to predict molecular properties, assess drug-likeness, generate novel molecules, visualize 3D structures, and query the latest biomedical literature — all from your browser.

---

## ✨ Key Features

### 🔬 Discovery Engine
| Feature | Description | AI/Tool |
|---------|-------------|---------|
| **Property Prediction** | Predict molecular weight, logP, TPSA, QED, HBD/HBA, rotatable bonds, and Lipinski Ro5 compliance | RDKit + ChemBERTa-77M-MTR |
| **ADMET Profiling** | Absorption, Distribution, Metabolism, Excretion & Toxicity radar visualization | ChemBERTa neural heads |
| **Molecule Generation** | BRICS fragment-based *de novo* generation with target logP/MW constraints | RDKit BRICS + ChEMBL/ZINC library |
| **Similarity Search** | Find structurally similar compounds using Tanimoto fingerprint similarity | RDKit Morgan Fingerprints |
| **Drug-Target Interaction** | Predict binding affinity (pKi) and interaction probability for compound-protein pairs | Deep learning DTI model |
| **3D Molecular Viewer** | Interactive visualization with stick, sphere, cartoon & surface rendering modes | 3Dmol.js + RDKit MMFF |

### 🧠 Knowledge Hub
| Feature | Description | Source |
|---------|-------------|--------|
| **BioGPT Chatbot** | Biomedical AI assistant for drug discovery Q&A | Microsoft BioGPT (15M PubMed abstracts) |
| **PubChem Search** | Query compound data, structures, and 2D images | NCBI PubChem REST API |
| **PubMed Literature** | Search & read biomedical research abstracts | NCBI PubMed E-Utilities |
| **ChEMBL Bioactivity** | Explore bioactivity data and assay results for compounds | EBI ChEMBL API |
| **UniProt Targets** | Search protein targets and fetch amino acid sequences | UniProt REST API |
| **Clinical Trials** | Search active and completed clinical trials | ClinicalTrials.gov API |

### 📁 Workspace & Billing
| Feature | Description |
|---------|-------------|
| **Project Management** | Create projects to organize molecules by research topic |
| **Molecule Library** | Save, tag, reassign, and delete molecules across projects |
| **Analytics Dashboard** | Track usage with bar/pie charts and recent activity feed |
| **Tiered Pricing** | Free / Pro / Enterprise plans with credit-based billing |
| **Payment Gateway** | Razorpay (UPI/cards/netbanking) + Stripe (global cards) + sandbox mode |
| **JWT Authentication** | Email + password auth with OTP email verification via SMTP |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React 18)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │ Sidebar  │ │Dashboard │ │3D Viewer │ │  Chatbot   │  │
│  │Navigation│ │Analytics │ │ 3Dmol.js │ │  BioGPT    │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │Properties│ │  ADMET   │ │Generator │ │ Workspace  │  │
│  │Prediction│ │ Profiler │ │  BRICS   │ │ Projects   │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │ PubChem  │ │ PubMed   │ │ ChEMBL   │ │ Pricing    │  │
│  │ Search   │ │Literature│ │Bioactivity│ │ Razorpay   │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (Axios + JWT)
┌──────────────────────▼──────────────────────────────────┐
│                  BACKEND (FastAPI + Python)               │
│  ┌────────────┐ ┌──────────┐ ┌───────────┐              │
│  │ RDKit      │ │ChemBERTa │ │ BioGPT    │              │
│  │ Cheminform.│ │ 77M-MTR  │ │ HuggingFace│             │
│  └────────────┘ └──────────┘ └───────────┘              │
│  ┌────────────┐ ┌──────────┐ ┌───────────┐              │
│  │ Auth/JWT   │ │ Billing  │ │ Database  │              │
│  │ OTP/SMTP   │ │ Razorpay │ │ MongoDB   │              │
│  └────────────┘ └──────────┘ └───────────┘              │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌─────────┐  ┌───────────┐  ┌──────────┐
   │ PubChem │  │  PubMed   │  │ ChEMBL   │
   │  NCBI   │  │ E-Utils   │  │   EBI    │
   └─────────┘  └───────────┘  └──────────┘
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌─────────┐  ┌───────────┐  ┌──────────┐
   │ UniProt │  │  Clinical │  │   RCSB   │
   │  REST   │  │  Trials   │  │   PDB    │
   └─────────┘  └───────────┘  └──────────┘
```

---

## 📂 Project Structure

```
ai-unified-platform/
├── frontend/                        # React 18 SPA
│   ├── public/
│   │   └── index.html               # Entry HTML with 3Dmol.js & Inter font
│   ├── src/
│   │   ├── App.jsx                  # Root component with page routing
│   │   ├── index.js                 # React DOM entry point
│   │   ├── styles.css               # Complete design system (dark theme)
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar with sections
│   │   │   ├── MoleculeViewer.jsx   # 3Dmol.js wrapper (SDF/PDB rendering)
│   │   │   ├── PropertyDashboard.jsx# Physicochemical property display
│   │   │   └── AdmetRadar.jsx       # ADMET radar chart visualization
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx         # Login / Register / OTP verification
│   │   │   ├── Dashboard.jsx        # Analytics with Recharts bar/pie charts
│   │   │   ├── PropertyPage.jsx     # RDKit + ChemBERTa property prediction
│   │   │   ├── AdmetPage.jsx        # ADMET profiling with radar chart
│   │   │   ├── GeneratePage.jsx     # BRICS molecule generator
│   │   │   ├── SimilarityPage.jsx   # Tanimoto similarity search
│   │   │   ├── DtiPage.jsx          # Drug-target interaction prediction
│   │   │   ├── ViewerPage.jsx       # 3D viewer (molecule + protein modes)
│   │   │   ├── ChatbotPage.jsx      # BioGPT conversational AI
│   │   │   ├── PubChemPage.jsx      # PubChem compound search
│   │   │   ├── PubMedPage.jsx       # PubMed literature search
│   │   │   ├── ChemblPage.jsx       # ChEMBL bioactivity explorer
│   │   │   ├── UniprotPage.jsx      # UniProt protein target search
│   │   │   ├── TrialsPage.jsx       # Clinical trials search
│   │   │   ├── WorkspacePage.jsx    # Project + molecule management
│   │   │   └── PricingPage.jsx      # Subscription plans + payment checkout
│   │   └── services/
│   │       ├── api.js               # Axios REST client (30+ endpoints)
│   │       └── auth.js              # JWT auth helpers (login/register/logout)
│   ├── package.json
│   ├── run.bat                      # Windows startup script
│   └── run.sh                       # Linux/macOS startup script
├── backend/                         # FastAPI Python backend (separate setup)
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based UI with hooks |
| **Recharts** | Interactive analytics charts (bar, pie) |
| **3Dmol.js** | WebGL-based 3D molecular visualization |
| **Axios** | HTTP client with JWT interceptors |
| **Lucide React** | Icon library |
| **CSS Custom Properties** | Complete dark theme design system |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Async Python REST API framework |
| **RDKit** | Cheminformatics (descriptors, BRICS, MMFF, fingerprints) |
| **ChemBERTa-77M-MTR** | Neural molecular property prediction (HuggingFace) |
| **BioGPT** | Biomedical language model for chatbot (Microsoft) |
| **MongoDB** | Document database for users, molecules, projects |
| **JWT + bcrypt** | Secure authentication with OTP email verification |
| **Razorpay / Stripe** | Payment gateway integration |

### External APIs
| API | Data |
|-----|------|
| **PubChem** | Compound search, structures, 2D images |
| **PubMed** | Biomedical literature and abstracts |
| **ChEMBL** | Bioactivity data and assay results |
| **UniProt** | Protein sequences and annotations |
| **ClinicalTrials.gov** | Clinical trial metadata |
| **RCSB PDB** | Protein 3D structures (PDB format) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16.x and **npm** ≥ 8.x
- **Python** ≥ 3.9 (for backend)
- **MongoDB** (local or Atlas cloud)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/akash02062005/DRUG-DISCO-AI-.git
cd DRUG-DISCO-AI-

# Install frontend dependencies
cd frontend
npm install

# Start the development server
npm start
# Frontend runs at http://localhost:3000
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, SMTP, and payment keys

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/drugdisco

# Authentication
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payments (optional — runs in sandbox mode without these)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
# OR
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 🎨 Design System

The platform uses a carefully crafted **dark theme design system** built entirely with CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0a0e1f` | Page background |
| `--panel` | `#131830` | Card/panel backgrounds |
| `--accent` | `#6d5efc` | Primary purple accent |
| `--accent-2` | `#22d3ee` | Cyan secondary accent |
| `--accent-3` | `#f472b6` | Pink tertiary accent |
| `--good` | `#34d399` | Success / positive indicators |
| `--warn` | `#fbbf24` | Warning indicators |
| `--bad` | `#f87171` | Error / danger indicators |

### Design Highlights
- 🌙 **Deep space dark theme** with layered panel depths
- ✨ **Gradient accents** on active navigation, stat cards, and buttons
- 🎭 **Glassmorphic panels** with subtle borders and shadows
- 🔄 **Micro-animations** on card hover (translateY + shadow bloom)
- 📱 **Responsive grid layouts** with auto-fit columns
- 🔤 **Inter typeface** for professional, clean typography

---

## 📊 API Endpoints

The frontend communicates with **30+ REST API endpoints** organized by domain:

```
Auth:       POST /auth/register | /auth/login | /auth/verify-otp | GET /auth/me
Predict:    POST /predict-properties | /predict-admet | /predict-dti
Generate:   POST /generate-molecules | /similarity
Viewer:     POST /molecule/sdf | GET /protein/pdb/:id
Chat:       POST /chat
PubChem:    POST /pubchem/search
PubMed:     POST /pubmed/search | GET /pubmed/abstract/:pmid
ChEMBL:     POST /chembl/search | GET /chembl/:id/bioactivities
UniProt:    POST /uniprot/search | GET /uniprot/:acc/sequence
Trials:     POST /clinical-trials/search
Workspace:  CRUD /molecules | CRUD /projects
Billing:    GET /billing/plans | /billing/config | POST /billing/checkout | /billing/verify
Analytics:  GET /analytics/overview | /analytics/recent
```

---

## 🤖 AI Models Used

| Model | Architecture | Training Data | Use Case |
|-------|-------------|---------------|----------|
| **ChemBERTa-77M-MTR** | RoBERTa (77M params) | ChEMBL SMILES | Multi-task molecular property regression |
| **BioGPT** | GPT-2 (347M params) | 15M PubMed abstracts | Biomedical Q&A chatbot |
| **RDKit Descriptors** | Classical cheminformatics | — | Molecular weight, logP, TPSA, QED, Ro5 |
| **Morgan Fingerprints** | Circular fingerprints | — | Tanimoto similarity computation |
| **BRICS Decomposition** | Fragment-based | ChEMBL/ZINC library | *De novo* molecule generation |
| **MMFF94 Force Field** | Molecular mechanics | — | 3D coordinate optimization |

---

## 🔐 Authentication Flow

```
User Registration:
  [Signup Form] → POST /auth/register → [Server sends OTP via SMTP]
                                       → [User enters 6-digit code]
                                       → POST /auth/verify-otp
                                       → [JWT issued + user created]

User Login:
  [Login Form] → POST /auth/login → [JWT returned]
                                   → [Stored in localStorage]
                                   → [Injected via Axios interceptor]

Guest Mode:
  [Continue as Guest] → [Local-only session, no persistence]
```

---

## 💳 Payment Integration

The platform supports **three billing modes** out of the box:

| Mode | Provider | Supported Methods |
|------|----------|-------------------|
| **Razorpay** | Indian gateway | UPI, Net Banking, Cards, Wallets |
| **Stripe** | Global gateway | Credit/Debit Cards worldwide |
| **Sandbox** | Mock provider | Auto-verified (for development/demo) |

Plans: **Free** (50 credits) → **Pro** (2,000 credits) → **Enterprise** (unlimited)

---

## 🙋‍♂️ Author

**Akash S**

- GitHub: [@akash02062005](https://github.com/akash02062005)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>⚗️ DrugDisco AI</strong> — Accelerating Drug Discovery with Artificial Intelligence
  <br/>
  <sub>Built with ❤️ using React, FastAPI, ChemBERTa, BioGPT & RDKit</sub>
</p>
