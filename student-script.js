// ============================================================
// ATTENDEASE - STUDENT DASHBOARD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // 1. GET LOGIN SESSION
    // ========================================================

    const session = getUser();

    if (!session) {
        window.location.href = "index.html";
        return;
    }

    // Student dashboard is only for students
    if (session.role !== "student") {
        window.location.href = "index.html";
        return;
    }

    console.log("Student session:", session);


    // ========================================================
    // 2. GET DATA FROM LOCAL STORAGE
    // ========================================================

    let data;

    try {

        const saved =
            localStorage.getItem("attendEaseData");

        if (!saved) {
            console.error("AttendEase data not found.");
            return;
        }

        data = JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not load AttendEase data:",
            error
        );

        return;
    }


    const users =
        Array.isArray(data.users)
            ? data.users
            : [];

    const classes =
        Array.isArray(data.classes)
            ? data.classes
            : [];

    const subjects =
        Array.isArray(data.subjects)
            ? data.subjects
            : [];

    const attendanceRecords =
        Array.isArray(data.attendanceRecords)
            ? data.attendanceRecords
            : [];


    console.log("Users:", users);
    console.log("Classes:", classes);
    console.log("Subjects:", subjects);
    console.log(
        "Attendance records:",
        attendanceRecords
    );


    // ========================================================
    // 3. FIND LOGGED-IN STUDENT
    // ========================================================

    const student =
        users.find(function (user) {

            return (
                user.username ===
                session.username
            );

        });


    if (!student) {

        console.error(
            "Student not found:",
            session.username
        );

        return;
    }


    console.log(
        "Logged-in student:",
        student
    );


    // ========================================================
    // 4. BASIC STUDENT INFORMATION
    // ========================================================

    const studentId =
        student.username;

    const studentName =
        student.name;

    const classId =
        student.classId;


    const studentClass =
        classes.find(function (item) {

            return item.id === classId;

        });


    // ========================================================
    // 5. HELPER FUNCTION
    // ========================================================

    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value;

        }

    }


    // ========================================================
    // 6. PROFILE INFORMATION
    // ========================================================

    setText(
        "miniName",
        studentName
    );


    setText(
        "welcomeTitle",
        "Welcome back, " +
        studentName +
        "!"
    );


    setText(
        "welcomeText",
        "Here's an overview of your attendance and academic progress."
    );


    setText(
        "profileName",
        studentName
    );


    setText(
        "profileFullName",
        studentName
    );


    setText(
        "profileId",
        student.username
    );


    setText(
        "profileInstitution",
        student.institutionCode
    );


    setText(
        "profileClass",
        studentClass
            ? studentClass.name
            : "-"
    );


    setText(
        "profileSection",
        studentClass
            ? studentClass.section
            : "-"
    );


    // Avatar

    const initial =
        studentName
            .charAt(0)
            .toUpperCase();


    setText(
        "miniAvatar",
        initial
    );


    setText(
        "profileAvatar",
        initial
    );


    // ========================================================
    // 7. GET STUDENT'S SUBJECTS
    // ========================================================

    const studentSubjects =
        subjects.filter(function (subject) {

            return (
                subject.classId ===
                classId
            );

        });


    console.log(
        "Student subjects:",
        studentSubjects
    );


    // ========================================================
    // 8. GET STUDENT'S ATTENDANCE
    // ========================================================

    const studentAttendance =
        attendanceRecords.filter(
            function (record) {

                return (
                    record.studentId ===
                    studentId
                );

            }
        );


    console.log(
        "Student attendance:",
        studentAttendance
    );


    // ========================================================
    // 9. CALCULATE SUBJECT ATTENDANCE
    // ========================================================

    function getSubjectAttendance(
        subjectId
    ) {

        const records =
            studentAttendance.filter(
                function (record) {

                    return (
                        record.subjectId ===
                        subjectId
                    );

                }
            );


        const total =
            records.length;


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
            total === 0
                ? 0
                : (
                    present /
                    total
                ) * 100;


        return {

            total: total,

            present: present,

            absent: absent,

            percentage: percentage

        };

    }


    // ========================================================
    // 10. CALCULATE OVERALL ATTENDANCE
    // ========================================================

    const totalLectures =
        studentAttendance.length;


    const totalPresent =
        studentAttendance.filter(
            function (record) {

                return (
                    record.status ===
                    "Present"
                );

            }
        ).length;


    const totalAbsent =
        studentAttendance.filter(
            function (record) {

                return (
                    record.status ===
                    "Absent"
                );

            }
        ).length;


    const overallAttendance =
        totalLectures === 0
            ? 0
            : (
                totalPresent /
                totalLectures
            ) * 100;


    // ========================================================
    // 11. DISPLAY STATISTICS
    // ========================================================

    setText(
        "overallAttendance",
        overallAttendance.toFixed(1) +
        "%"
    );


    setText(
        "totalLectures",
        totalLectures
    );


    setText(
        "totalPresent",
        totalPresent
    );


    setText(
        "totalAbsent",
        totalAbsent
    );


    // ========================================================
    // 12. ATTENDANCE REQUIREMENT
    // ========================================================

    const REQUIRED =
        75;


    const requirementContainer =
        document.getElementById(
            "requirementContainer"
        );


    if (requirementContainer) {

        requirementContainer.innerHTML = "";


        if (
            studentSubjects.length === 0
        ) {

            requirementContainer.innerHTML = `

                <div class="empty">

                    <i class="fa-solid fa-book"></i>

                    No subjects found for your class.

                </div>

            `;

        } else {

            const grid =
                document.createElement(
                    "div"
                );


            grid.className =
                "requirement-grid";


            studentSubjects.forEach(
                function (subject) {

                    const stats =
                        getSubjectAttendance(
                            subject.id
                        );


                    // ------------------------------------
                    // Calculate lectures needed
                    // ------------------------------------

                    let lecturesNeeded =
                        0;


                    if (
                        stats.percentage <
                        REQUIRED &&
                        stats.total > 0
                    ) {

                        lecturesNeeded =
                            Math.ceil(
                                (
                                    (
                                        REQUIRED /
                                        100
                                    ) *
                                    stats.total
                                    -
                                    stats.present
                                )
                                /
                                (
                                    1 -
                                    (
                                        REQUIRED /
                                        100
                                    )
                                )
                            );

                    }


                    // ------------------------------------
                    // Calculate lectures that can be missed
                    // ------------------------------------

                    let canMiss =
                        0;


                    if (
                        stats.percentage >=
                        REQUIRED
                    ) {

                        canMiss =
                            Math.floor(
                                (
                                    stats.present /
                                    (
                                        REQUIRED /
                                        100
                                    )
                                )
                                -
                                stats.total
                            );

                    }


                    // ------------------------------------
                    // Badge
                    // ------------------------------------

                    let badgeClass =
                        "";

                    let badgeText =
                        "";


                    if (
                        stats.total === 0
                    ) {

                        badgeText =
                            "No Data";

                    }

                    else if (
                        stats.percentage >=
                        REQUIRED
                    ) {

                        badgeText =
                            "Requirement Met";

                    }

                    else if (
                        stats.percentage >=
                        65
                    ) {

                        badgeClass =
                            "warning";

                        badgeText =
                            "Below Required";

                    }

                    else {

                        badgeClass =
                            "danger";

                        badgeText =
                            "Attendance Low";

                    }


                    // ------------------------------------
                    // Result message
                    // ------------------------------------

                    let resultClass =
                        "";

                    let resultMessage =
                        "";


                    if (
                        stats.total === 0
                    ) {

                        resultMessage =
                            "No attendance has been recorded yet.";

                    }

                    else if (
                        stats.percentage >=
                        REQUIRED
                    ) {

                        resultClass =
                            "safe";


                        if (
                            canMiss > 0
                        ) {

                            resultMessage =
                                "✓ Minimum 75% attendance reached. " +
                                "You can miss up to " +
                                canMiss +
                                " lecture(s) and remain at 75%.";

                        }

                        else {

                            resultMessage =
                                "✓ Minimum 75% attendance requirement met.";

                        }

                    }

                    else {

                        resultClass =
                            "danger";


                        resultMessage =
                            "⚠ You need to attend the next " +
                            lecturesNeeded +
                            " lecture(s) continuously to reach 75%.";

                    }


                    // ------------------------------------
                    // Progress
                    // ------------------------------------

                    const progress =
                        Math.min(
                            stats.percentage,
                            100
                        );


                    // ------------------------------------
                    // CARD
                    // ------------------------------------

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "requirement-card";


                    card.innerHTML = `

                        <div class="requirement-top">

                            <div>

                                <div class="subject-title">
                                    ${subject.name}
                                </div>

                                <div class="subject-code">
                                    ${subject.code}
                                </div>

                            </div>

                            <div class="attendance-badge ${badgeClass}">
                                ${badgeText}
                            </div>

                        </div>


                        <div class="attendance-progress">

                            <div
                                class="progress-fill"
                                style="width:${progress}%"
                            ></div>

                        </div>


                        <div class="requirement-numbers">

                            <div class="number-box">

                                <strong>
                                    ${stats.percentage.toFixed(1)}%
                                </strong>

                                <span>
                                    Current
                                </span>

                            </div>


                            <div class="number-box">

                                <strong>
                                    ${stats.present}
                                </strong>

                                <span>
                                    Present
                                </span>

                            </div>


                            <div class="number-box">

                                <strong>
                                    ${stats.total}
                                </strong>

                                <span>
                                    Held
                                </span>

                            </div>

                        </div>


                        <div class="requirement-result ${resultClass}">

                            ${resultMessage}

                        </div>

                    `;


                    grid.appendChild(
                        card
                    );

                }
            );


            requirementContainer.appendChild(
                grid
            );

        }

    }


    // ========================================================
    // 13. RECENT ATTENDANCE
    // ========================================================

    const recentBody =
        document.getElementById(
            "recentAttendanceBody"
        );


    if (recentBody) {

        recentBody.innerHTML = "";


        const recent =
            [...studentAttendance]
                .sort(
                    function (a, b) {

                        return (
                            b.date.localeCompare(
                                a.date
                            )
                        );

                    }
                )
                .slice(
                    0,
                    8
                );


        if (
            recent.length === 0
        ) {

            recentBody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="empty"
                    >

                        <i class="fa-solid fa-calendar"></i>

                        No attendance records available.

                    </td>

                </tr>

            `;

        } else {

            recent.forEach(
                function (record) {

                    const subject =
                        subjects.find(
                            function (item) {

                                return (
                                    item.id ===
                                    record.subjectId
                                );

                            }
                        );


                    const faculty =
                        users.find(
                            function (user) {

                                return (
                                    user.username ===
                                    record.facultyId
                                );

                            }
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${record.date}
                        </td>

                        <td>
                            ${
                                subject
                                    ? subject.name
                                    : record.subjectId
                            }
                        </td>

                        <td>
                            ${
                                faculty
                                    ? faculty.name
                                    : record.facultyId
                            }
                        </td>

                        <td>

                            <span class="status ${
                                record.status ===
                                "Present"
                                    ? "present"
                                    : "absent"
                            }">

                                ${record.status}

                            </span>

                        </td>

                    `;


                    recentBody.appendChild(
                        row
                    );

                }
            );

        }

    }


    // ========================================================
    // 14. MY ATTENDANCE PAGE
    // ========================================================

    const attendanceContainer =
        document.getElementById(
            "attendanceContainer"
        );


    if (attendanceContainer) {

        attendanceContainer.innerHTML = "";


        const grid =
            document.createElement(
                "div"
            );


        grid.className =
            "requirement-grid";


        studentSubjects.forEach(
            function (subject) {

                const stats =
                    getSubjectAttendance(
                        subject.id
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                let badgeClass =
                    "";


                if (
                    stats.percentage <
                    65
                ) {

                    badgeClass =
                        "danger";

                }

                else if (
                    stats.percentage <
                    75
                ) {

                    badgeClass =
                        "warning";

                }


                card.className =
                    "requirement-card";


                card.innerHTML = `

                    <div class="requirement-top">

                        <div>

                            <div class="subject-title">
                                ${subject.name}
                            </div>

                            <div class="subject-code">
                                ${subject.code}
                            </div>

                        </div>

                        <div class="attendance-badge ${badgeClass}">

                            ${stats.percentage.toFixed(1)}%

                        </div>

                    </div>


                    <div class="attendance-progress">

                        <div
                            class="progress-fill"
                            style="width:${Math.min(
                                stats.percentage,
                                100
                            )}%"
                        ></div>

                    </div>


                    <div class="requirement-numbers">

                        <div class="number-box">

                            <strong>
                                ${stats.total}
                            </strong>

                            <span>
                                Held
                            </span>

                        </div>


                        <div class="number-box">

                            <strong>
                                ${stats.present}
                            </strong>

                            <span>
                                Present
                            </span>

                        </div>


                        <div class="number-box">

                            <strong>
                                ${stats.absent}
                            </strong>

                            <span>
                                Absent
                            </span>

                        </div>

                    </div>


                    <div class="requirement-result ${
                        stats.percentage >= 75
                            ? "safe"
                            : "danger"
                    }">

                        ${
                            stats.percentage >= 75
                                ? "✓ Minimum attendance requirement met."
                                : "⚠ Attendance is below the required 75%."
                        }

                    </div>

                `;


                grid.appendChild(
                    card
                );

            }
        );


        if (
            studentSubjects.length === 0
        ) {

            attendanceContainer.innerHTML = `

                <div class="empty">

                    <i class="fa-solid fa-chart-column"></i>

                    No subjects available.

                </div>

            `;

        } else {

            attendanceContainer.appendChild(
                grid
            );

        }

    }


    // ========================================================
    // 15. ATTENDANCE HISTORY
    // ========================================================

    const historyBody =
        document.getElementById(
            "historyBody"
        );


    if (historyBody) {

        historyBody.innerHTML = "";


        const history =
            [...studentAttendance]
                .sort(
                    function (a, b) {

                        return (
                            b.date.localeCompare(
                                a.date
                            )
                        );

                    }
                );


        if (
            history.length === 0
        ) {

            historyBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty"
                    >

                        <i class="fa-solid fa-clock-rotate-left"></i>

                        No attendance history available.

                    </td>

                </tr>

            `;

        } else {

            history.forEach(
                function (record) {

                    const subject =
                        subjects.find(
                            function (item) {

                                return (
                                    item.id ===
                                    record.subjectId
                                );

                            }
                        );


                    const faculty =
                        users.find(
                            function (user) {

                                return (
                                    user.username ===
                                    record.facultyId
                                );

                            }
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${record.date}
                        </td>

                        <td>
                            ${
                                subject
                                    ? subject.name
                                    : record.subjectId
                            }
                        </td>

                        <td>
                            ${
                                faculty
                                    ? faculty.name
                                    : record.facultyId
                            }
                        </td>

                        <td>
                            ${
                                studentClass
                                    ? studentClass.name +
                                      " - " +
                                      studentClass.section
                                    : "-"
                            }
                        </td>

                        <td>

                            <span class="status ${
                                record.status ===
                                "Present"
                                    ? "present"
                                    : "absent"
                            }">

                                ${record.status}

                            </span>

                        </td>

                    `;


                    historyBody.appendChild(
                        row
                    );

                }
            );

        }

    }


    // ========================================================
    // 16. MY SUBJECTS
    // ========================================================

    const subjectsContainer =
        document.getElementById(
            "subjectsContainer"
        );


    if (subjectsContainer) {

        subjectsContainer.innerHTML = "";


        if (
            studentSubjects.length === 0
        ) {

            subjectsContainer.innerHTML = `

                <div class="empty">

                    <i class="fa-solid fa-book"></i>

                    No subjects available.

                </div>

            `;

        } else {

            const grid =
                document.createElement(
                    "div"
                );


            grid.className =
                "subject-grid";


            studentSubjects.forEach(
                function (subject) {

                    const faculty =
                        users.find(
                            function (user) {

                                return (
                                    user.username ===
                                    subject.facultyId
                                );

                            }
                        );


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "subject-card";


                    card.innerHTML = `

                        <div class="subject-icon">

                            <i class="fa-solid fa-book"></i>

                        </div>


                        <h4>
                            ${subject.name}
                        </h4>


                        <p>
                            Code: ${subject.code}
                        </p>


                        <p
                            style="margin-top:7px;"
                        >

                            Faculty:
                            ${
                                faculty
                                    ? faculty.name
                                    : subject.facultyId
                            }

                        </p>

                    `;


                    grid.appendChild(
                        card
                    );

                }
            );


            subjectsContainer.appendChild(
                grid
            );

        }

    }


    // ========================================================
    // 17. PAGE NAVIGATION
    // ========================================================

    const links =
        document.querySelectorAll(
            ".side-link[data-page], .footer-link[data-page]"
        );


    const pages =
        document.querySelectorAll(
            ".page"
        );


    const pageInfo = {

        dashboard: [
            "Dashboard",
            "Track your attendance and academic progress."
        ],

        attendance: [
            "My Attendance",
            "Subject-wise attendance and requirements."
        ],

        history: [
            "Attendance History",
            "Complete record of your attendance."
        ],

        subjects: [
            "My Subjects",
            "Subjects assigned to your class."
        ],

        profile: [
            "My Profile",
            "View your student account details."
        ]

    };


    function showPage(
        pageName
    ) {

        pages.forEach(
            function (page) {

                page.classList.remove(
                    "active"
                );

            }
        );


        const page =
            document.getElementById(
                "page-" +
                pageName
            );


        if (page) {

            page.classList.add(
                "active"
            );

        }


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


        if (
            pageInfo[pageName]
        ) {

            setText(
                "pageTitle",
                pageInfo[pageName][0]
            );


            setText(
                "pageSubtitle",
                pageInfo[pageName][1]
            );

        }


        // Close mobile sidebar

        const sidebar =
            document.getElementById(
                "sidebar"
            );


        if (sidebar) {

            sidebar.classList.remove(
                "open"
            );

        }

    }


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    showPage(
                        link.dataset.page
                    );

                }
            );

        }
    );


    // ========================================================
    // 18. MOBILE MENU
    // ========================================================

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        menuBtn &&
        sidebar
    ) {

        menuBtn.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );

    }


    // ========================================================
    // 19. LOGOUT
    // ========================================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                logoutUser();

            }
        );

    }


    // ========================================================
    // 20. FINISHED
    // ========================================================

    console.log(
        "================================="
    );

    console.log(
        "AttendEase Student Dashboard Loaded"
    );

    console.log(
        "Student:",
        studentName
    );

    console.log(
        "Student ID:",
        studentId
    );

    console.log(
        "Class:",
        classId
    );

    console.log(
        "Subjects:",
        studentSubjects
    );

    console.log(
        "Attendance:",
        studentAttendance
    );

    console.log(
        "Overall:",
        overallAttendance.toFixed(1) +
        "%"
    );

    console.log(
        "================================="
    );

});