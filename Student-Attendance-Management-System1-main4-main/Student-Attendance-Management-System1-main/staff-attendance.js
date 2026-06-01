// Sample student data
const students = [
    { id: 1, registerNumber: 'CS001', name: 'Alice Johnson', class: 'CSE-A' },
    { id: 2, registerNumber: 'CS002', name: 'Bob Smith', class: 'CSE-A' },
    { id: 3, registerNumber: 'CS003', name: 'Charlie Brown', class: 'CSE-A' },
    { id: 4, registerNumber: 'CS004', name: 'Diana Prince', class: 'CSE-A' },
    { id: 5, registerNumber: 'CS005', name: 'Ethan Hunt', class: 'CSE-A' },
    { id: 6, registerNumber: 'CS006', name: 'Fiona Green', class: 'CSE-A' },
    { id: 7, registerNumber: 'CS007', name: 'George Wilson', class: 'CSE-A' },
    { id: 8, registerNumber: 'CS008', name: 'Hannah Lee', class: 'CSE-A' },
];

let attendanceRecords = {};
let filteredStudents = [...students];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Set current date
    document.getElementById('date').valueAsDate = new Date();

    // Initialize attendance records (all present by default)
    students.forEach(student => {
        attendanceRecords[student.id] = {
            status: 'present',
            remarks: ''
        };
    });

    // Render table
    renderTable();
    updateStatistics();
    updateTime();

    // Update time every second
    setInterval(updateTime, 1000);

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
});

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('currentTime').textContent = timeString;
}

function renderTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    if (filteredStudents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <h3>No students found</h3>
                    <p>Try adjusting your search query</p>
                </td>
            </tr>
        `;
        return;
    }

    filteredStudents.forEach((student, index) => {
        const record = attendanceRecords[student.id];
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="register-number">${student.registerNumber}</span></td>
            <td>${student.name}</td>
            <td>
                <div class="status-buttons">
                    <button 
                        class="status-btn ${record.status === 'present' ? 'active-present' : ''}" 
                        onclick="markAttendance(${student.id}, 'present')"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Present
                    </button>
                    <button 
                        class="status-btn ${record.status === 'absent' ? 'active-absent' : ''}" 
                        onclick="markAttendance(${student.id}, 'absent')"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Absent
                    </button>
                </div>
            </td>
            <td>
                <input 
                    type="text" 
                    class="remarks-input" 
                    placeholder="Add remarks..." 
                    value="${record.remarks}"
                    onchange="updateRemarks(${student.id}, this.value)"
                >
            </td>
        `;

        tbody.appendChild(row);
    });
}

function markAttendance(studentId, status) {
    attendanceRecords[studentId].status = status;
    renderTable();
    updateStatistics();
}

function updateRemarks(studentId, remarks) {
    attendanceRecords[studentId].remarks = remarks;
}

function markAllPresent() {
    students.forEach(student => {
        attendanceRecords[student.id].status = 'present';
    });
    renderTable();
    updateStatistics();
}

function markAllAbsent() {
    students.forEach(student => {
        attendanceRecords[student.id].status = 'absent';
    });
    renderTable();
    updateStatistics();
}

function updateStatistics() {
    const present = Object.values(attendanceRecords).filter(r => r.status === 'present').length;
    const absent = Object.values(attendanceRecords).filter(r => r.status === 'absent').length;
    const total = students.length;

    document.getElementById('presentCount').textContent = present;
    document.getElementById('absentCount').textContent = absent;
    document.getElementById('totalCount').textContent = total;

    const presentPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    const absentPercentage = total > 0 ? ((absent / total) * 100).toFixed(1) : 0;

    document.getElementById('presentPercentage').textContent = `${presentPercentage}% of total`;
    document.getElementById('absentPercentage').textContent = `${absentPercentage}% of total`;
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.registerNumber.toLowerCase().includes(query)
    );
    renderTable();
}

function submitAttendance() {
    const form = document.getElementById('attendanceForm');

    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitBtn');

    // Prepare attendance data
    const attendanceData = {
        date: formData.get('date'),
        subject: formData.get('subject'),
        class: formData.get('class'),
        period: formData.get('period'),
        faculty: formData.get('faculty'),
        timestamp: new Date().toISOString(),
        records: students.map(student => ({
            studentId: student.id,
            registerNumber: student.registerNumber,
            name: student.name,
            status: attendanceRecords[student.id].status,
            remarks: attendanceRecords[student.id].remarks
        }))
    };

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Submitting...
    `;

    // Simulate API call
    setTimeout(() => {
        console.log('Submitting attendance:', attendanceData);

        // TODO: Replace with actual API call
        // fetch('http://localhost:5000/api/attendance/submit', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(attendanceData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     showSuccess();
        // })
        // .catch(error => {
        //     alert('Error submitting attendance: ' + error.message);
        // });

        showSuccess();

        // Reset button
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Submit Attendance
        `;
    }, 1500);
}

function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

function exportToCSV() {
    const form = document.getElementById('attendanceForm');
    const formData = new FormData(form);

    const headers = ['S.No', 'Register Number', 'Student Name', 'Status', 'Remarks'];
    const rows = students.map((student, index) => {
        const record = attendanceRecords[student.id];
        return [
            index + 1,
            student.registerNumber,
            student.name,
            record.status,
            record.remarks || ''
        ];
    });

    const csvContent = [
        `Attendance Report - ${formData.get('subject') || 'N/A'} - ${formData.get('date') || 'N/A'}`,
        `Class: ${formData.get('class') || 'N/A'}, Period: ${formData.get('period') || 'N/A'}`,
        '',
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${formData.get('date')}_${formData.get('subject')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + S to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        submitAttendance();
    }

    // Ctrl/Cmd + P to mark all present
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        markAllPresent();
    }

    // Ctrl/Cmd + A to mark all absent (in table context)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        markAllAbsent();
    }
});

// Prevent accidental page close
window.addEventListener('beforeunload', function (e) {
    const hasChanges = Object.values(attendanceRecords).some(r => r.status || r.remarks);
    if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});
