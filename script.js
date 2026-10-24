// ============================================
// ATTENDEASE - TEMPORARY DATASET
// PART 1
// ============================================


// ============================================
// INSTITUTION
// ============================================

const institution = {
    code: "ABC001",
    name: "ABC Institute of Technology"
};


// ============================================
// USERS
// ============================================

const users = [

    // ADMIN
    {
        username: "admin",
        password: "admin123",
        name: "Administrator",
        role: "admin",
        institutionCode: "ABC001"
    },

    // STUDENTS
    {
        username: "Sanehasharma",
        password: "Saneha@123",
        name: "Saneha Sharma",
        role: "student",
        institutionCode: "ABC001",
        classId: "cse3a"
    },

    {
        username: "Kashish29",
        password: "Kash@yt",
        name: "Kashish",
        role: "student",
        institutionCode: "ABC001",
        classId: "cse3a"
    },

    {
        username: "Jugraj59",
        password: "Jugraj@33",
        name: "Jugraj",
        role: "student",
        institutionCode: "ABC001",
        classId: "cse3a"
    },

    {
        username: "student04",
        password: "Student@111",
        name: "Student Four",
        role: "student",
        institutionCode: "ABC001",
        classId: "cse3b"
    },

    {
        username: "student05",
        password: "Student@222",
        name: "Student Five",
        role: "student",
        institutionCode: "ABC001",
        classId: "cse3b"
    },

    {
        username: "student06",
        password: "Student@333",
        name: "Student Six",
        role: "student",
        institutionCode: "ABC001",
        classId: "cse3b"
    },


    // FACULTY
    {
        username: "faculty01",
        password: "Faculty@123",
        name: "Faculty One",
        role: "faculty",
        institutionCode: "ABC001"
    },

    {
        username: "faculty02",
        password: "Faculty@456",
        name: "Faculty Two",
        role: "faculty",
        institutionCode: "ABC001"
    },

    {
        username: "faculty03",
        password: "Faculty@789",
        name: "Faculty Three",
        role: "faculty",
        institutionCode: "ABC001"
    }

];


// ============================================
// CLASSES
// ============================================

let classes = [

    {
        id: "cse3a",
        name: "CSE AI/ML 3",
        section: "A",
        teacherId: "faculty01"
    },

    {
        id: "cse3b",
        name: "CSE AI/ML 3",
        section: "B",
        teacherId: "faculty02"
    }

];


// ============================================
// SUBJECTS
// ============================================

let subjects = [

    {
        id: "java",
        name: "Java Programming",
        code: "CSE301",
        classId: "cse3a",
        facultyId: "faculty01"
    },

    {
        id: "stats",
        name: "Statistics & Data Engineering",
        code: "SDE302",
        classId: "cse3a",
        facultyId: "faculty02"
    },

    {
        id: "dbms",
        name: "Database Management Systems",
        code: "DBMS303",
        classId: "cse3a",
        facultyId: "faculty03"
    },

    {
        id: "java2",
        name: "Java Programming",
        code: "CSE301",
        classId: "cse3b",
        facultyId: "faculty01"
    },

    {
        id: "dbms2",
        name: "Database Management Systems",
        code: "DBMS303",
        classId: "cse3b",
        facultyId: "faculty03"
    }

];


// ============================================
// ATTENDANCE RECORDS
// ============================================

let attendanceRecords = [

    {
        date: "2026-08-18",
        studentId: "Sanehasharma",
        subjectId: "java",
        facultyId: "faculty01",
        status: "Present"
    },

    {
        date: "2026-08-18",
        studentId: "Kashish29",
        subjectId: "java",
        facultyId: "faculty01",
        status: "Present"
    },

    {
        date: "2026-08-18",
        studentId: "Jugraj59",
        subjectId: "java",
        facultyId: "faculty01",
        status: "Absent"
    },

    {
        date: "2026-08-18",
        studentId: "student04",
        subjectId: "java2",
        facultyId: "faculty01",
        status: "Present"
    },

    {
        date: "2026-08-18",
        studentId: "student05",
        subjectId: "java2",
        facultyId: "faculty01",
        status: "Present"
    },

    {
        date: "2026-08-18",
        studentId: "student06",
        subjectId: "java2",
        facultyId: "faculty01",
        status: "Absent"
    },

    {
        date: "2026-08-19",
        studentId: "Sanehasharma",
        subjectId: "stats",
        facultyId: "faculty02",
        status: "Present"
    },

    {
        date: "2026-08-19",
        studentId: "Kashish29",
        subjectId: "stats",
        facultyId: "faculty02",
        status: "Present"
    },

    {
        date: "2026-08-19",
        studentId: "Jugraj59",
        subjectId: "stats",
        facultyId: "faculty02",
        status: "Present"
    },

    {
        date: "2026-08-19",
        studentId: "student04",
        subjectId: "dbms2",
        facultyId: "faculty03",
        status: "Present"
    },

    {
        date: "2026-08-19",
        studentId: "student05",
        subjectId: "dbms2",
        facultyId: "faculty03",
        status: "Absent"
    },

    {
        date: "2026-08-19",
        studentId: "student06",
        subjectId: "dbms2",
        facultyId: "faculty03",
        status: "Present"
    }

];


// ============================================
// ADMIN ACTIVITY LOG
// ============================================

let activityLog = [

    {
        text: "Attendance records loaded for August 18",
        time: "Aug 18, 2026",
        icon: "fa-calendar-check"
    },

    {
        text: "Attendance records loaded for August 19",
        time: "Aug 19, 2026",
        icon: "fa-calendar-check"
    },

    {
        text: "Temporary institution dataset initialized",
        time: "Today",
        icon: "fa-database"
    }

];


// ============================================
// RESTORE ADMIN DATA
// ============================================

(function restoreAdminData() {

    try {

        const saved =
            localStorage.getItem("attendEaseData");

        if (!saved) {
            localStorage.setItem(
                "attendEaseData",
                JSON.stringify({
                    users,
                    classes,
                    subjects,
                    attendanceRecords,
                    activityLog
                })
            );
            return;
        }

        const data = JSON.parse(saved);


        // Restore users
        if (Array.isArray(data.users)) {

            users.length = 0;

            data.users.forEach(function(user) {

                users.push(user);

            });

        }


        // Restore classes
        if (Array.isArray(data.classes)) {

            classes = data.classes;

        }


        // Restore subjects
        if (Array.isArray(data.subjects)) {

            subjects = data.subjects;

        }


        // Restore attendance
        if (Array.isArray(data.attendanceRecords)) {

            attendanceRecords =
                data.attendanceRecords;

        }


        // Restore activity
        if (Array.isArray(data.activityLog)) {

            activityLog =
                data.activityLog;

        }

    }

    catch (error) {

        console.warn(
            "Could not restore AttendEase data.",
            error
        );

    }

})();


// ============================================
// LOGIN USER
// ============================================

function loginUser(
    institutionCode,
    username,
    password
) {

    return users.find(function(user) {

        return (

            user.institutionCode ===
            institutionCode

            &&

            user.username ===
            username

            &&

            user.password ===
            password

        );

    }) || null;

}


// ============================================
// SAVE LOGIN SESSION
// ============================================

function saveUser(user) {

    const session = {

        username: user.username,

        name: user.name,

        role: user.role,

        institutionCode:
            user.institutionCode,

        institutionName:
            institution.name

    };


    localStorage.setItem(

        "attendEaseSession",

        JSON.stringify(session)

    );

}


// ============================================
// GET CURRENT USER
// ============================================

function getUser() {

    const session =
        localStorage.getItem(
            "attendEaseSession"
        );


    if (session) {

        return JSON.parse(session);

    }


    return null;

}


// ============================================
// LOGOUT
// ============================================

function logoutUser() {

    localStorage.removeItem(
        "attendEaseSession"
    );


    window.location.href =
        "index.html";

}


// ============================================
// ROLE BASED REDIRECT
// ============================================

function redirectUser(user) {

    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    if (user.role === "admin") {

        window.location.href =
            "admin-dashboard.html";

    }


    else if (user.role === "faculty") {

        window.location.href =
            "faculty-dashboard.html";

    }


    else if (user.role === "student") {

        window.location.href =
            "student-dashboard.html";

    }


    else {

        localStorage.removeItem(
            "attendEaseSession"
        );

        window.location.href =
            "index.html";

    }

}
// ============================================
// PASSWORD SHOW / HIDE
// ============================================

function setupPasswordToggle() {

    const password =
        document.getElementById("password");

    const button =
        document.getElementById("showPassword");


    if (!password || !button) {

        return;

    }


    button.addEventListener(
        "click",
        function() {

            if (password.type === "password") {

                password.type = "text";

                button.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

                button.title =
                    "Hide password";

            }

            else {

                password.type =
                    "password";

                button.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

                button.title =
                    "Show password";

            }

        }
    );

}


// ============================================
// LOGIN FORM
// ============================================

