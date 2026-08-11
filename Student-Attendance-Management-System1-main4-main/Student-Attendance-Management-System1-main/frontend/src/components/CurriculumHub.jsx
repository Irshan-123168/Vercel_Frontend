import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, GraduationCap, Microscope, Code, Database, Globe, Layers, Award, HardHat, Zap, Settings, Home, FlaskRound as Flask } from 'lucide-react';

const CurriculumHub = () => {
    const [selectedBranch, setSelectedBranch] = useState('DCS');
    const [selectedSem, setSelectedSem] = useState(1);

    const branches = [
        { id: 'DCS', name: 'Computer Science', icon: <Code size={20} />, color: '#6366f1' },
        { id: 'DEEE', name: 'Electrical & Electronics', icon: <Zap size={20} />, color: '#f59e0b' },
        { id: 'DME', name: 'Mechanical Engg', icon: <Settings size={20} />, color: '#ef4444' },
        { id: 'DCE', name: 'Civil Engg', icon: <Home size={20} />, color: '#3b82f6' },
        { id: 'DMT', name: 'Metallurgy Engg', icon: <Flask size={20} />, color: '#10b981' }
    ];

    const curriculumData = {
        DCS: {
            1: [
                { id: 'CS101', name: 'FOC (Fundamentals of Computing)', type: 'Theory', icon: <Code size={20} />, weight: '4 Credits' },
                { id: 'CS102', name: 'Applied Mathematics', type: 'Theory', icon: <Layers size={20} />, weight: '4 Credits' },
                { id: 'CL103', name: 'Computing Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '2 Credits' }
            ],
            2: [
                { id: 'CS201', name: 'PMS (Project Management)', type: 'Theory', icon: <Database size={20} />, weight: '3 Credits' },
                { id: 'CL202', name: 'Programming in C Lab', type: 'Lab', icon: <Code size={20} />, weight: '2 Credits' }
            ],
            3: [
                { id: 'CL301', name: 'Data Structures Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' },
                { id: 'CL302', name: 'Digital Electronics Lab', type: 'Lab', icon: <Layers size={20} />, weight: '2 Credits' }
            ],
            4: [
                { id: 'CL401', name: 'Java Programming Lab', type: 'Lab', icon: <Code size={20} />, weight: '4 Credits' },
                { id: 'CL402', name: 'OS Administration Lab', type: 'Lab', icon: <Layers size={20} />, weight: '2 Credits' }
            ],
            5: [
                { id: 'CS501', name: 'Full Stack Development', type: 'Theory', icon: <Globe size={20} />, weight: '5 Credits' },
                { id: 'CL502', name: 'Full Stack Lab', type: 'Lab', icon: <Code size={20} />, weight: '3 Credits' }
            ],
            6: [
                { id: 'CS601', name: 'Cyber Security', type: 'Theory', icon: <Award size={20} />, weight: '4 Credits' },
                { id: 'CL602', name: 'Major Project', type: 'Practical', icon: <Code size={20} />, weight: '8 Credits' }
            ]
        },
        DEEE: {
            1: [
                { id: 'EE101', name: 'Basic Electrical Engg', type: 'Theory', icon: <Zap size={20} />, weight: '4 Credits' },
                { id: 'MA102', name: 'Applied Mathematics', type: 'Theory', icon: <Layers size={20} />, weight: '4 Credits' }
            ],
            2: [
                { id: 'EE201', name: 'Electrical Circuits', type: 'Theory', icon: <Layers size={20} />, weight: '4 Credits' },
                { id: 'EL202', name: 'Circuits Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '2 Credits' }
            ],
            3: [
                { id: 'EL301', name: 'DC Machines Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            4: [
                { id: 'EL401', name: 'AC Machines Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            5: [
                { id: 'EE501', name: 'Power Systems', type: 'Theory', icon: <Zap size={20} />, weight: '4 Credits' },
                { id: 'EL502', name: 'Power Electronics Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '3 Credits' }
            ],
            6: [
                { id: 'EE601', name: 'Control Systems', type: 'Theory', icon: <Settings size={20} />, weight: '4 Credits' },
                { id: 'EL602', name: 'Major Project', type: 'Practical', icon: <Award size={20} />, weight: '8 Credits' }
            ]
        },
        DME: {
            1: [
                { id: 'ME101', name: 'Engineering Mechanics', type: 'Theory', icon: <Settings size={20} />, weight: '4 Credits' },
                { id: 'MA102', name: 'Applied Mathematics', type: 'Theory', icon: <Layers size={20} />, weight: '4 Credits' }
            ],
            2: [
                { id: 'ME201', name: 'Thermodynamics', type: 'Theory', icon: <Flask size={20} />, weight: '4 Credits' },
                { id: 'ML202', name: 'Workshop Practice', type: 'Lab', icon: <Microscope size={20} />, weight: '2 Credits' }
            ],
            3: [
                { id: 'ML301', name: 'Manufacturing Processes Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            4: [
                { id: 'ML401', name: 'Machine Tools Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            5: [
                { id: 'ME501', name: 'Thermal Engineering', type: 'Theory', icon: <Settings size={20} />, weight: '4 Credits' },
                { id: 'ML502', name: 'CAD/CAM Lab', type: 'Lab', icon: <Code size={20} />, weight: '3 Credits' }
            ],
            6: [
                { id: 'ME601', name: 'Industrial Management', type: 'Theory', icon: <Award size={20} />, weight: '4 Credits' },
                { id: 'ML602', name: 'Major Project', type: 'Practical', icon: <Settings size={20} />, weight: '8 Credits' }
            ]
        },
        DCE: {
            1: [
                { id: 'CE101', name: 'Building Materials', type: 'Theory', icon: <Home size={20} />, weight: '4 Credits' },
                { id: 'MA102', name: 'Applied Mathematics', type: 'Theory', icon: <Layers size={20} />, weight: '4 Credits' }
            ],
            2: [
                { id: 'CE201', name: 'Surveying', type: 'Theory', icon: <Home size={20} />, weight: '4 Credits' },
                { id: 'CL202', name: 'Surveying Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '2 Credits' }
            ],
            3: [
                { id: 'CL301', name: 'Strength of Materials Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            4: [
                { id: 'CL401', name: 'Concrete Technology Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            5: [
                { id: 'CE501', name: 'Structural Analysis', type: 'Theory', icon: <Home size={20} />, weight: '4 Credits' },
                { id: 'CL502', name: 'Geo-Technical Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '3 Credits' }
            ],
            6: [
                { id: 'CE601', name: 'Environmental Engg', type: 'Theory', icon: <Globe size={20} />, weight: '4 Credits' },
                { id: 'CL602', name: 'Major Project', type: 'Practical', icon: <Award size={20} />, weight: '8 Credits' }
            ]
        },
        DMT: {
            1: [
                { id: 'MT101', name: 'Intro to Metallurgy', type: 'Theory', icon: <Flask size={20} />, weight: '4 Credits' },
                { id: 'MA102', name: 'Applied Mathematics', type: 'Theory', icon: <Layers size={20} />, weight: '4 Credits' }
            ],
            2: [
                { id: 'MT201', name: 'Physical Metallurgy', type: 'Theory', icon: <Layers size={20} />, weight: '4 Credits' },
                { id: 'ML202', name: 'Metallurgy Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '2 Credits' }
            ],
            3: [
                { id: 'ML301', name: 'Material Testing Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            4: [
                { id: 'ML401', name: 'Foundry Technology Lab', type: 'Lab', icon: <Microscope size={20} />, weight: '4 Credits' }
            ],
            5: [
                { id: 'MT501', name: 'Extractive Metallurgy', type: 'Theory', icon: <Flask size={20} />, weight: '4 Credits' },
                { id: 'ML502', name: 'Heat Treatment Lab', type: 'Lab', icon: <Layers size={20} />, weight: '3 Credits' }
            ],
            6: [
                { id: 'MT601', name: 'Corrosion Engineering', type: 'Theory', icon: <Flask size={20} />, weight: '4 Credits' },
                { id: 'ML602', name: 'Major Project', type: 'Practical', icon: <Award size={20} />, weight: '8 Credits' }
            ]
        }
    };

    return (
        <div className="animate-fade space-y-8">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--primary-gradient)', color: 'white', borderRadius: '12px' }}>
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Institutional Curriculum</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Academic roadmap for various engineering nodes</p>
                    </div>
                </div>
            </header>

            {/* Branch Selector */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '0.1em' }}>Select Academic Branch</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {branches.map(branch => (
                        <button
                            key={branch.id}
                            onClick={() => setSelectedBranch(branch.id)}
                            style={{
                                padding: '1.25rem',
                                borderRadius: '16px',
                                border: '1px solid',
                                borderColor: selectedBranch === branch.id ? branch.color : 'var(--border-color)',
                                background: selectedBranch === branch.id ? `${branch.color}10` : 'white',
                                color: selectedBranch === branch.id ? branch.color : 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: selectedBranch === branch.id ? 'translateY(-2px)' : 'none',
                                boxShadow: selectedBranch === branch.id ? `0 10px 20px ${branch.color}20` : 'none'
                            }}
                        >
                            <div style={{ 
                                padding: '0.5rem', 
                                background: selectedBranch === branch.id ? branch.color : 'var(--bg-secondary)', 
                                color: selectedBranch === branch.id ? 'white' : 'var(--text-light)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {branch.icon}
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{branch.id} - {branch.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Semester Switcher */}
            <div style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                background: 'var(--bg-secondary)', 
                padding: '0.75rem', 
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                overflowX: 'auto'
            }}>
                {[1, 2, 3, 4, 5, 6].map(sem => (
                    <button
                        key={sem}
                        onClick={() => setSelectedSem(sem)}
                        style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '1rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: selectedSem === sem ? 'white' : 'transparent',
                            color: selectedSem === sem ? 'var(--primary-color)' : 'var(--text-light)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: selectedSem === sem ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        <span style={{ opacity: selectedSem === sem ? 1 : 0.5 }}>SEM</span>
                        <span style={{ fontSize: '1.25rem' }}>0{sem}</span>
                    </button>
                ))}
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="wait">
                    {curriculumData[selectedBranch][selectedSem].map((subject, idx) => (
                        <motion.div
                            key={selectedBranch + selectedSem + subject.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="card group hover:border-indigo-500/50 transition-all duration-300"
                            style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}
                        >
                            <div style={{ 
                                width: '56px', 
                                height: '56px', 
                                background: subject.type === 'Theory' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                                color: subject.type === 'Theory' ? 'var(--primary-color)' : 'var(--success-color)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} className="group-hover:scale-110 transition-transform">
                                {subject.icon}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem' }}>{subject.name}</h4>
                                    <span style={{ 
                                        fontSize: '0.65rem', 
                                        fontWeight: 900, 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '20px',
                                        background: subject.type === 'Theory' ? 'var(--primary-color)' : 'var(--success-color)',
                                        color: 'white',
                                        textTransform: 'uppercase'
                                    }}>
                                        {subject.type}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Layers size={14} /> {subject.id}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Award size={14} /> {subject.weight}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CurriculumHub;
