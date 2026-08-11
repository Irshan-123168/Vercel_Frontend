export const downloadCSV = (data, filename, headers) => {
    if (!data || !data.length) return;

    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header.toLowerCase()] || '';
            const escaped = ('' + val).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generateStudentReport = (students) => {
    const headers = ['Name', 'Roll', 'Branch', 'Semester', 'Subject', 'Status', 'Time'];
    const filename = `Student_Report_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(students, filename, headers);
};

export const generateRegistryExport = (students) => {
    const headers = ['Name', 'Roll', 'Branch', 'Semester'];
    const filename = `Student_Registry_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(students, filename, headers);
};

export const generateMasterReport = (students) => {
    const headers = ['Name', 'Roll', 'Branch', 'Semester', 'Subject', 'Status', 'Time'];
    const filename = `Master_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(students, filename, headers);
};

export const downloadTXT = (data, filename) => {
    if (!data || !data.length) return;

    let content = "MASTER ATTENDANCE REPORT\n";
    content += `DATE: ${new Date().toLocaleDateString()}\n`;
    content += "=".repeat(50) + "\n\n";
    
    data.forEach((s, idx) => {
        content += `${idx + 1}. NAME: ${s.name}\n`;
        content += `   ROLL: ${s.roll}\n`;
        content += `   BRANCH: ${s.branch || 'N/A'}\n`;
        content += `   SEM: ${s.semester || 'N/A'}\n`;
        content += `   SUBJECT: ${s.subject || 'N/A'}\n`;
        content += `   STATUS: ${s.status || 'Pending'}\n`;
        content += `   TIME: ${s.time || '-'}\n`;
        content += "-".repeat(30) + "\n";
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generateMasterTextReport = (students) => {
    const filename = `Master_Report_${new Date().toISOString().split('T')[0]}.txt`;
    downloadTXT(students, filename);
};
