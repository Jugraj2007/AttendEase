# AttendEase

AttendEase is a role-based attendance management demo built as a React single-page application. Administrators manage institution data, faculty record attendance, and students review their attendance and request corrections. The app runs locally and saves its demo data in the browser; it has no server-side database or production authentication.

## Features

- **Role-based dashboards:** separate admin, faculty, and student workspaces with role-scoped routes.
- **Institution management:** manage people, classes, subjects, and faculty assignments; review institution-wide attendance insights.
- **Attendance sessions:** faculty select a class and subject, mark attendance, and edit saved sessions without creating duplicate sessions.
- **Attendance analytics and alerts:** subject and monthly summaries, class-level insights, low-attendance alerts, and a 75% shortage calculator.
- **History and reports:** filter attendance by subject, date range, month, status, and search text; export the filtered report as CSV or PDF.
- **Correction requests:** students request a correction for a saved record; assigned faculty explicitly approve a corrected Present or Absent status, and administrators can review request status.
- **Browser persistence:** demo users, academic data, attendance, correction history, and theme preference persist in `localStorage`. Data is synchronized between tabs in the same browser.
- **Responsive interface and themes:** dashboard layouts adapt to mobile, tablet, and desktop; users can switch between persistent light and dark modes.

## Technology

- React 19 and React DOM
- Vite 8 for development and production builds
- React Router 7 for client-side routing
- jsPDF and jsPDF-AutoTable for PDF reports
- Oxlint for linting
- Browser `localStorage` for local demo persistence

Use Node.js 20.19 or later in the 20.x line, or 22.12 or later in the 22.x line, with npm.

## Run locally

From the repository root in Windows PowerShell:

```powershell
npm.cmd --prefix attendease-react install
npm.cmd --prefix attendease-react run dev
```

Open the local URL printed by Vite (by default, <http://localhost:5173/>). PowerShell users can use `npm.cmd` if the `npm` command is blocked by script execution policy. On macOS or Linux, replace `npm.cmd` with `npm`.

To check the production bundle and lint the source:

```powershell
npm.cmd --prefix attendease-react run build
npm.cmd --prefix attendease-react run lint
```

To preview a production build locally, run the build first and then:

```powershell
npm.cmd --prefix attendease-react run preview
```

Vite is configured at the repository root, so the production bundle is written to `dist/`. The application uses role-scoped paths such as `/admin/dashboard`, `/faculty/mark`, and `/student/attendance`.

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow that builds and deploys the application to the repository Pages URL (`https://sanehasharam.github.io/AttendEase/`). It builds the React production bundle with the correct `/AttendEase/` asset path and includes a Pages fallback for dashboard routes.

1. Push the workflow and application changes to the `main` branch.
2. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Open the repository **Actions** tab and wait for **Deploy AttendEase to GitHub Pages** to complete successfully.
4. Open the published Pages URL from the deployment job or **Settings → Pages**. After later pushes to `main`, wait for the deployment workflow to finish before reloading the site.

## Demo accounts

Use institution code `ABC001` with one of these accounts:

| Role | User ID | Password |
| --- | --- | --- |
| Administrator | `admin` | `admin123` |
| Faculty | `faculty01` | `Faculty@123` |
| Student | `Sanehasharma` | `Saneha@123` |

Additional example faculty and student accounts are included in the initial demo data. These credentials are for local demonstration only, not secure authentication.

## Attendance and data behavior

Attendance percentages are based on unique saved sessions for subjects assigned to a student's class. Unrecorded sessions do not count because the demo does not include a timetable. The attendance requirement is 75%. Summary cards, shortage calculations, alerts, and reports use the saved attendance records and update when those records change.

Demo data is stored in browser `localStorage`, scoped to the browser and origin. It persists across refreshes and can synchronize between tabs on that same origin; it is not shared with other browsers or devices. Clearing site data removes the local demo dataset. Do not use this application to store real student information.

## Project layout

- `attendease-react/src/` — React application, storage helpers, and styles
- `attendease-react/package.json` — development scripts and dependencies
- `attendease-react/vite.config.js` — Vite setup (serves the repository root)
- `attendease-react/README.md` — React app setup and feature notes
