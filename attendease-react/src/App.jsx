import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { initialData, isApplicationData, isRole, readApplicationState } from './data.js'
import './App.css'

const TODAY = formatLocalDate(new Date())
const ATTENDANCE_THRESHOLD = 75

const navigation = {
  admin: [
    ['dashboard', 'Overview', '◫'],
    ['users', 'People', '♙'],
    ['academics', 'Academics', '▤'],
    ['attendance', 'Attendance', '✓'],
    ['corrections', 'Correction requests', '✎'],
    ['settings', 'Settings', '⚙'],
  ],
  faculty: [
    ['dashboard', 'Overview', '◫'],
    ['mark', 'Mark attendance', '✓'],
    ['history', 'Attendance history', '◷'],
    ['corrections', 'Correction requests', '✎'],
    ['classes', 'My classes', '▤'],
    ['profile', 'My profile', '♙'],
  ],
  student: [
    ['dashboard', 'Overview', '◫'],
    ['attendance', 'My attendance', '✓'],
    ['corrections', 'Correction requests', '✎'],
    ['subjects', 'My subjects', '▤'],
    ['profile', 'My profile', '♙'],
  ],
}

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getUniqueAttendanceRecords(records) {
  const uniqueRecords = new Map()
  records.forEach((record) => {
    uniqueRecords.set(`${record.date}|${record.subjectId}|${record.studentId}`, record)
  })
  return [...uniqueRecords.values()]
}

function getEligibleStudentRecords(data, student) {
  if (student.role !== 'student') return []
  const eligibleSubjects = new Set(
    data.subjects
      .filter((subject) => subject.classId === student.classId)
      .map((subject) => subject.id),
  )
  return getUniqueAttendanceRecords(data.attendanceRecords).filter((record) => (
    record.studentId === student.username &&
    eligibleSubjects.has(record.subjectId) &&
    ['present', 'absent'].includes(record.status.toLowerCase())
  ))
}

function getAttendanceSummary(records) {
  const present = records.filter((record) => record.status.toLowerCase() === 'present').length
  return {
    present,
    total: records.length,
    percentage: records.length ? Math.round((present / records.length) * 100) : 0,
  }
}

function getSubjectAttendancePlan(records) {
  const present = records.filter((record) => record.status.toLowerCase() === 'present').length
  const total = records.length
  if (!total) {
    return { present, total, percentage: 0, belowThreshold: false, classesNeeded: null, classesCanMiss: null }
  }

  const belowThreshold = present / total < ATTENDANCE_THRESHOLD / 100
  return {
    present,
    total,
    percentage: Math.round((present / total) * 100),
    belowThreshold,
    classesNeeded: belowThreshold ? 3 * total - 4 * present : 0,
    classesCanMiss: belowThreshold ? 0 : Math.floor((4 * present - 3 * total) / 3),
  }
}

function getStudentSubjectPlans(data, student, subjects) {
  const records = getEligibleStudentRecords(data, student)
  return subjects
    .filter((subject) => subject.classId === student.classId)
    .map((subject) => ({
      subject,
      ...getSubjectAttendancePlan(records.filter((record) => record.subjectId === subject.id)),
    }))
}

function getClassAttendanceSummary(data, classId) {
  const classSubjects = new Set(
    data.subjects.filter((subject) => subject.classId === classId).map((subject) => subject.id),
  )
  const studentIds = new Set(
    data.users
      .filter((student) => student.role === 'student' && student.classId === classId)
      .map((student) => student.username),
  )
  const records = getUniqueAttendanceRecords(data.attendanceRecords).filter((record) => (
    classSubjects.has(record.subjectId) &&
    studentIds.has(record.studentId) &&
    ['present', 'absent'].includes(record.status.toLowerCase())
  ))
  return {
    ...getAttendanceSummary(records),
    sessions: new Set(records.map((record) => `${record.date}|${record.subjectId}`)).size,
  }
}

function getEligibleInstitutionRecords(data) {
  const students = data.users.filter((user) => user.role === 'student')
  const eligibleRecordKeys = new Set(
    students.flatMap((student) => getEligibleStudentRecords(data, student).map((record) => (
      `${record.date}|${record.subjectId}|${record.studentId}`
    ))),
  )
  return getUniqueAttendanceRecords(data.attendanceRecords).filter((record) => (
    eligibleRecordKeys.has(`${record.date}|${record.subjectId}|${record.studentId}`)
  ))
}

function useStoredAppState() {
  const [initialState] = useState(readApplicationState)
  const [data, setData] = useState(initialState.data)
  const [session, setSession] = useState(initialState.session)
  const [theme, setTheme] = useState(initialState.theme ?? 'dark')
  const [storageError, setStorageError] = useState(initialState.error)

  useEffect(() => {
    if (storageError) return

    try {
      const serializedData = JSON.stringify(data)
      if (window.localStorage.getItem('attendEaseData') !== serializedData) {
        window.localStorage.setItem('attendEaseData', serializedData)
      }
    } catch (error) {
      console.error('Could not save AttendEase data:', error)
      queueMicrotask(() => setStorageError('Your changes could not be saved in this browser.'))
    }
  }, [data, storageError])

  useEffect(() => {
    if (storageError) return

    try {
      if (window.localStorage.getItem('attendEaseTheme') !== theme) {
        window.localStorage.setItem('attendEaseTheme', theme)
      }
      document.documentElement.dataset.theme = theme
      document.documentElement.style.colorScheme = theme
    } catch (error) {
      console.error('Could not save AttendEase theme preference:', error)
      queueMicrotask(() => setStorageError('Your theme preference could not be saved in this browser.'))
    }
  }, [theme, storageError])

  useEffect(() => {
    function syncFromOtherTab(event) {
      if (event.storageArea !== window.localStorage) return

      try {
        if (event.key === 'attendEaseData') {
          if (!event.newValue) {
            setStorageError('AttendEase data was cleared in another tab. Reload the application to restore it.')
            return
          }

          const nextData = JSON.parse(event.newValue)
          if (!isApplicationData(nextData)) {
            throw new Error('AttendEase data changed in another tab but is invalid.')
          }
          setData({
            ...nextData,
            correctionRequests: Array.isArray(nextData.correctionRequests) ? nextData.correctionRequests : [],
            activityLog: Array.isArray(nextData.activityLog) ? nextData.activityLog : [],
          })
        }

        if (event.key === 'attendEaseSession') {
          if (!event.newValue) {
            setSession(null)
            return
          }

          const nextSession = JSON.parse(event.newValue)
          if (!nextSession?.username || !isRole(nextSession.role)) {
            throw new Error('Sign-in details changed in another tab but are invalid.')
          }
          setSession(nextSession)
        }

        if (event.key === 'attendEaseTheme') {
          if (event.newValue !== 'dark' && event.newValue !== 'light') {
            throw new Error('Theme preference changed in another tab but is invalid.')
          }
          setTheme(event.newValue)
        }
      } catch (error) {
        console.error('Could not sync AttendEase between tabs:', error)
        setStorageError(error.message || 'AttendEase could not sync changes from another tab.')
      }
    }

    window.addEventListener('storage', syncFromOtherTab)
    return () => window.removeEventListener('storage', syncFromOtherTab)
  }, [setData, setSession, setStorageError, setTheme])

  return { data, setData, session, setSession, theme, setTheme, storageError, setStorageError }
}

function App() {
  const { data, setData, session, setSession, theme, setTheme, storageError, setStorageError } =
    useStoredAppState()
  const navigate = useNavigate()

  if (storageError) {
    return (
      <main className="error-screen">
        <div className="error-card">
          <span className="eyebrow">ATTENDEASE</span>
          <h1>We couldn’t open your workspace</h1>
          <p>{storageError}</p>
          <button className="button button-primary" onClick={() => window.location.reload()}>
            Reload application
          </button>
        </div>
      </main>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={session && isRole(session.role) ? (
          <Navigate replace to={`/${session.role}/dashboard`} />
        ) : (
          <Login
            users={data.users}
            onLogin={(user) => {
              const nextSession = {
                username: user.username,
                name: user.name,
                role: user.role,
                institutionCode: user.institutionCode,
                institutionName: 'ABC Institute of Technology',
              }
              try {
                window.localStorage.setItem('attendEaseSession', JSON.stringify(nextSession))
                setSession(nextSession)
                navigate(`/${nextSession.role}/dashboard`, { replace: true })
              } catch (error) {
                console.error('Could not save AttendEase session:', error)
                setStorageError('Your sign-in could not be saved in this browser.')
              }
            }}
          />
        )}
      />
      <Route
        path="/:role/:page"
        element={session && isRole(session.role) ? (
          <RoleDashboard
            data={data}
            pageIds={navigation[session.role].map(([id]) => id)}
            role={session.role}
            session={session}
            theme={theme}
            setTheme={setTheme}
            setData={setData}
            onLogout={() => {
              window.localStorage.removeItem('attendEaseSession')
              setSession(null)
              navigate('/login', { replace: true })
            }}
          />
        ) : (
          <Navigate replace to="/login" />
        )}
      />
      <Route path="/" element={<Navigate replace to={session && isRole(session.role) ? `/${session.role}/dashboard` : '/login'} />} />
      <Route path="*" element={<Navigate replace to={session && isRole(session.role) ? `/${session.role}/dashboard` : '/login'} />} />
    </Routes>
  )
}

function RoleDashboard({ data, pageIds, role, session, theme, setTheme, setData, onLogout }) {
  const { role: routeRole, page = 'dashboard' } = useParams()
  const user = data.users.find((item) => item.username === session.username)

  if (routeRole !== role || !pageIds.includes(page)) {
    return <Navigate replace to={`/${role}/dashboard`} />
  }

  if (!user || user.role !== role) {
    return (
      <main className="error-screen">
        <div className="error-card">
          <span className="eyebrow">ACCOUNT UNAVAILABLE</span>
          <h1>Your account is no longer available</h1>
          <p>Ask an administrator to restore your account, then sign in again.</p>
          <button
            className="button button-secondary"
            onClick={() => {
              window.localStorage.removeItem('attendEaseSession')
              onLogout()
            }}
          >
            Return to sign in
          </button>
        </div>
      </main>
    )
  }

  return <Dashboard data={data} setData={setData} user={user} page={page} theme={theme} setTheme={setTheme} onLogout={onLogout} />
}

function Login({ users, onLogin }) {
  const [institutionCode, setInstitutionCode] = useState('ABC001')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  function submit(event) {
    event.preventDefault()
    const user = users.find(
      (item) =>
      isRole(item.role) &&
      item.institutionCode === institutionCode.trim() &&
        item.username === username.trim() &&
        item.password === password,
    )

    if (!user) {
      setMessage('Institution code, user ID, or password is incorrect.')
      return
    }

    onLogin(user)
  }

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="login-intro">
          <Link className="brand brand-large" to="/login" aria-label="AttendEase home">
            <span className="brand-mark">A</span>
            <span>Attend<span>Ease</span></span>
          </Link>
          <div className="intro-copy">
            <span className="eyebrow">ATTENDANCE, MADE SIMPLE</span>
            <h1>Every class.<br />Every moment.<br /><span>In sync.</span></h1>
            <p>A clearer view of attendance for the people who teach, learn, and keep your institution moving.</p>
          </div>
          <div className="role-pills" aria-label="Available account roles">
            <span><i className="role-dot admin-dot" /> Administration</span>
            <span><i className="role-dot faculty-dot" /> Faculty</span>
            <span><i className="role-dot student-dot" /> Students</span>
          </div>
          <div className="login-orbit orbit-one" />
          <div className="login-orbit orbit-two" />
        </div>

        <div className="login-form-wrap">
          <div className="login-form-heading">
            <span className="eyebrow">WELCOME TO ATTENDEASE</span>
            <h2>Sign in to your account</h2>
            <p>Use your institutional credentials to continue.</p>
          </div>
          <form className="login-form" onSubmit={submit}>
            <label>
              Institution code
              <input
                autoComplete="organization"
                onChange={(event) => setInstitutionCode(event.target.value)}
                placeholder="e.g. ABC001"
                required
                value={institutionCode}
              />
            </label>
            <label>
              User ID
              <input
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your user ID"
                required
                value={username}
              />
            </label>
            <div className="login-password-label">
              <label htmlFor="login-password">Password</label>
              <span className="password-field">
                <input
                  autoComplete="current-password"
                  id="login-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </div>
            {message && <p className="form-error" role="alert">{message}</p>}
            <button className="button button-primary sign-in-button" type="submit">
              Sign in <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="privacy-note"><span aria-hidden="true">◇</span> Access is limited to authorized members of your institution.</p>
        </div>
      </section>
      <footer className="login-footer">
        <span>© 2026 AttendEase</span>
        <span>Online attendance management</span>
      </footer>
    </main>
  )
}

