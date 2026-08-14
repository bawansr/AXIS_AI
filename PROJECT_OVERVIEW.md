# AXIS — AI Workforce Scheduling Platform
## Comprehensive Project Overview & Tech Stack

---

## 🎯 Project Overview

**AXIS** is an enterprise-grade AI-powered workforce scheduling platform built for **Hemas Holdings**, a large healthcare and logistics company. The system intelligently manages shift creation, leave requests, shift swaps, and overtime (OT) coverage across multiple Strategic Business Units (SBUs) and departments.

### Key Business Goals
- **Automate scheduling** using natural language AI commands
- **Optimize fairness** across staff assignments  
- **Manage multi-SBU operations** (Hospitals, Mobility, etc.)
- **Enable self-service** leave and shift swap requests
- **Notify staff** for OT opportunities with smart candidate selection
- **Maintain compliance** with scheduling rules and labor regulations

---

## 📋 Core Capabilities

### 1. **AI Chat Scheduling**
- Managers create shifts via natural language (e.g., "Create 5 ICU morning shifts for nurses from April 1 to April 15")
- DeepSeek LLM processes the request and extracts parameters
- System validates constraints and schedules shifts
- Provides reasoning trace for every decision

### 2. **Multi-Role Support**
- Separate role-specific shifts (Nurses, Doctors, Ground Crew)
- Enforces role/certification matching during scheduling and swaps
- Per-role colour coding in the calendar UI

### 3. **Leave & Swap Management**
- Workers request leave via the frontend
- Manager reviews and approves/rejects
- System automatically finds qualified swap candidates
- Validates certifications, weekly hours, rest periods, and role match

### 4. **Overtime (OT) Management**
- Manager creates OT requests for uncovered shifts
- System notifies eligible workers (by department/certifications)
- Workers apply for OT; manager selects from applicants
- Email notifications via SendGrid or SMTP

### 5. **Shift Calendar**
- Visual calendar with drag-and-drop (future)
- Per-role colour coding
- Filter by department and date range

### 6. **Escalation & Decision Logs**
- Manager can escalate conflicts for human review
- Full audit trail of agent decisions with reasoning

---

## 🏗️ Architecture Overview

```
AXIS/
├── Backend (FastAPI + SQLAlchemy + AsyncPG)
│   ├── REST API (8001)
│   ├── AI Agents (DeepSeek LLM orchestration)
│   ├── Business Rules Engine (constraint validation)
│   └── PostgreSQL ORM models
│
├── Frontend (React + Vite + shadcn/ui)
│   ├── SPA served from (8080)
│   ├── React Query for data fetching
│   ├── Responsive UI with Tailwind CSS
│   └── Interactive shift calendar
│
├── Database (PostgreSQL 16 with pgvector)
│   ├── Multi-tenant SBU architecture
│   ├── Shift/Leave/OT request tables
│   └── Audit logs and agent traces
│
└── LLM Integration (DeepSeek API)
    └── OpenAI-compatible API wrapper
```

---

## 💻 Tech Stack

### **Backend**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | FastAPI 0.115.0 | Async REST API |
| **Server** | Uvicorn 0.30.0 | ASGI server |
| **ORM** | SQLAlchemy 2.0.35 | Database models & queries |
| **Driver** | AsyncPG 0.29.0 | Async PostgreSQL connection |
| **Migrations** | Alembic 1.13.2 | Schema versioning |
| **LLM** | DeepSeek (OpenAI API) | Natural language processing |
| **LLM Framework** | LangChain 0.3.3 | Agent orchestration |
| **Validation** | Pydantic 2.9.2 | Request/response schemas |
| **Config** | Pydantic Settings 2.5.2 | Environment variables |
| **Notifications** | SendGrid 6.11.0 | Email delivery |
| **HTTP Client** | httpx 0.27.2 | External API calls |
| **Language** | Python 3.11+ | Backend logic |