function setupLogin() {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {

        return;

    }


    const message =
        document.getElementById(
            "loginMessage"
        );


    const loginButton =
        document.getElementById(
            "loginButton"
        );


    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const institutionCode =
                document
                    .getElementById(
                        "institutionCode"
                    )
                    .value
                    .trim();


            const username =
                document
                    .getElementById(
                        "userId"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value;


            const user =
                loginUser(
                    institutionCode,
                    username,
                    password
                );


            // ====================================
            // INVALID LOGIN
            // ====================================

            if (!user) {

                message.textContent =
                    "Invalid institution code, User ID or password.";

                message.classList.remove(
                    "success"
                );

                return;

            }


            // ====================================
            // VALID LOGIN
            // ====================================

            saveUser(user);

            message.textContent =
                "Login successful. Preparing your dashboard...";

            message.classList.add(
                "success"
            );

            loginButton.disabled =
                true;

            loginButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Loading...';

            window.location.href =
                "load-role-aware.html";

        }
    );

}


// ============================================
// SAVE ADMIN DASHBOARD DATA
// ============================================

function saveAdminData() {

    const data = {

        users: users,

        classes: classes,

        subjects: subjects,

        attendanceRecords:
            attendanceRecords,

        activityLog:
            activityLog

    };


    localStorage.setItem(

        "attendEaseData",

        JSON.stringify(data)

    );

}


// ============================================
// FIND STUDENT
// ============================================

function getStudent(studentId) {

    return users.find(
        function(user) {

            return (
                user.username ===
                studentId
            );

        }
    );

}


// ============================================
// FIND FACULTY
// ============================================

function getFaculty(facultyId) {

    return users.find(
        function(user) {

            return (
                user.username ===
                facultyId
            );

        }
    );

}


// ============================================
// FIND CLASS
// ============================================

function getClass(classId) {

    return classes.find(
        function(item) {

            return (
                item.id ===
                classId
            );

        }
    );

}


// ============================================
// FIND SUBJECT
// ============================================

function getSubject(subjectId) {

    return subjects.find(
        function(item) {

            return (
                item.id ===
                subjectId
            );

        }
    );

}


// ============================================
// GET STUDENT CLASS
// ============================================

function getStudentClass(student) {

    if (!student) {

        return null;

    }


    return getClass(
        student.classId
    );

}


// ============================================
// GET STUDENT ATTENDANCE
// ============================================

function getStudentAttendance(
    studentId
) {

    return attendanceRecords.filter(
        function(record) {

            return (
                record.studentId ===
                studentId
            );

        }
    );

}


// ============================================
// CALCULATE STUDENT ATTENDANCE
// ============================================

function calculateStudentAttendance(
    studentId
) {

    const records =
        getStudentAttendance(
            studentId
        );


    if (records.length === 0) {

        return 0;

    }


    const present =
        records.filter(
            function(record) {

                return (
                    record.status ===
                    "Present"
                );

            }
        ).length;


    return Math.round(
        (present / records.length) * 100
    );

}


// ============================================
// CALCULATE OVERALL ATTENDANCE
// ============================================

function calculateOverallAttendance() {

    if (
        attendanceRecords.length ===
        0
    ) {

        return 0;

    }


    const present =
        attendanceRecords.filter(
            function(record) {

                return (
                    record.status ===
                    "Present"
                );

            }
        ).length;


    return Math.round(
        (
            present /
            attendanceRecords.length
        ) * 100
    );

}


// ============================================
// GET TOTAL STUDENTS
// ============================================

function getTotalStudents() {

    return users.filter(
        function(user) {

            return user.role ===
                "student";

        }
    ).length;

}


// ============================================
// GET TOTAL FACULTY
// ============================================

function getTotalFaculty() {

    return users.filter(
        function(user) {

            return user.role ===
                "faculty";

        }
    ).length;

}


// ============================================
// GET TOTAL CLASSES
// ============================================

function getTotalClasses() {

    return classes.length;

}


// ============================================
// GET PRESENT COUNT
// ============================================

function getPresentCount() {

    return attendanceRecords.filter(
        function(record) {

            return (
                record.status ===
                "Present"
            );

        }
    ).length;

}


// ============================================
// GET ABSENT COUNT
// ============================================

function getAbsentCount() {

    return attendanceRecords.filter(
        function(record) {

            return (
                record.status ===
                "Absent"
            );

        }
    ).length;

}


// ============================================
// GET UNIQUE ATTENDANCE SESSIONS
// ============================================

function getAttendanceSessionCount() {

    const sessions = [];


    attendanceRecords.forEach(
        function(record) {

            const key =
                record.date +
                "_" +
                record.subjectId;


            if (
                !sessions.includes(key)
            ) {

                sessions.push(key);

            }

        }
    );


    return sessions.length;

}


// ============================================
// INITIALIZE LOGIN PAGE
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupPasswordToggle();

        setupLogin();

    }
);
// ============================================
// ATTENDEASE ADMIN DASHBOARD
// PART 3
// ============================================


// ============================================
// RUN ONLY ON ADMIN DASHBOARD
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const session = getUser();

        const adminDashboard =
            document.getElementById(
                "admin-dashboard"
            );


        // If this is not the admin dashboard,
        // don't run admin dashboard code.

        if (!adminDashboard) {

            return;

        }


        // ====================================
        // SECURITY CHECK
        // ====================================

        if (
            !session ||
            session.role !== "admin"
        ) {

            window.location.href =
                "index.html";

            return;

        }


        initializeAdminDashboard();

    }
);


// ============================================
// ADMIN DASHBOARD INITIALIZATION
// ============================================

function initializeAdminDashboard() {

    setupAdminNavigation();

    setupAdminButtons();

    setupAdminSearch();

    setupAdminLogout();

    renderAdminDashboard();

}


// ============================================
// NAVIGATION
// ============================================

function setupAdminNavigation() {

    const navigationButtons =
        document.querySelectorAll(
            "[data-page]"
        );


    navigationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const page =
                        button.dataset.page;

                    if (!page) {

                        return;

                    }

                    showAdminPage(page);

                }
            );

        }
    );

}


// ============================================
// SHOW ADMIN PAGE
// ============================================

function showAdminPage(pageName) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(
        function (page) {

            page.classList.remove(
                "active"
            );

        }
    );


    const selectedPage =
        document.getElementById(
            pageName === "dashboard"
                ? "admin-dashboard"
                : "page-" + pageName
        );


    if (selectedPage) {

        selectedPage.classList.add(
            "active"
        );

    }


    const links =
        document.querySelectorAll(
            "[data-page]"
        );


    links.forEach(
        function (link) {

            link.classList.remove(
                "active"
            );


            if (
                link.dataset.page ===
                pageName
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );


    // Close mobile sidebar

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "overlay"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


// ============================================
// ADMIN BUTTONS
// ============================================

function setupAdminButtons() {

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {

                return;

            }


            const action =
                button.dataset.action;


            // Add student

            if (
                action ===
                "add-student"
            ) {

                openAddStudentModal();

            }


            // Add faculty

            else if (
                action ===
                "add-faculty"
            ) {

                openAddFacultyModal();

            }


            // Add class

            else if (
                action ===
                "add-class"
            ) {

                openAddClassModal();

            }


            // Add subject

            else if (
                action ===
                "add-subject"
            ) {

                openAddSubjectModal();

            }

        }
    );

}


// ============================================
// LOGOUT
// ============================================

function setupAdminLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                logoutUser();

            }
        );

    }


    const settingsLogout =
        document.getElementById(
            "settingsLogout"
        );


    if (settingsLogout) {

        settingsLogout.addEventListener(
            "click",
            function () {

                logoutUser();

            }
        );

    }

}


// ============================================
// SEARCH + FILTER
// ============================================

function setupAdminSearch() {

    const studentSearch =
        document.getElementById(
            "studentSearch"
        );


    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            renderStudents
        );

    }


    const studentFilter =
        document.getElementById(
            "studentClassFilter"
        );


    if (studentFilter) {

        studentFilter.addEventListener(
            "change",
            renderStudents
        );

    }


    const facultySearch =
        document.getElementById(
            "facultySearch"
        );


    if (facultySearch) {

        facultySearch.addEventListener(
            "input",
            renderFaculty
        );

    }


    const attendanceSearch =
        document.getElementById(
            "attendanceSearch"
        );


    if (attendanceSearch) {

        attendanceSearch.addEventListener(
            "input",
            renderAttendance
        );

    }


    const attendanceClass =
        document.getElementById(
            "attendanceClassFilter"
        );


    if (attendanceClass) {

        attendanceClass.addEventListener(
            "change",
            renderAttendance
        );

    }


    const attendanceStatus =
        document.getElementById(
            "attendanceStatusFilter"
        );


    if (attendanceStatus) {

        attendanceStatus.addEventListener(
            "change",
            renderAttendance
        );

    }

}