function Dashboard({ data, setData, user, page, theme, setTheme, onLogout }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const selectedPage = navigation[user.role].some(([id]) => id === page) ? page : 'dashboard'
  const selectedPageTitle = navigation[user.role].find(([id]) => id === selectedPage)?.[1] ?? 'Overview'

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <Link className="brand sidebar-brand" to={`/${user.role}/dashboard`}>
          <span className="brand-mark">A</span>
          <span>Attend<span>Ease</span></span>
        </Link>
        <div className="institution-label">
          <span className="institution-icon">⌂</span>
          <span><strong>ABC Institute</strong><small>Technology campus</small></span>
        </div>
        <span className="nav-label">WORKSPACE</span>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation[user.role].map(([id, title, icon]) => (
            <Link
              aria-current={selectedPage === id ? 'page' : undefined}
              className={selectedPage === id ? 'nav-link active' : 'nav-link'}
              to={`/${user.role}/${id}`}
              key={id}
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {title}
              {id === 'mark' && <span className="nav-link-arrow">→</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">?</span>
            <div><strong>Need a hand?</strong><small>Contact your administrator</small></div>
          </div>
          <button className="logout-button" onClick={onLogout}>
            <span aria-hidden="true">↪</span> Sign out
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          aria-label="Close navigation"
          className="mobile-scrim"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="workspace">
        <header className="topbar">
          <button
            aria-label="Open navigation"
            className="menu-toggle"
            onClick={() => setMobileNavOpen(true)}
          >
            ☰
          </button>
          <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{selectedPageTitle}</strong></div>
          <button
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'light'}
            className="theme-toggle"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            type="button"
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <div className="topbar-user">
            <div className="topbar-user-copy"><strong>{user.name}</strong><span>{capitalize(user.role)}</span></div>
            <Avatar name={user.name} />
          </div>
        </header>
        <div className="page-content">
          {user.role === 'admin' && (
            <AdminPage data={data} setData={setData} page={selectedPage} user={user} />
          )}
          {user.role === 'faculty' && (
            <FacultyPage data={data} setData={setData} page={selectedPage} user={user} />
          )}
          {user.role === 'student' && (
            <StudentPage data={data} page={selectedPage} setData={setData} user={user} />
          )}
        </div>
      </main>
    </div>
  )
}

function AdminPage({ data, setData, page, user }) {
  const students = data.users.filter((item) => item.role === 'student')
  const faculty = data.users.filter((item) => item.role === 'faculty')

  if (page === 'users') {
    return <PeoplePage data={data} setData={setData} currentUser={user} />
  }
  if (page === 'academics') {
    return <AcademicsPage data={data} setData={setData} />
  }
  if (page === 'attendance') {
    return (
      <AttendanceHistory
        records={getEligibleInstitutionRecords(data)}
        users={data.users}
        subjects={data.subjects}
        title="All attendance records"
        role="admin"
        classes={data.classes}
        showStudent
      />
    )
  }
  if (page === 'corrections') {
    return <CorrectionRequestsPage requests={data.correctionRequests ?? []} users={data.users} subjects={data.subjects} />
  }
  if (page === 'settings') {
    return <SettingsPage data={data} setData={setData} />
  }

  const eligibleAttendance = getEligibleInstitutionRecords(data)
  const attendanceToday = eligibleAttendance.filter((record) => record.date === TODAY)
  const sessionsToday = new Set(attendanceToday.map((record) => `${record.date}|${record.subjectId}`)).size
  const attendanceSummary = getAttendanceSummary(eligibleAttendance)
  const studentsWithShortages = students
    .map((student) => ({
      student,
      shortages: getStudentSubjectPlans(data, student, data.subjects).filter((plan) => plan.total && plan.belowThreshold),
    }))
    .filter(({ shortages }) => shortages.length)
  const pendingCorrectionCount = (data.correctionRequests ?? []).filter((request) => request.status === 'pending').length
  return (
    <>
      <PageHeading eyebrow="INSTITUTION OVERVIEW" title={`Good day, ${firstName(user.name)}.`} description="Here’s what’s happening across your institution." />
      <div className="stat-grid stat-grid-six">
        <StatCard label="Total students" value={students.length} detail="Active student accounts" icon="♙" tone="blue" />
        <StatCard label="Faculty members" value={faculty.length} detail="Teaching staff" icon="♧" tone="green" />
        <StatCard label="Classes" value={data.classes.length} detail="Across all sections" icon="▤" tone="purple" />
        <StatCard label="Attendance today" value={sessionsToday} detail={`${attendanceToday.length} students marked`} icon="✓" tone="orange" />
        <StatCard label="Attendance attention" value={studentsWithShortages.length} detail="Students below 75% in a subject" icon="!" tone="red" />
        <StatCard label="Pending corrections" value={pendingCorrectionCount} detail="Awaiting faculty review" icon="✎" tone="purple" />
      </div>
      <section className="panel correction-summary-panel">
        <div className="panel-heading"><div><span className="eyebrow">STUDENT REQUESTS</span><h2>Attendance correction requests</h2></div><Link className="text-link" to="/admin/corrections">Review requests →</Link></div>
        <p className="correction-summary-copy">{pendingCorrectionCount} pending request{pendingCorrectionCount === 1 ? '' : 's'} awaiting the assigned faculty member.</p>
      </section>
      <AttendanceAttentionPanel
        entries={studentsWithShortages.flatMap(({ student, shortages }) => shortages.map((plan) => ({ student, ...plan })))}
        safeMessage="All students with recorded sessions are at or above the attendance requirement."
        title="Students requiring attention"
      />
      <div className="content-grid admin-insights">
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">INSTITUTION-WIDE</span><h2>Attendance overview</h2></div><span className="count-pill">{attendanceSummary.percentage}% overall</span></div>
          <div className="class-attendance-summary">
            <div className="progress-title"><strong>Attendance across recorded eligible sessions</strong><span>{attendanceSummary.present} / {attendanceSummary.total} present</span></div>
            <Progress value={attendanceSummary.percentage} />
            <small>Based on {attendanceSummary.total} saved student-session records.</small>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">BY CLASS</span><h2>Class attendance</h2></div></div>
          <div className="class-list">
            {data.classes.map((item) => {
              const summary = getClassAttendanceSummary(data, item.id)
              const enrolled = students.filter((student) => student.classId === item.id).length
              return (
                <div className="class-attendance-row" key={item.id}>
                  <span className="class-avatar">{item.section}</span>
                  <div className="class-attendance-copy">
                    <div className="progress-title"><strong>{item.name} · Section {item.section}</strong><span>{summary.percentage}%</span></div>
                    <Progress value={summary.percentage} />
                    <small>{summary.present}/{summary.total} present · {summary.sessions} sessions · {enrolled} students</small>
                  </div>
                </div>
              )
            })}
            {!data.classes.length && <EmptyState title="No classes yet" description="Add a class to see attendance insights." />}
          </div>
        </section>
      </div>
      <div className="content-grid">
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">LATEST ACTIVITY</span><h2>Recent attendance</h2></div><Link className="text-link" to="/admin/attendance">View all →</Link></div>
          <AttendanceTable compact records={eligibleAttendance.slice(-5).reverse()} users={data.users} subjects={data.subjects} />
        </section>
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">ACADEMIC STRUCTURE</span><h2>Classes</h2></div><Link className="text-link" to="/admin/academics">Manage →</Link></div>
          <div className="class-list">
            {data.classes.slice(0, 5).map((item) => {
              const classStudents = students.filter((student) => student.classId === item.id).length
              return (
                <div className="class-list-item" key={item.id}>
                  <span className="class-avatar">{item.section}</span>
                  <span className="class-list-copy"><strong>{item.name} · Section {item.section}</strong><small>{classStudents} students</small></span>
                  <span className="muted">{data.subjects.filter((subject) => subject.classId === item.id).length} subjects</span>
                </div>
              )
            })}
            {!data.classes.length && <EmptyState title="No classes yet" description="Add a class to get started." />}
          </div>
        </section>
      </div>
    </>
  )
}

function CorrectionRequestsPage({ requests, users, subjects }) {
  const orderedRequests = [...requests].sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  return (
    <>
      <PageHeading eyebrow="INSTITUTION REVIEW" title="Correction requests" description="Review requests across the institution. Assigned faculty members make the attendance correction decision." />
      <section className="panel correction-history-panel">
        <div className="panel-heading"><div><span className="eyebrow">REQUEST HISTORY</span><h2>All correction requests</h2></div><span className="count-pill">{requests.filter((request) => request.status === 'pending').length} pending</span></div>
        {orderedRequests.length ? (
          <div className="correction-request-list">
            {orderedRequests.map((request) => (
              <CorrectionRequestSummary key={request.id} request={request} users={users} subjects={subjects} showStudent />
            ))}
          </div>
        ) : (
          <EmptyState title="No correction requests" description="Student correction requests will appear here." />
        )}
      </section>
    </>
  )
}

function AttendanceAttentionPanel({ entries, safeMessage, title }) {
  return (
    <section className={`panel attendance-attention-panel ${entries.length ? 'has-attendance-alerts' : ''}`} aria-live="polite">
      <div className="panel-heading">
        <div><span className="eyebrow">ATTENDANCE ALERTS</span><h2>{title}</h2></div>
        <AttendanceStatusBadge shortage={entries.length > 0} />
      </div>
      {entries.length ? (
        <div className="attendance-alert-list">
          {entries.map(({ student, subject, percentage, classesNeeded, present, total }) => (
            <article className="attendance-alert-row" key={`${student?.username ?? 'student'}-${subject.id}`}>
              {student && <div className="attendance-alert-student"><Avatar name={student.name} /><strong>{student.name}</strong></div>}
              <div className="attendance-alert-details">
                <strong>{subject.name}</strong>
                <span>{student
                  ? `${present} of ${total} classes attended · ${classesNeeded} consecutive ${classesNeeded === 1 ? 'class' : 'classes'} needed to reach ${ATTENDANCE_THRESHOLD}%.`
                  : `Required attendance: ${ATTENDANCE_THRESHOLD}%. Attend the next ${classesNeeded} consecutive ${classesNeeded === 1 ? 'class' : 'classes'} to reach the requirement.`}</span>
              </div>
              <div className="attendance-alert-status">
                <AttendanceStatusBadge shortage />
                <strong>{percentage}%</strong>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="attendance-alert-safe-message">{safeMessage}</p>
      )}
    </section>
  )
}

function AttendanceStatusBadge({ shortage }) {
  return (
    <span className={`attendance-status-badge ${shortage ? 'attendance-status-shortage' : 'attendance-status-safe'}`}>
      {shortage ? `⚠ Below ${ATTENDANCE_THRESHOLD}%` : '✓ On track'}
    </span>
  )
}

function PeoplePage({ data, setData, currentUser }) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [draft, setDraft] = useState({ name: '', username: '', password: '', role: 'student', classId: '' })
  const filtered = data.users.filter((person) => {
    const matchesRole = roleFilter === 'all' || person.role === roleFilter
    const searchText = `${person.name} ${person.username} ${person.role}`.toLowerCase()
    return matchesRole && searchText.includes(query.toLowerCase())
  })

  function addPerson(event) {
    event.preventDefault()
    if (data.users.some((person) => person.username.toLowerCase() === draft.username.trim().toLowerCase())) {
      setFormError('That user ID is already in use.')
      return
    }
    if (draft.role === 'student' && !draft.classId) {
      setFormError('Choose a class for this student.')
      return
    }
    const person = {
      username: draft.username.trim(),
      password: draft.password,
      name: draft.name.trim(),
      role: draft.role,
      institutionCode: currentUser.institutionCode,
      ...(draft.role === 'student' ? { classId: draft.classId } : {}),
    }
    setData((current) => ({ ...current, users: [...current.users, person] }))
    setDraft({ name: '', username: '', password: '', role: 'student', classId: '' })
    setFormError('')
    setFormOpen(false)
  }

  function removePerson(username) {
    if (username === currentUser.username) return
    if (!window.confirm('Remove this account? Existing attendance records will be kept.')) return
    setData((current) => ({ ...current, users: current.users.filter((person) => person.username !== username) }))
  }

  return (
    <>
      <PageHeading
        eyebrow="DIRECTORY"
        title="People"
        description="Manage student and faculty accounts for your institution."
        action={<button className="button button-primary" onClick={() => setFormOpen((open) => !open)}>{formOpen ? 'Cancel' : '+ Add person'}</button>}
      />
      {formOpen && (
        <section className="panel form-panel">
          <div className="panel-heading"><div><span className="eyebrow">NEW ACCOUNT</span><h2>Add a person</h2></div></div>
          <form className="inline-form" onSubmit={addPerson}>
            <label>Full name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label>User ID<input required value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} /></label>
            <label>Temporary password<input required minLength="6" type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} /></label>
            <label>Role<select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })}><option value="student">Student</option><option value="faculty">Faculty</option></select></label>
            {draft.role === 'student' && <label>Class<select required value={draft.classId} onChange={(event) => setDraft({ ...draft, classId: event.target.value })}><option value="">Select a class</option>{data.classes.map((item) => <option key={item.id} value={item.id}>{item.name} · Section {item.section}</option>)}</select></label>}
            {formError && <p className="form-error form-span">{formError}</p>}
            <div className="form-span"><button className="button button-primary" type="submit">Create account</button></div>
          </form>
        </section>
      )}
      <section className="panel">
        <div className="toolbar">
          <label className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Search people" onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or user ID" value={query} /></label>
          <select aria-label="Filter by role" className="filter-select" onChange={(event) => setRoleFilter(event.target.value)} value={roleFilter}>
            <option value="all">All roles</option><option value="student">Students</option><option value="faculty">Faculty</option><option value="admin">Admins</option>
          </select>
        </div>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>User ID</th><th>Role</th><th>Class</th><th /></tr></thead><tbody>
          {filtered.map((person) => <tr key={person.username}><td><div className="person-cell"><Avatar name={person.name} /><strong>{person.name}</strong></div></td><td>{person.username}</td><td><RoleBadge role={person.role} /></td><td>{data.classes.find((item) => item.id === person.classId)?.name ?? '—'}</td><td className="actions-cell">{person.username !== currentUser.username && <button className="quiet-button danger-text" onClick={() => removePerson(person.username)}>Remove</button>}</td></tr>)}
          {!filtered.length && <tr><td className="empty-cell" colSpan="5">No people match your search.</td></tr>}
        </tbody></table></div>
      </section>
    </>
  )
}