### **Frontend**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI component library |
| **Build Tool** | Vite 5.x | Lightning-fast dev server & builds |
| **Language** | TypeScript 5.x | Type-safe JavaScript |
| **UI Components** | shadcn/ui | Pre-built Radix UI components |
| **Styling** | Tailwind CSS 3.x | Utility-first CSS |
| **Routing** | React Router v6 | Client-side navigation |
| **State Management** | React Context API | Global state (AxisContext) |
| **Data Fetching** | TanStack React Query | Server state management |
| **Forms** | React Hook Form | Efficient form handling |
| **Validation** | Zod (via shadcn) | Schema validation |
| **Notifications** | Sonner + shadcn Toaster | Toast alerts |
| **Testing** | Vitest + Playwright | Unit & E2E tests |
| **Post-processing** | PostCSS | CSS transformations |

### **Database**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **DBMS** | PostgreSQL 16 | Relational database |
| **Extension** | pgvector | Vector similarity (future AI features) |
| **Connection** | AsyncPG | Async database driver |
| **Driver Support** | psycopg2-binary | Fallback PostgreSQL driver |
| **Async ORM** | SQLAlchemy 2.0 async | Async database operations |

### **Infrastructure**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Container images |
| **Orchestration** | Docker Compose | Multi-container local setup |
| **Database Container** | pgvector:pg16 | Containerized PostgreSQL |
| **Backend Container** | FastAPI (custom) | Containerized backend |
| **Frontend Container** | Node.js (custom) | Containerized React frontend |

### **External Services**

| Service | Purpose |
|---------|---------|
| **DeepSeek API** | Large Language Model for NL scheduling |
| **SendGrid** | Transactional email notifications |
| **SMTP** | Alternative email delivery (fallback) |

---

## 🧠 AI & Agent Architecture

### **Agent Pipeline**

Every manager message flows through a **multi-agent orchestration pipeline**:

```
Manager Input (Natural Language)
    ↓
┌─────────────────────────────────────┐
│  ORCHESTRATOR AGENT (Intent Router) │
│  ├─ Parses intent (schedule/swap)   │
│  ├─ Extracts parameters              │
│  └─ Routes to specialist agent      │
└────────────────────────────────────┘
    ↓
    ├─→ SCHEDULER AGENT (Generate shifts)
    │   ├─ Uses ValidateSchedule rule
    │   ├─ Calculates fairness scores
    │   └─ Creates Shift records
    │
    ├─→ SWAP AGENT (Manage leave/swaps)
    │   ├─ Finds candidates
    │   ├─ Validates role/certs
    │   └─ Escalates conflicts
    │
    ├─→ COMPLIANCE AGENT (Reporting)
    │   ├─ Fairness audits
    │   └─ Shift coverage reports
    │
    └─→ DIRECT RESPONSE (Queries)
        └─ Returns data without scheduling
```

### **Agent Files**

| File | Role |
|------|------|
| `orchestrator.py` | Entry point; classifies intent + routes |
| `scheduler.py` | Creates shifts; applies fairness scoring |
| `swap.py` | Finds swap candidates; resolves leave |
| `compliance.py` | Audit logs; fairness reports |
| `deepseek.py` | LLM wrapper (OpenAI-compatible API) |
| `tools.py` | Shared agent utilities |

### **Key Prompt Engineering**

Each agent has a detailed system prompt that:
- Explains its specific role (no overlap)
- Defines constraint rules (JSON format)
- Provides reasoning templates
- Guides JSON response format

---

## 📦 Database Schema

### **Core Tables**

#### **SBU (Strategic Business Unit)**
```sql
sbus:
  id (PK)
  name ("Hospitals", "Mobility")
  code ("hospitals", "mobility")
  timezone (e.g., "Asia/Colombo")
  config (JSONB) -- Full scheduling rules
  is_active (Boolean)
  created_at (Timestamp)
```

#### **Department**
```sql
departments:
  id (PK)
  sbu_id (FK → sbus)
  name ("ICU", "Emergency", "Ground Crew")
  code ("icu", "emergency", "ground_crew")
```

#### **ShiftType**
```sql
shift_types:
  id (PK)
  sbu_id (FK → sbus)
  name ("Morning ICU", "Evening Emergency")
  code ("morning_icu", "evening_emergency")
  start_time, end_time
  required_certifications (JSONB) -- ["nurse", "icu_cert"]
  min_headcount (e.g., 3 nurses per shift)
  department_code (foreign key)
```

#### **Worker**
```sql
workers:
  id (PK)
  employee_id (UNIQUE)
  name, email, phone
  department_id (FK → departments)
  certifications (JSONB) -- ["nurse", "icu_cert", "cpr"]
  max_weekly_hours (e.g., 40)
  is_active
  created_at
```