// ============================================
// MAIN DASHBOARD
// ============================================

function renderAdminDashboard() {

    renderDashboardStats();

    renderDashboardWelcome();

    renderAttendanceOverview();

    renderActivity();

    renderStudents();

    renderFaculty();

    renderClasses();

    renderSubjects();

    renderAttendance();

    populateClassFilters();

}


// ============================================
// DASHBOARD STATISTICS
// ============================================

function renderDashboardStats() {

    const students =
        getTotalStudents();

    const faculty =
        getTotalFaculty();

    const classCount =
        getTotalClasses();

    const attendance =
        calculateOverallAttendance();


    const studentElement =
        document.getElementById(
            "studentCount"
        );


    const facultyElement =
        document.getElementById(
            "facultyCount"
        );


    const classElement =
        document.getElementById(
            "classCount"
        );


    const attendanceElement =
        document.getElementById(
            "attendanceValue"
        );


    if (studentElement) {

        studentElement.textContent =
            students;

    }


    if (facultyElement) {

        facultyElement.textContent =
            faculty;

    }


    if (classElement) {

        classElement.textContent =
            classCount;

    }


    if (attendanceElement) {

        attendanceElement.textContent =
            attendance + "%";

    }


    // Attendance page statistics

    const presentElement =
        document.getElementById(
            "presentCount"
        );


    const absentElement =
        document.getElementById(
            "absentCount"
        );


    const sessionElement =
        document.getElementById(
            "sessionCount"
        );


    if (presentElement) {

        presentElement.textContent =
            getPresentCount();

    }


    if (absentElement) {

        absentElement.textContent =
            getAbsentCount();

    }


    if (sessionElement) {

        sessionElement.textContent =
            getAttendanceSessionCount();

    }

}


// ============================================
// WELCOME MESSAGE
// ============================================

function renderDashboardWelcome() {

    const session =
        getUser();


    const welcome =
        document.getElementById(
            "welcomeText"
        );


    const institutionName =
        document.getElementById(
            "institutionName"
        );


    const profile =
        document.getElementById(
            "profileInitial"
        );


    if (welcome && session) {

        welcome.textContent =
            "Good day, " +
            session.name +
            " 👋";

    }


    if (
        institutionName &&
        session
    ) {

        institutionName.textContent =
            institution.name +
            " • " +
            institution.code;

    }


    if (
        profile &&
        session
    ) {

        profile.textContent =
            session.name
                .charAt(0)
                .toUpperCase();

    }


    const settingsInstitution =
        document.getElementById(
            "settingsInstitution"
        );


    const settingsUser =
        document.getElementById(
            "settingsUser"
        );


    if (settingsInstitution) {

        settingsInstitution.textContent =
            institution.name +
            " (" +
            institution.code +
            ")";

    }


    if (
        settingsUser &&
        session
    ) {

        settingsUser.textContent =
            session.name +
            " • " +
            session.username;

    }

}


// ============================================
// ATTENDANCE OVERVIEW
// ============================================

function renderAttendanceOverview() {

    const percentage =
        calculateOverallAttendance();


    const ring =
        document.getElementById(
            "dashboardRing"
        );


    const ringText =
        document.getElementById(
            "dashboardRingText"
        );


    const summary =
        document.getElementById(
            "attendanceSummary"
        );


    if (ring) {

        ring.style.background =
            "conic-gradient(" +
            "var(--secondary) " +
            percentage * 3.6 +
            "deg, " +
            "#1E293B 0deg)";

    }


    if (ringText) {

        ringText.textContent =
            percentage + "%";

    }


    if (summary) {

        if (
            attendanceRecords.length ===
            0
        ) {

            summary.textContent =
                "No attendance records";

        }

        else {

            summary.textContent =
                getPresentCount() +
                " present of " +
                attendanceRecords.length +
                " records";

        }

    }

}


// ============================================
// ACTIVITY
// ============================================

function renderActivity() {

    const container =
        document.getElementById(
            "activityList"
        );


    if (!container) {

        return;

    }


    if (
        activityLog.length ===
        0
    ) {

        container.innerHTML =
            '<div class="empty">' +
            "No activity yet." +
            "</div>";

        return;

    }


    container.innerHTML =
        activityLog
            .slice(0, 8)
            .map(
                function (activity) {

                    return `

                    <div class="activity">

                        <i class="fa-solid ${
                            activity.icon ||
                            "fa-circle-info"
                        }"></i>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    activity.text
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    activity.time
                                )}
                            </span>

                        </div>

                    </div>

                    `;

                }
            )
            .join("");

}


// ============================================
// STUDENTS TABLE
// ============================================

