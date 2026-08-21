// ======================================================
// ATTENDEASE - FACULTY DASHBOARD
// faculty-script.js
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // 1. GET LOGIN SESSION
    // ==================================================

    let session = null;

    try {
        session = getUser();
    } catch (error) {
        console.error("Could not get login session:", error);
    }

    if (!session || session.role !== "faculty") {
        window.location.href = "index.html";
        return;
    }


    // ==================================================
    // 2. GET ACTUAL ATTENDEASE DATA
    // ==================================================

    let data = {
        users: [],
        classes: [],
        subjects: [],
        attendanceRecords: [],
        activityLog: []
    };

    try {

        const savedData =
            localStorage.getItem("attendEaseData");

        if (savedData) {
            data = JSON.parse(savedData);
        }

    } catch (error) {
        console.error(
            "Error reading AttendEase data:",
            error
        );
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


    console.log("AttendEase data loaded:", data);


    // ==================================================
    // 3. FIND LOGGED-IN FACULTY
    // ==================================================

    const faculty =
        users.find(function (user) {

            return (
                user.username === session.username &&
                user.role === "faculty"
            );

        });


    if (!faculty) {

        console.error(
            "Faculty not found:",
            session.username
        );

        alert("Faculty account not found.");

        logoutUser();

        return;
    }


    console.log(
        "Logged in faculty:",
        faculty
    );


    // ==================================================
    // 4. BASIC HELPERS
    // ==================================================

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent =
                value ?? "-";
        }
    }


    function getFacultyId() {

        return (
            faculty.username ||
            faculty.id ||
            faculty.userId
        );

    }


    const facultyId =
        getFacultyId();


    // ==================================================
    // 5. GET FACULTY SUBJECTS
    // ==================================================
    // IMPORTANT:
    // Only subjects whose facultyId matches
    // the logged-in faculty are shown.
    // ==================================================

    const mySubjects =
        subjects.filter(function (subject) {

            return (
                subject.facultyId === facultyId
            );

        });


    console.log(
        "Subjects assigned to",
        facultyId,
        ":",
        mySubjects
    );


    // ==================================================
    // 6. GET FACULTY CLASSES
    // ==================================================
    // Classes are obtained from the faculty's subjects.
    // This avoids giving every faculty every class.
    // ==================================================

    const myClassIds =
        [
            ...new Set(
                mySubjects
                    .map(function (subject) {
                        return subject.classId;
                    })
                    .filter(Boolean)
            )
        ];


    const myClasses =
        classes.filter(function (classItem) {

            return myClassIds.includes(
                classItem.id
            );

        });


    console.log(
        "Classes assigned to",
        facultyId,
        ":",
        myClasses
    );


    // ==================================================
    // 7. GET FACULTY STUDENTS
    // ==================================================

    const myStudents =
        users.filter(function (user) {

            if (user.role !== "student") {
                return false;
            }

            return myClassIds.includes(
                user.classId
            );

        });


    console.log(
        "Students assigned to",
        facultyId,
        ":",
        myStudents
    );


    // ==================================================
    // 8. FACULTY INFORMATION
    // ==================================================

    const facultyName =
        faculty.name ||
        faculty.username ||
        "Faculty";


    setText(
        "facultyName",
        facultyName
    );


    setText(
        "welcomeTitle",
        "Welcome back, " +
        facultyName +
        "!"
    );


    setText(
        "welcomeText",
        "Here's an overview of your faculty account."
    );


    setText(
        "infoName",
        facultyName
    );


    setText(
        "infoId",
        faculty.username
    );


    setText(
        "infoInstitution",
        faculty.institutionCode
    );


    setText(
        "infoRole",
        faculty.role
    );


    setText(
        "profileName",
        facultyName
    );


    setText(
        "profileId",
        faculty.username
    );


    setText(
        "profileInstitution",
        faculty.institutionCode
    );


    setText(
        "profileInstitutionName",
        faculty.institutionName ||
        faculty.institutionCode
    );


    setText(
        "profileRole",
        faculty.role
    );


    // Avatar

    const avatar =
        document.getElementById(
            "profileAvatar"
        );

    if (avatar) {

        avatar.textContent =
            facultyName
                .charAt(0)
                .toUpperCase();

    }


    // ==================================================
    // 9. DASHBOARD COUNTS
    // ==================================================

    setText(
        "classCount",
        myClasses.length
    );


    setText(
        "subjectCount",
        mySubjects.length
    );


    setText(
        "studentCount",
        myStudents.length
    );


    const myAttendance =
        attendanceRecords.filter(
            function (record) {

                return (
                    record.facultyId ===
                    facultyId
                );

            }
        );


    const uniqueSessions =
        new Set(
            myAttendance.map(
                function (record) {

                    return (
                        record.date +
                        "_" +
                        record.subjectId
                    );

                }
            )
        );


    setText(
        "sessionCount",
        uniqueSessions.size
    );


    // ==================================================
    // 10. CLASS NAME HELPER
    // ==================================================

    function getClassName(classId) {

        const classItem =
            classes.find(
                function (item) {

                    return (
                        item.id === classId
                    );

                }
            );


        if (!classItem) {
            return classId || "-";
        }


        return (
            classItem.name ||
            classItem.className ||
            classItem.id
        );

    }


    // ==================================================
    // 11. SUBJECT NAME HELPER
    // ==================================================

    function getSubjectName(subjectId) {

        const subject =
            subjects.find(
                function (item) {

                    return (
                        item.id === subjectId
                    );

                }
            );


        if (!subject) {
            return subjectId || "-";
        }


        return (
            subject.name ||
            subject.subjectName ||
            subject.code ||
            subject.id
        );

    }


    // ==================================================
    // 12. STUDENT NAME HELPER
    // ==================================================

    function getStudentName(studentId) {

        const student =
            users.find(
                function (user) {

                    return (
                        user.username === studentId ||
                        user.id === studentId ||
                        user.userId === studentId
                    );

                }
            );


        if (!student) {
            return studentId || "-";
        }


        return (
            student.name ||
            student.username
        );

    }


    // ==================================================
    // 13. DISPLAY CLASSES
    // ==================================================

    const classesContainer =
        document.getElementById(
            "classesContainer"
        );


    if (classesContainer) {

        classesContainer.innerHTML = "";


        if (myClasses.length === 0) {

            classesContainer.innerHTML = `
                <div class="empty">
                    <i class="fa-solid fa-school"></i>
                    No classes assigned.
                </div>
            `;

        } else {

            myClasses.forEach(
                function (classItem) {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className = "item";


                    div.innerHTML = `
                        <div class="item-icon">
                            <i class="fa-solid fa-school"></i>
                        </div>

                        <div>
                            <div class="item-title">
                                ${
                                    classItem.name ||
                                    classItem.className ||
                                    classItem.id
                                }
                            </div>

                            <div class="item-meta">
                                ${
                                    classItem.section
                                        ? "Section " +
                                          classItem.section
                                        : ""
                                }
                            </div>
                        </div>
                    `;


                    classesContainer.appendChild(
                        div
                    );

                }
            );

        }

    }


    // ==================================================
    // 14. DISPLAY SUBJECTS
    // ==================================================

    const subjectsContainer =
        document.getElementById(
            "subjectsContainer"
        );


    if (subjectsContainer) {

        subjectsContainer.innerHTML = "";


        if (mySubjects.length === 0) {

            subjectsContainer.innerHTML = `
                <div class="empty">
                    <i class="fa-solid fa-book"></i>
                    No subjects assigned.
                </div>
            `;

        } else {

            mySubjects.forEach(
                function (subject) {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className = "item";


                    div.innerHTML = `
                        <div class="item-icon">
                            <i class="fa-solid fa-book"></i>
                        </div>

                        <div>
                            <div class="item-title">
                                ${
                                    subject.name ||
                                    subject.subjectName ||
                                    subject.id
                                }
                            </div>

                            <div class="item-meta">
                                ${
                                    subject.code ||
                                    subject.id
                                }
                            </div>
                        </div>
                    `;


                    subjectsContainer.appendChild(
                        div
                    );

                }
            );

        }

    }


    // ==================================================
    // 15. SUBJECT PAGE
    // ==================================================

    const subjectsPageContainer =
        document.getElementById(
            "subjectsPageContainer"
        );


    if (subjectsPageContainer) {

        subjectsPageContainer.innerHTML = "";


        mySubjects.forEach(
            function (subject) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className = "item";


                div.innerHTML = `
                    <div class="item-icon">
                        <i class="fa-solid fa-book"></i>
                    </div>

                    <div>
                        <div class="item-title">
                            ${
                                subject.name ||
                                subject.subjectName ||
                                subject.id
                            }
                        </div>

                        <div class="item-meta">
                            Code:
                            ${
                                subject.code ||
                                subject.id
                            }
                        </div>
                    </div>
                `;


                subjectsPageContainer.appendChild(
                    div
                );

            }
        );

    }


    // ==================================================
    // 16. STUDENTS PAGE
    // ==================================================

    const studentsBody =
        document.getElementById(
            "studentsBody"
        );


    if (studentsBody) {

        studentsBody.innerHTML = "";


        if (myStudents.length === 0) {

            studentsBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty">
                        <i class="fa-solid fa-users"></i>
                        No students found.
                    </td>
                </tr>
            `;

        } else {

            myStudents.forEach(
                function (student) {

                    const classItem =
                        classes.find(
                            function (item) {

                                return (
                                    item.id ===
                                    student.classId
                                );

                            }
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `
                        <td>
                            <div class="student-name">
                                ${
                                    student.name ||
                                    student.username ||
                                    "-"
                                }
                            </div>
                        </td>

                        <td>
                            <div class="student-id">
                                ${
                                    student.username ||
                                    student.id ||
                                    "-"
                                }
                            </div>
                        </td>

                        <td>
                            ${
                                classItem
                                    ? (
                                        classItem.name ||
                                        classItem.className ||
                                        classItem.id
                                      )
                                    : student.classId
                            }
                        </td>

                        <td>
                            ${
                                classItem &&
                                classItem.section
                                    ? classItem.section
                                    : "-"
                            }
                        </td>
                    `;


                    studentsBody.appendChild(
                        row
                    );

                }
            );

        }

    }


    // ==================================================
    // 17. DROPDOWN HELPER
    // ==================================================

    function populateClassDropdown(
        selectId
    ) {

        const select =
            document.getElementById(
                selectId
            );


        if (!select) {
            return;
        }


        const firstOption =
            select.options[0];


        select.innerHTML = "";


        if (firstOption) {
            select.appendChild(
                firstOption
            );
        }


        myClasses.forEach(
            function (classItem) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    classItem.id;


                option.textContent =
                    (
                        classItem.name ||
                        classItem.className ||
                        classItem.id
                    ) +
                    (
                        classItem.section
                            ? " - Section " +
                              classItem.section
                            : ""
                    );


                select.appendChild(
                    option
                );

            }
        );

    }


    function populateSubjectDropdown(
        selectId
    ) {

        const select =
            document.getElementById(
                selectId
            );


        if (!select) {
            return;
        }


        const firstOption =
            select.options[0];


        select.innerHTML = "";


        if (firstOption) {
            select.appendChild(
                firstOption
            );
        }


        mySubjects.forEach(
            function (subject) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    subject.id;


                option.textContent =
                    (
                        subject.name ||
                        subject.subjectName ||
                        subject.code ||
                        subject.id
                    );


                select.appendChild(
                    option
                );

            }
        );

    }


    populateClassDropdown(
        "attendanceClass"
    );

    populateClassDropdown(
        "previousClass"
    );


    populateSubjectDropdown(
        "attendanceSubject"
    );

    populateSubjectDropdown(
        "previousSubject"
    );


    // ==================================================
    // 18. DATE
    // ==================================================

    const dateInput =
        document.getElementById(
            "attendanceDate"
        );


    if (dateInput) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        dateInput.value =
            `${year}-${month}-${day}`;

    }


    // ==================================================
    // 19. PAGE NAVIGATION
    // ==================================================

    const navLinks =
        document.querySelectorAll(
            ".side-link[data-page]"
        );


    const pages =
        document.querySelectorAll(
            ".page"
        );


    const pageInfo = {

        dashboard: [
            "Dashboard",
            "Manage your classes and attendance."
        ],

        attendance: [
            "Mark Attendance",
            "Record attendance for your students."
        ],

        previous: [
            "Previous Attendance",
            "View previously recorded attendance."
        ],

        students: [
            "My Students",
            "View students in your assigned classes."
        ],

        subjects: [
            "My Subjects",
            "View subjects assigned to you."
        ],

        profile: [
            "My Profile",
            "View your faculty account details."
        ]

    };


    function showPage(pageName) {

        pages.forEach(
            function (page) {

                page.classList.remove(
                    "active"
                );

            }
        );


        const page =
            document.getElementById(
                "page-" + pageName
            );


        if (page) {

            page.classList.add(
                "active"
            );

        }


        navLinks.forEach(
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


        if (pageInfo[pageName]) {

            setText(
                "pageTitle",
                pageInfo[pageName][0]
            );


            setText(
                "pageSubtitle",
                pageInfo[pageName][1]
            );

        }

    }


    navLinks.forEach(
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


    // ==================================================
    // 20. MOBILE MENU
    // ==================================================

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (menuBtn && sidebar) {

        menuBtn.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );

    }


    // ==================================================
    // 21. LOGOUT
    // ==================================================

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


    // ==================================================
    // 22. ATTENDANCE MESSAGE
    // ==================================================

    function attendanceMessage(
        text,
        type
    ) {

        const message =
            document.getElementById(
                "attendanceMessage"
            );


        if (!message) {
            return;
        }


        message.className =
            "message " + type;


        message.textContent =
            text;

    }


    // ==================================================
    // 23. LOAD STUDENTS
    // ==================================================

    const loadStudentsBtn =
        document.getElementById(
            "loadStudentsBtn"
        );


    const attendanceBody =
        document.getElementById(
            "attendanceBody"
        );


    function loadAttendanceStudents() {

        const classId =
            document.getElementById(
                "attendanceClass"
            )?.value;


        const subjectId =
            document.getElementById(
                "attendanceSubject"
            )?.value;


        if (!classId) {

            attendanceMessage(
                "Please select a class.",
                "error"
            );

            return;
        }


        if (!subjectId) {

            attendanceMessage(
                "Please select a subject.",
                "error"
            );

            return;
        }


        // IMPORTANT:
        // Check that this subject actually belongs
        // to this faculty.
        const allowedSubject =
            mySubjects.find(
                function (subject) {

                    return (
                        subject.id ===
                        subjectId
                    );

                }
            );


        if (!allowedSubject) {

            attendanceMessage(
                "You are not assigned to this subject.",
                "error"
            );

            return;
        }


        // Check subject/class combination
        if (
            allowedSubject.classId &&
            allowedSubject.classId !== classId
        ) {

            attendanceMessage(
                "This subject is not assigned to the selected class.",
                "error"
            );

            return;
        }


        const students =
            myStudents.filter(
                function (student) {

                    return (
                        student.classId ===
                        classId
                    );

                }
            );


        attendanceBody.innerHTML = "";


        if (students.length === 0) {

            attendanceBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty">
                        <i class="fa-solid fa-users"></i>
                        No students found for this class.
                    </td>
                </tr>
            `;

            return;
        }


        students.forEach(
            function (student, index) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.dataset.studentId =
                    student.username ||
                    student.id ||
                    student.userId;


                row.innerHTML = `
                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <div class="student-name">
                            ${
                                student.name ||
                                student.username ||
                                "-"
                            }
                        </div>
                    </td>

                    <td>
                        <div class="student-id">
                            ${
                                student.username ||
                                student.id ||
                                "-"
                            }
                        </div>
                    </td>

                    <td>

                        <div class="attendance-options">

                            <button
                                type="button"
                                class="attendance-btn present"
                                data-status="Present"
                            >
                                Present
                            </button>

                            <button
                                type="button"
                                class="attendance-btn absent"
                                data-status="Absent"
                            >
                                Absent
                            </button>

                        </div>

                    </td>
                `;


                attendanceBody.appendChild(
                    row
                );

            }
        );


        attendanceBody
            .querySelectorAll(
                ".attendance-btn"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const row =
                                button.closest(
                                    "tr"
                                );


                            row
                                .querySelectorAll(
                                    ".attendance-btn"
                                )
                                .forEach(
                                    function (btn) {

                                        btn.classList.remove(
                                            "active"
                                        );

                                    }
                                );


                            button.classList.add(
                                "active"
                            );

                        }
                    );

                }
            );


        attendanceMessage(
            students.length +
            " student(s) loaded.",
            "success"
        );

    }


    if (loadStudentsBtn) {

        loadStudentsBtn.addEventListener(
            "click",
            loadAttendanceStudents
        );

    }


    // ==================================================
    // 24. MARK ALL PRESENT
    // ==================================================

    const markAllPresent =
        document.getElementById(
            "markAllPresent"
        );


    if (markAllPresent) {

        markAllPresent.addEventListener(
            "click",
            function () {

                const buttons =
                    document.querySelectorAll(
                        "#attendanceBody .present"
                    );


                if (buttons.length === 0) {

                    attendanceMessage(
                        "Load students first.",
                        "error"
                    );

                    return;
                }


                buttons.forEach(
                    function (button) {

                        const row =
                            button.closest(
                                "tr"
                            );


                        row
                            .querySelectorAll(
                                ".attendance-btn"
                            )
                            .forEach(
                                function (btn) {

                                    btn.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );

                    }
                );


                attendanceMessage(
                    "All students marked Present.",
                    "success"
                );

            }
        );

    }


    // ==================================================
    // 25. MARK ALL ABSENT
    // ==================================================

    const markAllAbsent =
        document.getElementById(
            "markAllAbsent"
        );


    if (markAllAbsent) {

        markAllAbsent.addEventListener(
            "click",
            function () {

                const buttons =
                    document.querySelectorAll(
                        "#attendanceBody .absent"
                    );


                if (buttons.length === 0) {

                    attendanceMessage(
                        "Load students first.",
                        "error"
                    );

                    return;
                }


                buttons.forEach(
                    function (button) {

                        const row =
                            button.closest(
                                "tr"
                            );


                        row
                            .querySelectorAll(
                                ".attendance-btn"
                            )
                            .forEach(
                                function (btn) {

                                    btn.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );

                    }
                );


                attendanceMessage(
                    "All students marked Absent.",
                    "success"
                );

            }
        );

    }


    // ==================================================
    // 26. SAVE ATTENDANCE - TEMPORARILY VALIDATION ONLY
    // ==================================================

    const saveAttendanceBtn =
        document.getElementById(
            "saveAttendanceBtn"
        );


    if (saveAttendanceBtn) {

        saveAttendanceBtn.addEventListener(
            "click",
            function () {

                const rows =
                    document.querySelectorAll(
                        "#attendanceBody tr[data-student-id]"
                    );


                if (rows.length === 0) {

                    attendanceMessage(
                        "Load students first.",
                        "error"
                    );

                    return;
                }


                let unmarked = 0;


                rows.forEach(
                    function (row) {

                        const selected =
                            row.querySelector(
                                ".attendance-btn.active"
                            );


                        if (!selected) {
                            unmarked++;
                        }

                    }
                );


                if (unmarked > 0) {

                    attendanceMessage(
                        unmarked +
                        " student(s) are not marked.",
                        "error"
                    );

                    return;
                }


                attendanceMessage(
                    "Attendance is completely marked. Saving will be connected next.",
                    "success"
                );

            }
        );

    }


    // ==================================================
    // 27. PREVIOUS ATTENDANCE
    // ==================================================

    const loadPreviousBtn =
        document.getElementById(
            "loadPreviousBtn"
        );


    const previousBody =
        document.getElementById(
            "previousAttendanceBody"
        );


    if (loadPreviousBtn) {

        loadPreviousBtn.addEventListener(
            "click",
            function () {

                const classId =
                    document.getElementById(
                        "previousClass"
                    )?.value;


                const subjectId =
                    document.getElementById(
                        "previousSubject"
                    )?.value;


                const date =
                    document.getElementById(
                        "previousDate"
                    )?.value;


                const records =
                    attendanceRecords.filter(
                        function (record) {

                            return (
                                record.facultyId ===
                                    facultyId &&

                                (
                                    !classId ||
                                    record.classId ===
                                        classId
                                ) &&

                                (
                                    !subjectId ||
                                    record.subjectId ===
                                        subjectId
                                ) &&

                                (
                                    !date ||
                                    record.date ===
                                        date
                                )
                            );

                        }
                    );


                previousBody.innerHTML = "";


                if (records.length === 0) {

                    previousBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="empty">
                                <i class="fa-solid fa-clock-rotate-left"></i>
                                No attendance records found.
                            </td>
                        </tr>
                    `;

                    return;
                }


                records.forEach(
                    function (record) {

                        const row =
                            document.createElement(
                                "tr"
                            );


                        row.innerHTML = `
                            <td>
                                ${record.date || "-"}
                            </td>

                            <td>
                                ${
                                    getStudentName(
                                        record.studentId
                                    )
                                }
                            </td>

                            <td>
                                ${
                                    getClassName(
                                        record.classId
                                    )
                                }
                            </td>

                            <td>
                                ${
                                    getSubjectName(
                                        record.subjectId
                                    )
                                }
                            </td>

                            <td>
                                ${record.status || "-"}
                            </td>
                        `;


                        previousBody.appendChild(
                            row
                        );

                    }
                );

            }
        );

    }


    // ==================================================
    // FINAL LOG
    // ==================================================

    console.log(
        "===================================="
    );

    console.log(
        "AttendEase Faculty Dashboard READY"
    );

    console.log(
        "Faculty:",
        facultyName
    );

    console.log(
        "Faculty ID:",
        facultyId
    );

    console.log(
        "Assigned Subjects:",
        mySubjects
    );

    console.log(
        "Assigned Classes:",
        myClasses
    );

    console.log(
        "Assigned Students:",
        myStudents
    );

    console.log(
        "===================================="
    );

});