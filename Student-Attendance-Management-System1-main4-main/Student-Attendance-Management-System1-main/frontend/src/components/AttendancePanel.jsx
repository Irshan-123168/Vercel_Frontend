import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ClipboardList, CheckCircle2, XCircle, Clock, Users, Edit2, Save, X } from 'lucide-react';

const AttendancePanel = ({ students, updateStatus, searchQuery, onUpdateStudent }) => {
    const [editingStudent, setEditingStudent] = React.useState(null);
    const [editForm, setEditForm] = React.useState({ name: '', roll: '', studentClass: '', status: '', branch: '', semester: '', subject: '' });
    
    // Attendance Session State
    const [selectedBranch, setSelectedBranch] = React.useState('DCS');
    const [selectedSem, setSelectedSem] = React.useState('1');
    const [selectedSection, setSelectedSection] = React.useState('A');
    const [selectedSubject, setSelectedSubject] = React.useState('FOC');

    const branches = ['DCS', 'DEEE', 'DME', 'DCE', 'DMT'];
    const semesters = ['1', '2', '3', '4', '5', '6'];
    const sections = ['A', 'B', 'C', 'D'];
    const branchNames = {
        'DCS': 'Computer Science',
        'DEEE': 'Electrical & Electronics',
        'DME': 'Mechanical',
        'DCE': 'Civil',
        'DMT': 'Metallurgical'
    };

    const subjects = {
        'DCS': [
            'FOC', 'Engineering Maths', 'IT Skills', 'Digital Logic', 
            'Python Programming', 'Computer Networks', 'Database Management', 
            'Java Programming', 'Full Stack Development', 'Cyber Security',
            'Operating Systems', 'Software Engineering', 'Cloud Computing'
        ],
        'DEEE': [
            'FOC', 'Engineering Maths', 'Basic Electrical', 'Electrical Circuits', 
            'Power Systems', 'Control Systems', 'Electric Motors', 
            'Transformers & Alternators', 'Power Electronics', 'Industrial Automation', 
            'Renewable Energy', 'Transmission & Distribution', 'Switchgear & Protection'
        ],
        'DME': [
            'FOC', 'Engineering Maths', 'Mechanical Concepts', 'Thermodynamics', 
            'Fluid Mechanics', 'Mechanics of Materials', 'Machine Tool Tech', 
            'Manufacturing Processes', 'CAD/CAM', 'CNC Machining', 
            'Robotics', 'Heat Transfer', 'Automobile Engineering'
        ],
        'DCE': [
            'FOC', 'Engineering Maths', 'Essential English', 'Construction Materials', 
            'Surveying', 'Concrete Tech', 'Structure Analysis', 
            'Geotechnical Engg', 'Hydraulics', 'Transportation Engg', 
            'Quantity Surveying', 'Environmental Engg', 'Design of Structures'
        ],
        'DMT': [
            'FOC', 'Engineering Maths', 'Environmental Sustainability', 'Concepts of Metallurgy', 
            'Material Science', 'Extractive Metallurgy', 'Physical Metallurgy', 
            'Heat Treatment', 'Mechanical Metallurgy', 'Foundry Technology', 
            'Welding Technology', 'Corrosion Engineering', 'Material Testing'
        ]
    };

    const handleEditStart = (s) => {
        setEditingStudent(s.id);
        const validBranch = subjects[s.branch] ? s.branch : selectedBranch;
        setEditForm({ 
            name: s.name, 
            roll: s.roll, 
            studentClass: s.studentClass, 
            status: s.status,
            branch: validBranch,
            semester: s.semester || selectedSem,
            section: s.section || selectedSection,
            subject: s.subject || selectedSubject
        });
    };

    const handleSaveEdit = async () => {
        if (onUpdateStudent) {
            await onUpdateStudent(editingStudent, editForm);
        } else if (updateStatus) {
            await updateStatus(editingStudent, editForm.status, editForm.branch, editForm.semester, editForm.section, editForm.subject);
        }
        setEditingStudent(null);
    };

    const handleQuickStatusUpdate = async (id, status) => {
        if (updateStatus) {
            await updateStatus(id, status, selectedBranch, selectedSem, selectedSection, selectedSubject);
        }
    };

    const query = (searchQuery || '').toLowerCase();
    const filteredStudents = (students || []).filter(s => 
        (s.name || '').toLowerCase().includes(query) || 
        (s.roll || '').toLowerCase().includes(query)
    );

    const stats = {
        total: filteredStudents.length,
        present: filteredStudents.filter(s => s.status === 'Present').length,
        absent: filteredStudents.filter(s => s.status === 'Absent').length,
        late: filteredStudents.filter(s => s.status === 'Late').length
    };

    return (
        <div className="animate-fade space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Attendance Central</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage and synchronize student attendance records</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="badge badge-info shadow-sm">Updated Just Now</div>
                </div>
            </header>

            {/* Session Configuration Card */}
            <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--primary-color)', borderLeft: '8px solid var(--primary-color)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Branch</label>
                        <select 
                            className="form-input" 
                            value={selectedBranch} 
                            onChange={(e) => {
                                setSelectedBranch(e.target.value);
                                setSelectedSubject(subjects[e.target.value][0]);
                            }}
                            style={{ fontWeight: 700 }}
                        >
                            {branches.map(b => <option key={b} value={b}>{branchNames[b]} Diploma</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Academic Semester</label>
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
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Section Protocol</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {sections.map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setSelectedSection(s)}
                                    style={{
                                        flex: 1,
                                        height: '42px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: selectedSection === s ? 'var(--primary-gradient)' : 'white',
                                        color: selectedSection === s ? 'white' : 'var(--text-primary)',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: selectedSection === s ? 'var(--shadow-md)' : 'none'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-light)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Subject</label>
                        <select 
                            className="form-input" 
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={{ fontWeight: 700 }}
                        >
                            {(subjects[selectedBranch] || subjects['DCS']).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                    Live Session: {selectedBranch} / SEM-0{selectedSem}-{selectedSection} / {selectedSubject}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<Users size={24} />} title="Registry Nodes" value={stats.total} color="#6366f1" />
                <StatCard icon={<CheckCircle2 size={24} />} title="Authorized" value={stats.present} color="#10b981" />
                <StatCard icon={<XCircle size={24} />} title="Restricted" value={stats.absent} color="#ef4444" />
                <StatCard icon={<Clock size={24} />} title="Delayed" value={stats.late} color="#f59e0b" />
            </div>

            {/* Registry Table */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Student Registry Ledger</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 600 }}>SYNC STATUS: OPTIMAL</div>
                </div>
                
                <div className="table-container" style={{ border: 'none' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Student Identity</th>
                                <th>Roll No</th>
                                <th>Branch/Sem</th>
                                 <th>Subject</th>
                                <th>Status</th>
                                <th>Performance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredStudents.map((s, idx) => {
                                    const total = (s.presentCount || 0) + (s.absentCount || 0);
                                    const percentage = total > 0 
                                        ? ((s.presentCount || 0) / total * 100).toFixed(1) 
                                        : '0.0';
                                    
                                    return (
                                        <motion.tr 
                                            key={s.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={18} className="text-gray-400" />
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700, color: 'var(--text-light)' }}>{s.roll}</td>
                                            <td>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.branch || selectedBranch}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>SEM-0{s.semester || selectedSem}</div>
                                            </td>
                                            <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.subject || selectedSubject}</td>
                                            <td>
                                                <span className={`badge badge-${s.status === 'Present' ? 'success' : s.status === 'Absent' ? 'danger' : 'warning'}`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: parseFloat(percentage) >= 75 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                                        {percentage}%
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)' }}>
                                                        P:{s.presentCount || 0} / A:{s.absentCount || 0}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                            <div className="flex gap-2">
                                                <ControlButton type="Present" active={s.status === 'Present'} onClick={() => handleQuickStatusUpdate(s.id, 'Present')} />
                                                <ControlButton type="Absent" active={s.status === 'Absent'} onClick={() => handleQuickStatusUpdate(s.id, 'Absent')} />
                                                <ControlButton type="Late" active={s.status === 'Late'} onClick={() => handleQuickStatusUpdate(s.id, 'Late')} />
                                                <button 
                                                    onClick={() => handleEditStart(s)}
                                                    className="btn btn-secondary" 
                                                    style={{ width: '36px', height: '36px', padding: 0, borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--primary-color)' }}
                                                    title="Edit Node Details"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal Overlay */}
            <AnimatePresence>
                {editingStudent && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
                            backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', padding: '1rem'
                        }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '450px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Student Node</h3>
                                <button onClick={() => setEditingStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>IDENTITY NAME</label>
                                    <input 
                                        type="text" className="form-input" 
                                        value={editForm.name} 
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>REGISTRY ROLL</label>
                                    <input 
                                        type="text" className="form-input" 
                                        value={editForm.roll} 
                                        onChange={(e) => setEditForm({...editForm, roll: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>OPERATIONAL CLASS</label>
                                    <input 
                                        type="text" className="form-input" 
                                        value={editForm.studentClass} 
                                        onChange={(e) => setEditForm({...editForm, studentClass: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>STATUS VECTOR</label>
                                    <select 
                                        className="form-input" 
                                        value={editForm.status} 
                                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Late">Late</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>BRANCH</label>
                                        <select 
                                            className="form-input" value={editForm.branch} 
                                            onChange={(e) => setEditForm({...editForm, branch: e.target.value})}
                                        >
                                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>SECTION</label>
                                        <select 
                                            className="form-input" value={editForm.section || 'A'} 
                                            onChange={(e) => setEditForm({...editForm, section: e.target.value})}
                                        >
                                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>SEMESTER</label>
                                        <select 
                                            className="form-input" value={editForm.semester} 
                                            onChange={(e) => setEditForm({...editForm, semester: e.target.value})}
                                        >
                                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.5rem' }}>SUBJECT</label>
                                        <select 
                                            className="form-input" value={editForm.subject} 
                                            onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                                        >
                                            {(subjects[editForm.branch] || subjects['DCS']).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setEditingStudent(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button onClick={handleSaveEdit} className="btn btn-primary" style={{ flex: 1 }}>
                                    <Save size={18} /> Sync Update
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="card stat-card" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="icon-box" style={{ background: color + '15', color }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</p>
        </div>
    </div>
);

const ControlButton = ({ type, active, onClick }) => {
    const colors = {
        Present: { bg: '#dcfce7', text: '#166534', icon: <CheckCircle2 size={16} /> },
        Absent: { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={16} /> },
        Late: { bg: '#fef3c7', text: '#92400e', icon: <Clock size={16} /> }
    };
    
    return (
        <button 
            onClick={onClick}
            style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: active ? 'none' : '1px solid var(--border-color)',
                background: active ? colors[type].bg : 'white',
                color: active ? colors[type].text : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
            title={type}
        >
            {colors[type].icon}
        </button>
    );
};

export default AttendancePanel;