function renderStudents() {

    const table =
        document.getElementById(
            "studentsBody"
        );


    if (!table) {

        return;

    }


    const search =
        (
            document.getElementById(
                "studentSearch"
            )?.value || ""
        )
            .toLowerCase()
            .trim();


    const classFilter =
        document.getElementById(
            "studentClassFilter"
        )?.value || "";


    let students =
        users.filter(
            function (user) {

                return (
                    user.role ===
                    "student"
                );

            }
        );


    // Search

    if (search) {

        students =
            students.filter(
                function (student) {

                    const classData =
                        getStudentClass(
                            student
                        );


                    const text =
                        (
                            student.name +
                            " " +
                            student.username +
                            " " +
                            (
                                classData?.name ||
                                ""
                            )
                        )
                            .toLowerCase();


                    return text.includes(
                        search
                    );

                }
            );

    }


    // Class filter

    if (classFilter) {

        students =
            students.filter(
                function (student) {

                    return (
                        student.classId ===
                        classFilter
                    );

                }
            );

    }


    if (
        students.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    No students found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        students
            .map(
                function (student) {

                    const classData =
                        getStudentClass(
                            student
                        );


                    const percentage =
                        calculateStudentAttendance(
                            student.username
                        );


                    let badgeClass =
                        "green";


                    if (
                        percentage < 60
                    ) {

                        badgeClass =
                            "red";

                    }

                    else if (
                        percentage < 75
                    ) {

                        badgeClass =
                            "orange";

                    }


                    return `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    student.name
                                )}
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(
                                    student.username
                                )}
                            </small>

                        </td>


                        <td>

                            ${
                                classData
                                    ? escapeHTML(
                                        classData.name
                                    ) +
                                    " - " +
                                    escapeHTML(
                                        classData.section
                                    )
                                    : "Unassigned"
                            }

                        </td>


                        <td>

                            ${escapeHTML(
                                student.username
                            )}

                        </td>


                        <td>

                            <span
                                class="badge ${badgeClass}"
                            >

                                ${percentage}%

                            </span>

                        </td>


                        <td>

                            <span
                                class="badge green"
                            >
                                Active
                            </span>

                        </td>


                        <td>

                            <div class="actions">

                                <button
                                    onclick="viewStudent(
                                        '${student.username}'
                                    )"
                                    title="View"
                                >

                                    <i
                                        class="fa-solid fa-eye"
                                    ></i>

                                </button>


                                <button
                                    onclick="editStudent(
                                        '${student.username}'
                                    )"
                                    title="Edit"
                                >

                                    <i
                                        class="fa-solid fa-pen"
                                    ></i>

                                </button>


                                <button
                                    onclick="deleteUser(
                                        '${student.username}'
                                    )"
                                    title="Delete"
                                >

                                    <i
                                        class="fa-solid fa-trash"
                                    ></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                    `;

                }
            )
            .join("");

}


// ============================================
// FACULTY TABLE
// ============================================

function renderFaculty() {

    const table =
        document.getElementById(
            "facultyBody"
        );


    if (!table) {

        return;

    }


    const search =
        (
            document.getElementById(
                "facultySearch"
            )?.value || ""
        )
            .toLowerCase()
            .trim();


    let faculty =
        users.filter(
            function (user) {

                return (
                    user.role ===
                    "faculty"
                );

            }
        );


    if (search) {

        faculty =
            faculty.filter(
                function (person) {

                    const text =
                        (
                            person.name +
                            " " +
                            person.username
                        )
                            .toLowerCase();


                    return text.includes(
                        search
                    );

                }
            );

    }


    if (
        faculty.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    No faculty found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        faculty
            .map(
                function (person) {

                    const assignedSubjects =
                        subjects.filter(
                            function (subject) {

                                return (
                                    subject.facultyId ===
                                    person.username
                                );

                            }
                        );


                    const subjectNames =
                        assignedSubjects
                            .map(
                                function (
                                    subject
                                ) {

                                    return subject.name;

                                }
                            )
                            .join(", ");


                    const classNames =
                        [
                            ...new Set(
                                assignedSubjects
                                    .map(
                                        function (
                                            subject
                                        ) {

                                            const classData =
                                                getClass(
                                                    subject.classId
                                                );


                                            return classData
                                                ? classData.name
                                                : null;

                                        }
                                    )
                                    .filter(Boolean)
                            )
                        ]
                            .join(", ");


                    return `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    person.name
                                )}
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(
                                    person.username
                                )}
                            </small>

                        </td>


                        <td>

                            ${escapeHTML(
                                person.username
                            )}

                        </td>


                        <td>

                            ${
                                escapeHTML(
                                    subjectNames ||
                                    "—"
                                )
                            }

                        </td>


                        <td>

                            ${
                                escapeHTML(
                                    classNames ||
                                    "—"
                                )
                            }

                        </td>


                        <td>

                            <span
                                class="badge green"
                            >
                                Active
                            </span>

                        </td>


                        <td>

                            <div class="actions">

                                <button
                                    onclick="viewFaculty(
                                        '${person.username}'
                                    )"
                                    title="View"
                                >

                                    <i
                                        class="fa-solid fa-eye"
                                    ></i>

                                </button>


                                <button
                                    onclick="editFaculty(
                                        '${person.username}'
                                    )"
                                    title="Edit"
                                >

                                    <i
                                        class="fa-solid fa-pen"
                                    ></i>

                                </button>


                                <button
                                    onclick="deleteUser(
                                        '${person.username}'
                                    )"
                                    title="Delete"
                                >

                                    <i
                                        class="fa-solid fa-trash"
                                    ></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                    `;

                }
            )
            .join("");

}


// ============================================
// CLASSES TABLE
// ============================================

function renderClasses() {

    const table =
        document.getElementById(
            "classesBody"
        );


    if (!table) {

        return;

    }


    if (
        classes.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    No classes created.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        classes
            .map(
                function (classData) {

                    const studentCount =
                        users.filter(
                            function (student) {

                                return (
                                    student.role ===
                                    "student" &&
                                    student.classId ===
                                    classData.id
                                );

                            }
                        ).length;


                    const subjectCount =
                        subjects.filter(
                            function (subject) {

                                return (
                                    subject.classId ===
                                    classData.id
                                );

                            }
                        ).length;


                    const teacher =
                        getFaculty(
                            classData.teacherId
                        );


                    return `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    classData.name
                                )}
                            </strong>

                        </td>


                        <td>

                            ${escapeHTML(
                                classData.section
                            )}

                        </td>


                        <td>

                            ${studentCount}

                        </td>


                        <td>

                            ${subjectCount}

                        </td>


                        <td>

                            ${
                                teacher
                                    ? escapeHTML(
                                        teacher.name
                                    )
                                    : "Not assigned"
                            }

                        </td>


                        <td>

                            <div class="actions">

                                <button
                                    onclick="editClass(
                                        '${classData.id}'
                                    )"
                                    title="Edit"
                                >

                                    <i
                                        class="fa-solid fa-pen"
                                    ></i>

                                </button>


                                <button
                                    onclick="deleteClass(
                                        '${classData.id}'
                                    )"
                                    title="Delete"
                                >

                                    <i
                                        class="fa-solid fa-trash"
                                    ></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                    `;

                }
            )
            .join("");

}


// ============================================
// SUBJECTS TABLE
// ============================================

function renderSubjects() {

    const table =
        document.getElementById(
            "subjectsBody"
        );


    if (!table) {

        return;

    }


    if (
        subjects.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty"
                >
                    No subjects created.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        subjects
            .map(
                function (subject) {

                    const classData =
                        getClass(
                            subject.classId
                        );


                    const faculty =
                        getFaculty(
                            subject.facultyId
                        );


                    return `

                    <tr>

                        <td>

                            ${escapeHTML(
                                subject.name
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                subject.code
                            )}

                        </td>


                        <td>

                            ${
                                classData
                                    ? escapeHTML(
                                        classData.name
                                    )
                                    : "—"
                            }

                        </td>


                        <td>

                            ${
                                faculty
                                    ? escapeHTML(
                                        faculty.name
                                    )
                                    : "—"
                            }

                        </td>


                        <td>

                            <div class="actions">

                                <button
                                    onclick="editSubject(
                                        '${subject.id}'
                                    )"
                                    title="Edit"
                                >

                                    <i
                                        class="fa-solid fa-pen"
                                    ></i>

                                </button>


                                <button
                                    onclick="deleteSubject(
                                        '${subject.id}'
                                    )"
                                    title="Delete"
                                >

                                    <i
                                        class="fa-solid fa-trash"
                                    ></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                    `;

                }
            )
            .join("");

}


// ============================================
// ATTENDANCE TABLE
// ============================================

function renderAttendance() {

    const table =
        document.getElementById(
            "attendanceBody"
        );


    if (!table) {

        return;

    }


    const search =
        (
            document.getElementById(
                "attendanceSearch"
            )?.value || ""
        )
            .toLowerCase()
            .trim();


    const classFilter =
        document.getElementById(
            "attendanceClassFilter"
        )?.value || "";


    const statusFilter =
        document.getElementById(
            "attendanceStatusFilter"
        )?.value || "";


    let records =
        [...attendanceRecords];


    records =
        records.filter(
            function (record) {

                const student =
                    getStudent(
                        record.studentId
                    );


                const subject =
                    getSubject(
                        record.subjectId
                    );


                const text =
                    (
                        student?.name ||
                        ""
                    ) +
                    " " +
                    (
                        subject?.name ||
                        ""
                    ) +
                    " " +
                    record.date;


                const matchesSearch =
                    !search ||
                    text
                        .toLowerCase()
                        .includes(search);


                const matchesClass =
                    !classFilter ||
                    student?.classId ===
                    classFilter;


                const matchesStatus =
                    !statusFilter ||
                    record.status ===
                    statusFilter;


                return (
                    matchesSearch &&
                    matchesClass &&
                    matchesStatus
                );

            }
        );


    // Newest first

    records.sort(
        function (a, b) {

            return b.date.localeCompare(
                a.date
            );

        }
    );


    if (
        records.length ===
        0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    No attendance records found.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        records
            .map(
                function (record) {

                    const student =
                        getStudent(
                            record.studentId
                        );


                    const classData =
                        getStudentClass(
                            student
                        );


                    const subject =
                        getSubject(
                            record.subjectId
                        );


                    const faculty =
                        getFaculty(
                            record.facultyId
                        );


                    const badge =
                        record.status ===
                        "Present"
                            ? "green"
                            : "red";


                    return `

                    <tr>

                        <td>

                            ${escapeHTML(
                                record.date
                            )}

                        </td>


                        <td>

                            ${
                                student
                                    ? escapeHTML(
                                        student.name
                                    )
                                    : escapeHTML(
                                        record.studentId
                                    )
                            }

                        </td>


                        <td>

                            ${
                                classData
                                    ? escapeHTML(
                                        classData.name
                                    )
                                    : "—"
                            }

                        </td>


                        <td>

                            ${
                                subject
                                    ? escapeHTML(
                                        subject.name
                                    )
                                    : "—"
                            }

                        </td>


                        <td>

                            ${
                                faculty
                                    ? escapeHTML(
                                        faculty.name
                                    )
                                    : "—"
                            }

                        </td>


                        <td>

                            <span
                                class="badge ${badge}"
                            >

                                ${escapeHTML(
                                    record.status
                                )}

                            </span>

                        </td>

                    </tr>

                    `;

                }
            )
            .join("");

}


// ============================================
// CLASS FILTER OPTIONS
// ============================================

function populateClassFilters() {

    const filters = [

        document.getElementById(
            "studentClassFilter"
        ),

        document.getElementById(
            "attendanceClassFilter"
        )

    ];


    filters.forEach(
        function (filter) {

            if (!filter) {

                return;

            }


            const oldValue =
                filter.value;


            filter.innerHTML =
                '<option value="">All classes</option>';


            classes.forEach(
                function (classData) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        classData.id;


                    option.textContent =
                        classData.name +
                        " - " +
                        classData.section;


                    filter.appendChild(
                        option
                    );

                }
            );


            filter.value =
                oldValue;

        }
    );

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        function (character) {

            const entities = {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            };


            return entities[
                character
            ];

        }
    );

}


// ============================================
// SIMPLE NOTIFICATION
// ============================================

function showAdminToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        alert(message);

        return;

    }


    toast.textContent =
        message;


    toast.className =
        "toast show " +
        type;


    clearTimeout(
        window.attendEaseToast
    );


    window.attendEaseToast =
        setTimeout(
            function () {

                toast.className =
                    "toast";

            },
            2500
        );

}


// ============================================
// MODAL
// ============================================

function openAdminModal(
    title,
    content
) {

    const modal =
        document.getElementById(
            "modal"
        );


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    const modalBody =
        document.getElementById(
            "modalBody"
        );


    if (!modal) {

        return;

    }


    modalTitle.textContent =
        title;


    modalBody.innerHTML =
        content;


    modal.classList.add(
        "show"
    );


    const closeButton =
        document.getElementById(
            "modalClose"
        );


    if (closeButton) {

        closeButton.onclick =
            closeAdminModal;

    }

}


function closeAdminModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// ============================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ============================================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "modal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeAdminModal();

        }

    }
);