function AcademicsPage({ data, setData }) {
  const [classDraft, setClassDraft] = useState({ name: '', section: '', teacherId: '' })
  const [subjectDraft, setSubjectDraft] = useState({ name: '', code: '', classId: '', facultyId: '' })
  const [message, setMessage] = useState('')

  function addClass(event) {
    event.preventDefault()
    const id = `${classDraft.name}-${classDraft.section}`.toLowerCase().replace(/[^a-z0-9]+/g, '')
    if (data.classes.some((item) => item.id === id)) {
      setMessage('That class and section already exist.')
      return
    }
    setData((current) => ({ ...current, classes: [...current.classes, { ...classDraft, id }] }))
    setClassDraft({ name: '', section: '', teacherId: '' })
    setMessage('')
  }

  function addSubject(event) {
    event.preventDefault()
    const id = `${subjectDraft.code}-${subjectDraft.classId}`.toLowerCase().replace(/[^a-z0-9]+/g, '')
    if (data.subjects.some((subject) => subject.id === id)) {
      setMessage('That subject code already exists for this class.')
      return
    }
    setData((current) => ({ ...current, subjects: [...current.subjects, { ...subjectDraft, id }] }))
    setSubjectDraft({ name: '', code: '', classId: '', facultyId: '' })
    setMessage('')
  }

  return (
    <>
      <PageHeading eyebrow="ACADEMIC SETUP" title="Academics" description="Organize classes, sections, and teaching assignments." />
      <div className="content-grid">
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">CLASS DIRECTORY</span><h2>Classes and sections</h2></div><span className="count-pill">{data.classes.length}</span></div>
          <div className="class-list">
            {data.classes.map((item) => (
              <div className="class-list-item" key={item.id}>
                <span className="class-avatar">{item.section}</span>
                <span className="class-list-copy"><strong>{item.name} · Section {item.section}</strong><small>Class ID: {item.id}</small></span>
                <span className="muted">{data.users.filter((person) => person.classId === item.id && person.role === 'student').length} students</span>
              </div>
            ))}
            {!data.classes.length && <EmptyState title="No classes yet" description="Use the form below to create one." />}
          </div>
          <form className="stacked-form" onSubmit={addClass}>
            <h3>Add a class</h3>
            <div className="form-row"><label>Class name<input required value={classDraft.name} onChange={(event) => setClassDraft({ ...classDraft, name: event.target.value })} placeholder="e.g. CSE Year 3" /></label><label>Section<input required value={classDraft.section} onChange={(event) => setClassDraft({ ...classDraft, section: event.target.value })} placeholder="e.g. A" /></label></div>
            <label>Class teacher <select value={classDraft.teacherId} onChange={(event) => setClassDraft({ ...classDraft, teacherId: event.target.value })}><option value="">Not assigned</option>{data.users.filter((person) => person.role === 'faculty').map((person) => <option key={person.username} value={person.username}>{person.name}</option>)}</select></label>
            <button className="button button-secondary" type="submit">Add class</button>
          </form>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">SUBJECT CATALOGUE</span><h2>Subjects</h2></div><span className="count-pill">{data.subjects.length}</span></div>
          <div className="subject-list">
            {data.subjects.map((subject) => (
              <div className="subject-row" key={subject.id}>
                <span className="subject-code">{subject.code}</span>
                <div><strong>{subject.name}</strong><small>{data.classes.find((item) => item.id === subject.classId)?.name ?? 'Class not found'} · {data.users.find((person) => person.username === subject.facultyId)?.name ?? 'Faculty not assigned'}</small></div>
              </div>
            ))}
            {!data.subjects.length && <EmptyState title="No subjects yet" description="Use the form below to add one." />}
          </div>
          <form className="stacked-form" onSubmit={addSubject}>
            <h3>Add a subject</h3>
            <label>Subject name<input required value={subjectDraft.name} onChange={(event) => setSubjectDraft({ ...subjectDraft, name: event.target.value })} /></label>
            <div className="form-row"><label>Subject code<input required value={subjectDraft.code} onChange={(event) => setSubjectDraft({ ...subjectDraft, code: event.target.value })} /></label><label>Class<select required value={subjectDraft.classId} onChange={(event) => setSubjectDraft({ ...subjectDraft, classId: event.target.value })}><option value="">Choose</option>{data.classes.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.section}</option>)}</select></label></div>
            <label>Faculty<select required value={subjectDraft.facultyId} onChange={(event) => setSubjectDraft({ ...subjectDraft, facultyId: event.target.value })}><option value="">Choose</option>{data.users.filter((person) => person.role === 'faculty').map((person) => <option key={person.username} value={person.username}>{person.name}</option>)}</select></label>
            {message && <p className="form-error">{message}</p>}
            <button className="button button-secondary" type="submit">Add subject</button>
          </form>
        </section>
      </div>
    </>
  )
}