#### **Shifts**
```sql
shifts:
  id (PK)
  worker_id (FK → workers, nullable for open shifts)
  shift_type_id (FK → shift_types)
  date, start_time, end_time
  status ('open', 'proposed', 'confirmed', 'cancelled', 'swapped')
  fairness_score (0–100)
  explanation (AI reasoning)
  reasoning_trace (JSONB) -- Full decision log
  created_by ('agent' or manager name)
  created_at, confirmed_at
```

#### **LeaveRequest**
```sql
leave_requests:
  id (PK)
  worker_id (FK → workers)
  shift_id (FK → shifts, nullable)
  date, reason
  status ('pending', 'approved', 'rejected', 'covered')
  replacement_worker_id (FK → workers, the swap candidate)
  resolution_summary
  created_at, resolved_at
```

#### **OTRequest**
```sql
ot_requests:
  id (PK)
  shift_type_id (FK → shift_types)
  date, start_time, end_time
  status ('open', 'notified', 'assigned', 'cancelled')
  notified_count, min_applicants
  created_by, created_at
```

#### **OTApplication**
```sql
ot_applications:
  id (PK)
  ot_request_id (FK → ot_requests)
  worker_id (FK → workers)
  status ('pending', 'assigned', 'rejected')
  applied_at, resolved_at
```

#### **Escalation**
```sql
escalations:
  id (PK)
  shift_id (FK → shifts)
  reason (e.g., "No qualified swap found")
  status ('open', 'resolved', 'dismissed')
  manager_notes
  created_at, resolved_at
```

#### **Availability**
```sql
availability:
  id (PK)
  worker_id (FK → workers)
  date, start_time, end_time
  is_available (Boolean)
```

---

## 🔧 Rules Engine (Validation Layer)

The **Business Rules Engine** (`backend/app/rules/engine.py`) enforces all constraints. The AI agent DOES NOT validate; it only calls these rules.

### **Core Validation Checks**

1. **Overlap Detection**
   - No two shifts on the same day/time for the same worker

2. **Availability Check**
   - Worker has not requested leave for that date
   - Worker has declared availability (if availability tracking enabled)

3. **Certification Matching**
   - Worker possesses all required certifications for the shift type

4. **Weekly Hours Limit**
   - Total weekly hours do not exceed worker's max_weekly_hours

5. **Rest Period Enforcement**
   - Minimum rest hours between consecutive shifts

6. **Department Match** (for swaps)
   - Swap candidate is from the same department

7. **Role Match** (for swaps)
   - Swap candidate has the same role/shift type

8. **Fairness Scoring**
   - Weighted calculation: recent shifts + hours + role distribution
   - Lower score = more "fair" to assign

---

## 📡 API Design (REST Endpoints)

### **Shift Management**
```
POST   /shifts/create               -- Create a single shift
POST   /shifts/schedule             -- Generate multiple shifts (AI scheduling)
GET    /shifts                      -- List shifts (filterable)
PATCH  /shifts/{id}                -- Update shift status
DELETE /shifts/{id}                -- Cancel shift
```

### **Scheduling & Validation**
```
POST   /scheduling/validate         -- Run all business rules
POST   /scheduling/available-staff  -- Query eligible workers
```

### **Leave Management**
```
POST   /leave-requests              -- Worker requests leave
GET    /leave-requests              -- List requests
PATCH  /leave-requests/{id}         -- Approve/reject
POST   /leave-requests/{id}/resolve -- Find & assign replacement
```

### **Swap Management**
```
POST   /swaps/find-candidates       -- Find qualified swap candidates
POST   /swaps/resolve               -- Execute the swap
GET    /swaps                       -- List all swaps
```

### **OT Management**
```
POST   /ot-requests                 -- Create OT request
POST   /ot-requests/{id}/notify     -- Notify eligible workers
GET    /ot-applications             -- List applications
PATCH  /ot-applications/{id}        -- Assign OT to worker
```

### **AI Orchestration**
```
POST   /chat/message                -- Send natural language command
POST   /query-assistant             -- Query-only (no scheduling)
GET    /decision-logs               -- Retrieve reasoning traces
```

---