// ============================================
// ADD STUDENT
// ============================================

function openAddStudentModal() {

    let classOptions =
        "";


    classes.forEach(
        function (classData) {

            classOptions += `

                <option
                    value="${classData.id}"
                >

                    ${escapeHTML(
                        classData.name
                    )}
                    -
                    ${escapeHTML(
                        classData.section
                    )}

                </option>

            `;

        }
    );


    openAdminModal(
        "Add Student",
        `

        <form id="addStudentForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Full Name
                    </label>

                    <input
                        class="input"
                        id="newStudentName"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Username
                    </label>

                    <input
                        class="input"
                        id="newStudentUsername"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Password
                    </label>

                    <input
                        class="input"
                        id="newStudentPassword"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Class
                    </label>

                    <select
                        class="select"
                        id="newStudentClass"
                        required
                    >

                        ${classOptions}

                    </select>

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Add Student
                </button>

            </div>

        </form>

        `
    );


    const form =
        document.getElementById(
            "addStudentForm"
        );


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "newStudentName"
                ).value.trim();


            const username =
                document.getElementById(
                    "newStudentUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "newStudentPassword"
                ).value;


            const classId =
                document.getElementById(
                    "newStudentClass"
                ).value;


            if (
                users.some(
                    function (user) {

                        return (
                            user.username ===
                            username
                        );

                    }
                )
            ) {

                showAdminToast(
                    "Username already exists.",
                    "error"
                );

                return;

            }


            users.push({

                username: username,

                password: password,

                name: name,

                role: "student",

                institutionCode:
                    institution.code,

                classId: classId

            });


            activityLog.unshift({

                text:
                    "Added student " +
                    name,

                time:
                    "Just now",

                icon:
                    "fa-user-plus"

            });


            saveAdminData();

            renderAdminDashboard();

            closeAdminModal();


            showAdminToast(
                "Student added successfully."
            );

        }
    );

}


// ============================================
// ADD FACULTY
// ============================================

function openAddFacultyModal() {

    openAdminModal(
        "Add Faculty",
        `

        <form id="addFacultyForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Full Name
                    </label>

                    <input
                        class="input"
                        id="newFacultyName"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Username
                    </label>

                    <input
                        class="input"
                        id="newFacultyUsername"
                        required
                    >

                </div>


                <div class="field full">

                    <label>
                        Password
                    </label>

                    <input
                        class="input"
                        id="newFacultyPassword"
                        required
                    >

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Add Faculty
                </button>

            </div>

        </form>

        `
    );


    const form =
        document.getElementById(
            "addFacultyForm"
        );


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "newFacultyName"
                ).value.trim();


            const username =
                document.getElementById(
                    "newFacultyUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "newFacultyPassword"
                ).value;


            if (
                users.some(
                    function (user) {

                        return (
                            user.username ===
                            username
                        );

                    }
                )
            ) {

                showAdminToast(
                    "Username already exists.",
                    "error"
                );

                return;

            }


            users.push({

                username: username,

                password: password,

                name: name,

                role: "faculty",

                institutionCode:
                    institution.code

            });


            activityLog.unshift({

                text:
                    "Added faculty " +
                    name,

                time:
                    "Just now",

                icon:
                    "fa-user-plus"

            });


            saveAdminData();

            renderAdminDashboard();

            closeAdminModal();


            showAdminToast(
                "Faculty added successfully."
            );

        }
    );

}


// ============================================
// VIEW STUDENT
// ============================================

function viewStudent(
    username
) {

    const student =
        getStudent(
            username
        );


    if (!student) {

        return;

    }


    const classData =
        getStudentClass(
            student
        );


    const records =
        getStudentAttendance(
            username
        );


    const percentage =
        calculateStudentAttendance(
            username
        );


    const present =
        records.filter(
            function (record) {

                return (
                    record.status ===
                    "Present"
                );

            }
        ).length;


    const absent =
        records.filter(
            function (record) {

                return (
                    record.status ===
                    "Absent"
                );

            }
        ).length;


    openAdminModal(
        "Student Details",
        `

        <div>

            <h3 style="margin-top:0">
                ${escapeHTML(
                    student.name
                )}
            </h3>


            <p>
                <strong>
                    Username:
                </strong>

                ${escapeHTML(
                    student.username
                )}
            </p>


            <p>
                <strong>
                    Class:
                </strong>

                ${
                    classData
                        ? escapeHTML(
                            classData.name
                        ) +
                        " - " +
                        escapeHTML(
                            classData.section
                        )
                        : "Unassigned"
                }
            </p>


            <p>
                <strong>
                    Attendance:
                </strong>

                ${percentage}%
            </p>


            <p>
                <strong>
                    Present:
                </strong>

                ${present}
            </p>


            <p>
                <strong>
                    Absent:
                </strong>

                ${absent}
            </p>


            <p>
                <strong>
                    Account Status:
                </strong>

                <span class="badge green">
                    Active
                </span>
            </p>

        </div>

        `
    );

}


// ============================================
// VIEW FACULTY
// ============================================

function viewFaculty(
    username
) {

    const faculty =
        getFaculty(
            username
        );


    if (!faculty) {

        return;

    }


    const assignedSubjects =
        subjects.filter(
            function (subject) {

                return (
                    subject.facultyId ===
                    username
                );

            }
        );


    let subjectHTML =
        "";


    assignedSubjects.forEach(
        function (subject) {

            const classData =
                getClass(
                    subject.classId
                );


            subjectHTML += `

                <li>

                    ${escapeHTML(
                        subject.name
                    )}

                    -

                    ${
                        classData
                            ? escapeHTML(
                                classData.name
                            )
                            : "Unknown class"
                    }

                </li>

            `;

        }
    );


    openAdminModal(
        "Faculty Details",
        `

        <h3 style="margin-top:0">
            ${escapeHTML(
                faculty.name
            )}
        </h3>


        <p>

            <strong>
                Username:
            </strong>

            ${escapeHTML(
                faculty.username
            )}

        </p>


        <p>

            <strong>
                Assigned Subjects:
            </strong>

        </p>


        ${
            subjectHTML
                ? `<ul>${subjectHTML}</ul>`
                : "<p>No subjects assigned.</p>"
        }


        <p>

            <strong>
                Account Status:
            </strong>

            <span class="badge green">
                Active
            </span>

        </p>

        `
    );

}


// ============================================
// EDIT STUDENT
// ============================================

function editStudent(
    username
) {

    const student =
        getStudent(
            username
        );


    if (!student) {

        return;

    }


    let classOptions =
        "";


    classes.forEach(
        function (classData) {

            classOptions += `

                <option
                    value="${classData.id}"
                    ${
                        student.classId ===
                        classData.id
                            ? "selected"
                            : ""
                    }
                >

                    ${escapeHTML(
                        classData.name
                    )}
                    -
                    ${escapeHTML(
                        classData.section
                    )}

                </option>

            `;

        }
    );


    openAdminModal(
        "Edit Student",
        `

        <form id="editStudentForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Full Name
                    </label>

                    <input
                        class="input"
                        id="editStudentName"
                        value="${escapeHTML(
                            student.name
                        )}"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Username
                    </label>

                    <input
                        class="input"
                        value="${escapeHTML(
                            student.username
                        )}"
                        disabled
                    >

                </div>


                <div class="field">

                    <label>
                        Password
                    </label>

                    <input
                        class="input"
                        id="editStudentPassword"
                        value="${escapeHTML(
                            student.password
                        )}"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Class
                    </label>

                    <select
                        class="select"
                        id="editStudentClass"
                    >

                        ${classOptions}

                    </select>

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Save Changes
                </button>

            </div>

        </form>

        `
    );


    document
        .getElementById(
            "editStudentForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                student.name =
                    document.getElementById(
                        "editStudentName"
                    ).value.trim();


                student.password =
                    document.getElementById(
                        "editStudentPassword"
                    ).value;


                student.classId =
                    document.getElementById(
                        "editStudentClass"
                    ).value;


                activityLog.unshift({

                    text:
                        "Updated student " +
                        student.name,

                    time:
                        "Just now",

                    icon:
                        "fa-user-pen"

                });


                saveAdminData();

                renderAdminDashboard();

                closeAdminModal();


                showAdminToast(
                    "Student updated."
                );

            }
        );

}


// ============================================
// EDIT FACULTY
// ============================================

