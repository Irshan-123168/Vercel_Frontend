import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, UserCheck, Calendar, FileText, PieChart, Download, CheckCircle, Eye, Lock, Send, XCircle, Trash2 } from 'lucide-react';
import { generateStudentReport, generateRegistryExport } from '../utils/exportUtils';
import ClassSchedule from './ClassSchedule';
import { api } from '../api';

const StudentDashboard = ({ user, students = [], onNavigate, searchQuery = '', settings, setSettings, onDeleteAccount }) => {
    const [showRegistryPopup, setShowRegistryPopup] = useState(false);
    const [isUpdatingKey, setIsUpdatingKey] = useState(false);
    const [oldKey, setOldKey] = useState('');
    const [newKey, setNewKey] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleUpdateKey = async (e) => {
        e.preventDefault();
        if (!oldKey || !newKey) return;
        
        try {
            await api.updatePassword(user.id, oldKey, newKey);
            setStatus({ type: 'success', message: 'Access Key updated successfully' });
            setOldKey('');
            setNewKey('');
            setTimeout(() => {
                setIsUpdatingKey(false);
                setStatus({ type: '', message: '' });
            }, 2000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const toggleDarkMode = () => {
        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const handleFinalizeRegistry = () => {
        setShowRegistryPopup(true);
        setTimeout(() => setShowRegistryPopup(false), 3500);
    };

    // Attempt to find the current student's record in the registry
    const studentRecord = students.find(s => s.name === user?.username || s.roll === user?.rollNumber);
    
    // Personal stats calculation
    const presentDays = studentRecord?.presentCount || 0;
    const absentDays = studentRecord?.absentCount || 0;
    const totalPersonal = presentDays + absentDays;
    const personalPercentage = totalPersonal > 0 ? ((presentDays / totalPersonal) * 100).toFixed(1) : '0.0';

    // Aggregated Metrics
    const totalPresent = students.filter(s => s.status === 'Present').length;
    const totalStudents = students.length || 1;
    const globalAttendance = Math.round((totalPresent / totalStudents) * 100);
    
    const teamMembers = [
        "M Shiva Balaji Gouda",
        "Shaik Irshan",
        "Dasari Charan Venkat",
        "Sidda Reddy",
        "Harsha Reddy",
        "Indravaraprasad"
    ].filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));

    const metrics = {
        personalStatus: studentRecord?.status || "Pending",
        personalTime: studentRecord?.time !== '-' ? studentRecord?.time : "N/A",
        globalTrend: `${globalAttendance}%`,
        totalNodes: totalStudents,
        percentage: `${personalPercentage}%`,
        present: presentDays,
        absent: absentDays
    };

    return (
        <div className="animate-fade space-y-6">
            <header>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Portal: {user?.username}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.25rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Central Learning Terminal & Academic Trace</p>
                    <div className="badge badge-info" style={{ fontWeight: 800 }}>ROLL: {user?.rollNumber || 'N/A'}</div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard icon={<PieChart />} title="Performance" value={metrics.percentage} color={parseFloat(personalPercentage) >= 75 ? '#10b981' : '#ef4444'} />
                <MetricCard icon={<UserCheck />} title="Present Days" value={metrics.present} color="#10b981" />
                <MetricCard icon={<Activity />} title="Absent Days" value={metrics.absent} color="#ef4444" />
                <MetricCard icon={<Clock />} title="Last Activity" value={metrics.personalTime} color="#6366f1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Weekly Attendance Trace</h3>
                    <div style={{ height: '300px', padding: '1rem' }}>
                        <LineGraph data={[
                            { day: "Mon", value: 90 },
                            { day: "Tue", value: 85 },
                            { day: "Wed", value: 70 },
                            { day: "Thu", value: 95 },
                            { day: "Fri", value: 80 },
                            { day: "Sat", value: 40 }
                        ]} />
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Registry Actions</h3>
                    <div className="space-y-3">
                        <ActionButton icon={<CheckCircle />} label="Finalize Log Registry" color="#10b981" onClick={handleFinalizeRegistry} highlight />
                        <ActionButton icon={<Clock />} label="Leave Gateway" color="#6366f1" onClick={() => onNavigate('leave')} />
                        <ActionButton icon={<Download />} label="Download Registry" color="#6366f1" onClick={() => generateRegistryExport(students)} />
                        <ActionButton icon={<FileText />} label="Syllabus DCS C-25 (PDF)" color="#ec4899" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_1_4_ComputerScience&Engineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus C-20 (Web)" color="#8b5cf6" onClick={() => window.open('https://dtek.karnataka.gov.in/52/c-20-syllabus/en', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DEEE C-25 (PDF)" color="#f97316" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_EE_1_4_Electrical&ElectronicsEngineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DME C-25 (PDF)" color="#14b8a6" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_ME_1_4_MechanicalEngineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DMT C-25 (PDF)" color="#a855f7" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_MT_1_4_MetallurgicalEngineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DCE C-25 (PDF)" color="#0ea5e9" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_CE_1_4_CivilEngineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Generate Report" color="#f59e0b" onClick={() => generateStudentReport(students)} />
                        <ActionButton icon={<UserCheck />} label="Update Identity" color="#10b981" onClick={() => onNavigate('profile')} />
                        <ActionButton 
                            icon={<Eye size={20} />} 
                            label="Dark Interface" 
                            color={settings?.darkMode ? "#10b981" : "#6366f1"}
                            onClick={toggleDarkMode} 
                            highlight={settings?.darkMode} 
                        />
                        <ActionButton 
                            icon={<Lock size={20} />} 
                            label="Update Access Key" 
                            color="#f59e0b"
                            onClick={() => setIsUpdatingKey(true)} 
                        />
                        <ActionButton 
                            icon={<Trash2 size={20} />} 
                            label="Delete Account" 
                            color="#ef4444"
                            onClick={onDeleteAccount} 
                            isDanger
                        />
                    </div>
                </div>
            </div>
            <ClassSchedule />

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Peer Registry</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {teamMembers.length > 0 ? teamMembers.map((name, idx) => (
                        <div key={idx} style={{ 
                            padding: '1rem', 
                            background: 'var(--bg-secondary)', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem',
                            border: '1px solid var(--border-color)'
                        }}>
                             <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                background: 'var(--primary-gradient)', 
                                color: 'white', 
                                borderRadius: '8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 800,
                                fontSize: '0.8rem'
                            }}>
                                {name.charAt(0)}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{name}</h4>
                                <p style={{ fontSize: '0.65rem', color: 'var(--success-color)', fontWeight: 700, margin: 0 }}>SGP STUDENT</p>
                            </div>
                        </div>
                    )) : (
                        <p style={{ padding: '1rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No matching peers found.</p>
                    )}
                </div>
            </div>

            {/* Finalize Log Registry Success Popup */}
            <AnimatePresence>
                {showRegistryPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 200, padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            style={{
                                background: 'var(--bg-primary)',
                                borderRadius: '24px',
                                padding: '3rem 2.5rem',
                                maxWidth: '420px',
                                width: '100%',
                                textAlign: 'center',
                                boxShadow: '0 25px 60px rgba(16,185,129,0.25), 0 0 0 1px rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.3)'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
                                style={{
                                    width: '80px', height: '80px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: '0 8px 32px rgba(16,185,129,0.4)'
                                }}
                            >
                                <CheckCircle size={40} color="white" />
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#10b981' }}
                            >
                                Registry Finalized!
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.6 }}
                            >
                                Student Registry Successfully Updated
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.45 }}
                                style={{ marginTop: '2rem' }}
                            >
                                <button
                                    onClick={() => setShowRegistryPopup(false)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 2rem', fontWeight: 700, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                                >
                                    <CheckCircle size={16} /> Close
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Access Key Update Modal */}
            <AnimatePresence>
                {isUpdatingKey && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card" 
                            style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Access Key Protocol</h3>
                                <button onClick={() => setIsUpdatingKey(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <form className="space-y-4" onSubmit={handleUpdateKey}>
                                <div className="form-group">
                                    <label className="form-label">Old Access Key</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Enter current PIN..." 
                                        value={oldKey}
                                        onChange={(e) => setOldKey(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Access Key</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Enter new 6-digit PIN..." 
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        required 
                                    />
                                </div>
                                
                                {status.message && (
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        borderRadius: '8px', 
                                        background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: status.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {status.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        {status.message}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary w-full" style={{ height: '52px', marginTop: '1rem' }}>
                                    <Send size={18} />
                                    Synchronize Key
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MetricCard = ({ icon, title, value, color }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color }}>{icon}</div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</h4>
        </div>
    </div>
);

const LineGraph = ({ data }) => {
    const points = data.map((d, i) => `${(i * 100) / (data.length - 1)},${100 - d.value}`).join(' ');
    
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', paddingTop: '2rem' }}>
            <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Area under line */}
                <polyline
                    fill="url(#lineGradient)"
                    stroke="none"
                    points={`0,100 ${points} 100,100`}
                />
                
                {/* Main Trace Line */}
                <polyline
                    fill="none"
                    stroke="var(--primary-color)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(99, 102, 241, 0.3))' }}
                />
                
                {/* Data Nodes */}
                {data.map((d, i) => (
                    <g key={i}>
                        <circle
                            cx={(i * 100) / (data.length - 1)}
                            cy={100 - d.value}
                            r="3"
                            fill="white"
                            stroke="var(--primary-color)"
                            strokeWidth="2"
                        />
                        <text
                            x={(i * 100) / (data.length - 1)}
                            y="112"
                            textAnchor="middle"
                            style={{ fontSize: '5px', fontWeight: 800, fill: 'var(--text-light)' }}
                        >
                            {d.day}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

const ActionButton = ({ icon, label, color, onClick, highlight, isDanger }) => (
    <button 
        onClick={onClick}
        className="btn btn-secondary w-full" 
        style={{
            justifyContent: 'flex-start', padding: '1.25rem', borderStyle: 'dashed', display: 'flex', alignItems: 'center', gap: '1rem',
            ...(highlight ? {
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.08))',
                borderColor: 'rgba(16,185,129,0.5)',
                borderStyle: 'solid',
                boxShadow: '0 0 16px rgba(16,185,129,0.15)'
            } : {}),
            ...(isDanger ? {
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
            } : {})
        }}
    >
        <div style={{ color }}>{icon}</div>
        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{label}</span>
    </button>
);

export default StudentDashboard;