## 🎨 Frontend Structure

### **Page Layout**

```
┌────────────────────────────────────────────────────────┐
│                    ContextBar (Top)                     │
│          [SBU Selector] [Department Filter] [User]      │
└────────────────────────────────────────────────────────┘
┌──────────────┬────────────────────────────────────────┐
│              │                                         │
│   Sidebar    │         Main Content (Router)          │
│              │                                         │
│  • Home      │  Route → Page Component               │
│  • Employees │  - Index (Dashboard + Chat)           │
│  • Payroll   │  - EmployeesPage (Worker List)        │
│  • Timesheet │  - PayrollPage (Hours/Pay)            │
│              │  - TimesheetPage (Attendance)         │
│              │                                         │
└──────────────┴────────────────────────────────────────┘
```

### **Key Components**

#### **ChatPanel.tsx**
- Manager sends natural language commands
- Connects to `/chat/message` endpoint
- Displays AI reasoning & decision logs

#### **ShiftCalendar.tsx**
- Visual calendar view (date grid)
- Color-coded by role (Nurse=blue, Doctor=red, etc.)
- Drag-to-reassign (future)

#### **ShiftModal.tsx**
- Create/edit shift details
- Date, time, shift type, worker selection
- Inline validation feedback

#### **SwapPanel.tsx**
- Request shift swap
- Display swap candidates with match score
- Approve/reject UI

#### **OTPanel.tsx**
- Create OT request
- Notify eligible workers
- View applications & assign

#### **UI Components** (shadcn/ui)
- Accordion, Alert, Avatar, Badge, Button, Calendar
- Card, Checkbox, Command, Dialog, Dropdown
- Form, Hover Card, Input, Label, Pagination
- Popover, Select, Sidebar, Tabs, Toast

### **State Management**

**AxisContext.tsx** provides:
```typescript
interface AxisContextType {
  selectedSBU: string;
  selectedDepartment: string;
  currentUser: User;
  setSelectedSBU: (sbu: string) => void;
  setSelectedDepartment: (dept: string) => void;
}
```

### **Data Fetching** (React Query)

```typescript
// Example: Fetch shifts for a date range
useQuery({
  queryKey: ['shifts', dateStart, dateEnd],
  queryFn: () => fetchShifts(dateStart, dateEnd),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

---

## 🚀 Deployment & Execution Flow

### **Docker Compose Setup**

1. **Database Service** (`pgvector:pg16`)
   - Listens on `localhost:5432`
   - Auto-initializes with `init.sql`
   - Health check every 5s

2. **Backend Service** (FastAPI)
   - Builds from `backend/Dockerfile`
   - Listens on `localhost:8001`
   - Environment variables injected from `.env`
   - Command: `uvicorn app.main:app --host 0.0.0.0 --port 8001`
   - Waits for DB health check before starting

3. **Frontend Service** (React/Vite)
   - Builds from `shift-genie-main/Dockerfile`
   - Served on `localhost:8080`
   - Built React SPA (production build)

### **Database Seeding**

```python
# backend/seed.py
# Inserts:
# - SBU records (Hospitals, Mobility)
# - Departments per SBU
# - ShiftTypes per department
# - Sample Workers with certifications
# - Availability slots
```

Run after containers start:
```bash
docker exec axis-backend python seed.py
```

---

## 🔒 Security & Configuration

### **Environment Variables**

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | YES | PostgreSQL async connection string |
| `DEEPSEEK_API_KEY` | YES* | *Optional but required for AI features |
| `DEEPSEEK_BASE_URL` | NO | Default: https://api.deepseek.com |
| `DEEPSEEK_MODEL` | NO | Default: deepseek-chat |
| `SENDGRID_API_KEY` | NO | For email notifications |
| `SMTP_HOST/PORT/USER/PASSWORD/FROM` | NO | Alternative email setup |
| `AXIS_API_BASE` | NO | Backend URL for agents (default: http://127.0.0.1:8001) |
| `ENVIRONMENT` | NO | development/production |
| `LOG_LEVEL` | NO | Default: INFO |

### **Multi-Tenancy**

- SBU (Strategic Business Unit) is the tenant boundary
- Each SBU has:
  - Separate department structure
  - Independent shift type definitions
  - Isolated worker pools
  - Unique scheduling rules (in config JSON)

---

## 📊 Data Flow Diagrams

### **AI Scheduling Request**

```
Manager: "Create 5 ICU morning shifts for nurses from April 1–15"
                              ↓
                    [Orchestrator Agent]
                    Intent: "schedule"
                    Params: dept="ICU", headcount=5, dates=["2025-04-01" to "2025-04-15"]
                              ↓
                    [Scheduler Agent]
                    ├─ For each date: GET available nurses
                    ├─ For each nurse: RUN validation rules
                    ├─ Calculate fairness score
                    └─ POST /shifts/create
                              ↓
                    [Rules Engine]
                    ├─ Overlap? ✓
                    ├─ Availability? ✓
                    ├─ Certifications? ✓
                    ├─ Weekly hours? ✓
                    └─ Return validation result
                              ↓
                    [Database]
                    INSERT shifts rows (status='proposed')
                              ↓