function FacultyCorrectionRequests({ data, setData, requests, user }) {
  const pendingRequests = requests.filter((request) => request.status === 'pending')
  const resolvedRequests = requests.filter((request) => request.status !== 'pending')
  return (
    <div className="correction-request-sections">
      <section className="panel correction-history-panel">
        <div className="panel-heading"><div><span className="eyebrow">ACTION REQUIRED</span><h2>Pending requests</h2></div><span className="count-pill">{pendingRequests.length}</span></div>
        {pendingRequests.length ? (
          <div className="correction-request-list">
            {pendingRequests.map((request) => (
              <FacultyCorrectionRequest key={request.id} data={data} setData={setData} request={request} user={user} />
            ))}
          </div>
        ) : (
          <EmptyState title="No pending requests" description="New correction requests for your subjects will appear here." />
        )}
      </section>
      <section className="panel correction-history-panel">
        <div className="panel-heading"><div><span className="eyebrow">COMPLETED REVIEWS</span><h2>Request history</h2></div><span className="count-pill">{resolvedRequests.length}</span></div>
        {resolvedRequests.length ? (
          <div className="correction-request-list">
            {resolvedRequests.map((request) => (
              <CorrectionRequestSummary key={request.id} request={request} users={data.users} subjects={data.subjects} />
            ))}
          </div>
        ) : (
          <EmptyState title="No reviewed requests yet" description="Approved and rejected requests will remain available here." />
        )}
      </section>
    </div>
  )
}

function FacultyCorrectionRequest({ data, setData, request, user }) {
  const [correctedStatus, setCorrectedStatus] = useState('')
  const [response, setResponse] = useState('')
  const [message, setMessage] = useState('')
  const student = data.users.find((person) => person.username === request.studentId)
  const subject = data.subjects.find((item) => item.id === request.subjectId)

  function decide(status) {
    if (request.facultyId !== user.username || subject?.facultyId !== user.username) {
      setMessage('You are not assigned to review this request.')
      return
    }
    if (status === 'approved' && !['Present', 'Absent'].includes(correctedStatus)) {
      setMessage('Select the corrected attendance status before approving.')
      return
    }
    if (status === 'approved' && !data.attendanceRecords.some((record) => (
      record.date === request.date &&
      record.studentId === request.studentId &&
      record.subjectId === request.subjectId
    ))) {
      setMessage('The original attendance record no longer exists, so this request cannot be approved.')
      return
    }

    setData((current) => ({
      ...current,
      attendanceRecords: status === 'approved'
        ? current.attendanceRecords.map((record) => (
          record.date === request.date &&
          record.studentId === request.studentId &&
          record.subjectId === request.subjectId
            ? { ...record, status: correctedStatus, facultyId: user.username }
            : record
        ))
        : current.attendanceRecords,
      correctionRequests: (current.correctionRequests ?? []).map((item) => (
        item.id === request.id
          ? {
            ...item,
            status,
            ...(status === 'approved' ? { correctedStatus } : {}),
            response: response.trim(),
            reviewerId: user.username,
            reviewedAt: new Date().toISOString(),
          }
          : item
      )),
      activityLog: [{
        text: `Attendance correction ${status} for ${student?.name ?? request.studentId}`,
        time: request.date,
        icon: status === 'approved' ? '✓' : '!',
      }, ...current.activityLog],
    }))
    setMessage(status === 'approved'
      ? `Approved. Attendance updated to ${correctedStatus}.`
      : 'Correction request rejected.')
  }

  return (
    <article className="correction-request-card correction-request-pending">
      <CorrectionRequestSummary request={request} users={data.users} subjects={data.subjects} />
      <div className="correction-review-controls">
        <label>Correct attendance to
          <select aria-label={`Corrected status for ${student?.name ?? request.studentId}`} onChange={(event) => { setCorrectedStatus(event.target.value); setMessage('') }} value={correctedStatus}>
            <option value="">Select after reviewing</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </label>
        <label>Response (optional)
          <textarea onChange={(event) => setResponse(event.target.value)} placeholder="Explain your decision to the student" rows="2" value={response} />
        </label>
        {message && <p className={message.startsWith('Approved') || message.startsWith('Correction request rejected') ? 'form-success' : 'form-error'} role="status">{message}</p>}
        <div className="correction-decision-actions">
          <button className="button button-primary" disabled={!correctedStatus} onClick={() => decide('approved')} type="button">Approve with selected status</button>
          <button className="button button-danger" onClick={() => decide('rejected')} type="button">Reject request</button>
        </div>
      </div>
    </article>
  )
}

function CorrectionRequestSummary({ request, users, subjects, showStudent = false }) {
  const student = users.find((person) => person.username === request.studentId)
  const subject = subjects.find((item) => item.id === request.subjectId)
  return (
    <div className="correction-request-summary">
      <div className="correction-request-heading">
        <div>
          {showStudent && <span className="correction-request-student">{student?.name ?? request.studentId}</span>}
          <h3>{subject?.name ?? request.subjectId}</h3>
          <span className="correction-request-meta">{formatDate(request.date)} · Marked {request.originalStatus ?? 'attendance'}</span>
        </div>
        <CorrectionRequestStatus status={request.status} />
      </div>
      <div className="correction-request-reason"><strong>Student’s reason</strong><p>{request.reason}</p></div>
      {request.status !== 'pending' && (
        <div className="correction-request-outcome">
          <span>{request.status === 'approved' ? `Corrected to ${request.correctedStatus}.` : 'Request rejected.'}</span>
          {request.response && <p>{request.response}</p>}
          {request.reviewedAt && <small>Reviewed {formatDate(request.reviewedAt.slice(0, 10))}{request.reviewerId ? ` by ${users.find((person) => person.username === request.reviewerId)?.name ?? request.reviewerId}` : ''}</small>}
        </div>
      )}
    </div>
  )
}

function CorrectionRequestStatus({ status }) {
  return <span className={`correction-request-status correction-status-${status}`}>{capitalize(status)}</span>
}

function FacultyPage({ data, setData, page, user }) {
  const facultySubjects = data.subjects.filter((subject) => subject.facultyId === user.username)
  const facultySubjectIds = facultySubjects.map((subject) => subject.id)
  const facultyRecords = data.attendanceRecords.filter((record) => facultySubjectIds.includes(record.subjectId))
  const classes = [...new Set(facultySubjects.map((subject) => subject.classId))]
    .map((id) => data.classes.find((item) => item.id === id))
    .filter(Boolean)
  const facultyStudents = data.users.filter((student) => (
    student.role === 'student' && classes.some((item) => item.id === student.classId)
  ))
  const facultyShortages = facultyStudents.flatMap((student) => (
    getStudentSubjectPlans(data, student, facultySubjects)
      .filter((plan) => plan.total && plan.belowThreshold)
      .map((plan) => ({ student, ...plan }))
  ))
  const facultyCorrectionRequests = (data.correctionRequests ?? [])
    .filter((request) => request.facultyId === user.username)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))

  if (page === 'mark') {
    return <MarkAttendance data={data} setData={setData} user={user} subjects={facultySubjects} classes={classes} />
  }
  if (page === 'corrections') {
    return (
      <>
        <PageHeading eyebrow="ATTENDANCE REVIEW" title="Correction requests" description="Review student requests and confirm the corrected attendance status before approving." />
        <FacultyCorrectionRequests data={data} setData={setData} requests={facultyCorrectionRequests} user={user} />
      </>
    )
  }
  if (page === 'history') {
    return (
      <>
        <PageHeading eyebrow="YOUR TEACHING ACTIVITY" title="Attendance history" description="Review and filter attendance in your assigned subjects." />
        <AttendanceHistory records={getUniqueAttendanceRecords(facultyRecords)} users={data.users} subjects={facultySubjects} title="My attendance records" role="faculty" classes={classes} showStudent />
      </>
    )
  }
  if (page === 'classes') {
    return (
      <>
        <PageHeading eyebrow="YOUR TEACHING ASSIGNMENTS" title="My classes" description="Classes and subjects assigned to you." />
        <section className="panel">
          <div className="class-list">
            {classes.map((item) => (
              <div className="class-list-item" key={item.id}><span className="class-avatar">{item.section}</span><span className="class-list-copy"><strong>{item.name} · Section {item.section}</strong><small>{facultySubjects.filter((subject) => subject.classId === item.id).map((subject) => subject.name).join(' · ')}</small></span><span className="muted">{data.users.filter((person) => person.classId === item.id && person.role === 'student').length} students</span></div>
            ))}
            {!classes.length && <EmptyState title="No classes assigned" description="Ask an administrator to assign a subject to your account." />}
          </div>
        </section>
      </>
    )
  }
  if (page === 'profile') {
    return <ProfilePage data={data} user={user} />
  }

  const todaysRecords = facultyRecords.filter((record) => record.date === TODAY)
  return (
    <>
      <PageHeading eyebrow="FACULTY WORKSPACE" title={`Welcome, ${firstName(user.name)}.`} description="Your teaching schedule and attendance activity, all in one place." action={<Link className="button button-primary" to="/faculty/mark">Mark attendance <span aria-hidden="true">→</span></Link>} />
      <div className="stat-grid stat-grid-five">
        <StatCard label="My classes" value={classes.length} detail="Assigned class groups" icon="▤" tone="blue" />
        <StatCard label="My subjects" value={facultySubjects.length} detail="Active teaching assignments" icon="◈" tone="purple" />
        <StatCard label="Students" value={new Set(classes.flatMap((item) => data.users.filter((person) => person.classId === item.id && person.role === 'student').map((person) => person.username))).size} detail="Across my classes" icon="♙" tone="green" />
        <StatCard label="Sessions today" value={todaysRecords.length} detail="Attendance entries today" icon="✓" tone="orange" />
        <StatCard label="Pending corrections" value={facultyCorrectionRequests.filter((request) => request.status === 'pending').length} detail="Awaiting your review" icon="✎" tone="purple" />
      </div>
      <section className="panel correction-summary-panel">
        <div className="panel-heading"><div><span className="eyebrow">STUDENT REQUESTS</span><h2>Attendance correction requests</h2></div><Link className="text-link" to="/faculty/corrections">Review requests →</Link></div>
        <p className="correction-summary-copy">{facultyCorrectionRequests.filter((request) => request.status === 'pending').length} pending request{facultyCorrectionRequests.filter((request) => request.status === 'pending').length === 1 ? '' : 's'} require your review.</p>
      </section>
      <AttendanceAttentionPanel
        entries={facultyShortages}
        safeMessage="No students in your assigned subjects are below the attendance requirement."
        title="Students with low attendance"
      />
      <div className="content-grid">
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">RECENT SESSIONS</span><h2>Latest attendance</h2></div><Link className="text-link" to="/faculty/history">View history →</Link></div>
          <AttendanceTable compact records={getUniqueAttendanceRecords(facultyRecords).slice(-5).reverse()} users={data.users} subjects={data.subjects} />
        </section>
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">TEACHING ASSIGNMENTS</span><h2>My subjects</h2></div><Link className="text-link" to="/faculty/classes">View classes →</Link></div>
          <div className="subject-list">{facultySubjects.map((subject) => <div className="subject-row" key={subject.id}><span className="subject-code">{subject.code}</span><div><strong>{subject.name}</strong><small>{data.classes.find((item) => item.id === subject.classId)?.name ?? 'Class not found'}</small></div></div>)}{!facultySubjects.length && <EmptyState title="No subjects assigned" description="Ask an administrator to update your teaching assignments." />}</div>
        </section>
      </div>
    </>
  )
}

