# 📊 AI-Powered Product Sentiment Dashboard

![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=for-the-badge&logo=openai&logoColor=white)

> **Transform raw customer feedback into actionable strategic insights in seconds.**

---

## 📖 Overview

The **Product Review Sentiment & Summary Dashboard** is a full-stack analytical tool designed to help e-commerce businesses understand their customers instantly. 

Instead of manually reading thousands of rows of CSV data, this system ingests raw review files, processes them using **Large Language Models (LLMs)** in parallel, and visualizes the results on a modern, glassmorphic dashboard. It identifies recurring themes (Pros/Cons), calculates sentiment trends, and generates executive summaries automatically.

---

## ✨ Key Features

### 1. Intelligent Analysis
- **Automated Sentiment Scoring:** Classifies reviews as Positive, Neutral, or Negative with high precision
- **Theme Extraction:** Dynamic identification of top "Pros" and "Cons" across thousands of reviews
- **Executive Summaries:** Auto-generates a human-readable "Verdict" text (e.g., "Highly Recommended") based on aggregate data

### 2. High-Performance Engineering
- **Asynchronous Processing:** Java `CompletableFuture` ensures the UI remains responsive while the backend crunches data in the background
- **Parallel Execution:** Fast multi-threaded processing of review batches (5x faster than sequential)
- **Live Polling:** Real-time status updates on the dashboard using a smart polling mechanism

### 3. Modern UI/UX
- **Glassmorphism Design:** A stunning dark-mode interface built with **Tailwind CSS**
- **Interactive Visualizations:** Dynamic Pie Charts and Bar Graphs using **Recharts**
- **Smart Filtering:** Automatically detects products in the CSV and allows instant filtering by Product Name

---

## 📂 Project Structure

A high-level overview of the codebase organization.

### **Backend (Spring Boot)**
The core logic resides in `src/main/java/com/github/ani/llm_review_analysis/`.

```text
backend/
├── config/
│   └── WebConfig.java           # Global CORS configuration allowing frontend access
├── controller/
│   ├── ReviewController.java    # Handles CSV file upload & parsing requests
│   └── DashboardController.java # Endpoints for fetching stats, charts, and filtering logic
├── model/
│   ├── ProductReview.java       # Entity mapping for raw CSV data
│   └── ReviewAnalysis.java      # Entity for AI results (stores JSONB pros/cons)
├── repository/
│   └── AnalysisRepository.java  # Optimized SQL queries for aggregating sentiment stats
└── service/
    ├── ReviewService.java       # The "Brain". Handles Async orchestration & Parallel Stream logic
    └── OpenAiService.java       # Manages communication with GPT-3.5 API
```

### **Frontend (React + Vite)**
The UI is built with a component-first architecture in `src/`.

```text
frontend/
├── src/
│   ├── components/
│   │   ├── charts/              # Reusable Recharts components (Pie & Bar)
│   │   ├── ui/                  # Shadcn/Tailwind UI primitives (Buttons, Cards)
│   │   ├── Dashboard.tsx        # Main view. Handles polling, state, and product filtering
│   │   ├── FileUpload.tsx       # Drag & Drop zone with animation states
│   │   └── SummaryInsights.tsx  # Generates the "Executive Summary" text block
│   ├── pages/
│   │   └── Index.tsx            # Route handling and layout wrapper
│   └── App.tsx                  # Global providers (QueryClient, Toaster)
```

---

## 🏗️ System Architecture

The system follows a modern 3-Tier Microservices-ready Architecture, decoupling the high-performance backend from the interactive frontend.

