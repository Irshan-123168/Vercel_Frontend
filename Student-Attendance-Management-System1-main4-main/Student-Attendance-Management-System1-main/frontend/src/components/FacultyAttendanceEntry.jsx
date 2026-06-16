import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Search, 
    Filter, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Calendar,
    Save,
    RotateCcw,
    ChevronDown,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { api } from '../api';

const FacultyAttendanceEntry = ({ user }) => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = React.useState('DCS');
    const [selectedSem, setSelectedSem] = React.useState('1');
    const [selectedSubject, setSelectedSubject] = React.useState('FOC');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);

    const branches = ['DCS', 'DEEE', 'DME', 'DCE', 'DMT'];
    const semesters = ['1', '2', '3', '4', '5', '6'];
    const subjects = {
        'DCS': ['FOC', 'PMS', 'Java', 'Full Stack', 'Cyber Security'],
        'DEEE': ['FOC', 'Basic Electrical', 'Electrical Circuits', 'Power Systems', 'Control Systems'],
        'DME': ['FOC', 'Mechanics', 'Thermodynamics', 'Thermal Engg', 'Workshop'],
        'DCE': ['FOC', 'Building Materials', 'Surveying', 'Structural Analysis', 'Environmental'],
        'DMT': ['FOC', 'Intro Metallurgy', 'Physical Metallurgy', 'Extractive', 'Corrosion']
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await api.getStudents();
                setStudents(data.map(s => ({ ...s, status: s.status || 'Pending' })));
            } catch (err) {
                console.error("Registry sync failed:", err);
            }
        };
        fetchStudents();
    }, []);

    const updateStatus = (id, newStatus) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        try {
            await Promise.all(students.map(s => 
                api.updateStudentStatus(s.id, s.status, time, selectedBranch, selectedSem, selectedSubject)
            ));
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Bulk sync failed:", error);
            setIsSaving(false);
            alert("Failed to synchronize records with the central ledger.");
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.roll.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBranch = s.branch === selectedBranch || !s.branch;
        return matchesQuery && matchesBranch;
    });

    const stats = {
        present: filteredStudents.filter(s => s.status === 'Present').length,
        absent: filteredStudents.filter(s => s.status === 'Absent').length,
        late: filteredStudents.filter(s => s.status === 'Late').length
    };

    return (
        <div className="animate-fade space-y-8">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Faculty Attendance Terminal</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Live synchronization of node presence for {activeDate}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" style={{ background: 'white' }}>
                        <Calendar size={18} />
                        Change Date
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="btn btn-primary" 
                        style={{ padding: '0.75rem 2rem', borderRadius: '14px', minWidth: '160px' }}
                    >
                        {isSaving ? 'Syncing...' : saveSuccess ? 'Record Saved' : 'Sync Records'}
                        {!isSaving && !saveSuccess && <Save size={18} />}
                        {saveSuccess && <ShieldCheck size={18} />}
                    </button>
                </div>
            </header>

            {/* Session Configuration Matrix */}
            <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--primary-color)', borderLeft: '8px solid var(--primary-color)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Department Node</label>
                        <select 
                            className="form-input" 
                            value={selectedBranch} 
                            onChange={(e) => {
                                setSelectedBranch(e.target.value);
                                setSelectedSubject(subjects[e.target.value][0]);
                            }}
                            style={{ fontWeight: 700 }}
                        >
                            {branches.map(b => <option key={b} value={b}>{b} Diploma</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Target Semester</label>
                        <select 
                            className="form-input" 
                            value={selectedSem} 
                            onChange={(e) => setSelectedSem(e.target.value)}
                            style={{ fontWeight: 700 }}
                        >
                            {semesters.map(s => <option key={s} value={s}>Semester 0{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Academic Subject</label>
                        <select 
                            className="form-input" 
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={{ fontWeight: 700 }}
                        >
                            {subjects[selectedBranch].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={16} />
                            <input 
                                type="text" 
                                className="form-input" 
                                style={{ paddingLeft: '2.5rem', height: '44px', fontSize: '0.875rem' }} 
                                placeholder="Search student..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Ledger */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        <MiniStat label="AUTHORIZED" value={stats.present} color="#10b981" />
                        <MiniStat label="RESTRICTED" value={stats.absent} color="#ef4444" />
                        <MiniStat label="DELAYED" value={stats.late} color="#f59e0b" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Activity size={14} /> LIVE NODES: {filteredStudents.length}
                    </div>
                </div>

                <div className="table-container" style={{ border: 'none' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Student Identity</th>
                                <th>Registry Roll</th>
                                <th>Branch/Sem</th>
                                <th>Subject</th>
                                <th style={{ textAlign: 'center' }}>Presence Toggle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredStudents.map((s, idx) => (
                                    <motion.tr 
                                        key={s.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <td style={{ fontWeight: 700 }}>{s.name}</td>
                                        <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{s.roll}</td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.branch || selectedBranch}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>SEM-0{s.semester || selectedSem}</div>
                                        </td>
                                        <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.subject || selectedSubject}</td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                <StatusToggle label="PR" active={s.status === 'Present'} onClick={() => updateStatus(s.id, 'Present')} color="#10b981" />
                                                <StatusToggle label="AB" active={s.status === 'Absent'} onClick={() => updateStatus(s.id, 'Absent')} color="#ef4444" />
                                                <StatusToggle label="LT" active={s.status === 'Late'} onClick={() => updateStatus(s.id, 'Late')} color="#f59e0b" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MiniStat = ({ label, value, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '0.05em' }}>{label}:</span>
        <span style={{ fontSize: '1rem', fontWeight: 800 }}>{value}</span>
    </div>
);

const StatusToggle = ({ label, active, onClick, color }) => (
    <button 
        onClick={onClick}
        style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: active ? 'none' : '1px solid var(--border-color)',
            background: active ? color : 'white',
            color: active ? 'white' : 'var(--text-light)',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        {label}
    </button>
);

export default FacultyAttendanceEntry;
