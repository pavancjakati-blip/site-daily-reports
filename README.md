# FieldLog — Site Daily Report Tool

FieldLog is a clean, modern, full-stack web application designed for construction contractors to submit daily field reports at the end of each working day. Project managers can review these reports in real-time to monitor site progress, workforce presence, and active blockers.

---

## 🏗 Features

- **Site Directory**: Searchable list of all construction project sites with dynamic project count indicators.
- **Add Construction Sites**: Instantly add new sites with name and location details via a responsive overlay.
- **Daily Field Entries**: Detailed submission form for contractors to record workforce counts, completed work notes, and operational blockers.
- **Real-Time Reports Panel**: Clean tabular overview of all reports sorted newest first.
- **Date Filtration**: Instantly locate reports for a specific date or return to the complete log with one click.
- **Duplicate Prevention**: Strict validation on both backend and frontend preventing duplicate submissions for the same site on the same calendar date (HTTP 409).
- **Responsive Design**: Curated dark-themed visual aesthetics with full responsiveness across desktop, tablet, and mobile displays.

---

## 🛠 Tech Stack

- **Database**: PostgreSQL (relational database storage)
- **Backend**: Node.js + Express.js (REST API server)
- **Frontend**: HTML5, CSS3 (Vanilla CSS variables), and vanilla ES6 JavaScript (zero frameworks)

---

## 🗄 Database Schema

The database consists of two tables linked via a foreign key relation. Run the following SQL queries in your PostgreSQL instance to initialize the schema:

```sql
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE daily_reports (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    workers_present INTEGER NOT NULL,
    work_done TEXT NOT NULL,
    blockers TEXT,
    submitted_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_site_date_report UNIQUE (site_id, report_date)
);
```

---

## 🔌 API Endpoints

All backend endpoints are built in Express.js under the `/sites` prefix.

### Sites Endpoints
- **`GET /sites`**
  - **Description**: Returns a list of all construction sites in the directory.
  - **Response Status**: `200 OK`

- **`POST /sites`**
  - **Description**: Creates a new construction site.
  - **Body Format (JSON)**:
    ```json
    {
      "name": "Prestige Sunrise",
      "location": "Whitefield, Bangalore"
    }
    ```
  - **Response Status**: `201 Created` / `400 Bad Request` (validation failures)

### Reports Endpoints
- **`GET /sites/:id/reports`**
  - **Description**: Returns all daily reports for a specific site, ordered by date (newest first).
  - **Response Status**: `200 OK` / `500 Server Error`

- **`GET /sites/:id/reports/:date`**
  - **Description**: Returns the report for a specific site on a specific date (`YYYY-MM-DD`).
  - **Response Status**: `200 OK` / `404 Not Found`

- **`POST /sites/:id/reports`**
  - **Description**: Submits a daily field report.
  - **Body Format (JSON)**:
    ```json
    {
      "report_date": "2026-07-08",
      "workers_present": 12,
      "work_done": "Completed plastering on floors 3 and 4.",
      "blockers": "Cement delivery delayed — floor 6 work on hold.",
      "submitted_by": "Rajan Kumar"
    }
    ```
  - **Response Status**: 
    - `201 Created`: Report submitted successfully.
    - `400 Bad Request`: Missing mandatory fields.
    - `409 Conflict`: A report already exists for this site on the selected date.

---

## 💻 Local Setup Instructions

Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database instance

### 1. Set Up the Backend
1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory and set your PostgreSQL Connection String and Port:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
   PORT=3000
   ```
4. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *The API will start running at `http://localhost:3000`.*

### 2. Set Up the Frontend
1. Open the `frontend/` directory.
2. In the Javascript files (e.g. `frontend/script.js` and `frontend/site.js`), configure the target API URL constant at the top of the file:
   ```javascript
   const API_URL = "http://localhost:3000";
   ```
3. Launch `index.html` directly in your browser or run it using a simple static web server (such as Live Server in VS Code, or `npx serve .`).

---

## 🚀 Deployment

- **Backend (Railway)**: Connect your repository, create a PostgreSQL database plugin, copy the connection credentials, set them as the `DATABASE_URL` environment variable, and deploy.
- **Frontend (Vercel)**: Point Vercel to your repository. Set the root folder to `/frontend` or drag and drop your static files onto the Vercel dashboard. Ensure the `API_URL` variable in your javascript matches your public backend URL.