Manager sees: "Created 75 shifts (15 dates × 5 nurses)"
              + Fairness scores
              + Reasoning trace
```

### **Leave Request & Swap Resolution**

```
Worker: Requests leave on April 5
                              ↓
        [DB: INSERT leave_request (status='pending')]
                              ↓
Manager: Approves leave request
                              ↓
        [Swap Agent triggered]
        ├─ GET affected shifts for that date
        ├─ POST /swaps/find-candidates
        │   ├─ Query workers in same dept
        │   ├─ Filter by role/certifications
        │   ├─ Check availability
        │   └─ Rank by fairness score
        │
        └─ If no candidates:
            ├─ Escalation created
            └─ Manager notified
                              ↓
Manager selects swap candidate
                              ↓
        [DB: UPDATE shifts, leave_requests]
        [EMAIL: Notify both workers]
```

---

## 🧪 Testing & CI/CD

### **Frontend Tests**

- **Unit**: Vitest with component testing
- **E2E**: Playwright for user workflows
- Run: `npm test` / `npm run test:watch`

### **Backend Tests**

- **conftest.py**: Async session fixtures
- **test_workflows.py**: Integration tests
- Run: `pytest`

### **Docker Build Pipeline**

```
git push
    ↓
docker-compose build
    ├─ backend: Python image + requirements.txt
    ├─ frontend: Node image + npm build
    └─ db: pgvector prebuilt image
    ↓
docker-compose up
    ├─ Run DB migrations (Alembic)
    ├─ Start FastAPI server
    ├─ Serve React SPA
    └─ Health checks
```

---

## 🎯 Key Design Decisions

### **Why DeepSeek LLM?**

- ✅ OpenAI-compatible API (easy integration)
- ✅ Cost-effective for large-scale use
- ✅ Supports complex reasoning (chain-of-thought)
- ✅ Can run specialized prompts (Orchestrator, Scheduler, Swap agents)

### **Why Agent Architecture?**

- ✅ Separation of concerns (routing, scheduling, swaps, compliance)
- ✅ Easy to test & debug individual agent logic
- ✅ Scalable to new agent types (payroll, forecasting)
- ✅ Decision traceability (every agent step logged)

### **Why Rules Engine as Separate Layer?**

- ✅ Constraints are NOT AI-driven (deterministic, auditable)
- ✅ Validation is fast (no LLM calls needed)
- ✅ Easy to update rules without retraining AI
- ✅ Compliance & legal teams can review rules code

### **Why PostgreSQL + AsyncPG?**

- ✅ ACID guarantees for shift assignments
- ✅ AsyncPG for high concurrency (many managers scheduling simultaneously)
- ✅ pgvector for future AI embedding-based search
- ✅ Mature ecosystem (SQLAlchemy, Alembic)

### **Why React + Vite?**

- ✅ Fast development build (< 1s HMR)
- ✅ Lightweight React SPA (no SSR overhead)
- ✅ Vite's native TypeScript support
- ✅ Small bundle size for frontline workers on slow networks

---

## 📈 Scalability & Performance

### **Current Bottlenecks**

1. **LLM API latency** (~5–10s per request)
   - Solution: Response streaming, prompt caching (DeepSeek API v2)

2. **Database queries** (large date ranges)
   - Solution: Indexes on (shift_date, department_id), caching

3. **Frontend real-time updates**
   - Solution: WebSocket subscriptions (future), React Query polling

### **Optimization Opportunities**

- **Batch shift creation** (agent generates 100+ shifts in one call)
- **Cached shift type configs** (rarely change, high hit rate)
- **Read replicas** for reports (eventual consistency OK)
- **Search optimization** (Elasticsearch for full-text shift notes)

---

## 📝 Development Workflow

### **Local Setup**

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
export DEEPSEEK_API_KEY=sk-xxx
export DATABASE_URL=postgresql+asyncpg://...
uvicorn app.main:app --reload

# Frontend
cd shift-genie-main
npm install
npm run dev  # Vite dev server on :5173
```