function editFaculty(
    username
) {

    const faculty =
        getFaculty(
            username
        );


    if (!faculty) {

        return;

    }


    openAdminModal(
        "Edit Faculty",
        `

        <form id="editFacultyForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Full Name
                    </label>

                    <input
                        class="input"
                        id="editFacultyName"
                        value="${escapeHTML(
                            faculty.name
                        )}"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Username
                    </label>

                    <input
                        class="input"
                        value="${escapeHTML(
                            faculty.username
                        )}"
                        disabled
                    >

                </div>


                <div class="field full">

                    <label>
                        Password
                    </label>

                    <input
                        class="input"
                        id="editFacultyPassword"
                        value="${escapeHTML(
                            faculty.password
                        )}"
                        required
                    >

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Save Changes
                </button>

            </div>

        </form>

        `
    );


    document
        .getElementById(
            "editFacultyForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                faculty.name =
                    document.getElementById(
                        "editFacultyName"
                    ).value.trim();


                faculty.password =
                    document.getElementById(
                        "editFacultyPassword"
                    ).value;


                activityLog.unshift({

                    text:
                        "Updated faculty " +
                        faculty.name,

                    time:
                        "Just now",

                    icon:
                        "fa-user-pen"

                });


                saveAdminData();

                renderAdminDashboard();

                closeAdminModal();


                showAdminToast(
                    "Faculty updated."
                );

            }
        );

}


// ============================================
// DELETE USER
// ============================================

function deleteUser(
    username
) {

    const user =
        users.find(
            function (item) {

                return (
                    item.username ===
                    username
                );

            }
        );


    if (!user) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete " +
            user.name +
            "?"
        );


    if (!confirmed) {

        return;

    }


    const index =
        users.indexOf(
            user
        );


    users.splice(
        index,
        1
    );


    // Remove attendance connected
    // to this user

    attendanceRecords =
        attendanceRecords.filter(
            function (record) {

                return (
                    record.studentId !==
                    username &&
                    record.facultyId !==
                    username
                );

            }
        );


    // Remove subjects assigned
    // to deleted faculty

    subjects =
        subjects.filter(
            function (subject) {

                return (
                    subject.facultyId !==
                    username
                );

            }
        );


    activityLog.unshift({

        text:
            "Deleted " +
            user.role +
            " " +
            user.name,

        time:
            "Just now",

        icon:
            "fa-trash"

    });


    saveAdminData();

    renderAdminDashboard();


    showAdminToast(
        "User deleted."
    );

}


// ============================================
// ADD CLASS
// ============================================

function openAddClassModal() {

    let facultyOptions =
        '<option value="">Not assigned</option>';


    users
        .filter(
            function (user) {

                return (
                    user.role ===
                    "faculty"
                );

            }
        )
        .forEach(
            function (faculty) {

                facultyOptions += `

                    <option
                        value="${faculty.username}"
                    >

                        ${escapeHTML(
                            faculty.name
                        )}

                    </option>

                `;

            }
        );


    openAdminModal(
        "Create Class",
        `

        <form id="addClassForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Class Name
                    </label>

                    <input
                        class="input"
                        id="newClassName"
                        placeholder="CSE AI/ML 4"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Section
                    </label>

                    <input
                        class="input"
                        id="newClassSection"
                        placeholder="A"
                        required
                    >

                </div>


                <div class="field full">

                    <label>
                        Class Teacher
                    </label>

                    <select
                        class="select"
                        id="newClassTeacher"
                    >

                        ${facultyOptions}

                    </select>

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Create Class
                </button>

            </div>

        </form>

        `
    );


    document
        .getElementById(
            "addClassForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "newClassName"
                    ).value.trim();


                const section =
                    document.getElementById(
                        "newClassSection"
                    ).value.trim();


                const teacherId =
                    document.getElementById(
                        "newClassTeacher"
                    ).value;


                const id =
                    "class_" +
                    Date.now();


                classes.push({

                    id: id,

                    name: name,

                    section: section,

                    teacherId:
                        teacherId

                });


                activityLog.unshift({

                    text:
                        "Created class " +
                        name,

                    time:
                        "Just now",

                    icon:
                        "fa-book-open"

                });


                saveAdminData();

                renderAdminDashboard();

                closeAdminModal();


                showAdminToast(
                    "Class created successfully."
                );

            }
        );

}


// ============================================
// EDIT CLASS
// ============================================

function editClass(
    classId
) {

    const classData =
        getClass(
            classId
        );


    if (!classData) {

        return;

    }


    let facultyOptions =
        '<option value="">Not assigned</option>';


    users
        .filter(
            function (user) {

                return (
                    user.role ===
                    "faculty"
                );

            }
        )
        .forEach(
            function (faculty) {

                facultyOptions += `

                    <option
                        value="${faculty.username}"
                        ${
                            faculty.username ===
                            classData.teacherId
                                ? "selected"
                                : ""
                        }
                    >

                        ${escapeHTML(
                            faculty.name
                        )}

                    </option>

                `;

            }
        );


    openAdminModal(
        "Edit Class",
        `

        <form id="editClassForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Class Name
                    </label>

                    <input
                        class="input"
                        id="editClassName"
                        value="${escapeHTML(
                            classData.name
                        )}"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Section
                    </label>

                    <input
                        class="input"
                        id="editClassSection"
                        value="${escapeHTML(
                            classData.section
                        )}"
                        required
                    >

                </div>


                <div class="field full">

                    <label>
                        Class Teacher
                    </label>

                    <select
                        class="select"
                        id="editClassTeacher"
                    >

                        ${facultyOptions}

                    </select>

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Save Changes
                </button>

            </div>

        </form>

        `
    );


    document
        .getElementById(
            "editClassForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                classData.name =
                    document.getElementById(
                        "editClassName"
                    ).value.trim();


                classData.section =
                    document.getElementById(
                        "editClassSection"
                    ).value.trim();


                classData.teacherId =
                    document.getElementById(
                        "editClassTeacher"
                    ).value;


                saveAdminData();

                renderAdminDashboard();

                closeAdminModal();


                showAdminToast(
                    "Class updated."
                );

            }
        );

}


// ============================================
// DELETE CLASS
// ============================================

function deleteClass(
    classId
) {

    const classData =
        getClass(
            classId
        );


    if (!classData) {

        return;

    }


    const confirmed =
        confirm(
            "Delete class " +
            classData.name +
            " - " +
            classData.section +
            "?"
        );


    if (!confirmed) {

        return;

    }


    classes =
        classes.filter(
            function (item) {

                return (
                    item.id !==
                    classId
                );

            }
        );


    // Remove class assignment
    // from students

    users.forEach(
        function (user) {

            if (
                user.classId ===
                classId
            ) {

                delete user.classId;

            }

        }
    );


    // Remove subjects belonging
    // to this class

    subjects =
        subjects.filter(
            function (subject) {

                return (
                    subject.classId !==
                    classId
                );

            }
        );


    activityLog.unshift({

        text:
            "Deleted class " +
            classData.name,

        time:
            "Just now",

        icon:
            "fa-trash"

    });


    saveAdminData();

    renderAdminDashboard();


    showAdminToast(
        "Class deleted."
    );

}


// ============================================
// ADD SUBJECT
// ============================================

function openAddSubjectModal() {

    let classOptions =
        "";


    classes.forEach(
        function (classData) {

            classOptions += `

                <option
                    value="${classData.id}"
                >

                    ${escapeHTML(
                        classData.name
                    )}
                    -
                    ${escapeHTML(
                        classData.section
                    )}

                </option>

            `;

        }
    );


    let facultyOptions =
        "";


    users
        .filter(
            function (user) {

                return (
                    user.role ===
                    "faculty"
                );

            }
        )
        .forEach(
            function (faculty) {

                facultyOptions += `

                    <option
                        value="${faculty.username}"
                    >

                        ${escapeHTML(
                            faculty.name
                        )}

                    </option>

                `;

            }
        );


    openAdminModal(
        "Add Subject",
        `

        <form id="addSubjectForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Subject Name
                    </label>

                    <input
                        class="input"
                        id="newSubjectName"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Subject Code
                    </label>

                    <input
                        class="input"
                        id="newSubjectCode"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Class
                    </label>

                    <select
                        class="select"
                        id="newSubjectClass"
                        required
                    >

                        ${classOptions}

                    </select>

                </div>


                <div class="field">

                    <label>
                        Faculty
                    </label>

                    <select
                        class="select"
                        id="newSubjectFaculty"
                        required
                    >

                        ${facultyOptions}

                    </select>

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Add Subject
                </button>

            </div>

        </form>

        `
    );


    document
        .getElementById(
            "addSubjectForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "newSubjectName"
                    ).value.trim();


                const code =
                    document.getElementById(
                        "newSubjectCode"
                    ).value.trim();


                const classId =
                    document.getElementById(
                        "newSubjectClass"
                    ).value;


                const facultyId =
                    document.getElementById(
                        "newSubjectFaculty"
                    ).value;


                subjects.push({

                    id:
                        "subject_" +
                        Date.now(),

                    name: name,

                    code: code,

                    classId:
                        classId,

                    facultyId:
                        facultyId

                });


                activityLog.unshift({

                    text:
                        "Added subject " +
                        name,

                    time:
                        "Just now",

                    icon:
                        "fa-book"

                });


                saveAdminData();

                renderAdminDashboard();

                closeAdminModal();


                showAdminToast(
                    "Subject added successfully."
                );

            }
        );

}


