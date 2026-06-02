import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Users, CheckCircle, Clock, Download, FileText, UserPlus,
  Lock, Eye, Send, XCircle, Trash2, RefreshCw, Bell, Search, Settings,
  BarChart2, Calendar, TrendingUp, TrendingDown, ChevronRight, ChevronDown,
  BookOpen, Layers, Award, AlertCircle, Star, Home, LogOut, Menu, X,
  PlusCircle, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Zap, Shield, Database, Globe, Cpu, Hash, Radio, MessageSquare, User,
  BookMarked, GitBranch, Inbox, CheckSquare, Map, Smile, Coffee
} from 'lucide-react';
import { api } from '../api';
import { generateStudentReport, generateRegistryExport, generateMasterReport } from '../utils/exportUtils';
import ClassSchedule from './ClassSchedule';

/* ─────────────────── SPARKLINE COMPONENT ─────────────────── */
const Sparkline = ({ data, color, height = 40, width = 100 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts} ${width},${height}`}
        fill={`url(#sg-${color.replace('#','')})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last dot */}
      {(() => {
        const lastParts = pts.split(' ').pop().split(',');
        return <circle cx={lastParts[0]} cy={lastParts[1]} r="3" fill={color} />;
      })()}
    </svg>
  );
};

/* ─────────────────── MINI BAR CHART ─────────────────── */
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '48px' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? color : `${color}55`,
          borderRadius: '3px 3px 0 0',
          transition: 'height 0.4s ease',
          minHeight: '4px'
        }} />
      ))}
    </div>
  );
};

/* ─────────────────── DONUT CHART ─────────────────── */
const DonutChart = ({ present = 78, absent = 14, late = 8 }) => {
  const size = 120;
  const r = 46;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = present + absent + late;
  const presentDash = (present / total) * circumference;
  const absentDash = (absent / total) * circumference;
  const lateDash = (late / total) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6C63FF" strokeWidth="14"
          strokeDasharray={`${presentDash} ${circumference}`}
          strokeDashoffset="0" strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF4DA6" strokeWidth="14"
          strokeDasharray={`${absentDash} ${circumference}`}
          strokeDashoffset={-presentDash} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#00C2FF" strokeWidth="14"
          strokeDasharray={`${lateDash} ${circumference}`}
          strokeDashoffset={-(presentDash + absentDash)} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{present}%</span>
        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600 }}>PRESENT</span>
      </div>
    </div>
  );
};