```mermaid
graph TD
    %% Styling
    classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0c4a6e;
    classDef frontend fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d;
    classDef backend fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#7c2d12;
    classDef db fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px,color:#4c1d95;
    classDef ai fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d;

    subgraph User_Interaction [User Interaction]
        User[End User]
    end

    subgraph Frontend_Layer [Frontend Layer]
        UI[React Dashboard]
        Uploader[File Uploader]
        Charts[Charts and Stats]
    end

    subgraph Backend_Layer [Backend Layer]
        Controller[REST Controllers]
        Service[Service Layer Async Processing]
        Repo[JPA Repositories]
    end

    subgraph Data_Layer [Database Layer]
        DB[PostgreSQL Supabase]
    end

    subgraph AI_Services [External Services]
        OpenAI[OpenAI API]
    end

    User -->|Drag and Drop CSV| Uploader
    Uploader -->|POST api upload| Controller
    UI -->|GET api stats polling| Controller
    Controller -->|Trigger async| Service
    Service -->|Save raw data| Repo
    Repo -->|Read write| DB
    Service -.->|Analyze parallel| OpenAI

    %% Class assignments
    class User client
    class UI,Uploader,Charts frontend
    class Controller,Service,Repo backend
    class DB db
    class OpenAI ai
```

---

## 💾 Database Schema

The database is designed with normalization and scalability in mind, separating raw ingestion data from AI-generated insights.

```mermaid
erDiagram
    upload_batches ||--|{ product_reviews : contains
    product_reviews ||--|| review_analysis : has_one

    upload_batches {
        uuid batch_id PK
        string file_name
        timestamp upload_timestamp
        string status "PENDING | COMPLETED"
    }

    product_reviews {
        int id PK
        uuid batch_id FK
        string product_name
        text review_text
        string reviewer_name
    }

    review_analysis {
        int id PK
        int review_id FK
        string sentiment "Positive | Negative | Neutral"
        decimal confidence_score
        text summary
        jsonb pros 
        jsonb cons 
    }
```

### Table Breakdown

| Table | Purpose | Key Feature |
|-------|---------|-------------|
| `upload_batches` | Tracks every file upload attempt | Manages the Async State (PROCESSING vs COMPLETED) to enable the live loading UI |
| `product_reviews` | Stores the raw CSV data exactly as uploaded | Decouples the original data from the analysis, allowing re-analysis if the AI model changes |
| `review_analysis` | Stores the LLM outputs | Uses PostgreSQL JSONB columns for pros and cons, enabling flexible, schema-less storage of list data |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS, Framer Motion
- **Visualization:** Recharts
- **State Management:** React Hooks
- **HTTP Client:** Axios

### Backend
- **Framework:** Spring Boot 3.3.0 (Java 17)
- **Database:** PostgreSQL (via Supabase) with JSONB support
- **ORM:** Spring Data JPA (Hibernate)
- **CSV Parsing:** OpenCSV
- **Concurrency:** Java CompletableFuture & Stream API

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Java 17 or higher
- Node.js and npm
- Supabase Project (PostgreSQL)
- OpenAI API Key

### Clone the Repository

```bash
git clone https://github.com/yourusername/llm-review-analysis.git
cd llm-review-analysis
```

### Backend Setup

Navigate to the backend folder and configure your environment variables.

1. Open `src/main/resources/application.properties`

2. Update the following credentials:

```properties
# Database Configuration (Supabase)
spring.datasource.url=jdbc:postgresql://[YOUR_SUPABASE_HOST]:5432/postgres?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=[YOUR_DB_PASSWORD]

# OpenAI Configuration
openai.api.key=[YOUR_OPENAI_API_KEY]
openai.model=gpt-3.5-turbo
```

3. Run the Backend:

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

### Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`

---

## 🧪 Usage Guide

1. **Prepare Data:** Create a CSV file with columns: `id`, `product_name`, `review_text`, `reviewer_name`

2. **Upload:** Drag and drop the CSV into the dashboard

3. **Analyze:** Monitor the live analysis badge as the backend processes reviews in real-time

4. **Explore:**
   - Filter by specific products using the dropdown
   - View the calculated executive summary
   - Hover over charts to see detailed sentiment breakdowns