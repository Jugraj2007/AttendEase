export const initialData = {
  users: [
    { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin', institutionCode: 'ABC001' },
    { username: 'Sanehasharma', password: 'Saneha@123', name: 'Saneha Sharma', role: 'student', institutionCode: 'ABC001', classId: 'cse3a' },
    { username: 'Kashish29', password: 'Kash@yt', name: 'Kashish', role: 'student', institutionCode: 'ABC001', classId: 'cse3a' },
    { username: 'Jugraj59', password: 'Jugraj@33', name: 'Jugraj', role: 'student', institutionCode: 'ABC001', classId: 'cse3a' },
    { username: 'student04', password: 'Student@111', name: 'Student Four', role: 'student', institutionCode: 'ABC001', classId: 'cse3b' },
    { username: 'student05', password: 'Student@222', name: 'Student Five', role: 'student', institutionCode: 'ABC001', classId: 'cse3b' },
    { username: 'student06', password: 'Student@333', name: 'Student Six', role: 'student', institutionCode: 'ABC001', classId: 'cse3b' },
    { username: 'faculty01', password: 'Faculty@123', name: 'Faculty One', role: 'faculty', institutionCode: 'ABC001' },
    { username: 'faculty02', password: 'Faculty@456', name: 'Faculty Two', role: 'faculty', institutionCode: 'ABC001' },
    { username: 'faculty03', password: 'Faculty@789', name: 'Faculty Three', role: 'faculty', institutionCode: 'ABC001' },
  ],
  classes: [
    { id: 'cse3a', name: 'CSE AI/ML 3', section: 'A', teacherId: 'faculty01' },
    { id: 'cse3b', name: 'CSE AI/ML 3', section: 'B', teacherId: 'faculty02' },
  ],
  subjects: [
    { id: 'java', name: 'Java Programming', code: 'CSE301', classId: 'cse3a', facultyId: 'faculty01' },
    { id: 'stats', name: 'Statistics & Data Engineering', code: 'SDE302', classId: 'cse3a', facultyId: 'faculty02' },
    { id: 'dbms', name: 'Database Management Systems', code: 'DBMS303', classId: 'cse3a', facultyId: 'faculty03' },
    { id: 'java2', name: 'Java Programming', code: 'CSE301', classId: 'cse3b', facultyId: 'faculty01' },
    { id: 'dbms2', name: 'Database Management Systems', code: 'DBMS303', classId: 'cse3b', facultyId: 'faculty03' },
  ],
  attendanceRecords: [
    { date: '2026-08-18', studentId: 'Sanehasharma', subjectId: 'java', facultyId: 'faculty01', status: 'Present' },
    { date: '2026-08-18', studentId: 'Kashish29', subjectId: 'java', facultyId: 'faculty01', status: 'Present' },
    { date: '2026-08-18', studentId: 'Jugraj59', subjectId: 'java', facultyId: 'faculty01', status: 'Absent' },
    { date: '2026-08-18', studentId: 'student04', subjectId: 'java2', facultyId: 'faculty01', status: 'Present' },
    { date: '2026-08-18', studentId: 'student05', subjectId: 'java2', facultyId: 'faculty01', status: 'Present' },
    { date: '2026-08-18', studentId: 'student06', subjectId: 'java2', facultyId: 'faculty01', status: 'Absent' },
    { date: '2026-08-19', studentId: 'Sanehasharma', subjectId: 'stats', facultyId: 'faculty02', status: 'Present' },
    { date: '2026-08-19', studentId: 'Kashish29', subjectId: 'stats', facultyId: 'faculty02', status: 'Present' },
    { date: '2026-08-19', studentId: 'Jugraj59', subjectId: 'stats', facultyId: 'faculty02', status: 'Present' },
    { date: '2026-08-19', studentId: 'student04', subjectId: 'dbms2', facultyId: 'faculty03', status: 'Present' },
    { date: '2026-08-19', studentId: 'student05', subjectId: 'dbms2', facultyId: 'faculty03', status: 'Absent' },
    { date: '2026-08-19', studentId: 'student06', subjectId: 'dbms2', facultyId: 'faculty03', status: 'Present' },
  ],
  correctionRequests: [],
  activityLog: [
    { text: 'Attendance records loaded for August 18', time: 'Aug 18, 2026', icon: '✓' },
    { text: 'Attendance records loaded for August 19', time: 'Aug 19, 2026', icon: '✓' },
    { text: 'Temporary institution dataset initialized', time: 'Today', icon: '▤' },
  ],
}

export function isRole(role) {
  return role === 'admin' || role === 'faculty' || role === 'student'
}

export function isApplicationData(data) {
  const hasFields = (value, fields) =>
    value !== null &&
    typeof value === 'object' &&
    fields.every((field) => typeof value[field] === 'string')

  return Boolean(
    data &&
      Array.isArray(data.users) &&
      data.users.every((user) =>
        hasFields(user, ['username', 'password', 'name', 'role', 'institutionCode']) &&
        isRole(user.role),
      ) &&
      Array.isArray(data.classes) &&
      data.classes.every((item) => hasFields(item, ['id', 'name', 'section'])) &&
      Array.isArray(data.subjects) &&
      data.subjects.every((subject) =>
        hasFields(subject, ['id', 'name', 'code', 'classId', 'facultyId']),
      ) &&
      Array.isArray(data.attendanceRecords) &&
      data.attendanceRecords.every(
        (record) =>
          hasFields(record, ['date', 'studentId', 'subjectId', 'facultyId', 'status']) &&
          ['present', 'absent'].includes(record.status.toLowerCase()),
      ) &&
      (data.correctionRequests === undefined ||
        (Array.isArray(data.correctionRequests) &&
          data.correctionRequests.every((request) =>
            hasFields(request, [
              'id',
              'studentId',
              'subjectId',
              'date',
              'facultyId',
              'reason',
              'status',
              'createdAt',
            ]) &&
            request.reason.trim().length > 0 &&
            ['pending', 'approved', 'rejected'].includes(request.status) &&
            (request.reviewedAt === undefined || typeof request.reviewedAt === 'string') &&
            (request.reviewerId === undefined || typeof request.reviewerId === 'string') &&
            (request.correctedStatus === undefined ||
              ['Present', 'Absent'].includes(request.correctedStatus)) &&
            (request.response === undefined || typeof request.response === 'string') &&
            (request.status !== 'approved' ||
              (['Present', 'Absent'].includes(request.correctedStatus) &&
                typeof request.reviewerId === 'string' &&
                typeof request.reviewedAt === 'string')) &&
            (request.status === 'pending' ||
              (typeof request.reviewerId === 'string' && typeof request.reviewedAt === 'string')),
          ))),
  )
}

export function readApplicationState() {
  try {
    const theme = window.localStorage.getItem('attendEaseTheme') ?? 'dark'
    if (!['dark', 'light'].includes(theme)) {
      throw new Error('Stored theme preference is invalid. Clear AttendEase theme preference and reload.')
    }

    const savedData = window.localStorage.getItem('attendEaseData')
    const data = savedData ? JSON.parse(savedData) : structuredClone(initialData)
    if (!isApplicationData(data)) {
      throw new Error('Stored AttendEase data is incomplete. Restore or import a valid data file to continue.')
    }

    const rawSession = window.localStorage.getItem('attendEaseSession')
    const session = rawSession ? JSON.parse(rawSession) : null
    if (session && (!session.username || !isRole(session.role))) {
      throw new Error('Stored sign-in details are invalid. Clear this browser’s AttendEase sign-in data and try again.')
    }

    return {
      data: {
        ...data,
        correctionRequests: Array.isArray(data.correctionRequests) ? data.correctionRequests : [],
        activityLog: Array.isArray(data.activityLog) ? data.activityLog : [],
      },
      session,
      theme,
      error: '',
    }
  } catch (error) {
    console.error('Could not load AttendEase data:', error)
    return {
      data: structuredClone(initialData),
      session: null,
      error: error.message || 'AttendEase could not read local browser storage.',
    }
  }
}