function MarkAttendance({ data, setData, user, subjects, classes }) {
  const [classId, setClassId] = useState(classes[0]?.id ?? '')
  const classSubjects = subjects.filter((subject) => subject.classId === classId)
  const [subjectId, setSubjectId] = useState(classSubjects[0]?.id ?? '')
  const [date, setDate] = useState(TODAY)
  const [attendanceOverrides, setAttendanceOverrides] = useState({})
  const [message, setMessage] = useState('')
  const selectedSubject = classSubjects.find((subject) => subject.id === subjectId) ?? classSubjects[0]
  const students = useMemo(
    () => data.users.filter((person) => person.role === 'student' && person.classId === classId),
    [classId, data.users],
  )
  const selectedSubjectId = selectedSubject?.id
  const sessionRecords = selectedSubject
    ? getUniqueAttendanceRecords(data.attendanceRecords).filter(
      (record) => record.date === date && record.subjectId === selectedSubject.id,
    )
    : []
  const savedSession = sessionRecords.length > 0
  const sessionKey = `${date}|${selectedSubjectId ?? ''}`
  const savedMarks = new Map(
    sessionRecords.map((record) => [record.studentId, record.status.toLowerCase() === 'present']),
  )
  const isStudentPresent = (studentId) => (
    attendanceOverrides[`${sessionKey}|${studentId}`] ?? savedMarks.get(studentId) ?? true
  )
  const markedCount = students.filter((student) => isStudentPresent(student.username)).length

  function saveAttendance(event) {
    event.preventDefault()
    if (!selectedSubject || !classId || !students.length) {
      setMessage('Select a class and subject with enrolled students before saving.')
      return
    }
    const remaining = data.attendanceRecords.filter(
      (record) => record.date !== date || record.subjectId !== selectedSubject.id,
    )
    const newRecords = students.map((student) => ({
      date,
      studentId: student.username,
      subjectId,
      facultyId: user.username,
      status: isStudentPresent(student.username) ? 'Present' : 'Absent',
    }))
    setData((current) => ({
      ...current,
      attendanceRecords: [...remaining, ...newRecords],
      activityLog: [{ text: `Attendance ${savedSession ? 'updated' : 'recorded'} for ${selectedSubject.name}`, time: date, icon: '✓' }, ...current.activityLog],
    }))
    setAttendanceOverrides((current) => {
      const updated = { ...current }
      students.forEach((student) => delete updated[`${sessionKey}|${student.username}`])
      return updated
    })
    setMessage(`${savedSession ? 'Attendance updated' : 'Attendance saved'} for ${students.length} students.`)
  }

  return (
    <>
      <PageHeading eyebrow="CLASS REGISTER" title="Mark attendance" description="Choose a subject, check the register, and save the session." />
      {!classes.length ? (
        <section className="panel"><EmptyState title="No classes assigned" description="Ask an administrator to assign a class and subject before recording attendance." /></section>
      ) : (
        <form className="panel attendance-form" onSubmit={saveAttendance}>
          <div className="attendance-controls">
            <label>Class<select aria-label="Class" onChange={(event) => { const nextClassId = event.target.value; const firstSubject = subjects.find((subject) => subject.classId === nextClassId); setClassId(nextClassId); setSubjectId(firstSubject?.id ?? ''); setMessage('') }} value={classId}>{classes.map((item) => <option key={item.id} value={item.id}>{item.name} · Section {item.section}</option>)}</select></label>
            <label>Subject<select disabled={!classSubjects.length} onChange={(event) => { setSubjectId(event.target.value); setMessage('') }} value={selectedSubject?.id ?? ''}>{classSubjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name} · {subject.code}</option>)}</select></label>
            <label>Session date<input onChange={(event) => { setDate(event.target.value); setMessage('') }} required type="date" value={date} /></label>
            <div className="attendance-count"><strong>{students.length}</strong><span>students</span></div>
          </div>
          <div className="register-heading"><div><span className="eyebrow">{savedSession ? 'EDIT SAVED SESSION' : 'NEW SESSION'}</span><h2>{selectedSubject?.name ?? 'Select a subject'}</h2><p>{classes.find((item) => item.id === classId)?.name ?? ''} · {formatDate(date)}</p></div><span className="count-pill">{markedCount} / {students.length} present</span></div>
          <div className="table-wrap"><table><thead><tr><th>Student</th><th>User ID</th><th className="status-column">Attendance</th></tr></thead><tbody>
            {students.map((student) => {
              const present = isStudentPresent(student.username)
              return <tr key={student.username}><td><div className="person-cell"><Avatar name={student.name} /><strong>{student.name}</strong></div></td><td>{student.username}</td><td className="status-column"><button aria-pressed={present} className={`attendance-toggle ${present ? 'present' : 'absent'}`} onClick={() => setAttendanceOverrides((current) => ({ ...current, [`${sessionKey}|${student.username}`]: !present }))} type="button">{present ? 'Present' : 'Absent'}</button></td></tr>
            })}
            {!students.length && <tr><td className="empty-cell" colSpan="3">No students are enrolled in this class.</td></tr>}
          </tbody></table></div>
          <div className="form-footer">{message && <p className={message.startsWith('Attendance saved') || message.startsWith('Attendance updated') ? 'form-success' : 'form-error'} role="status">{message}</p>}<button className="button button-primary" disabled={!selectedSubject || !students.length} type="submit">{savedSession ? 'Update attendance' : 'Save attendance'}</button></div>
        </form>
      )}
    </>
  )
}

function StudentPage({ data, page, setData, user }) {
  const records = getEligibleStudentRecords(data, user)
  const subjects = data.subjects.filter((subject) => subject.classId === user.classId)
  const subjectPlans = getStudentSubjectPlans(data, user, subjects)
  const studentRequests = (data.correctionRequests ?? [])
    .filter((request) => request.studentId === user.username)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  const presentCount = records.filter((record) => record.status.toLowerCase() === 'present').length
  const percentage = records.length ? Math.round((presentCount / records.length) * 100) : 0

  if (page === 'attendance') {
    return (
      <>
        <PageHeading eyebrow="YOUR ATTENDANCE" title="Attendance" description="Review and filter every attendance record recorded for you." />
        <AttendanceHistory records={records} users={data.users} subjects={subjects} title="My attendance records" role="student" classes={[]} />
      </>
    )
  }
  if (page === 'corrections') {
    return (
      <>
        <PageHeading eyebrow="STUDENT SUPPORT" title="Attendance correction requests" description="Report an incorrect attendance entry for review by the assigned faculty member." />
        <StudentCorrectionRequests data={data} setData={setData} records={records} requests={studentRequests} subjects={subjects} user={user} />
      </>
    )
  }
  if (page === 'subjects') {
    return (
      <>
        <PageHeading eyebrow="YOUR CURRICULUM" title="My subjects" description="Your current subjects and attendance progress." />
        <div className="subject-cards">
          {subjectPlans.map(({ subject, ...plan }) => {
            return (
              <section className={`panel subject-card ${plan.belowThreshold ? 'subject-card-shortage' : ''}`} key={subject.id}>
                <span className="subject-code">{subject.code}</span>
                <h2>{subject.name}</h2>
                <p>{data.users.find((person) => person.username === subject.facultyId)?.name ?? 'Faculty not assigned'}</p>
                <Progress value={plan.percentage} />
                <div className="progress-caption"><span>{plan.present} of {plan.total} classes attended</span><strong>{plan.percentage}%</strong></div>
                {plan.total ? (
                  <div className={`attendance-plan ${plan.belowThreshold ? 'attendance-plan-warning' : ''}`}>
                    <AttendanceStatusBadge shortage={plan.belowThreshold} />
                    {plan.belowThreshold ? (
                      <p>Attend the next <b>{plan.classesNeeded}</b> consecutive {plan.classesNeeded === 1 ? 'class' : 'classes'} to reach {ATTENDANCE_THRESHOLD}%.</p>
                    ) : (
                      <p>You can miss <b>{plan.classesCanMiss}</b> {plan.classesCanMiss === 1 ? 'class' : 'classes'} and remain at or above {ATTENDANCE_THRESHOLD}%.</p>
                    )}
                  </div>
                ) : (
                  <div className="attendance-plan attendance-plan-empty"><strong>Not enough data yet</strong><p>Your attendance plan will appear after the first saved session.</p></div>
                )}
              </section>
            )
          })}
          {!subjects.length && <section className="panel"><EmptyState title="No subjects available" description="Your subjects will appear here once they are assigned to your class." /></section>}
        </div>
      </>
    )
  }
  if (page === 'profile') return <ProfilePage data={data} user={user} />

  const attendanceStatus = percentage >= ATTENDANCE_THRESHOLD ? 'On track' : 'Needs attention'
  return (
    <>
      <PageHeading
        eyebrow="STUDENT WORKSPACE"
        title={`Hello, ${firstName(user.name)}.`}
        description="Here’s your attendance at a glance. Keep showing up and keep moving forward."
        action={<Link className="button button-secondary" to="/student/corrections">Request attendance correction</Link>}
      />
      <section className="student-hero">
        <div><span className="eyebrow">OVERALL ATTENDANCE</span><div className="attendance-score">{percentage}<span>%</span></div><p>{attendanceStatus} <span className="score-separator">·</span> Minimum requirement is {ATTENDANCE_THRESHOLD}%</p></div>
        <div className="attendance-ring" style={{ '--progress': `${percentage}%` }}><span>{percentage}%</span></div>
        <div className="student-hero-foot"><span>{presentCount} classes attended</span><span>{records.length - presentCount} absences</span><span>{records.length} total sessions</span></div>
      </section>
      <div className="stat-grid stat-grid-three">
        <StatCard label="Classes attended" value={presentCount} detail="Sessions marked present" icon="✓" tone="green" />
        <StatCard label="Classes missed" value={records.length - presentCount} detail="Sessions marked absent" icon="–" tone="orange" />
        <StatCard label="Enrolled subjects" value={subjects.length} detail="In your class" icon="▤" tone="blue" />
      </div>
      <AttendanceAttentionPanel
        entries={subjectPlans.filter((plan) => plan.total && plan.belowThreshold)}
        safeMessage={records.length
          ? 'Your attendance is on track in every subject with recorded sessions.'
          : 'Attendance alerts will appear after your first session is recorded.'}
        title="Your attendance status"
      />
      <div className="content-grid">
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">LATEST RECORDS</span><h2>Recent attendance</h2></div><Link className="text-link" to="/student/attendance">View all →</Link></div>
          <AttendanceTable compact records={[...records].slice(-5).reverse()} users={data.users} subjects={data.subjects} />
        </section>
      </div>
      <AttendanceAnalytics records={records} subjects={subjects} />
    </>
  )
}

