import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import ClassSchedule from './ClassSchedule';

const Dashboard = ({ students = [] }) => {
    const stats = {
        total: students.length || 108,
        present: students.filter(s => s.status === 'Present').length || 85,
        absent: students.filter(s => s.status === 'Absent').length || 15,
        late: 8
    };

    return (
        <div className="animate-fade space-y-8">
            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>System Pulse Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Real-time institutional attendance metrics and system health</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ModernStatCard label="Total Registry" value={stats.total} icon={<Users />} color="#6366f1" />
                <ModernStatCard label="Verified Present" value={stats.present} icon={<CheckCircle />} color="#10b981" trend="+2.4%" />
                <ModernStatCard label="Absence Trace" value={stats.absent} icon={<Activity />} color="#ef4444" trend="-1.2%" />
                <ModernStatCard label="Delayed Nodes" value={stats.late} icon={<Clock />} color="#f59e0b" />
            </div>

            <ClassSchedule />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontWeight: 700 }}>Presence Analytics</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="badge" style={{ background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer' }}>WEEKLY</button>
                            <button className="badge badge-info" style={{ border: 'none', cursor: 'pointer' }}>MONTHLY</button>
                        </div>
                    </div>
                    <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        {[65, 82, 45, 90, 75, 55, 88, 72, 95, 80, 60, 85].map((val, i) => (
                            <div key={i} style={{ flex: 1, background: 'var(--primary-gradient)', height: `${val}%`, borderRadius: '4px 4px 0 0', opacity: 0.1 + (val/100) }}></div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="card" style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none' }}>
                        <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>SGP-CORE Health</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span>Latency</span>
                            <span style={{ fontWeight: 800 }}>12ms</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                            <div style={{ width: '92%', height: '100%', background: 'white', borderRadius: '2px' }}></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '1rem', opacity: 0.8, fontWeight: 600 }}>SYSTEM STATUS: OPTIMAL</p>
                    </div>

                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}><BarChart3 size={16} /> Data Export</button>
                            <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}><TrendingUp size={16} /> Performance Meta</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModernStatCard = ({ label, value, icon, color, trend }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{label}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</h4>
            <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: trend.startsWith('+') ? 'var(--success-color)' : 'var(--error-color)', marginTop: '0.5rem' }}>
                {trend} <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last session</span>
            </p>
        )}
    </div>
);

export default Dashboard;
