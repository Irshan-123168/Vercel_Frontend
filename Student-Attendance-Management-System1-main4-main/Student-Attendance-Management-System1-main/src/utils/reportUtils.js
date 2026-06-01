export const generateCSV = (dataItems) => {
    if (!dataItems || dataItems.length === 0) return "";
    const headers = ["Name", "Roll Number", "Class", "Status", "Last Sync Time"];
    const rows = dataItems.map(s => [
        s.name || "N/A",
        s.roll || "N/A",
        s.studentClass || "N/A",
        s.status || "N/A",
        s.time || "N/A"
    ].map(val => `"${val}"`).join(","));

    return [headers.join(","), ...rows].join("\n");
};

export const generateTextReport = (dataItems, reportType = 'General') => {
    if (!dataItems || dataItems.length === 0) return "No data available.";

    const presentCount = dataItems.filter(s => s.status === 'Present').length;
    const absentCount = dataItems.filter(s => s.status === 'Absent').length;
    const lateCount = dataItems.filter(s => s.status === 'Late').length;

    let reportText = `Sanjay Gandhi Polytechnic - Attendance Report\n`;
    reportText += `Generated on: ${new Date().toLocaleString()}\n`;
    reportText += `Report Type: ${reportType}\n`;
    reportText += `--------------------------------------------------\n`;
    reportText += `Summary:\n`;
    reportText += `Total Students: ${dataItems.length}\n`;
    reportText += `Present: ${presentCount}\n`;
    reportText += `Absent: ${absentCount}\n`;
    reportText += `Late/Delayed: ${lateCount}\n`;
    reportText += `--------------------------------------------------\n\n`;
    reportText += `Detailed Personnel List:\n`;

    const header = `Name`.padEnd(20) + " | " + `Roll`.padEnd(10) + " | " + `Class`.padEnd(15) + " | " + `Status`.padEnd(10) + "\n";
    reportText += header;

    dataItems.forEach(s => {
        const name = (s.name || "N/A").padEnd(20);
        const roll = (s.roll || "N/A").padEnd(10);
        const sClass = (s.studentClass || "N/A").padEnd(15);
        const status = (s.status || "N/A");
        reportText += `${name} | ${roll} | ${sClass} | ${status}\n`;
    });

    return reportText;
};

export const downloadFile = (content, fileName, type) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
};