function StudentCorrectionRequests({ data, setData, records, requests, subjects, user }) {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '')
  const availableDates = records
    .filter((record) => record.subjectId === subjectId)
    .sort((first, second) => second.date.localeCompare(first.date))
  const [date, setDate] = useState(availableDates[0]?.date ?? '')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)
  const pendingDuplicate = requests.some((request) => (
    request.status === 'pending' &&
    request.subjectId === subjectId &&
    request.date === date
  ))

  function changeSubject(nextSubjectId) {
    setSubjectId(nextSubjectId)
    const nextDate = records
      .filter((record) => record.subjectId === nextSubjectId)
      .sort((first, second) => second.date.localeCompare(first.date))[0]?.date ?? ''
    setDate(nextDate)
    setMessage('')
  }

  function submitRequest(event) {
    event.preventDefault()
    const attendanceRecord = records.find((record) => record.subjectId === subjectId && record.date === date)
    const subject = subjects.find((item) => item.id === subjectId)
    const faculty = data.users.find((person) => person.username === subject?.facultyId && person.role === 'faculty')
    if (!attendanceRecord || !subject || !faculty) {
      setMessage('Choose a subject and date with a saved attendance record and assigned faculty member.')
      setMessageIsError(true)
      return
    }
    if (!reason.trim()) {
      setMessage('Explain why this attendance record needs correction.')
      setMessageIsError(true)
      return
    }
    if (requests.some((request) => (
      request.status === 'pending' &&
      request.subjectId === subjectId &&
      request.date === date
    ))) {
      setMessage('A correction request for this attendance record is already pending.')
      setMessageIsError(true)
      return
    }

    const request = {
      id: crypto.randomUUID(),
      studentId: user.username,
      subjectId,
      date,
      facultyId: faculty.username,
      originalStatus: attendanceRecord.status,
      reason: reason.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setData((current) => ({
      ...current,
      correctionRequests: [...(current.correctionRequests ?? []), request],
    }))
    setReason('')
    setMessage('Correction request submitted for faculty review.')
    setMessageIsError(false)
  }

  return (
    <div className="correction-request-sections">
      <section className="panel correction-submit-panel">
        <div className="panel-heading"><div><span className="eyebrow">NEW REQUEST</span><h2>Request an attendance correction</h2></div></div>
        <form className="correction-request-form" onSubmit={submitRequest}>
          <label>Subject
            <select aria-label="Correction subject" onChange={(event) => changeSubject(event.target.value)} required value={subjectId}>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
          </label>
          <label>Attendance date
            <select aria-label="Correction attendance date" onChange={(event) => { setDate(event.target.value); setMessage('') }} required value={date}>
              {availableDates.map((record) => <option key={record.date} value={record.date}>{formatDate(record.date)} · {record.status}</option>)}
            </select>
          </label>
          <label className="correction-reason-field">Reason for correction
            <textarea aria-label="Reason for correction" maxLength="1000" onChange={(event) => { setReason(event.target.value); setMessage('') }} placeholder="Explain what is incorrect and provide relevant details." required rows="4" value={reason} />
          </label>
          {pendingDuplicate && <p className="correction-pending-note">A request for this subject and date is already pending.</p>}
          {message && <p className={messageIsError ? 'form-error' : 'form-success'} role="status">{message}</p>}
          <button className="button button-primary" disabled={!availableDates.length || pendingDuplicate} type="submit">Submit correction request</button>
        </form>
      </section>
      <section className="panel correction-history-panel">
        <div className="panel-heading"><div><span className="eyebrow">YOUR REQUESTS</span><h2>Request history</h2></div><span className="count-pill">{requests.length}</span></div>
        {requests.length ? (
          <div className="correction-request-list">
            {requests.map((request) => <CorrectionRequestSummary key={request.id} request={request} users={data.users} subjects={data.subjects} />)}
          </div>
        ) : (
          <EmptyState title="No correction requests yet" description="Requests you submit will be saved here with their review status." />
        )}
      </section>
    </div>
  )
}

function AttendanceAnalytics({ records, subjects }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState('all')
  const subjectSummaries = subjects.map((subject) => {
    const subjectRecords = records.filter((record) => record.subjectId === subject.id)
    const present = subjectRecords.filter((record) => record.status.toLowerCase() === 'present').length
    return {
      ...subject,
      present,
      total: subjectRecords.length,
      percentage: subjectRecords.length ? Math.round((present / subjectRecords.length) * 100) : 0,
    }
  })
  const monthlySummaries = records
    .filter((record) => selectedSubjectId === 'all' || record.subjectId === selectedSubjectId)
    .reduce((months, record) => {
      const month = record.date.slice(0, 7)
      const summary = months.get(month) ?? { present: 0, total: 0 }
      summary.total += 1
      if (record.status.toLowerCase() === 'present') summary.present += 1
      months.set(month, summary)
      return months
    }, new Map())
  const monthlyData = [...monthlySummaries.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([month, summary]) => ({
      month,
      label: new Date(`${month}-01T12:00:00`).toLocaleDateString('en', { month: 'short', year: 'numeric' }),
      ...summary,
      percentage: Math.round((summary.present / summary.total) * 100),
    }))
  const chartWidth = 720
  const plotLeft = 54
  const plotRight = 18
  const plotTop = 20
  const plotBottom = 52
  const chartHeight = 270
  const plotWidth = chartWidth - plotLeft - plotRight
  const plotHeight = chartHeight - plotTop - plotBottom
  const monthlyPoints = monthlyData.map((item, index) => ({
    ...item,
    x: plotLeft + (monthlyData.length === 1 ? plotWidth / 2 : (index / (monthlyData.length - 1)) * plotWidth),
    y: plotTop + ((100 - item.percentage) / 100) * plotHeight,
  }))

  function selectSubject(subjectId) {
    setSelectedSubjectId(subjectId)
  }

  return (
    <section className="panel analytics-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">ATTENDANCE ANALYTICS</span><h2>Attendance trends</h2></div>
        <Link className="text-link" to="/student/subjects">Subject details →</Link>
      </div>
      <div className="analytics-grid">
        <section className="analytics-chart" aria-labelledby="subject-chart-title">
          <div className="analytics-chart-heading">
            <div><span className="eyebrow">SUBJECT-WISE</span><h3 id="subject-chart-title">Attendance by subject</h3></div>
            <span className="analytics-hint">Select a subject to filter the monthly chart</span>
          </div>
          {subjectSummaries.length ? (
            <svg className="analytics-svg subject-chart-svg" viewBox={`0 0 ${chartWidth} ${Math.max(110, subjectSummaries.length * 58 + 38)}`} role="group" aria-label="Subject attendance chart">
              {[0, 25, 50, 75, 100].map((tick) => {
                const x = 230 + (tick / 100) * 420
                return <g key={tick}><line className="chart-gridline" x1={x} x2={x} y1="22" y2={subjectSummaries.length * 58 + 15} /><text className="chart-axis-label" x={x} y="14" textAnchor="middle">{tick}%</text></g>
              })}
              {subjectSummaries.map((subject, index) => {
                const y = 40 + index * 58
                const active = selectedSubjectId === subject.id
                return (
                  <g
                    aria-label={`${subject.name}: ${subject.percentage}%, ${subject.present} of ${subject.total} classes attended. Select to filter monthly attendance.`}
                    aria-pressed={active}
                    className={`subject-chart-row ${active ? 'subject-chart-row-active' : ''}`}
                    key={subject.id}
                    onClick={() => selectSubject(subject.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        selectSubject(subject.id)
                      }
                    }}
                    role="button"
                    tabIndex="0"
                  >
                    <text className="chart-subject-label" x="0" y={y + 16}>{subject.name.length > 27 ? `${subject.name.slice(0, 26)}…` : subject.name}</text>
                    <rect className="chart-bar-track" x="230" y={y} width="420" height="24" rx="6" />
                    <rect className={`chart-bar ${active ? 'chart-bar-active' : ''}`} x="230" y={y} width={subject.percentage * 4.2} height="24" rx="6" />
                    <text className="chart-value-label" x="664" y={y + 16}>{subject.total ? `${subject.percentage}%` : 'No data'}</text>
                    <title>{`${subject.present} of ${subject.total} recorded classes attended`}</title>
                  </g>
                )
              })}
            </svg>
          ) : (
            <p className="analytics-empty">No subjects are assigned to your class yet.</p>
          )}
        </section>
        <section className="analytics-chart" aria-labelledby="monthly-chart-title">
          <div className="analytics-chart-heading">
            <div><span className="eyebrow">MONTHLY</span><h3 id="monthly-chart-title">Attendance over time</h3></div>
            <label className="analytics-filter">Subject
              <select aria-label="Filter monthly attendance by subject" onChange={(event) => selectSubject(event.target.value)} value={selectedSubjectId}>
                <option value="all">All subjects</option>
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
            </label>
          </div>
          {monthlyData.length ? (
            <>
              <svg className="analytics-svg monthly-chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`Monthly attendance trend, ${monthlyData.length} ${monthlyData.length === 1 ? 'month' : 'months'} of recorded sessions`}>
                {[0, 25, 50, 75, 100].map((tick) => {
                  const y = plotTop + ((100 - tick) / 100) * plotHeight
                  return <g key={tick}><line className="chart-gridline" x1={plotLeft} x2={chartWidth - plotRight} y1={y} y2={y} /><text className="chart-axis-label" x={plotLeft - 10} y={y + 4} textAnchor="end">{tick}%</text></g>
                })}
                {monthlyPoints.length > 1 && <polyline className="chart-trend-line" points={monthlyPoints.map(({ x, y }) => `${x},${y}`).join(' ')} />}
                {monthlyPoints.map((point) => (
                  <g key={point.month}>
                    <circle className="chart-trend-point" cx={point.x} cy={point.y} r="5" />
                    <text className="chart-month-label" x={point.x} y={chartHeight - 21} textAnchor="middle">{point.label}</text>
                    <title>{`${point.label}: ${point.percentage}% attendance, ${point.present} of ${point.total} classes attended`}</title>
                  </g>
                ))}
              </svg>
              <p className="analytics-caption">
                {selectedSubjectId === 'all' ? 'All subjects' : subjects.find((subject) => subject.id === selectedSubjectId)?.name}
                {' · '}Based on {monthlyData.reduce((total, item) => total + item.total, 0)} saved student-session records.
              </p>
            </>
          ) : (
            <p className="analytics-empty">No saved sessions for this selection yet.</p>
          )}
        </section>
      </div>
    </section>
  )
}