// ============================================
// EDIT SUBJECT
// ============================================

function editSubject(
    subjectId
) {

    const subject =
        getSubject(
            subjectId
        );


    if (!subject) {

        return;

    }


    let classOptions =
        "";


    classes.forEach(
        function (classData) {

            classOptions += `

                <option
                    value="${classData.id}"
                    ${
                        subject.classId ===
                        classData.id
                            ? "selected"
                            : ""
                    }
                >

                    ${escapeHTML(
                        classData.name
                    )}
                    -
                    ${escapeHTML(
                        classData.section
                    )}

                </option>

            `;

        }
    );


    let facultyOptions =
        "";


    users
        .filter(
            function (user) {

                return (
                    user.role ===
                    "faculty"
                );

            }
        )
        .forEach(
            function (faculty) {

                facultyOptions += `

                    <option
                        value="${faculty.username}"
                        ${
                            subject.facultyId ===
                            faculty.username
                                ? "selected"
                                : ""
                        }
                    >

                        ${escapeHTML(
                            faculty.name
                        )}

                    </option>

                `;

            }
        );


    openAdminModal(
        "Edit Subject",
        `

        <form id="editSubjectForm">

            <div class="form-grid">

                <div class="field">

                    <label>
                        Subject Name
                    </label>

                    <input
                        class="input"
                        id="editSubjectName"
                        value="${escapeHTML(
                            subject.name
                        )}"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Subject Code
                    </label>

                    <input
                        class="input"
                        id="editSubjectCode"
                        value="${escapeHTML(
                            subject.code
                        )}"
                        required
                    >

                </div>


                <div class="field">

                    <label>
                        Class
                    </label>

                    <select
                        class="select"
                        id="editSubjectClass"
                    >

                        ${classOptions}

                    </select>

                </div>


                <div class="field">

                    <label>
                        Faculty
                    </label>

                    <select
                        class="select"
                        id="editSubjectFaculty"
                    >

                        ${facultyOptions}

                    </select>

                </div>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="btn secondary"
                    onclick="closeAdminModal()"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    class="btn"
                >
                    Save Changes
                </button>

            </div>

        </form>

        `
    );


    document
        .getElementById(
            "editSubjectForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                subject.name =
                    document.getElementById(
                        "editSubjectName"
                    ).value.trim();


                subject.code =
                    document.getElementById(
                        "editSubjectCode"
                    ).value.trim();


                subject.classId =
                    document.getElementById(
                        "editSubjectClass"
                    ).value;


                subject.facultyId =
                    document.getElementById(
                        "editSubjectFaculty"
                    ).value;


                saveAdminData();

                renderAdminDashboard();

                closeAdminModal();


                showAdminToast(
                    "Subject updated."
                );

            }
        );

}


// ============================================
// DELETE SUBJECT
// ============================================

function deleteSubject(
    subjectId
) {

    const subject =
        getSubject(
            subjectId
        );


    if (!subject) {

        return;

    }


    const confirmed =
        confirm(
            "Delete subject " +
            subject.name +
            "?"
        );


    if (!confirmed) {

        return;

    }


    subjects =
        subjects.filter(
            function (item) {

                return (
                    item.id !==
                    subjectId
                );

            }
        );


    // Remove attendance belonging
    // to this subject

    attendanceRecords =
        attendanceRecords.filter(
            function (record) {

                return (
                    record.subjectId !==
                    subjectId
                );

            }
        );


    activityLog.unshift({

        text:
            "Deleted subject " +
            subject.name,

        time:
            "Just now",

        icon:
            "fa-trash"

    });


    saveAdminData();

    renderAdminDashboard();


    showAdminToast(
        "Subject deleted."
    );

}
// ============================================
// ATTENDEASE ADMIN DASHBOARD
// PART 4
// ============================================


// ============================================
// MOBILE SIDEBAR
// ============================================

function setupMobileSidebar() {

    const menuButton =
        document.getElementById("menuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("overlay");


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");

            if (overlay) {
                overlay.classList.toggle("show");
            }

        }
    );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                sidebar.classList.remove("open");

                overlay.classList.remove("show");

            }
        );

    }

}


// ============================================
// CLOSE MODAL WITH ESCAPE
// ============================================

function setupKeyboardControls() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            closeAdminModal();


            const sidebar =
                document.getElementById("sidebar");

            const overlay =
                document.getElementById("overlay");


            if (sidebar) {
                sidebar.classList.remove("open");
            }


            if (overlay) {
                overlay.classList.remove("show");
            }

        }
    );

}


// ============================================
// REPORT GENERATOR
// ============================================

function generateAttendanceReport() {

    if (attendanceRecords.length === 0) {

        showAdminToast(
            "There is no attendance data to export.",
            "error"
        );

        return;

    }


    let csv =
        "Date,Student,Student ID,Class,Subject,Faculty,Status\n";


    attendanceRecords.forEach(
        function (record) {

            const student =
                getStudent(record.studentId);

            const classData =
                getStudentClass(student);

            const subject =
                getSubject(record.subjectId);

            const faculty =
                getFaculty(record.facultyId);


            const row = [

                record.date,

                student?.name || "",

                student?.username || record.studentId,

                classData
                    ? classData.name +
                      " - " +
                      classData.section
                    : "",

                subject?.name || "",

                faculty?.name || "",

                record.status

            ];


            csv +=
                row
                    .map(csvEscape)
                    .join(",") +
                "\n";

        }
    );


    downloadFile(
        "attendEase-attendance-report.csv",
        csv,
        "text/csv"
    );


    showAdminToast(
        "Attendance report downloaded."
    );

}


// ============================================
// CSV ESCAPE
// ============================================

function csvEscape(value) {

    const text =
        String(value ?? "");


    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n")
    ) {

        return (
            '"' +
            text.replace(
                /"/g,
                '""'
            ) +
            '"'
        );

    }


    return text;

}


// ============================================
// DOWNLOAD FILE
// ============================================

