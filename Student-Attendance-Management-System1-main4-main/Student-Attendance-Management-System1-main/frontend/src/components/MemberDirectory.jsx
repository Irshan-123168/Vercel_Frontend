import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, ShieldCheck, Mail, Smartphone, ChevronRight, MoreVertical, Trash2, User } from 'lucide-react';

const MemberDirectory = ({ students, searchQuery, setSearchQuery }) => {
    const [activeSector, setActiveSector] = useState('All');
    const [activeMenuId, setActiveMenuId] = useState(null);
    
    const filteredStudents = (students || []).filter(s => {
        const matchesQuery = (s.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
                           (s.roll || '').toLowerCase().includes((searchQuery || '').toLowerCase());
        // Ensure s.studentClass is treated as a string for comparison
        const matchesSector = activeSector === 'All' || (s.studentClass || '').toLowerCase() === activeSector.toLowerCase();
        return matchesQuery && matchesSector;
    });

    const sectors = ['All', ...new Set((students || []).map(s => s.studentClass))];

    return (
        <div className="animate-fade space-y-8" onClick={() => setActiveMenuId(null)}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Member Directory</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Institutional User Registry & Node Ledger</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
                        <input 
                            type="text" 
                            className="form-input" 
                            style={{ paddingLeft: '3rem', width: '300px' }}
                            placeholder="Search Identifier..." 
                            value={searchQuery || ''}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Sector Matrix */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {sectors.map(sector => (
                    <button
                        key={sector}
                        onClick={(e) => { e.stopPropagation(); setActiveSector(sector); }}
                        style={{
                            padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)',
                            background: activeSector === sector ? 'var(--primary-gradient)' : 'white',
                            color: activeSector === sector ? 'white' : 'var(--text-secondary)',
                            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.3s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {sector === 'All' ? 'ALL NODES' : sector}
                    </button>
                ))}
            </div>

            {/* Member Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredStudents.map((s, idx) => (
                        <motion.div 
                            key={s.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="card"
                            style={{ padding: '1.5rem', position: 'relative' }}
                        >
                            {/* Action Menu (Three Dots) */}
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1rem' }}>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === s.id ? null : s.id);
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                >
                                    <MoreVertical size={20} />
                                </button>
                                
                                <AnimatePresence>
                                    {activeMenuId === s.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                            style={{ 
                                                position: 'absolute', top: '100%', right: 0, width: '180px', 
                                                background: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                border: '1px solid var(--border-color)', zIndex: 10, padding: '0.5rem'
                                            }}
                                        >
                                            <button className="menu-item-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                <User size={16} color="var(--primary-color)" /> View Profile
                                            </button>
                                            <button className="menu-item-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                <Smartphone size={16} color="var(--success-color)" /> Send Alert
                                            </button>
                                            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
                                            <button className="menu-item-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700, color: '#ef4444' }}>
                                                <Trash2 size={16} /> Delete Registry
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingRight: '2rem' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                                    <Users size={28} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.name}</h4>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '0.05em' }}>ID: {s.roll}</p>
                                </div>
                                <div style={{ color: 'var(--success-color)', display: activeMenuId === s.id ? 'none' : 'block' }}>
                                    <ShieldCheck size={20} />
                                </div>
                            </div>

                            <div className="space-y-2" style={{ marginBottom: '1.5rem' }}>
                                <MemberMeta icon={<Mail size={14} />} label="node-access@sgp.edu" />
                                <MemberMeta icon={<Smartphone size={14} />} label="+91 XXXXX XXXXX" />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                <span className="badge badge-info">{s.studentClass}</span>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    VIEW TRACE <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const MemberMeta = ({ icon, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-light)', fontSize: '0.8125rem', fontWeight: 600 }}>
        {icon}
        <span>{label}</span>
    </div>
);

export default MemberDirectory;