function AttendanceHistory({ records, users, subjects, title, role, classes = [], showStudent = false }) {
  const [subjectId, setSubjectId] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [month, setMonth] = useState('')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const invalidDateRange = Boolean(startDate && endDate && startDate > endDate)
  const normalizedQuery = query.trim().toLowerCase()
  const filteredRecords = records
    .filter((record) => {
      if (subjectId !== 'all' && record.subjectId !== subjectId) return false
      if (startDate && record.date < startDate) return false
      if (endDate && record.date > endDate) return false
      if (month && !record.date.startsWith(month)) return false
      if (status !== 'all' && record.status.toLowerCase() !== status) return false
      if (normalizedQuery) {
        const student = users.find((person) => person.username === record.studentId)
        const subject = subjects.find((item) => item.id === record.subjectId)
        const searchableText = `${student?.name ?? ''} ${record.studentId} ${subject?.name ?? ''} ${record.subjectId} ${record.date} ${record.status}`.toLowerCase()
        if (!searchableText.includes(normalizedQuery)) return false
      }
      return true
    })
    .sort((first, second) => second.date.localeCompare(first.date) ||
      first.studentId.localeCompare(second.studentId) ||
      first.subjectId.localeCompare(second.subjectId))
  const visibleRecords = invalidDateRange ? [] : filteredRecords
  const summary = getAttendanceSummary(visibleRecords)
  const reportFilters = [
    `Subject: ${subjectId === 'all' ? 'All' : subjects.find((subject) => subject.id === subjectId)?.name ?? subjectId}`,
    `Date range: ${startDate || 'Any'} to ${endDate || 'Any'}`,
    `Month: ${month || 'Any'}`,
    `Status: ${status === 'all' ? 'All' : capitalize(status)}`,
    `Search: ${query.trim() || 'None'}`,
  ]
  const reportSections = buildAttendanceReportSections({ role, records: visibleRecords, users, subjects, classes })

  function exportCsv() {
    const generatedAt = new Date().toLocaleString()
    const rows = [
      ['AttendEase Attendance Report'],
      ['Role', capitalize(role)],
      ['Generated', generatedAt],
      ['Filters', reportFilters.join(' | ')],
      ['Summary', `Attended: ${summary.present}; Missed: ${summary.total - summary.present}; Attendance: ${summary.percentage}%; Records: ${summary.total}`],
      [],
    ]
    reportSections.forEach((section) => {
      rows.push([section.title], section.headers, ...section.rows, [])
    })
    downloadFile(`${role}-attendance-report-${formatLocalDate(new Date())}.csv`, `\uFEFF${rows.map((row) => row.map(escapeCsvValue).join(',')).join('\r\n')}`, 'text/csv;charset=utf-8')
    setReportMessage(`CSV report generated ${generatedAt}.`)
  }

  async function exportPdf() {
    const generatedAt = new Date().toLocaleString()
    try {
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ])
      const document = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      document.setFontSize(18)
      document.text('AttendEase Attendance Report', 14, 17)
      document.setFontSize(9)
      document.text(`Role: ${capitalize(role)}  |  Generated: ${generatedAt}`, 14, 24)
      const filterLines = document.splitTextToSize(reportFilters.join('  |  '), 265)
      document.text(filterLines, 14, 30)
      const summaryY = 30 + filterLines.length * 4.5 + 3
      document.text(`Summary: ${summary.present} attended  |  ${summary.total - summary.present} missed  |  ${summary.percentage}% attendance  |  ${summary.total} records`, 14, summaryY)
      let cursorY = summaryY + 7
      reportSections.forEach((section) => {
        if (cursorY > 180) {
          document.addPage()
          cursorY = 16
        }
        document.setFontSize(12)
        document.text(section.title, 14, cursorY)
        autoTable(document, {
          startY: cursorY + 3,
          head: [section.headers],
          body: section.rows.length ? section.rows : [['No matching records', ...Array(Math.max(0, section.headers.length - 1)).fill('')]],
          margin: { left: 14, right: 14 },
          styles: { fontSize: 8, cellPadding: 2.2, overflow: 'linebreak' },
          headStyles: { fillColor: [44, 76, 124] },
        })
        cursorY = document.lastAutoTable.finalY + 10
      })
      downloadFile(
        `${role}-attendance-report-${formatLocalDate(new Date())}.pdf`,
        document.output('blob'),
        'application/pdf',
      )
      setReportMessage(`PDF report generated ${generatedAt}.`)
    } catch (error) {
      console.error('Could not generate attendance PDF:', error)
      setReportMessage('PDF export failed. Please try again.')
    }
  }

  function resetFilters() {
    setSubjectId('all')
    setStartDate('')
    setEndDate('')
    setMonth('')
    setStatus('all')
    setQuery('')
  }

  return (
    <section className="panel attendance-history">
      <div className="panel-heading">
        <div><span className="eyebrow">FILTERABLE RECORDS</span><h2>{title}</h2></div>
        <span className="count-pill">{visibleRecords.length} records</span>
      </div>
      <div className="attendance-history-filters">
        <label>Search records<input aria-label="Search attendance records" onChange={(event) => setQuery(event.target.value)} placeholder="Student, subject, date..." type="search" value={query} /></label>
        <label>Subject<select aria-label="Filter by subject" onChange={(event) => setSubjectId(event.target.value)} value={subjectId}><option value="all">All subjects</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
        <label>Start date<input aria-label="Start date" max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} /></label>
        <label>End date<input aria-label="End date" min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} /></label>
        <label>Month<input aria-label="Filter by month" onChange={(event) => setMonth(event.target.value)} type="month" value={month} /></label>
        <label>Status<select aria-label="Filter by status" onChange={(event) => setStatus(event.target.value)} value={status}><option value="all">All statuses</option><option value="present">Present</option><option value="absent">Absent</option></select></label>
        <button className="button button-secondary attendance-history-reset" onClick={resetFilters} type="button">Reset filters</button>
        {invalidDateRange && <p className="form-error attendance-history-error" role="alert">Start date must be on or before the end date.</p>}
      </div>
      <div className="attendance-history-summary" aria-live="polite">
        <div><span>Classes attended</span><strong>{summary.present}</strong></div>
        <div><span>Classes missed</span><strong>{summary.total - summary.present}</strong></div>
        <div><span>Attendance</span><strong>{summary.percentage}%</strong></div>
        <div><span>Filtered records</span><strong>{summary.total}</strong></div>
      </div>
      <div className="attendance-report-export">
        <div><strong>Download this filtered report</strong><span>Includes role-specific summaries and the generation date.</span></div>
        <div className="attendance-report-actions">
          <button className="button button-secondary" disabled={!visibleRecords.length} onClick={exportCsv} type="button">Download CSV</button>
          <button className="button button-primary" disabled={!visibleRecords.length} onClick={exportPdf} type="button">Download PDF</button>
        </div>
        {reportMessage && <p className={reportMessage.includes('failed') ? 'form-error' : 'form-success'} role="status">{reportMessage}</p>}
      </div>
      <AttendanceReportSummary sections={reportSections} />
      <AttendanceTable records={visibleRecords} users={users} subjects={subjects} showStudent={showStudent} />
    </section>
  )
}

