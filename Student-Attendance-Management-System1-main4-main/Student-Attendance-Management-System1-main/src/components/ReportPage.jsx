import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Download, Filter, Calendar, Search, ChevronRight, Activity, FileText } from 'lucide-react';
import { generateMasterTextReport } from '../utils/exportUtils';

const ReportPage = ({ records = [] }) => {
    const [reportType, setReportType] = useState('monthly');
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic stats based on records
    const stats = {
        integrity: records.length > 0 ? "99.9%" : "0.0%",
        logs: records.filter(r => r.status && r.status !== 'Unknown').length,
        presentRate: records.length > 0 
            ? ((records.filter(r => r.status === 'Present').length / records.length) * 100).toFixed(1) + "%"
            : "0%"
    };

    const filteredRecords = records.filter(r => 
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roll?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade space-y-8">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Analytics & Reports</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>System intelligence and academic data export</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <Filter size={18} />
                        Print View
                    </button>
                    <button 
                        className="btn btn-primary"
                        onClick={() => generateMasterTextReport(records)}
                    >
                        <FileText size={18} />
                        Export Master (.txt)
                    </button>
                </div>
            </header>

            {/* Config Hub */}
            <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="flex gap-2">
                    <ReportToggle label="Monthly Trace" active={reportType === 'monthly'} onClick={() => setReportType('monthly')} />
                    <ReportToggle label="Weekly Sync" active={reportType === 'weekly'} onClick={() => setReportType('weekly')} />
                    <ReportToggle label="Custom Node" active={reportType === 'custom'} onClick={() => setReportType('custom')} />
                </div>
                <div style={{ height: '30px', width: '1px', background: 'var(--border-color)' }}></div>
                <div className="flex items-center gap-4 flex-1">
                    <Calendar size={20} className="text-gray-400" />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Current Session Analytics</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Secondary Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <ReportStat icon={<Activity />} label="Sync Integrity" value={stats.integrity} color="#6366f1" />
                    <ReportStat icon={<FileBarChart />} label="Generated Logs" value={stats.logs} color="#10b981" />
                    <ReportStat icon={<Activity />} label="Avg Presence" value={stats.presentRate} color="#f59e0b" />
                    
                    <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '1rem' }}>Node Status</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                            {records.length > 0 
                                ? "All institutional nodes are currently synchronized with the central attendance ledger."
                                : "Awaiting synchronization with the central database pool."}
                        </p>
                    </div>
                </div>

                {/* Main Report View */}
                <div className="lg:col-span-3 card" style={{ padding: 0 }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 700 }}>Telemetry Data Stream</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input 
                                type="text" 
                                className="form-input" 
                                style={{ width: '200px', height: '36px', paddingLeft: '2.5rem', fontSize: '0.8125rem' }} 
                                placeholder="Filter entries..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="table-container" style={{ border: 'none', maxHeight: '500px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Ref</th>
                                    <th>Branch/Sem</th>
                                     <th>Subject</th>
                                    <th>Status</th>
                                    <th>Performance</th>
                                    <th>Timestamp</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <ReportRow 
                                            key={record.id} 
                                            name={record.name} 
                                            roll={record.roll} 
                                            status={record.status} 
                                            time={record.time} 
                                            branch={record.branch}
                                            semester={record.semester}
                                            subject={record.subject}
                                            presentCount={record.presentCount}
                                            absentCount={record.absentCount}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)', fontWeight: 600 }}>
                                            No telemetry data found for the current query.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportToggle = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        style={{ 
            padding: '0.625rem 1.25rem', borderRadius: '10px', 
            background: active ? 'var(--primary-gradient)' : 'transparent',
            color: active ? 'white' : 'var(--text-secondary)',
            fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
        }}
    >
        {label}
    </button>
);

const ReportStat = ({ icon, label, value, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
        <div style={{ color }}>{icon}</div>
        <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)' }}>{label}</p>
            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{value}</p>
        </div>
    </div>
);

const ReportRow = ({ name, roll, status, time, branch, semester, subject, presentCount = 0, absentCount = 0 }) => {
    const total = presentCount + absentCount;
    const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0.0';
    
    return (
        <tr>
            <td>
                <div style={{ fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{roll}</div>
            </td>
            <td>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{branch || 'General'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>SEM-{semester || '1'}</div>
            </td>
            <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{subject || '-'}</td>
            <td>
                <span className={`badge ${status === 'Present' ? 'badge-success' : status === 'Absent' ? 'badge-danger' : 'badge-info'}`}>
                    {status || 'Pending'}
                </span>
            </td>
            <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '0.85rem' }}>{percentage}%</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 600 }}>P:{presentCount} A:{absentCount}</span>
                </div>
            </td>
            <td style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.8rem' }}>{time || '-'}</td>
            <td>
                <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>
                    <ChevronRight size={20} />
                </button>
            </td>
        </tr>
    );
};

export default ReportPage;