/* ─────────────────── HEATMAP COMPONENT ─────────────────── */
const HeatmapWidget = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = 6;
  const data = Array.from({ length: weeks }, () =>
    days.map(() => Math.floor(Math.random() * 100))
  );
  const getColor = (v) => {
    if (v >= 90) return '#6C63FF';
    if (v >= 75) return '#8B83FF';
    if (v >= 60) return '#B8B4FF';
    if (v >= 40) return '#E8E7FF';
    return '#f1f5f9';
  };
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {data.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {week.map((val, di) => (
            <div key={di} title={`${days[di]}: ${val}%`}
              style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: getColor(val), cursor: 'pointer',
                transition: 'transform 0.15s', position: 'relative'
              }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/* ─────────────────── LINE CHART ─────────────────── */
const AttendanceTrendChart = ({ data }) => {
  const chartData = data || [78, 82, 76, 88, 85, 91, 87, 93, 89, 94, 91, 96];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const W = 480, H = 160;
  const padX = 30, padY = 20;
  const chartW = W - padX * 2, chartH = H - padY * 2;
  const max = 100, min = 60;
  const pts = chartData.map((v, i) => {
    const x = padX + (i / (chartData.length - 1)) * chartW;
    const y = padY + chartH - ((v - min) / (max - min)) * chartH;
    return [x, y];
  });
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length - 1][0]},${H - padY} L${pts[0][0]},${H - padY} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '320px' }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v, i) => {
          const y = padY + chartH - ((v - min) / (max - min)) * chartH;
          return y >= padY && y <= H - padY ? (
            <line key={i} x1={padX} y1={y} x2={W - padX} y2={y}
              stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
          ) : null;
        })}
        {/* Area fill */}
        <path d={areaD} fill="url(#trendGrad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="url(#lineGrad2)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#00C2FF" />
          </linearGradient>
        </defs>
        {/* Data points */}
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="white" stroke="#6C63FF" strokeWidth="2" />
          </g>
        ))}
        {/* X labels */}
        {labels.map((l, i) => {
          const x = padX + (i / (labels.length - 1)) * chartW;
          return (
            <text key={i} x={x} y={H - 4} textAnchor="middle"
              style={{ fontSize: '9px', fill: '#94a3b8', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {l}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

/* ─────────────────── BAR CHART (Department) ─────────────────── */
const DeptBarChart = () => {
  const depts = [
    { name: 'CS', val: 91, color: '#6C63FF' },
    { name: 'EE', val: 87, color: '#FF4DA6' },
    { name: 'ME', val: 84, color: '#00C2FF' },
    { name: 'CE', val: 79, color: '#F59E0B' },
    { name: 'MT', val: 88, color: '#10B981' },
    { name: 'EC', val: 93, color: '#8B5CF6' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {depts.map((d) => (
        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', width: '24px', flexShrink: 0 }}>{d.name}</span>
          <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${d.val}%` }}
              transition={{ duration: 1, delay: 0.1 }}
              style={{ height: '100%', background: d.color, borderRadius: '99px' }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: d.color, width: '32px', textAlign: 'right' }}>{d.val}%</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────── NOTIFICATION ITEM ─────────────────── */
const NotifItem = ({ icon: Icon, color, title, time, badge }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
    padding: '0.875rem 0', borderBottom: '1px solid #f1f5f9'
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `${color}18`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={16} color={color} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>{title}</p>
      <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '3px 0 0', fontWeight: 500 }}>{time}</p>
    </div>
    {badge && (
      <span style={{
        fontSize: '0.6rem', fontWeight: 800, padding: '2px 7px',
        borderRadius: 99, background: `${color}18`, color, flexShrink: 0
      }}>{badge}</span>
    )}
  </div>
);

/* ─────────────────── KPI CARD ─────────────────── */
const KPICard = ({ icon: Icon, title, value, change, positive, color, sparkData, gradient }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(108,99,255,0.12)' }}
    className="glass-card"
    style={{
      padding: '1.5rem',
      position: 'relative', overflow: 'hidden', cursor: 'default'
    }}
  >
    {/* Gradient accent top */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
      background: gradient || `linear-gradient(90deg, ${color}, ${color}88)`
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {positive ? <ArrowUpRight size={14} color="#10b981" /> : <ArrowDownRight size={14} color="#ef4444" />}
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: positive ? '#10b981' : '#ef4444' }}>
          {change}
        </span>
      </div>
    </div>
    <div style={{ marginTop: '1rem' }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1 }}>{value}</h2>
    </div>
    <div style={{ marginTop: '1rem' }}>
      <Sparkline data={sparkData} color={color} height={36} width={100} />
    </div>
  </motion.div>
);

/* ─────────────────── SCHEDULE ROW ─────────────────── */
const ScheduleRow = ({ subject, section, time, room, status }) => {
  const statusMap = {
    'Ongoing': { bg: '#dcfce7', color: '#16a34a', dot: '#22c55e' },
    'Upcoming': { bg: '#e0e7ff', color: '#4338ca', dot: '#6C63FF' },
    'Completed': { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' },
    'Cancelled': { bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' }
  };
  const s = statusMap[status] || statusMap['Upcoming'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '0.875rem 0', borderBottom: '1px solid #f8fafc'
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0,
        boxShadow: `0 0 0 3px ${s.dot}30`
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject}</p>
        <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>{section} · {room}</p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', margin: 0 }}>{time}</p>
      </div>
      <span style={{
        padding: '4px 10px', borderRadius: 99, fontSize: '0.65rem',
        fontWeight: 800, background: s.bg, color: s.color, flexShrink: 0
      }}>{status}</span>
    </div>
  );
};

/* ─────────────────── ACTIVITY FEED ITEM ─────────────────── */
const ActivityFeedItem = ({ icon: Icon, color, text, time, sub }) => (
  <div style={{ display: 'flex', gap: '0.875rem', paddingBottom: '1rem', position: 'relative' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={14} color={color} />
      </div>
      <div style={{ width: 1, flex: 1, background: '#f1f5f9', marginTop: 6 }} />
    </div>
    <div style={{ paddingTop: 4, flex: 1 }}>
      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', margin: 0, lineHeight: 1.5 }}>{text}</p>
      {sub && <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>{sub}</p>}
      <p style={{ fontSize: '0.68rem', color: '#cbd5e1', margin: '3px 0 0', fontWeight: 600 }}>{time}</p>
    </div>
  </div>
);

/* ─────────────────── QUICK ACTION BUTTON ─────────────────── */
const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      width: '100%', padding: '0.875rem 1rem',
      background: 'white', border: '1px solid #e2e8f0',
      borderRadius: '14px', cursor: 'pointer',
      transition: 'all 0.2s', textAlign: 'left',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}
  >
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={16} color={color} />
    </div>
    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{label}</span>
    <ChevronRight size={14} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
  </motion.button>
);

/* ─────────────────── SIDEBAR NAV ITEM ─────────────────── */
const SideNavItem = ({ icon: Icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1rem', width: '100%',
      borderRadius: '12px', border: 'none', cursor: 'pointer',
      background: active ? 'linear-gradient(135deg, #6C63FF, #FF4DA6)' : 'transparent',
      color: active ? 'white' : '#64748b',
      fontWeight: active ? 700 : 600, fontSize: '0.85rem',
      transition: 'all 0.2s', textAlign: 'left',
      marginBottom: '2px', position: 'relative'
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#6C63FF'; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}}
  >
    {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: 'rgba(255,255,255,0.6)', borderRadius: '0 4px 4px 0' }} />}
    <Icon size={17} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge && (
      <span style={{
        background: active ? 'rgba(255,255,255,0.25)' : '#ff4da618',
        color: active ? 'white' : '#FF4DA6',
        fontSize: '0.65rem', fontWeight: 800,
        padding: '2px 7px', borderRadius: 99
      }}>{badge}</span>
    )}
  </button>
);

/* ═══════════════════════════════════════════════════════════
   MAIN FACULTY DASHBOARD COMPONENT
═══════════════════════════════════════════════════════════ */
const FacultyDashboard = ({ user, students = [], onNavigateToAttendance, searchQuery = '', settings, setSettings, onDeleteAccount }) => {
  const [showRegistryPopup, setShowRegistryPopup] = useState(false);
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [oldKey, setOldKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [selectedSection, setSelectedSection] = useState('All');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Monthly');
  const [smsLogs, setSmsLogs] = useState([]);
  const [isLoadingSmsLogs, setIsLoadingSmsLogs] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testStudentName, setTestStudentName] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [isSendingTestSms, setIsSendingTestSms] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const fetchSmsLogs = async () => {
    setIsLoadingSmsLogs(true);
    try {
      const logs = await api.getSmsLogs();
      setSmsLogs(logs);
    } catch (error) {
      console.error('Failed to load SMS logs:', error);
    } finally {
      setIsLoadingSmsLogs(false);
    }
  };

  useEffect(() => { fetchSmsLogs(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSendTestSms = async (e) => {
    e.preventDefault();
    if (!testPhone) return;
    setIsSendingTestSms(true);
    try {
      const res = await api.sendTestSms(testPhone, testStudentName, testMessage);
      setStatus({ type: 'success', message: `SMS processed! Gateway: ${res.status || 'SUCCESS'}` });
      setTestPhone(''); setTestStudentName(''); setTestMessage('');
      fetchSmsLogs();
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    } finally {
      setIsSendingTestSms(false);
    }
  };

  const handleUpdateKey = async (e) => {
    e.preventDefault();
    if (!oldKey || !newKey) return;
    try {
      await api.updatePassword(user.id, oldKey, newKey);
      setStatus({ type: 'success', message: 'Access Key updated successfully' });
      setOldKey(''); setNewKey('');
      setTimeout(() => { setIsUpdatingKey(false); setStatus({ type: '', message: '' }); }, 2000);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const handleSimulateSweep = async () => {
    try {
      const res = await api.post('/api/config/simulate-sweep');
      setStatus({ type: 'success', message: `Sweep executed: ${res.data.sweptCount} records.` });
    } catch (e) { setStatus({ type: 'error', message: e.message }); }
  };

  const handleSimulateReset = async () => {
    try {
      const res = await api.post('/api/config/simulate-reset');
      setStatus({ type: 'success', message: `Reset executed: ${res.data.resetCount} records.` });
    } catch (e) { setStatus({ type: 'error', message: e.message }); }
  };

  const handleFinalizeRegistry = () => { setShowRegistryPopup(true); setTimeout(() => setShowRegistryPopup(false), 3500); };
  const toggleDarkMode = () => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));

  // Computed stats
  const totalStudents = students.length;
  const presentToday = students.filter(s => s.status === 'Present').length;
  const pendingLeave = students.filter(s => s.status === 'Pending').length;
  const activeFaculty = 24;
  const avgAttendance = totalStudents > 0
    ? Math.round((students.reduce((acc, s) => acc + (s.presentCount || 0), 0) /
      students.reduce((acc, s) => acc + (s.presentCount || 0) + (s.absentCount || 0) || 1, 0)) * 100)
    : 87;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const academicYear = '2025–26';

  // Sparkline mock data
  const sparkStudents = [120, 118, 122, 125, 121, 128, 130, 127, 132, 129, 134, totalStudents || 134];
  const sparkAttendance = [80, 84, 79, 88, 85, 91, 87, 92, 89, 93, 91, presentToday || 91];
  const sparkLeave = [2, 5, 3, 7, 4, 6, 5, 8, 6, 9, 7, pendingLeave || 7];
  const sparkFaculty = [20, 21, 22, 21, 23, 22, 24, 23, 24, 23, 24, activeFaculty];

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'attendance', icon: CheckCircle, label: 'Attendance Entry' },
    { id: 'students', icon: Users, label: 'Student Registry' },
    { id: 'faculty', icon: Award, label: 'Faculty Directory' },
    { id: 'leave', icon: Clock, label: 'Leave Management', badge: pendingLeave || 7 },
    { id: 'curriculum', icon: BookOpen, label: 'Curriculum Hub' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const scheduleData = [
    { subject: 'Data Structures & Algorithms', section: 'CS-3A', time: '08:30 AM', room: 'LH-201', status: 'Completed' },
    { subject: 'Computer Networks', section: 'CS-4B', time: '10:00 AM', room: 'LH-105', status: 'Ongoing' },
    { subject: 'Operating Systems Lab', section: 'CS-3B', time: '11:30 AM', room: 'Lab-02', status: 'Upcoming' },
    { subject: 'Software Engineering', section: 'CS-5A', time: '02:00 PM', room: 'LH-301', status: 'Upcoming' },
    { subject: 'DBMS Tutorial', section: 'CS-4A', time: '03:30 PM', room: 'LH-204', status: 'Upcoming' },
  ];

  const activityFeed = [
    { icon: CheckCircle, color: '#10b981', text: 'Attendance marked for CS-3A (32/35 Present)', sub: 'Data Structures & Algorithms', time: '2 min ago' },
    { icon: UserPlus, color: '#6C63FF', text: 'New student Priya Sharma registered', sub: 'Section: CS-4B', time: '18 min ago' },
    { icon: Clock, color: '#F59E0B', text: 'Leave request from Rahul Verma — Medical', sub: 'Pending approval · 3 days', time: '45 min ago' },
    { icon: FileText, color: '#FF4DA6', text: 'Monthly Attendance Report generated', sub: 'May 2026 · 134 students', time: '1 hr ago' },
    { icon: Bell, color: '#00C2FF', text: 'SMS alerts sent to 12 absent students\' parents', sub: 'Gateway: Textbelt', time: '2 hr ago' },
    { icon: CheckSquare, color: '#8B5CF6', text: 'Leave approved for Deepak Kumar', sub: '2 days · Personal leave', time: '3 hr ago' },
  ];

  const notifications = [
    { icon: Clock, color: '#F59E0B', title: '7 leave requests awaiting approval', time: 'Just now', badge: 'URGENT' },
    { icon: Bell, color: '#6C63FF', title: 'Attendance deadline: CS-5A by 4:00 PM', time: '15 min ago', badge: 'REMINDER' },
    { icon: AlertCircle, color: '#ef4444', title: '3 students below 75% attendance threshold', time: '1 hr ago', badge: 'ALERT' },
    { icon: Star, color: '#10b981', title: 'Monthly report auto-generated successfully', time: '2 hr ago', badge: null },
    { icon: Users, color: '#00C2FF', title: 'Faculty meeting scheduled — 5:00 PM today', time: '3 hr ago', badge: null },
  ];

  const upcomingClasses = [
    { subject: 'OS Lab', section: 'CS-3B', time: '11:30 AM', room: 'Lab-02', color: '#6C63FF' },
    { subject: 'Software Engg.', section: 'CS-5A', time: '02:00 PM', room: 'LH-301', color: '#FF4DA6' },
    { subject: 'DBMS Tutorial', section: 'CS-4A', time: '03:30 PM', room: 'LH-204', color: '#00C2FF' },
  ];

  const holidays = [
    { date: 'Jun 6', name: 'Eid-ul-Adha' },
    { date: 'Jun 15', name: 'Rajyotsava' },
    { date: 'Jul 4', name: 'Mid-Sem Break' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', 'Poppins', sans-serif" }}>

      {/* ══════════════ LEFT SIDEBAR ══════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: 260, minHeight: '100vh', background: 'white',
              borderRight: '1px solid #e2e8f0', display: 'flex',
              flexDirection: 'column', position: 'sticky', top: 0,
              zIndex: 50, boxShadow: '2px 0 16px rgba(0,0,0,0.04)', flexShrink: 0
            }}
          >
            {/* Logo */}
            <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(108,99,255,0.35)'
                }}>
                  <Activity size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AttendFlow
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>FACULTY PORTAL</div>
                </div>
              </div>
            </div>

            {/* Faculty mini profile in sidebar */}
            <div style={{ margin: '1rem 1.25rem', padding: '0.875rem', background: 'linear-gradient(135deg, #f8f4ff, #fff0f8)', borderRadius: '14px', border: '1px solid #e9d8fd' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: 'white', fontSize: '0.9rem'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'Professor'}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: '#6C63FF', margin: 0, fontWeight: 600 }}>Faculty Member</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 2px #dcfce7', flexShrink: 0 }} />
              </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 0.875rem', overflowY: 'auto' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
                MAIN MENU
              </p>
              {navItems.map(item => (
                <SideNavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  active={activeNav === item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'attendance') onNavigateToAttendance('faculty-attendance');
                    if (item.id === 'students') onNavigateToAttendance('students');
                    if (item.id === 'leave') onNavigateToAttendance('leave');
                  }}
                />
              ))}

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.875rem 0' }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
                SYSTEM
              </p>
              <SideNavItem icon={Shield} label="Security" active={false} onClick={() => setIsUpdatingKey(true)} />
              <SideNavItem icon={Database} label="SMS Console" active={false} onClick={() => {}} />
              <SideNavItem icon={LogOut} label="Sign Out" active={false} onClick={() => {}} />
            </nav>

            {/* Bottom version tag */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 600 }}>
                AttendFlow v2.0 · {academicYear}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ─── TOP HEADER ─── */}
        <header style={{
          height: 70, background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Left: Toggle + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: 6 }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>AttendFlow</span>
              <ChevronRight size={12} color="#cbd5e1" />
              <span style={{ fontSize: '0.75rem', color: '#6C63FF', fontWeight: 700, textTransform: 'capitalize' }}>{activeNav}</span>
            </div>
          </div>

          {/* Center: Search */}
          <div style={{ position: 'relative', maxWidth: 380, width: '100%', margin: '0 1.5rem' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder="Search students, reports, faculty..."
              style={{
                width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem',
                border: '1px solid #e2e8f0', borderRadius: '12px',
                background: '#f8fafc', fontSize: '0.82rem', color: '#1e293b',
                outline: 'none', fontWeight: 500, fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
            <kbd style={{
              position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '0.6rem', background: '#f1f5f9', border: '1px solid #e2e8f0',
              borderRadius: 5, padding: '2px 6px', color: '#94a3b8', fontFamily: 'inherit', fontWeight: 700
            }}>⌘K</kbd>
          </div>

          {/* Right: Notifs + Session + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Academic Session */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '10px', padding: '0.4rem 0.875rem'
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d' }}>AY {academicYear}</span>
            </div>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(p => !p)}
                style={{
                  position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: '12px', width: 40, height: 40, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Bell size={17} color="#475569" />
                <span style={{
                  position: 'absolute', top: -4, right: -4, width: 18, height: 18,
                  background: 'linear-gradient(135deg, #FF4DA6, #6C63FF)',
                  borderRadius: '50%', fontSize: '0.6rem', color: 'white', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white'
                }}>5</span>
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    style={{
                      position: 'absolute', top: '110%', right: 0, width: 320,
                      background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0',
                      boxShadow: '0 20px 48px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Notifications</span>
                      <span style={{ fontSize: '0.7rem', color: '#6C63FF', fontWeight: 700, cursor: 'pointer' }}>Mark all read</span>
                    </div>
                    <div style={{ padding: '0 1.25rem', maxHeight: 320, overflowY: 'auto' }}>
                      {notifications.map((n, i) => <NotifItem key={i} {...n} />)}
                    </div>
                    <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6C63FF', fontWeight: 700, cursor: 'pointer' }}>View all notifications →</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfile(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '12px', padding: '0.375rem 0.75rem 0.375rem 0.375rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: 'white', fontSize: '0.85rem'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{user?.name || 'Professor'}</p>
                  <p style={{ fontSize: '0.62rem', color: '#94a3b8', margin: 0, fontWeight: 600 }}>Faculty</p>
                </div>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{
                      position: 'absolute', top: '110%', right: 0, width: 200,
                      background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden'
                    }}
                  >
                    {[
                      { icon: User, label: 'My Profile', color: '#6C63FF' },
                      { icon: Settings, label: 'Settings', color: '#64748b' },
                      { icon: Lock, label: 'Change Key', color: '#F59E0B', action: () => setIsUpdatingKey(true) },
                      { icon: LogOut, label: 'Sign Out', color: '#ef4444' },
                    ].map(({ icon: Icon, label, color, action }) => (
                      <button key={label} onClick={action}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.625rem',
                          width: '100%', padding: '0.75rem 1rem',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.82rem', fontWeight: 600, color: '#374151',
                          borderBottom: '1px solid #f8fafc'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >
                        <Icon size={14} color={color} />
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ═══════════════════ DASHBOARD CONTENT ═══════════════════ */}
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ─── HERO GREETING BANNER ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF4DA6 60%, #00C2FF 100%)',
              borderRadius: '20px', padding: '1.75rem 2rem',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(108,99,255,0.28)'
            }}
          >
            {/* Decorative orbs */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }} />
            <div style={{ position: 'absolute', bottom: -30, left: 200, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(16px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Coffee size={16} color="rgba(255,255,255,0.8)" />
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{timeStr}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Good Morning</span>
                  </div>
                  <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', lineHeight: 1.2 }}>
                    Welcome Back, {user?.name ? `Prof. ${user.name.split(' ')[0]}` : 'Professor'} 👋
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '0.85rem', fontWeight: 500 }}>
                    {dateStr} · Academic Year {academicYear}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Classes Today', value: '5' },
                    { label: 'Avg Attendance', value: `${avgAttendance}%` },
                    { label: 'Pending Actions', value: `${pendingLeave || 7}` }
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)',
                      borderRadius: '14px', padding: '0.875rem 1.25rem',
                      border: '1px solid rgba(255,255,255,0.25)', textAlign: 'center'
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem', fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                      <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── KPI CARDS ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <KPICard
              icon={Users} title="Total Students" value={totalStudents || '134'}
              change="+3.2%" positive color="#6C63FF"
              gradient="linear-gradient(90deg, #6C63FF, #8B83FF)"
              sparkData={sparkStudents}
            />
            <KPICard
              icon={CheckCircle} title="Today's Attendance" value={presentToday || '91%'}
              change="+5.1%" positive color="#10B981"
              gradient="linear-gradient(90deg, #10B981, #34D399)"
              sparkData={sparkAttendance}
            />
            <KPICard
              icon={Clock} title="Pending Leaves" value={pendingLeave || '7'}
              change="+2" positive={false} color="#FF4DA6"
              gradient="linear-gradient(90deg, #FF4DA6, #FF85C8)"
              sparkData={sparkLeave}
            />
            <KPICard
              icon={Award} title="Active Faculty" value={activeFaculty}
              change="+1" positive color="#00C2FF"
              gradient="linear-gradient(90deg, #00C2FF, #38BDF8)"
              sparkData={sparkFaculty}
            />
          </div>

          {/* ─── MAIN GRID: 70% / 30% ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>

            {/* ── LEFT COLUMN 70% ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Attendance Analytics Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card" style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: '0 0 4px' }}>Attendance Analytics</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>12-month attendance trend — AY {academicYear}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Weekly', 'Monthly', 'Yearly'].map(f => (
                      <button key={f} onClick={() => setActiveFilter(f)}
                        style={{
                          padding: '0.375rem 0.875rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700,
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          background: activeFilter === f ? '#6C63FF' : '#f8fafc',
                          color: activeFilter === f ? 'white' : '#64748b'
                        }}
                      >{f}</button>
                    ))}
                  </div>
                </div>

                {/* Attendance % indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', padding: '0.875rem', background: 'linear-gradient(135deg, #f8f4ff, #fff0f8)', borderRadius: '14px' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 2px', textTransform: 'uppercase' }}>Overall Rate</p>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: '#6C63FF', margin: 0 }}>{avgAttendance || 91}%</p>
                  </div>
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  {[
                    { label: 'Present', val: presentToday || 91, color: '#6C63FF' },
                    { label: 'Absent', val: 14, color: '#FF4DA6' },
                    { label: 'Late', val: 8, color: '#F59E0B' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: 800, color, margin: 0 }}>{val}%</p>
                    </div>
                  ))}
                </div>

                <AttendanceTrendChart />
              </motion.div>

              {/* Today's Class Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card" style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: '0 0 4px' }}>Today's Class Schedule</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>Monday, {today.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}</p>
                  </div>
                  <button
                    onClick={() => onNavigateToAttendance('faculty-attendance')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                      border: 'none', borderRadius: '10px', padding: '0.5rem 1rem',
                      color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    <PlusCircle size={14} />
                    Mark Attendance
                  </button>
                </div>
                {scheduleData.map((s, i) => <ScheduleRow key={i} {...s} />)}
              </motion.div>

              {/* Analytics Section: Donut + Bar + Heatmap */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                {/* Student Presence Donut */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card" style={{ padding: '1.5rem' }}
                >
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 1.25rem' }}>Student Presence</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <DonutChart present={avgAttendance || 78} absent={14} late={8} />
                    <div style={{ flex: 1 }}>
                      {[
                        { label: 'Present', val: `${avgAttendance || 78}%`, color: '#6C63FF' },
                        { label: 'Absent', val: '14%', color: '#FF4DA6' },
                        { label: 'Late', val: '8%', color: '#00C2FF' },
                      ].map(({ label, val, color }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>{label}</span>
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Department Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="glass-card" style={{ padding: '1.5rem' }}
                >
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 1.25rem' }}>Dept. Comparison</h3>
                  <DeptBarChart />
                </motion.div>
              </div>

              {/* Monthly Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card" style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 4px' }}>Monthly Performance Heatmap</h3>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>Daily attendance intensity — Jun 2026</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>Less</span>
                    {['#f1f5f9', '#E8E7FF', '#B8B4FF', '#8B83FF', '#6C63FF'].map(c => (
                      <div key={c} style={{ width: 14, height: 14, borderRadius: 4, background: c }} />
                    ))}
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>More</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                      <span key={d} style={{ height: 28, fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{d}</span>
                    ))}
                  </div>
                  <HeatmapWidget />
                </div>
              </motion.div>

              {/* Recent Activity Feed */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass-card" style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>Recent Activity Feed</h3>
                  <button style={{ fontSize: '0.72rem', color: '#6C63FF', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
                </div>
                <div>
                  {activityFeed.map((a, i) => <ActivityFeedItem key={i} {...a} />)}
                </div>
              </motion.div>

              {/* SMS Console */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card" style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={18} color="#6C63FF" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>Parent SMS Console</h3>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 0', fontWeight: 500 }}>Outbound SMS logs & sandbox gateway</p>
                    </div>
                  </div>
                  <button onClick={fetchSmsLogs} disabled={isLoadingSmsLogs}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.5rem 1rem', background: '#f8fafc',
                      border: '1px solid #e2e8f0', borderRadius: '10px',
                      fontSize: '0.75rem', fontWeight: 700, color: '#475569', cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={13} className={isLoadingSmsLogs ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem' }}>
                  {/* SMS Logs Table */}
                  <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', maxHeight: 300, overflowY: 'auto' }}>
                    {smsLogs.length === 0 ? (
                      <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                        <MessageSquare size={28} style={{ margin: '0 auto 0.875rem', opacity: 0.4 }} />
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>No SMS logs yet</p>
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                            {['Student', 'Phone', 'Message', 'Time', 'Status'].map(h => (
                              <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {smsLogs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600, color: '#1e293b' }}>{log.studentName}</td>
                              <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>{log.recipientNumber}</td>
                              <td style={{ padding: '0.75rem', color: '#64748b', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.messageContent}</td>
                              <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{log.sentTime}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  padding: '2px 8px', borderRadius: 99, fontSize: '0.62rem', fontWeight: 800,
                                  background: log.status?.includes('DELIVERED') ? '#dcfce7' : '#e0e7ff',
                                  color: log.status?.includes('DELIVERED') ? '#16a34a' : '#4338ca'
                                }}>{log.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* SMS Sandbox */}
                  <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.75rem' }}>Sandbox Gateway</p>
                    <form onSubmit={handleSendTestSms} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { label: 'Parent Mobile', type: 'tel', placeholder: '+919876543210', val: testPhone, set: setTestPhone, required: true },
                        { label: 'Student Name', type: 'text', placeholder: 'e.g. Alice Johnson', val: testStudentName, set: setTestStudentName },
                      ].map(({ label, type, placeholder, val, set, required }) => (
                        <div key={label}>
                          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</label>
                          <input type={type} placeholder={placeholder} required={required} value={val} onChange={e => set(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.8rem', fontFamily: 'inherit', background: 'white', color: '#1e293b', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Message</label>
                        <textarea placeholder="Custom SMS body..." rows={2} value={testMessage} onChange={e => setTestMessage(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.8rem', fontFamily: 'inherit', background: 'white', color: '#1e293b', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <button type="submit" disabled={isSendingTestSms}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          width: '100%', padding: '0.625rem', borderRadius: '10px', border: 'none',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit'
                        }}
                      >
                        <Send size={13} />
                        {isSendingTestSms ? 'Sending...' : 'Send Test SMS'}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>

              {/* Section filter + Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="glass-card" style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>Advanced Analytics</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['All', 'A', 'B', 'C', 'D'].map(s => (
                      <button key={s} onClick={() => setSelectedSection(s)}
                        style={{
                          padding: '0.375rem 0.875rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700,
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          background: selectedSection === s ? 'linear-gradient(135deg, #6C63FF, #FF4DA6)' : '#f8fafc',
                          color: selectedSection === s ? 'white' : '#64748b'
                        }}
                      >{s === 'All' ? 'All Sections' : `Sec ${s}`}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
                  {[
                    { icon: Activity, title: 'Live Classes', value: '04', color: '#6C63FF', bg: '#f0edff' },
                    { icon: Users, title: 'Total Students', value: totalStudents || '134', color: '#10b981', bg: '#f0fdf4' },
                    { icon: CheckCircle, title: 'Avg Attendance', value: `${avgAttendance || 87}%`, color: '#00C2FF', bg: '#f0faff' },
                    { icon: Clock, title: 'Pending Records', value: pendingLeave || '7', color: '#F59E0B', bg: '#fffbeb' },
                    { icon: FileText, title: 'Reports Gen.', value: '12', color: '#8B5CF6', bg: '#f5f0ff' },
                    { icon: Star, title: 'Completion Rate', value: '96%', color: '#FF4DA6', bg: '#fff0f8' },
                  ].map(({ icon: Icon, title, value, color, bg }) => (
                    <div key={title} style={{ background: bg, borderRadius: '14px', padding: '1rem', border: `1px solid ${color}22` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                        <Icon size={15} color={color} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{title}</span>
                      </div>
                      <p style={{ fontSize: '1.75rem', fontWeight: 800, color, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                  <button onClick={handleFinalizeRegistry}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <CheckCircle size={14} /> Finalize Registry
                  </button>
                  <button onClick={() => generateMasterReport(students)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: '#f0edff', border: '1px solid #c4b5fd', borderRadius: '12px', color: '#6C63FF', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Download size={14} /> Export Master
                  </button>
                  <button onClick={handleSimulateSweep}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <RefreshCw size={14} /> Simulate Sweep
                  </button>
                </div>
              </motion.div>

              {/* ClassSchedule component */}
              <ClassSchedule />
            </div>

            {/* ── RIGHT COLUMN 30% ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card" style={{ padding: '1.25rem' }}
              >
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 1rem' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <QuickAction icon={CheckCircle} label="Mark Attendance" color="#6C63FF" onClick={() => onNavigateToAttendance('faculty-attendance')} />
                  <QuickAction icon={UserPlus} label="Add Student" color="#10b981" onClick={() => onNavigateToAttendance('students')} />
                  <QuickAction icon={FileText} label="Generate Report" color="#FF4DA6" onClick={() => generateStudentReport(students)} />
                  <QuickAction icon={Download} label="Download Registry" color="#00C2FF" onClick={() => generateRegistryExport(students)} />
                  <QuickAction icon={Clock} label="Approve Leave Request" color="#F59E0B" onClick={() => onNavigateToAttendance('leave')} />
                  <QuickAction icon={BookOpen} label="Curriculum Hub" color="#8B5CF6" onClick={() => {}} />
                </div>
              </motion.div>

              {/* Notifications Center */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card" style={{ padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>Notifications</h3>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '3px 9px', borderRadius: 99, background: '#fee2e2', color: '#dc2626' }}>5 new</span>
                </div>
                {notifications.map((n, i) => <NotifItem key={i} {...n} />)}
              </motion.div>

              {/* Faculty Performance */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 8px 32px rgba(15,23,42,0.25)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', margin: 0 }}>My Performance</h3>
                  <TrendingUp size={16} color="#6C63FF" />
                </div>
                {[
                  { label: 'Classes Conducted', value: '48', max: 60, color: '#6C63FF' },
                  { label: 'Attendance Completion', value: '96%', max: 100, pct: 96, color: '#10b981' },
                  { label: 'Pending Tasks', value: '3', max: 10, pct: 30, color: '#FF4DA6' },
                  { label: 'Reports Submitted', value: '12/12', max: 100, pct: 100, color: '#00C2FF' },
                ].map(({ label, value, pct, max, color }) => (
                  <div key={label} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 800 }}>{value}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct || (parseInt(value) / max * 100)}%` }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 99, background: color }}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <MiniBarChart data={[3, 5, 4, 6, 5, 7, 5, 8, 6, 9, 8, 9]} color="#6C63FF" />
                  <MiniBarChart data={[80, 82, 85, 84, 88, 87, 91, 90, 93, 92, 95, 96]} color="#10b981" />
                </div>
              </motion.div>

              {/* Upcoming Classes */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card" style={{ padding: '1.25rem' }}
              >
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 1rem' }}>Upcoming Classes</h3>
                {upcomingClasses.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 0', borderBottom: i < upcomingClasses.length - 1 ? '1px solid #f8fafc' : 'none'
                  }}>
                    <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 99, background: c.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{c.subject}</p>
                      <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>{c.section} · {c.room}</p>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.color, flexShrink: 0 }}>{c.time}</span>
                  </div>
                ))}
              </motion.div>

              {/* Syllabus Hub */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card" style={{ padding: '1.25rem' }}
              >
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 1rem' }}>Curriculum Hub</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { dept: 'Computer Science', scheme: 'C-25', color: '#6C63FF', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_1_4_ComputerScience&Engineering.pdf' },
                    { dept: 'Electrical Engg.', scheme: 'C-25', color: '#F59E0B', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_EE_1_4_Electrical&ElectronicsEngineering.pdf' },
                    { dept: 'Mechanical Engg.', scheme: 'C-25', color: '#10b981', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_ME_1_4_MechanicalEngineering.pdf' },
                    { dept: 'Civil Engg.', scheme: 'C-25', color: '#00C2FF', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_CE_1_4_CivilEngineering.pdf' },
                    { dept: 'Metallurgical', scheme: 'C-25', color: '#8B5CF6', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_MT_1_4_MetallurgicalEngineering.pdf' },
                    { dept: 'C-20 Syllabus', scheme: 'Web', color: '#FF4DA6', url: 'https://dtek.karnataka.gov.in/52/c-20-syllabus/en' },
                  ].map(({ dept, scheme, color, url }) => (
                    <button key={dept} onClick={() => window.open(url, '_blank')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.625rem 0.875rem', background: '#f8fafc',
                        border: '1px solid #e2e8f0', borderRadius: '12px',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.borderColor = `${color}44`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <BookMarked size={14} color={color} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', flex: 1 }}>{dept}</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: `${color}18`, color }}>{scheme}</span>
                      <ArrowUpRight size={12} color="#94a3b8" />
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Holidays */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                style={{ background: 'linear-gradient(135deg, #fffbeb, #fff0f8)', borderRadius: '20px', border: '1px solid #fde68a', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#92400e', margin: 0 }}>Upcoming Holidays</h3>
                  <Calendar size={16} color="#F59E0B" />
                </div>
                {holidays.map(({ date, name }) => (
                  <div key={date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #fde68a44' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400e' }}>{name}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#F59E0B', background: '#fef3c7', padding: '2px 8px', borderRadius: 8 }}>{date}</span>
                  </div>
                ))}
              </motion.div>

              {/* Faculty Availability */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card" style={{ padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>Faculty Availability</h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', background: '#dcfce7', padding: '3px 8px', borderRadius: 8 }}>Live</span>
                </div>
                {['M Shiva Balaji', 'Shaik Irshan', 'D Charan Venkat', 'Sidda Reddy', 'Harsha Reddy'].map((name, i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${['#6C63FF', '#FF4DA6', '#00C2FF', '#10b981', '#F59E0B'][i]}, ${['#8B83FF', '#FF85C8', '#38BDF8', '#34D399', '#FCD34D'][i]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, color: 'white', fontSize: '0.7rem', flexShrink: 0
                    }}>{name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{name}</p>
                      <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>SGP Faculty</p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: i % 3 === 2 ? '#F59E0B' : '#22c55e', flexShrink: 0 }} />
                  </div>
                ))}
              </motion.div>

              {/* Pending Approvals */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="glass-card" style={{ padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>Pending Approvals</h3>
                  <button onClick={() => onNavigateToAttendance('leave')}
                    style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FF4DA6', background: '#fff0f8', border: '1px solid #fce7f3', padding: '3px 10px', borderRadius: 8, cursor: 'pointer' }}>
                    {pendingLeave || 7} pending
                  </button>
                </div>
                {[
                  { name: 'Rahul Verma', type: 'Medical Leave', days: 3, urgency: 'high' },
                  { name: 'Sneha Patel', type: 'Personal Leave', days: 2, urgency: 'medium' },
                  { name: 'Amit Kumar', type: 'Family Emergency', days: 5, urgency: 'high' },
                ].map(({ name, type, days, urgency }) => (
                  <div key={name} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '0.5rem',
                    border: `1px solid ${urgency === 'high' ? '#fecaca' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF4DA6, #6C63FF)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0
                    }}>{name.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{name}</p>
                      <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: '1px 0 0', fontWeight: 500 }}>{type} · {days}d</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button style={{ width: 26, height: 26, borderRadius: 8, background: '#dcfce7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={13} color="#16a34a" />
                      </button>
                      <button style={{ width: 26, height: 26, borderRadius: 8, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <XCircle size={13} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* ══════════════ STATUS MESSAGE ══════════════ */}
      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60 }}
            style={{
              position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: status.type === 'success' ? '#16a34a' : '#dc2626',
              padding: '0.875rem 1.5rem', borderRadius: '14px', zIndex: 9999,
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontWeight: 700, fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap'
            }}
          >
            {status.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ FINALIZE REGISTRY POPUP ══════════════ */}
      <AnimatePresence>
        {showRegistryPopup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 200, padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                background: 'white', borderRadius: '28px', padding: '3rem 2.5rem',
                maxWidth: 420, width: '100%', textAlign: 'center',
                boxShadow: '0 32px 80px rgba(16,185,129,0.3)',
                border: '1px solid rgba(16,185,129,0.2)'
              }}
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: 80, height: 80, background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', boxShadow: '0 8px 32px rgba(16,185,129,0.4)'
                }}
              >
                <CheckCircle size={40} color="white" />
              </motion.div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.75rem' }}>Registry Finalized!</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>Student Registry has been successfully finalized and locked.</p>
              <button onClick={() => setShowRegistryPopup(false)}
                style={{
                  marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.875rem', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                <CheckCircle size={16} /> Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ ACCESS KEY MODAL ══════════════ */}
      <AnimatePresence>
        {isUpdatingKey && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 100, padding: '1rem'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'white', borderRadius: '24px', padding: '2.5rem',
                maxWidth: 420, width: '100%',
                boxShadow: '0 24px 64px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={20} color="#6C63FF" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>Update Access Key</h3>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>Security credential update</p>
                  </div>
                </div>
                <button onClick={() => setIsUpdatingKey(false)}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={16} color="#94a3b8" />
                </button>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleUpdateKey}>
                {[
                  { label: 'Current Access Key', val: oldKey, set: setOldKey, placeholder: 'Enter current PIN...' },
                  { label: 'New Access Key', val: newKey, set: setNewKey, placeholder: 'Enter new 6-digit PIN...' },
                ].map(({ label, val, set, placeholder }) => (
                  <div key={label}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
                    <input type="password" placeholder={placeholder} required value={val} onChange={e => set(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}

                {status.message && (
                  <div style={{
                    padding: '0.75rem', borderRadius: '10px',
                    background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: status.type === 'success' ? '#16a34a' : '#dc2626',
                    fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    {status.type === 'success' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {status.message}
                  </div>
                )}

                <button type="submit"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    width: '100%', padding: '0.875rem', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                    color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    fontFamily: 'inherit', marginTop: '0.5rem'
                  }}
                >
                  <Send size={16} />
                  Update Access Key
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyDashboard;