function buildAttendanceReportSections({ role, records, users, subjects, classes }) {
  const detailHeaders = role === 'student'
    ? ['Date', 'Subject', 'Status']
    : ['Date', 'Student', 'Class', 'Subject', 'Status']
  const detailRows = records.map((record) => {
    const student = users.find((person) => person.username === record.studentId)
    const subject = subjects.find((item) => item.id === record.subjectId)
    const classItem = classes.find((item) => item.id === student?.classId)
    return role === 'student'
      ? [formatDate(record.date), subject?.name ?? record.subjectId, record.status]
      : [formatDate(record.date), student?.name ?? record.studentId, classItem ? `${classItem.name} - ${classItem.section}` : '-', subject?.name ?? record.subjectId, record.status]
  })
  const sections = []
  const groups = new Map()
  records.forEach((record) => {
    const key = role === 'student' ? record.subjectId : `${record.studentId}|${record.subjectId}`
    const group = groups.get(key) ?? []
    group.push(record)
    groups.set(key, group)
  })

  if (role === 'student') {
    sections.push({
      title: 'Subject-wise attendance',
      headers: ['Subject', 'Attended', 'Missed', 'Total', 'Attendance %', 'Status'],
      rows: [...groups.entries()].map(([id, groupedRecords]) => {
        const subject = subjects.find((item) => item.id === id)
        const plan = getSubjectAttendancePlan(groupedRecords)
        return [subject?.name ?? id, plan.present, plan.total - plan.present, plan.total, `${plan.percentage}%`, plan.belowThreshold ? 'Below 75%' : 'On track']
      }),
    })
  } else if (role === 'faculty') {
    sections.push({
      title: 'Student-wise attendance by subject',
      headers: ['Student', 'Class', 'Subject', 'Attended', 'Missed', 'Total', 'Attendance %', 'Status'],
      rows: [...groups.entries()].map(([key, groupedRecords]) => {
        const [studentId, subjectId] = key.split('|')
        const student = users.find((person) => person.username === studentId)
        const subject = subjects.find((item) => item.id === subjectId)
        const classItem = classes.find((item) => item.id === student?.classId)
        const plan = getSubjectAttendancePlan(groupedRecords)
        return [student?.name ?? studentId, classItem ? `${classItem.name} - ${classItem.section}` : '-', subject?.name ?? subjectId, plan.present, plan.total - plan.present, plan.total, `${plan.percentage}%`, plan.belowThreshold ? 'Below 75%' : 'On track']
      }),
    })
    sections.push({
      title: 'Students below attendance requirement',
      headers: ['Student', 'Subject', 'Attendance %', 'Classes needed'],
      rows: [...groups.entries()].flatMap(([key, groupedRecords]) => {
        const [studentId, subjectId] = key.split('|')
        const plan = getSubjectAttendancePlan(groupedRecords)
        if (!plan.belowThreshold) return []
        return [[
          users.find((person) => person.username === studentId)?.name ?? studentId,
          subjects.find((item) => item.id === subjectId)?.name ?? subjectId,
          `${plan.percentage}%`,
          plan.classesNeeded,
        ]]
      }),
    })
  } else {
    sections.push({
      title: 'Class-wise attendance',
      headers: ['Class', 'Attended', 'Missed', 'Total', 'Attendance %'],
      rows: classes.map((classItem) => {
        const classStudentIds = new Set(users.filter((person) => person.role === 'student' && person.classId === classItem.id).map((person) => person.username))
        const classSubjectIds = new Set(subjects.filter((subject) => subject.classId === classItem.id).map((subject) => subject.id))
        const classRecords = records.filter((record) => classStudentIds.has(record.studentId) && classSubjectIds.has(record.subjectId))
        const summary = getAttendanceSummary(classRecords)
        return [`${classItem.name} - ${classItem.section}`, summary.present, summary.total - summary.present, summary.total, `${summary.percentage}%`]
      }),
    })
    sections.push({
      title: 'Subject-wise attendance',
      headers: ['Subject', 'Class', 'Attended', 'Missed', 'Total', 'Attendance %'],
      rows: subjects.map((subject) => {
        const subjectRecords = records.filter((record) => record.subjectId === subject.id)
        const summary = getAttendanceSummary(subjectRecords)
        const classItem = classes.find((item) => item.id === subject.classId)
        return [subject.name, classItem ? `${classItem.name} - ${classItem.section}` : '-', summary.present, summary.total - summary.present, summary.total, `${summary.percentage}%`]
      }),
    })
    sections.push({
      title: 'Students below attendance requirement',
      headers: ['Student', 'Class', 'Subject', 'Attended', 'Total', 'Attendance %', 'Classes needed'],
      rows: [...groups.entries()].flatMap(([key, groupedRecords]) => {
        const [studentId, subjectId] = key.split('|')
        const student = users.find((person) => person.username === studentId)
        const subject = subjects.find((item) => item.id === subjectId)
        const classItem = classes.find((item) => item.id === student?.classId)
        const plan = getSubjectAttendancePlan(groupedRecords)
        if (!plan.belowThreshold) return []
        return [[student?.name ?? studentId, classItem ? `${classItem.name} - ${classItem.section}` : '-', subject?.name ?? subjectId, plan.present, plan.total, `${plan.percentage}%`, plan.classesNeeded]]
      }),
    })
  }
  sections.push({ title: 'Filtered attendance records', headers: detailHeaders, rows: detailRows })
  return sections
}

function AttendanceReportSummary({ sections }) {
  return (
    <details className="attendance-report-summary">
      <summary>View role-specific report summaries</summary>
      <div className="attendance-report-summary-sections">
        {sections.slice(0, -1).map((section) => (
          <section key={section.title}>
            <h3>{section.title}</h3>
            <div className="table-wrap"><table><thead><tr>{section.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>
              {section.rows.map((row, index) => <tr key={`${section.title}-${index}`}>{row.map((cell, cellIndex) => <td key={`${section.title}-${index}-${cellIndex}`}>{cell}</td>)}</tr>)}
              {!section.rows.length && <tr><td className="empty-cell" colSpan={section.headers.length}>No matching records.</td></tr>}
            </tbody></table></div>
          </section>
        ))}
      </div>
    </details>
  )
}

function escapeCsvValue(value) {
  let text = String(value ?? '')
  if (/^[\t\r ]*[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

function AttendanceTable({ records, users, subjects, compact = false, title, showStudent = true }) {
  const columnCount = showStudent ? 4 : 3
  return (
    <div className={`attendance-table ${compact ? 'attendance-table-compact' : ''}`}>
      {title && <div className="panel-heading attendance-table-title"><div><span className="eyebrow">RECORDS</span><h2>{title}</h2></div></div>}
      <div className="table-wrap"><table><thead><tr><th>Date</th>{showStudent && <th>Student</th>}<th>Subject</th><th>Status</th></tr></thead><tbody>
        {records.map((record, index) => {
          const student = users.find((person) => person.username === record.studentId)
          const subject = subjects.find((item) => item.id === record.subjectId)
          return <tr key={`${record.date}-${record.studentId}-${record.subjectId}-${index}`}><td>{formatDate(record.date)}</td>{showStudent && <td>{student?.name ?? record.studentId}</td>}<td>{subject?.name ?? record.subjectId}</td><td><StatusBadge status={record.status} /></td></tr>
        })}
        {!records.length && <tr><td className="empty-cell" colSpan={columnCount}>No attendance records match these filters.</td></tr>}
      </tbody></table></div>
    </div>
  )
}

function SettingsPage({ data, setData }) {
  const [message, setMessage] = useState('')

  function exportData() {
    downloadFile('attendease-data.json', JSON.stringify(data, null, 2), 'application/json')
    setMessage('Your data export is ready.')
  }

  async function importData(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const imported = JSON.parse(await file.text())
      if (!isApplicationData(imported)) {
        throw new Error('The selected file does not contain valid AttendEase data.')
      }
      setData({
        users: imported.users,
        classes: imported.classes,
        subjects: imported.subjects,
        attendanceRecords: imported.attendanceRecords,
        correctionRequests: Array.isArray(imported.correctionRequests) ? imported.correctionRequests : [],
        activityLog: Array.isArray(imported.activityLog) ? imported.activityLog : [],
      })
      setMessage('Data imported successfully.')
      event.target.value = ''
    } catch (error) {
      console.error('Could not import AttendEase data:', error)
      setMessage(error.message || 'Could not read this data file.')
      event.target.value = ''
    }
  }

  function resetData() {
    if (!window.confirm('Restore the original demo data? This replaces all current browser data.')) return
    setData(structuredClone(initialData))
    setMessage('Demo data restored.')
  }

  return (
    <>
      <PageHeading eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Manage your local demo data and data exports." />
      <section className="panel settings-panel">
        <div className="settings-row"><div><span className="eyebrow">BACKUP</span><h2>Export institution data</h2><p>Download accounts, classes, subjects, attendance, and correction request history as JSON.</p></div><button className="button button-secondary" onClick={exportData}>Export JSON</button></div>
        <div className="settings-row"><div><span className="eyebrow">RESTORE</span><h2>Import institution data</h2><p>Replace this browser’s data with a previous AttendEase JSON export.</p></div><label className="button button-secondary file-button">Choose JSON file<input accept="application/json,.json" onChange={importData} type="file" /></label></div>
        <div className="settings-row settings-danger"><div><span className="eyebrow">RESET</span><h2>Restore demo data</h2><p>Replace all local data with the original example accounts and attendance.</p></div><button className="button button-danger" onClick={resetData}>Restore demo data</button></div>
        {message && <p className="form-success" role="status">{message}</p>}
      </section>
      <p className="settings-disclaimer">AttendEase stores demo data in this browser only. It is not connected to a production authentication service or institution database.</p>
    </>
  )
}

function ProfilePage({ data, user }) {
  const profileClass = data.classes.find((item) => item.id === user.classId)
  const subjects = data.subjects.filter((subject) => (
    user.role === 'faculty' ? subject.facultyId === user.username : subject.classId === user.classId
  ))
  return (
    <>
      <PageHeading eyebrow="ACCOUNT DETAILS" title="My profile" description="Your AttendEase account information." />
      <section className="panel profile-card">
        <div className="profile-banner"><Avatar name={user.name} large /><div><h2>{user.name}</h2><RoleBadge role={user.role} /><p>{user.username}</p></div></div>
        <div className="profile-details">
          <Detail label="Institution" value="ABC Institute of Technology" />
          <Detail label="Institution code" value={user.institutionCode} />
          <Detail label="Account type" value={capitalize(user.role)} />
          {profileClass && <Detail label="Class" value={`${profileClass.name} · Section ${profileClass.section}`} />}
          <Detail label={user.role === 'faculty' ? 'Assigned subjects' : 'Subjects'} value={String(subjects.length)} />
        </div>
      </section>
    </>
  )
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action && <div className="page-heading-action">{action}</div>}</div>
}

function StatCard({ label, value, detail, icon, tone }) {
  return <section className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-detail">{detail}</span></section>
}

function Avatar({ name, large = false }) {
  return <span className={`avatar ${large ? 'avatar-large' : ''}`} aria-hidden="true">{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
}

function RoleBadge({ role }) {
  return <span className={`role-badge role-${role}`}>{capitalize(role)}</span>
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${status.toLowerCase() === 'present' ? 'status-present' : 'status-absent'}`}>{status}</span>
}

function Progress({ value }) {
  return <div aria-label={`${value}% attendance`} className="progress-track" role="img"><span style={{ width: `${value}%` }} /></div>
}

function EmptyState({ title, description }) {
  return <div className="empty-state"><span className="empty-icon">◌</span><strong>{title}</strong><p>{description}</p></div>
}

function Detail({ label, value }) {
  return <div className="detail-item"><span>{label}</span><strong>{value}</strong></div>
}

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
}

function downloadFile(filename, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function firstName(name) {
  return name.split(/\s+/)[0]
}

export default App