### **Adding a New Shift Type**

1. Insert into `shift_types` table (via admin panel or seed)
2. Update SBU config in `configs/{sbu}.json`
3. Frontend auto-fetches and displays in shift creation modal

### **Adding a New Constraint**

1. Add validation function to `rules/engine.py`
2. Call it from `validate_assignment()` in `rules/engine.py`
3. Test with `pytest`
4. Agent will use it automatically (no code changes needed)

### **Adding a New Agent**

1. Create `agents/{agent_name}.py`
2. Define SYSTEM_PROMPT with role + constraints
3. Export `run_{agent_name}()` function
4. Update orchestrator routing logic

---

## 🚨 Error Handling & Logging

### **Backend Logging**

- **Level**: INFO (configured via `LOG_LEVEL` env var)
- **Location**: stderr (docker logs)
- **Tracing**: Full decision reasoning in `reasoning_trace` JSONB field

### **Agent Decision Logs**

```json
{
  "shift_id": 42,
  "reasoning_trace": {
    "agent": "scheduler",
    "intent": "schedule",
    "validation_checks": [
      {"name": "overlap", "passed": true},
      {"name": "certification", "passed": true},
      {"name": "weekly_hours", "passed": true}
    ],
    "fairness_score": 75.3,
    "selected_worker_id": 12,
    "timestamp": "2025-04-01T10:23:45Z"
  }
}
```

### **Error Recovery**

- **DB transaction failures**: Rolled back automatically (SQLAlchemy)
- **LLM API down**: Fallback to basic heuristic mode
- **Email sending fails**: Logged but doesn't block shift creation

---

## 🔗 External Integrations

### **DeepSeek API Integration**

```python
from agents.deepseek import chat_completion

result = chat_completion(
    system="You are a scheduler...",
    user="Create 5 ICU shifts...",
    max_tokens=500,
    temperature=0.0  # Deterministic
)
```

### **SendGrid Integration**

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

mail = Mail(
    from_email="noreply@axis.app",
    to_emails="worker@hemas.com",
    subject="Shift Swap Approved",
    plain_text_content="Your swap has been approved..."
)
```

---

## 🎓 Knowledge Base & References

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **SQLAlchemy Async**: https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html
- **React Query**: https://tanstack.com/query/latest
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **DeepSeek API**: https://api-docs.deepseek.com
- **LangChain**: https://python.langchain.com

---

## 📊 Metrics & KPIs

### **Operational Metrics**

| Metric | Target | Current |
|--------|--------|---------|
| Shift creation time (via AI) | < 2 min | TBD |
| Leave approval turnaround | < 24 hrs | TBD |
| Swap candidate match rate | > 80% | TBD |
| Fairness score variance | < 15 points | TBD |
| Uptime | 99.5% | TBD |

### **System Metrics**

| Metric | Target |
|--------|--------|
| API response time (p95) | < 500ms |
| DB query time (p95) | < 100ms |
| Frontend Lighthouse score | > 90 |
| Backend CPU usage | < 60% |

---

## 🔮 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Predictive scheduling (ML model for demand forecasting)
- [ ] Advanced fairness scoring (reinforcement learning)
- [ ] Multi-language support (i18n)
- [ ] Custom scheduling rules UI (no-code rule builder)
- [ ] Payroll integration (export to QuickBooks, SAP)
- [ ] Forecasting dashboard (upcoming demand, capacity planning)
- [ ] Kubernetes deployment (Helm charts)
- [ ] GraphQL API (alternative to REST)

---

## 📞 Support & Contact

For architecture questions or deployment support, refer to the README.md or check the `.instructions.md` file in the project root.

