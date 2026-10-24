# AttendEase React application

AttendEase is a role-based attendance management application built with React and Vite. The React entry point and application UI live in `src/`; Vite serves the repository root so the existing app URL and dashboard bookmarks open the React application.

## Technologies

- React 19 and React DOM
- Vite 8 and React Router 7
- jsPDF and jsPDF-AutoTable for PDF report exports
- Oxlint
- Browser `localStorage` for demo data and theme persistence

Use Node.js 20.19 or later in the 20.x line, or 22.12 or later in the 22.x line, with npm.

## Run locally

From the repository root, install dependencies and start Vite:

```powershell
npm.cmd --prefix attendease-react install
npm.cmd --prefix attendease-react run dev
```

## Available scripts

- `npm.cmd --prefix attendease-react run dev` — start the development server
- `npm.cmd --prefix attendease-react run build` — create a production build in `dist/`
- `npm.cmd --prefix attendease-react run preview` — serve the production build locally
- `npm.cmd --prefix attendease-react run lint` — lint React source files

On macOS or Linux, use `npm` instead of `npm.cmd`.

React Router provides role-scoped routes such as `/admin/dashboard`, `/faculty/mark`, and `/student/attendance`. Attendance percentages use unique saved sessions for subjects assigned to the student's class; sessions that have not been recorded are not counted. The minimum attendance requirement is 75%.

Student dashboards show subject-level shortage calculations and alerts. Faculty dashboards highlight students below the requirement in their assigned subjects, and the admin dashboard counts students who need attendance attention. Alerts recalculate from saved attendance records.

Student, faculty, and admin attendance history pages support subject, date range, month, status, and text-search filters. Each view updates its attended/missed totals and attendance percentage with the filtered records.

Students can submit correction requests for existing attendance records and follow their status. Requests are stored with the demo data; assigned faculty members must explicitly select Present or Absent before approval, while admins can review request history and pending counts.

Student, faculty, and admin attendance history pages can export the current filtered records as CSV or PDF. Reports include a generation timestamp and role-specific subject, student, class, and shortage summaries where applicable.

Admin, faculty, and student dashboards include a light/dark theme toggle. The preference is saved in browser storage and synchronized across tabs.

See the repository [README](../README.md) for the full feature list, demo accounts, and data behavior. Demo accounts and attendance data are stored in browser local storage; this app does not provide server-side authentication.