function downloadFile(
    filename,
    content,
    type
) {

    const blob =
        new Blob(
            [content],
            {
                type: type
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        filename;


    document.body.appendChild(link);


    link.click();


    link.remove();


    URL.revokeObjectURL(url);

}


// ============================================
// STUDENT REPORT
// ============================================

function generateStudentReport() {

    const students =
        users.filter(
            function (user) {

                return user.role === "student";

            }
        );


    if (students.length === 0) {

        showAdminToast(
            "No students available.",
            "error"
        );

        return;

    }


    let csv =
        "Student Name,Student ID,Class,Section,Attendance %,Present,Absent\n";


    students.forEach(
        function (student) {

            const classData =
                getStudentClass(student);

            const records =
                getStudentAttendance(
                    student.username
                );


            const present =
                records.filter(
                    function (record) {

                        return (
                            record.status ===
                            "Present"
                        );

                    }
                ).length;


            const absent =
                records.filter(
                    function (record) {

                        return (
                            record.status ===
                            "Absent"
                        );

                    }
                ).length;


            const percentage =
                calculateStudentAttendance(
                    student.username
                );


            const row = [

                student.name,

                student.username,

                classData?.name || "",

                classData?.section || "",

                percentage + "%",

                present,

                absent

            ];


            csv +=
                row
                    .map(csvEscape)
                    .join(",") +
                "\n";

        }
    );


    downloadFile(
        "attendEase-student-report.csv",
        csv,
        "text/csv"
    );


    showAdminToast(
        "Student report downloaded."
    );

}


// ============================================
// FACULTY REPORT
// ============================================

function generateFacultyReport() {

    const faculty =
        users.filter(
            function (user) {

                return user.role === "faculty";

            }
        );


    if (faculty.length === 0) {

        showAdminToast(
            "No faculty available.",
            "error"
        );

        return;

    }


    let csv =
        "Faculty Name,Faculty ID,Subjects,Classes\n";


    faculty.forEach(
        function (person) {

            const assignedSubjects =
                subjects.filter(
                    function (subject) {

                        return (
                            subject.facultyId ===
                            person.username
                        );

                    }
                );


            const subjectNames =
                assignedSubjects
                    .map(
                        function (subject) {

                            return subject.name;

                        }
                    )
                    .join(" | ");


            const classNames =
                [
                    ...new Set(
                        assignedSubjects
                            .map(
                                function (subject) {

                                    const classData =
                                        getClass(
                                            subject.classId
                                        );

                                    return classData
                                        ? classData.name +
                                          " - " +
                                          classData.section
                                        : null;

                                }
                            )
                            .filter(Boolean)
                    )
                ]
                    .join(" | ");


            const row = [

                person.name,

                person.username,

                subjectNames,

                classNames

            ];


            csv +=
                row
                    .map(csvEscape)
                    .join(",") +
                "\n";

        }
    );


    downloadFile(
        "attendEase-faculty-report.csv",
        csv,
        "text/csv"
    );


    showAdminToast(
        "Faculty report downloaded."
    );

}


// ============================================
// CLASS REPORT
// ============================================

function generateClassReport() {

    if (classes.length === 0) {

        showAdminToast(
            "No classes available.",
            "error"
        );

        return;

    }


    let csv =
        "Class,Section,Students,Subjects,Class Teacher\n";


    classes.forEach(
        function (classData) {

            const studentCount =
                users.filter(
                    function (user) {

                        return (
                            user.role === "student" &&
                            user.classId ===
                            classData.id
                        );

                    }
                ).length;


            const subjectList =
                subjects.filter(
                    function (subject) {

                        return (
                            subject.classId ===
                            classData.id
                        );

                    }
                );


            const teacher =
                getFaculty(
                    classData.teacherId
                );


            const row = [

                classData.name,

                classData.section,

                studentCount,

                subjectList.length,

                teacher?.name || ""

            ];


            csv +=
                row
                    .map(csvEscape)
                    .join(",") +
                "\n";

        }
    );


    downloadFile(
        "attendEase-class-report.csv",
        csv,
        "text/csv"
    );


    showAdminToast(
        "Class report downloaded."
    );

}


// ============================================
// REPORT BUTTONS
// ============================================

function setupReportButtons() {

    const attendanceReport =
        document.getElementById(
            "attendanceReportBtn"
        );


    if (attendanceReport) {

        attendanceReport.addEventListener(
            "click",
            generateAttendanceReport
        );

    }


    const studentReport =
        document.getElementById(
            "studentReportBtn"
        );


    if (studentReport) {

        studentReport.addEventListener(
            "click",
            generateStudentReport
        );

    }


    const facultyReport =
        document.getElementById(
            "facultyReportBtn"
        );


    if (facultyReport) {

        facultyReport.addEventListener(
            "click",
            generateFacultyReport
        );

    }


    const classReport =
        document.getElementById(
            "classReportBtn"
        );


    if (classReport) {

        classReport.addEventListener(
            "click",
            generateClassReport
        );

    }

}


// ============================================
// REFRESH DASHBOARD
// ============================================

function refreshAdminDashboard() {

    renderAdminDashboard();

    showAdminToast(
        "Dashboard refreshed."
    );

}


// ============================================
// REFRESH BUTTON
// ============================================

function setupRefreshButton() {

    const refreshButton =
        document.getElementById(
            "refreshBtn"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshAdminDashboard
        );

    }

}


// ============================================
// NOTIFICATION BUTTON
// ============================================

function setupNotificationButton() {

    const notificationButton =
        document.getElementById(
            "notificationBtn"
        );


    if (!notificationButton) {
        return;
    }


    notificationButton.addEventListener(
        "click",
        function () {

            const count =
                activityLog.length;


            if (count === 0) {

                showAdminToast(
                    "No new notifications."
                );

                return;

            }


            openAdminModal(
                "Notifications",
                `

                <div>

                    <p>
                        You have
                        <strong>
                            ${count}
                        </strong>
                        recent activity item(s).
                    </p>


                    <ul>

                        ${
                            activityLog
                                .slice(0, 5)
                                .map(
                                    function (
                                        item
                                    ) {

                                        return `

                                        <li>

                                            ${escapeHTML(
                                                item.text
                                            )}

                                        </li>

                                        `;

                                    }
                                )
                                .join("")
                        }

                    </ul>

                </div>

                `
            );

        }
    );

}


// ============================================
// SETTINGS
// ============================================

function setupSettings() {

    const institutionInput =
        document.getElementById(
            "settingInstitutionName"
        );


    const saveSettings =
        document.getElementById(
            "saveSettingsBtn"
        );


    if (
        !institutionInput ||
        !saveSettings
    ) {

        return;

    }


    institutionInput.value =
        institution.name;


    saveSettings.addEventListener(
        "click",
        function () {

            const newName =
                institutionInput
                    .value
                    .trim();


            if (!newName) {

                showAdminToast(
                    "Institution name cannot be empty.",
                    "error"
                );

                return;

            }


            institution.name =
                newName;


            localStorage.setItem(
                "attendEaseInstitution",
                JSON.stringify(
                    institution
                )
            );


            saveAdminData();

            renderDashboardWelcome();


            showAdminToast(
                "Settings saved."
            );

        }
    );

}


// ============================================
// RESET DEMO DATA
// ============================================

function resetDemoData() {

    const confirmed =
        confirm(
            "This will remove all changes made in the admin dashboard and restore the original demo data. Continue?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "attendEaseData"
    );


    localStorage.removeItem(
        "attendEaseInstitution"
    );


    localStorage.removeItem(
        "attendEaseUser"
    );


    location.reload();

}


// ============================================
// RESET BUTTON
// ============================================

function setupResetButton() {

    const resetButton =
        document.getElementById(
            "resetDemoBtn"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetDemoData
        );

    }

}


// ============================================
// EXPORT ALL DATA
// ============================================

function exportAllData() {

    const data = {

        institution:
            institution,

        users:
            users,

        classes:
            classes,

        subjects:
            subjects,

        attendanceRecords:
            attendanceRecords,

        activityLog:
            activityLog

    };


    downloadFile(

        "attendEase-backup.json",

        JSON.stringify(
            data,
            null,
            4
        ),

        "application/json"

    );


    showAdminToast(
        "Backup exported successfully."
    );

}


// ============================================
// IMPORT DATA FROM JSON
// ============================================

function importDataFile(
    file
) {

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !data.users ||
                    !data.classes ||
                    !data.subjects ||
                    !data.attendanceRecords
                ) {

                    throw new Error(
                        "Invalid backup file."
                    );

                }


                users =
                    data.users;

                classes =
                    data.classes;

                subjects =
                    data.subjects;

                attendanceRecords =
                    data.attendanceRecords;

                activityLog =
                    data.activityLog ||
                    [];


                if (data.institution) {

                    institution =
                        data.institution;

                }


                saveAdminData();


                localStorage.setItem(
                    "attendEaseInstitution",
                    JSON.stringify(
                        institution
                    )
                );


                renderAdminDashboard();


                showAdminToast(
                    "Backup imported successfully."
                );


            }

            catch (error) {

                console.error(
                    error
                );


                showAdminToast(
                    "Invalid backup file.",
                    "error"
                );

            }

        };


    reader.readAsText(
        file
    );

}


// ============================================
// IMPORT BUTTON
// ============================================

function setupImportButton() {

    const importButton =
        document.getElementById(
            "importDataBtn"
        );


    const fileInput =
        document.getElementById(
            "importDataInput"
        );


    if (
        !importButton ||
        !fileInput
    ) {

        return;

    }


    importButton.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        function () {

            importDataFile(
                fileInput.files[0]
            );


            fileInput.value =
                "";

        }
    );

}


// ============================================
// ADMIN SEARCH - GLOBAL
// ============================================

function setupGlobalSearch() {

    const searchInput =
        document.getElementById(
            "globalSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Enter"
            ) {

                return;

            }


            const value =
                searchInput
                    .value
                    .trim()
                    .toLowerCase();


            if (!value) {
                return;
            }


            const student =
                users.find(
                    function (user) {

                        return (
                            user.role ===
                            "student" &&
                            (
                                user.name
                                    .toLowerCase()
                                    .includes(value) ||
                                user.username
                                    .toLowerCase()
                                    .includes(value)
                            )
                        );

                    }
                );


            if (student) {

                showAdminPage(
                    "students"
                );


                const studentSearch =
                    document.getElementById(
                        "studentSearch"
                    );


                if (studentSearch) {

                    studentSearch.value =
                        value;

                    renderStudents();

                }


                return;

            }


            const faculty =
                users.find(
                    function (user) {

                        return (
                            user.role ===
                            "faculty" &&
                            (
                                user.name
                                    .toLowerCase()
                                    .includes(value) ||
                                user.username
                                    .toLowerCase()
                                    .includes(value)
                            )
                        );

                    }
                );


            if (faculty) {

                showAdminPage(
                    "faculty"
                );


                const facultySearch =
                    document.getElementById(
                        "facultySearch"
                    );


                if (facultySearch) {

                    facultySearch.value =
                        value;

                    renderFaculty();

                }


                return;

            }


            showAdminToast(
                "No matching student or faculty found.",
                "error"
            );

        }
    );

}


// ============================================
// FINAL ADMIN INITIALIZATION
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const adminDashboard =
            document.getElementById(
                "admin-dashboard"
            );


        if (!adminDashboard) {
            return;
        }


        const session =
            getUser();


        if (
            !session ||
            session.role !== "admin"
        ) {

            return;

        }


        setupMobileSidebar();

        setupKeyboardControls();

        setupReportButtons();

        setupRefreshButton();

        setupNotificationButton();

        setupSettings();

        setupResetButton();

        setupImportButton();

        setupGlobalSearch();

    }
);