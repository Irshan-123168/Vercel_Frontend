import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Coffee } from 'lucide-react';

const ClassSchedule = ({ title = "Class Period Timings" }) => {
    const periods = [
        { id: 'I', time: '9:00 AM - 10:00 AM', subject: 'Core Technical Session' },
        { id: 'II', time: '10:00 AM - 11:00 AM', subject: 'Practical Workshop' },
        { id: 'III', time: '11:00 AM - 12:00 PM', subject: 'Theoretical Analysis' },
        { id: 'IV', time: '12:00 PM - 1:00 PM', subject: 'Project Lab' },
        { id: 'LUNCH', time: '1:00 PM - 2:00 PM', subject: 'Nutrition Break', isBreak: true },
        { id: 'V', time: '2:00 PM - 3:00 PM', subject: 'Elective Module' },
        { id: 'VI', time: '3:00 PM - 4:00 PM', subject: 'Special Seminar' },
        { id: 'VII', time: '4:00 PM - 5:00 PM', subject: 'Review & Feedback' },
    ];

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '12px' }}>
                    <Clock size={24} />
                </div>
                <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>{title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Daily Academic Ledger</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {periods.map((p, idx) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                            padding: '1.25rem',
                            background: p.isBreak ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                            borderRadius: '16px',
                            border: `1px solid ${p.isBreak ? 'var(--border-color)' : 'var(--primary-light)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {p.isBreak && (
                            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
                                <Coffee size={60} />
                            </div>
                        )}
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: p.isBreak ? 'var(--warning-color)' : 'var(--primary-gradient)',
                            color: 'white',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '0.875rem',
                            flexShrink: 0
                        }}>
                            {p.id === 'LUNCH' ? 'L' : p.id}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Period {p.id}</p>
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: p.isBreak ? 'var(--warning-color)' : 'var(--primary-color)' }}>{p.isBreak ? 'BREAK' : 'ACTIVE'}</span>
                            </div>
                            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '2px 0' }}>{p.subject}</h4>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ClassSchedule;
