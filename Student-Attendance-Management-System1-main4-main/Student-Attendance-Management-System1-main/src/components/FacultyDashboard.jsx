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

/* ─────────────────── HIGH-FIDELITY SPARKLINE COMPONENT ─────────────────── */
const Sparkline = ({ data, color, height = 44, width = 120 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  
  const id = `sg-${color.replace('#','')}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts} ${width},${height}`}
        fill={`url(#${id})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {(() => {
        const lastParts = pts.split(' ').pop().split(',');
        return (
          <g>
            <circle cx={lastParts[0]} cy={lastParts[1]} r="4" fill="white" stroke={color} strokeWidth="2.5" />
            <circle cx={lastParts[0]} cy={lastParts[1]} r="7" fill={color} fillOpacity="0.3" className="animate-ping" style={{ transformOrigin: `${lastParts[0]}px ${lastParts[1]}px` }} />
          </g>
        );
      })()}
    </svg>
  );
};

/* ─────────────────── MINI BAR CHART ─────────────────── */
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data) || 1;
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '52px', padding: '4px 0', position: 'relative' }}>
      {data.map((v, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? color : `${color}38`,
            borderRadius: '4px 4px 0 0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '6px',
            cursor: 'pointer',
            transform: hoveredIdx === i ? 'scaleX(1.15) translateY(-2px)' : 'none',
            boxShadow: hoveredIdx === i ? `0 4px 12px ${color}40` : 'none'
          }}
          title={`Value: ${v}`}
        />
      ))}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0f172a',
              color: 'white',
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            Val: {data[hoveredIdx]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────── PREMIUM DONUT CHART ─────────────────── */
const DonutChart = ({ present = 78, absent = 14, late = 8 }) => {
  const size = 130;
  const r = 48;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = present + absent + late;
  const presentDash = (present / total) * circumference;
  const absentDash = (absent / total) * circumference;
  const lateDash = (late / total) * circumference;

  const [activeSegment, setActiveSegment] = useState(null);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        
        {/* Present segment */}
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke="#6C63FF" strokeWidth={activeSegment === 'present' ? '16' : '12'}
          strokeDasharray={`${presentDash} ${circumference}`}
          strokeDashoffset="0" strokeLinecap="round"
          style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
          onMouseEnter={() => setActiveSegment('present')}
          onMouseLeave={() => setActiveSegment(null)}
        />
        
        {/* Absent segment */}
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke="#FF4DA6" strokeWidth={activeSegment === 'absent' ? '16' : '12'}
          strokeDasharray={`${absentDash} ${circumference}`}
          strokeDashoffset={-presentDash} strokeLinecap="round"
          style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
          onMouseEnter={() => setActiveSegment('absent')}
          onMouseLeave={() => setActiveSegment(null)}
        />
        
        {/* Late segment */}
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke="#00C2FF" strokeWidth={activeSegment === 'late' ? '16' : '12'}
          strokeDasharray={`${lateDash} ${circumference}`}
          strokeDashoffset={-(presentDash + absentDash)} strokeLinecap="round"
          style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
          onMouseEnter={() => setActiveSegment('late')}
          onMouseLeave={() => setActiveSegment(null)}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {activeSegment === 'present' ? `${present}%` : activeSegment === 'absent' ? `${absent}%` : activeSegment === 'late' ? `${late}%` : `${present}%`}
        </span>
        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.05em', marginTop: '4px', textTransform: 'uppercase' }}>
          {activeSegment ? activeSegment : 'PRESENT'}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────── HIGH-DENSITY HEATMAP WIDGET ─────────────────── */
const HeatmapWidget = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = 7;
  
  // Seed stable random data
  const data = [
    [92, 85, 78, 64, 91, 88],
    [74, 95, 82, 45, 93, 76],
    [88, 72, 86, 94, 79, 91],
    [90, 84, 92, 78, 85, 96],
    [81, 93, 75, 82, 88, 90],
    [95, 88, 91, 74, 96, 85],
    [89, 76, 84, 91, 82, 94]
  ];

  const [hoveredCell, setHoveredCell] = useState(null);

  const getColor = (v) => {
    if (v >= 90) return '#6C63FF';
    if (v >= 80) return '#8B83FF';
    if (v >= 70) return '#A8A2FF';
    if (v >= 50) return '#C7C4FF';
    return '#EBEAFF';
  };

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', position: 'relative', padding: '4px 0' }}>
      {data.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {week.map((val, di) => (
            <div
              key={di}
              onMouseEnter={() => setHoveredCell({ wi, di, val })}
              onMouseLeave={() => setHoveredCell(null)}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: getColor(val),
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCell?.wi === wi && hoveredCell?.di === di ? 'scale(1.2) translateY(-2px)' : 'none',
                boxShadow: hoveredCell?.wi === wi && hoveredCell?.di === di ? '0 6px 16px rgba(108,99,255,0.45)' : 'none',
                zIndex: hoveredCell?.wi === wi && hoveredCell?.di === di ? 2 : 1
              }}
            />
          ))}
        </div>
      ))}

      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              position: 'absolute',
              bottom: '108%',
              left: `${hoveredCell.wi * 36 + 12}px`,
              background: '#0f172a',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 20,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ fontWeight: 800, color: '#A8A2FF', marginBottom: '2px' }}>{days[hoveredCell.di]} Week {hoveredCell.wi + 1}</div>
            <div>Presence: <span style={{ fontWeight: 800, color: 'white' }}>{hoveredCell.val}%</span></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────── HIGH-FIDELITY INTERACTIVE LINE CHART ─────────────────── */
const AttendanceTrendChart = ({ data }) => {
  const chartData = data || [78, 82, 76, 88, 85, 91, 87, 93, 89, 94, 91, 96];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const W = 520, H = 180;
  const padX = 35, padY = 25;
  const chartW = W - padX * 2, chartH = H - padY * 2;
  const max = 100, min = 60;
  
  const pts = chartData.map((v, i) => {
    const x = padX + (i / (chartData.length - 1)) * chartW;
    const y = padY + chartH - ((v - min) / (max - min)) * chartH;
    return [x, y];
  });
  
  // Make curved line using bezier curves
  let pathD = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpX1 = pts[i][0] + chartW / (chartData.length - 1) / 2;
    const cpY1 = pts[i][1];
    const cpX2 = pts[i + 1][0] - chartW / (chartData.length - 1) / 2;
    const cpY2 = pts[i + 1][1];
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
  }
  
  const areaD = `${pathD} L ${pts[pts.length - 1][0]} ${H - padY} L ${pts[0][0]} ${H - padY} Z`;

  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '400px', overflow: 'visible' }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="50%" stopColor="#FF4DA6" />
            <stop offset="100%" stopColor="#00C2FF" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[60, 70, 80, 90, 100].map((v, i) => {
          const y = padY + chartH - ((v - min) / (max - min)) * chartH;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="#f1f5f9" strokeWidth="1.2" />
              <text x={padX - 8} y={y + 3} textAnchor="end" style={{ fontSize: '9px', fill: '#94a3b8', fontWeight: 600, fontFamily: 'monospace' }}>{v}%</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#trendGrad)" />
        
        {/* Line curve */}
        <path d={pathD} fill="none" stroke="url(#lineGrad2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dynamic active vertical guide-line */}
        {hoveredIdx !== null && (
          <line
            x1={pts[hoveredIdx][0]}
            y1={padY}
            x2={pts[hoveredIdx][0]}
            y2={H - padY}
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
        )}

        {/* Data points overlay */}
        {pts.map(([x, y], i) => (
          <g
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={x}
              cy={y}
              r={hoveredIdx === i ? 7 : 4}
              fill="white"
              stroke={hoveredIdx === i ? '#FF4DA6' : '#6C63FF'}
              strokeWidth="2.5"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            {hoveredIdx === i && (
              <circle
                cx={x}
                cy={y}
                r="12"
                fill="#FF4DA6"
                fillOpacity="0.15"
              />
            )}
          </g>
        ))}

        {/* X labels */}
        {labels.map((l, i) => {
          const x = padX + (i / (labels.length - 1)) * chartW;
          return (
            <text key={i} x={x} y={H - 6} textAnchor="middle"
              style={{ fontSize: '9px', fill: '#94a3b8', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
              {l}
            </text>
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              top: `${pts[hoveredIdx][1] - 44}px`,
              left: `${pts[hoveredIdx][0] - 50}px`,
              width: 100,
              background: '#0f172a',
              color: 'white',
              padding: '6px 8px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 30,
              pointerEvents: 'none',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{labels[hoveredIdx]}</div>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#00C2FF' }}>{chartData[hoveredIdx]}% Rate</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────── DEPARTMENT COMPARISON BAR CHART ─────────────────── */
const DeptBarChart = () => {
  const depts = [
    { name: 'CS', val: 91, color: '#6C63FF' },
    { name: 'EE', val: 87, color: '#FF4DA6' },
    { name: 'ME', val: 84, color: '#00C2FF' },
    { name: 'CE', val: 79, color: '#F59E0B' },
    { name: 'MT', val: 88, color: '#10B981' },
    { name: 'EC', val: 93, color: '#8B5CF6' },
  ];
  const [hoveredDept, setHoveredDept] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {depts.map((d) => (
        <div
          key={d.name}
          onMouseEnter={() => setHoveredDept(d.name)}
          onMouseLeave={() => setHoveredDept(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            transform: hoveredDept === d.name ? 'translateX(4px)' : 'none',
            transition: 'transform 0.2s ease'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', width: '26px', flexShrink: 0 }}>{d.name}</span>
          <div style={{ flex: 1, height: '12px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${d.val}%` }}
              transition={{ duration: 1, delay: 0.1 }}
              style={{
                height: '100%',
                background: hoveredDept === d.name 
                  ? `linear-gradient(90deg, ${d.color}, ${d.color}cc)`
                  : d.color,
                borderRadius: '99px',
                boxShadow: hoveredDept === d.name ? `0 0 10px ${d.color}60` : 'none',
                transition: 'background 0.3s ease'
              }}
            />
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 900,
            color: d.color,
            width: '36px',
            textAlign: 'right',
            scale: hoveredDept === d.name ? '1.1' : '1',
            transition: 'scale 0.2s ease'
          }}>{d.val}%</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────── NOTIFICATION ITEM ─────────────────── */
const NotifItem = ({ icon: Icon, color, title, time, badge }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
    padding: '0.95rem 0', borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer'
  }} className="hover-trigger">
    <div style={{
      width: 38, height: 38, borderRadius: 12,
      background: `${color}12`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
      border: `1px solid ${color}20`
    }}>
      <Icon size={16} color={color} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
      <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '3px 0 0', fontWeight: 600 }}>{time}</p>
    </div>
    {badge && (
      <span style={{
        fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px',
        borderRadius: 99, background: `${color}15`, color, flexShrink: 0,
        letterSpacing: '0.04em'
      }}>{badge}</span>
    )}
  </div>
);

/* ─────────────────── PREMIUM KPI CARD ─────────────────── */
const KPICard = ({ icon: Icon, title, value, change, positive, color, sparkData, gradient }) => (
  <motion.div
    whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(108,99,255,0.08)', borderColor: `${color}40` }}
    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    style={{
      background: 'white',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
    }}
  >
    {/* Colored gradient branding top border */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
      background: gradient || `linear-gradient(90deg, ${color}, ${color}88)`
    }} />
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: 46, height: 46, borderRadius: 14,
        background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${color}20`
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: positive ? '#f0fdf4' : '#fef2f2',
        padding: '4px 8px', borderRadius: 99,
        border: `1px solid ${positive ? '#bbf7d0' : '#fecaca'}`
      }}>
        {positive ? <ArrowUpRight size={13} color="#16a34a" /> : <ArrowDownRight size={13} color="#dc2626" />}
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: positive ? '#16a34a' : '#dc2626' }}>
          {change}
        </span>
      </div>
    </div>
    
    <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.1, letterSpacing: '-0.03em' }}>{value}</h2>
      </div>
      <div style={{ flexShrink: 0 }}>
        <Sparkline data={sparkData} color={color} />
      </div>
    </div>
  </motion.div>
);

/* ─────────────────── CLASS TIMETABLE ROW ─────────────────── */
const ScheduleRow = ({ subject, section, time, room, status }) => {
  const statusMap = {
    'Ongoing': { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', dot: '#10b981', pulse: true },
    'Upcoming': { bg: '#e0e7ff', color: '#4338ca', border: '#c7d2fe', dot: '#6C63FF', pulse: false },
    'Completed': { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', dot: '#94a3b8', pulse: false },
    'Cancelled': { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', dot: '#ef4444', pulse: false }
  };
  const s = statusMap[status] || statusMap['Upcoming'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.25rem',
      padding: '1rem 0', borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0,
          boxShadow: `0 0 0 4px ${s.dot}25`, zIndex: 2
        }} />
        {s.pulse && (
          <div
            style={{
              position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: s.dot,
              boxShadow: `0 0 0 6px ${s.dot}30`, animation: 'ping 1.5s infinite', zIndex: 1
            }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject}</p>
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 0', fontWeight: 600 }}>{section} · Lecture Hall {room}</p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', margin: 0 }}>{time}</p>
      </div>
      <span style={{
        padding: '4px 12px', borderRadius: 99, fontSize: '0.65rem',
        fontWeight: 800, background: s.bg, color: s.color, border: `1px solid ${s.border}`, flexShrink: 0,
        textTransform: 'uppercase', letterSpacing: '0.04em'
      }}>{status}</span>
    </div>
  );
};

/* ─────────────────── TIMELINE ACTIVITY ITEM ─────────────────── */
const ActivityFeedItem = ({ icon: Icon, color, text, time, sub }) => (
  <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1.25rem', position: 'relative' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 12,
        background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${color}20`, zIndex: 2
      }}>
        <Icon size={15} color={color} />
      </div>
      <div style={{ width: 2, flex: 1, background: '#f1f5f9', marginTop: 8, zIndex: 1 }} />
    </div>
    <div style={{ paddingTop: 3, flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.45 }}>{text}</p>
      {sub && <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 600 }}>{sub}</p>}
      <p style={{ fontSize: '0.7rem', color: '#cbd5e1', margin: '4px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{time}</p>
    </div>
  </div>
);

/* ─────────────────── SAAS QUICK ACTION BUTTON ─────────────────── */
const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.025, y: -2, borderColor: `${color}50`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.85rem',
      width: '100%', padding: '0.95rem 1rem',
      background: 'white', border: '1px solid #e2e8f0',
      borderRadius: '16px', cursor: 'pointer',
      transition: 'all 0.2s', textAlign: 'left'
    }}
  >
    <div style={{
      width: 38, height: 38, borderRadius: 12,
      background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      border: `1px solid ${color}20`
    }}>
      <Icon size={17} color={color} />
    </div>
    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{label}</span>
    <ChevronRight size={14} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
  </motion.button>
);

/* ─────────────────── SIDEBAR NAV ITEM ─────────────────── */
const SideNavItem = ({ icon: Icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.85rem',
      padding: '0.85rem 1.1rem', width: '100%',
      borderRadius: '14px', border: 'none', cursor: 'pointer',
      background: active ? 'linear-gradient(135deg, #6C63FF, #FF4DA6)' : 'transparent',
      color: active ? 'white' : '#64748b',
      fontWeight: active ? 800 : 600, fontSize: '0.875rem',
      transition: 'all 0.2s', textAlign: 'left',
      marginBottom: '3px', position: 'relative',
      boxShadow: active ? '0 4px 14px rgba(108,99,255,0.25)' : 'none'
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#6C63FF'; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}}
  >
    {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3.5, background: 'rgba(255,255,255,0.8)', borderRadius: '0 4px 4px 0' }} />}
    <Icon size={18} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge && (
      <span style={{
        background: active ? 'rgba(255,255,255,0.25)' : '#ff4da615',
        color: active ? 'white' : '#FF4DA6',
        fontSize: '0.65rem', fontWeight: 900,
        padding: '2px 8px', borderRadius: 99
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
    { id: 'logout', icon: LogOut, label: 'Logout' },
  ];

  const scheduleData = [
    { subject: 'Data Structures & Algorithms', section: 'CS-3A', time: '08:30 AM', room: '201', status: 'Completed' },
    { subject: 'Computer Networks', section: 'CS-4B', time: '10:00 AM', room: '105', status: 'Ongoing' },
    { subject: 'Operating Systems Lab', section: 'CS-3B', time: '11:30 AM', room: '02', status: 'Upcoming' },
    { subject: 'Software Engineering', section: 'CS-5A', time: '02:00 PM', room: '301', status: 'Upcoming' },
    { subject: 'DBMS Tutorial', section: 'CS-4A', time: '03:30 PM', room: '204', status: 'Upcoming' },
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
              width: 270, minHeight: '100vh', background: 'white',
              borderRight: '1px solid #e2e8f0', display: 'flex',
              flexDirection: 'column', position: 'sticky', top: 0,
              zIndex: 50, boxShadow: '2px 0 20px rgba(0,0,0,0.03)', flexShrink: 0
            }}
          >
            {/* Logo */}
            <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 14,
                  background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(108,99,255,0.32)',
                  position: 'relative'
                }}>
                  <Activity size={22} color="white" />
                  <span style={{ position: 'absolute', right: -2, top: -2, width: 8, height: 8, borderRadius: '50%', background: '#00C2FF', border: '2px solid white' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #6C63FF, #FF4DA6, #00C2FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AttendFlow
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.08em' }}>ENTERPRISE ERP</div>
                </div>
              </div>
            </div>

            {/* Faculty mini profile in sidebar */}
            <div style={{ margin: '1.25rem', padding: '1rem', background: 'linear-gradient(135deg, #f3f0ff, #fff0f6)', borderRadius: '16px', border: '1px solid rgba(108,99,255,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, color: 'white', fontSize: '0.95rem',
                  boxShadow: '0 4px 10px rgba(108,99,255,0.2)'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'Professor'}
                  </p>
                  <p style={{ fontSize: '0.68rem', color: '#6C63FF', margin: 0, fontWeight: 700 }}>Faculty Member</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.25)', flexShrink: 0 }} />
              </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 0.5rem', marginBottom: '0.75rem' }}>
                MAIN PLATFORM
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
                    else if (item.id === 'students') onNavigateToAttendance('students');
                    else if (item.id === 'leave') onNavigateToAttendance('leave');
                    else if (item.id === 'curriculum') onNavigateToAttendance('curriculum');
                    else if (item.id === 'analytics') onNavigateToAttendance('analytics');
                    else if (item.id === 'reports') onNavigateToAttendance('reports');
                    else if (item.id === 'settings') onNavigateToAttendance('settings');
                    else if (item.id === 'logout') onNavigateToAttendance('logout');
                    else onNavigateToAttendance(item.id);
                  }}
                />
              ))}

              <div style={{ height: '1px', background: '#f1f5f9', margin: '1.25rem 0' }} />
              <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 0.5rem', marginBottom: '0.75rem' }}>
                CONSOLE UTILITIES
              </p>
              <SideNavItem icon={Shield} label="Security Panel" active={false} onClick={() => setIsUpdatingKey(true)} />
              <SideNavItem icon={Database} label="SMS logs Console" active={false} onClick={() => {
                const element = document.getElementById('sms-console-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }} />
              <SideNavItem icon={LogOut} label="Log Out Account" active={false} onClick={() => onNavigateToAttendance('logout')} />
            </nav>

            {/* Bottom version tag */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1', fontWeight: 700, letterSpacing: '0.02em' }}>
                AttendFlow Platform v2.5 · {academicYear}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ─── TOP HEADER ─── */}
        <header style={{
          height: 70, background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 1px 8px rgba(0,0,0,0.02)'
        }}>
          {/* Left: Toggle + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
                cursor: 'pointer', color: '#64748b', display: 'flex', padding: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6C63FF'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.02em' }}>Portal</span>
              <ChevronRight size={12} color="#cbd5e1" />
              <span style={{ fontSize: '0.8rem', color: '#6C63FF', fontWeight: 800, textTransform: 'capitalize', letterSpacing: '0.02em' }}>{activeNav}</span>
            </div>
          </div>

          {/* Center: SaaS-inspired Search with Command badge */}
          <div style={{ position: 'relative', maxWidth: 420, width: '100%', margin: '0 2rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder="Search registry database, reports, schedules..."
              style={{
                width: '100%', padding: '0.65rem 1rem 0.65rem 2.75rem',
                border: '1px solid #e2e8f0', borderRadius: '14px',
                background: '#f8fafc', fontSize: '0.85rem', color: '#1e293b',
                outline: 'none', fontWeight: 600, fontFamily: 'inherit',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(108,99,255,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
            />
            <kbd style={{
              position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '0.62rem', background: 'white', border: '1px solid #cbd5e1',
              borderRadius: 6, padding: '3px 8px', color: '#64748b', fontFamily: 'monospace', fontWeight: 800,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)', userSelect: 'none'
            }}>⌘K</kbd>
          </div>

          {/* Right: Notifs + Session + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Academic Session */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '12px', padding: '0.45rem 1rem',
              boxShadow: '0 1px 2px rgba(34,197,94,0.02)'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', letterSpacing: '0.04em' }}>SESSION: {academicYear}</span>
            </div>

            {/* Notifications Bell Dropdown */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(p => !p)}
                style={{
                  position: 'relative', background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '14px', width: 42, height: 42, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6C63FF'}
                onMouseLeave={e => { if(!showNotifs) e.currentTarget.style.borderColor = '#e2e8f0' }}
              >
                <Bell size={18} color="#475569" />
                <span style={{
                  position: 'absolute', top: -3, right: -3, width: 18, height: 18,
                  background: 'linear-gradient(135deg, #FF4DA6, #6C63FF)',
                  borderRadius: '50%', fontSize: '0.62rem', color: 'white', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2.5px solid white', boxShadow: '0 2px 8px rgba(255,77,166,0.3)'
                }}>5</span>
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute', top: '120%', right: 0, width: 340,
                      background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(20px)',
                      borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#0f172a', letterSpacing: '-0.01em' }}>Notifications</span>
                      <span style={{ fontSize: '0.72rem', color: '#6C63FF', fontWeight: 800, cursor: 'pointer' }}>Mark all read</span>
                    </div>
                    <div style={{ padding: '0 1.25rem', maxHeight: 340, overflowY: 'auto' }}>
                      {notifications.map((n, i) => <NotifItem key={i} {...n} />)}
                    </div>
                    <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', background: '#f8fafc' }}>
                      <span style={{ fontSize: '0.78rem', color: '#6C63FF', fontWeight: 800, cursor: 'pointer' }}>View All Activity Ledger →</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfile(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '14px', padding: '0.4rem 0.875rem 0.4rem 0.4rem',
                  cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6C63FF'}
                onMouseLeave={e => { if(!showProfile) e.currentTarget.style.borderColor = '#e2e8f0' }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, color: 'white', fontSize: '0.9rem',
                  boxShadow: '0 2px 6px rgba(108,99,255,0.2)'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>{user?.name || 'Professor'}</p>
                  <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>FACULTY</p>
                </div>
                <ChevronDown size={14} color="#94a3b8" style={{ transition: 'transform 0.2s', transform: showProfile ? 'rotate(180deg)' : 'none' }} />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '120%', right: 0, width: 210,
                      background: 'white', borderRadius: '18px', border: '1px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: '0 20px 48px rgba(0,0,0,0.08)', zIndex: 200, overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '0.5rem' }}>
                      {[
                        { icon: User, label: 'My Profile Panel', color: '#6C63FF', action: () => onNavigateToAttendance('profile') },
                        { icon: Settings, label: 'Portal Settings', color: '#64748b', action: () => onNavigateToAttendance('settings') },
                        { icon: Lock, label: 'Change Access Key', color: '#F59E0B', action: () => { setIsUpdatingKey(true); setShowProfile(false); } },
                        { icon: LogOut, label: 'Sign Out Portal', color: '#ef4444', action: () => onNavigateToAttendance('logout') },
                      ].map(({ icon: Icon, label, color, action }) => (
                        <button key={label} onClick={action}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            width: '100%', padding: '0.75rem 1rem',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '0.85rem', fontWeight: 700, color: '#374151',
                            borderRadius: '10px', transition: 'all 0.2s',
                            textAlign: 'left'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = color; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#374151'; }}
                        >
                          <Icon size={15} color={color} style={{ flexShrink: 0 }} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ═══════════════════ DASHBOARD CONTENT ═══════════════════ */}
        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* ─── HERO GREETING BANNER ─── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF4DA6 50%, #00C2FF 100%)',
              borderRadius: '24px', padding: '2rem 2.25rem',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(108,99,255,0.22)'
            }}
          >
            {/* Elegant glassmorphism backdrop orbs */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', filter: 'blur(30px)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(20px)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                    <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'white', fontWeight: 800 }}>LIVE STATS</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>{timeStr} · Good Morning</span>
                  </div>
                  <h1 style={{ color: 'white', fontSize: '2.1rem', fontWeight: 900, margin: '0 0 0.5rem', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
                    Welcome Back, {user?.name ? `Prof. ${user.name.split(' ')[0]}` : 'Professor'} 👋
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.88)', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>
                    {dateStr} · Academic Semester Ledger
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Classes Today', value: '5' },
                    { label: 'Avg Attendance', value: `${avgAttendance}%` },
                    { label: 'Pending Actions', value: `${pendingLeave || 7}` }
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)',
                      borderRadius: '18px', padding: '0.95rem 1.5rem',
                      border: '1px solid rgba(255,255,255,0.22)', textAlign: 'center',
                      minWidth: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                      <p style={{ color: 'white', fontSize: '1.65rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── KPI CARDS ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

            {/* ── LEFT COLUMN 70% ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

              {/* Attendance Analytics Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0',
                  padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.01em' }}>Attendance Analytics</h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, fontWeight: 600 }}>12-month registration & attendance metrics</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    {['Weekly', 'Monthly', 'Yearly'].map(f => (
                      <button key={f} onClick={() => setActiveFilter(f)}
                        style={{
                          padding: '0.45rem 1rem', borderRadius: '9px', fontSize: '0.75rem', fontWeight: 800,
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          background: activeFilter === f ? 'white' : 'transparent',
                          color: activeFilter === f ? '#6C63FF' : '#64748b',
                          boxShadow: activeFilter === f ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
                        }}
                      >{f}</button>
                    ))}
                  </div>
                </div>

                {/* Legend rate details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem', padding: '1rem 1.25rem', background: 'linear-gradient(135deg, #f5f3ff, #fff0f5)', borderRadius: '16px', border: '1px solid rgba(108,99,255,0.08)' }}>
                  <div>
                    <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Overall Present Rate</p>
                    <p style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6C63FF', margin: 0, letterSpacing: '-0.02em' }}>{avgAttendance || 91}%</p>
                  </div>
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  {[
                    { label: 'Present Today', val: presentToday || 91, color: '#6C63FF' },
                    { label: 'Absent Registry', val: 14, color: '#FF4DA6' },
                    { label: 'Late Grace', val: 8, color: '#00C2FF' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 3px' }}>{label}</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 900, color, margin: 0 }}>{val}%</p>
                    </div>
                  ))}
                </div>

                <AttendanceTrendChart />
              </motion.div>

              {/* Today's Class Schedule list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0',
                  padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.01em' }}>Today's Class Schedule</h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, fontWeight: 600 }}>Monday, {today.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}</p>
                  </div>
                  <button
                    onClick={() => onNavigateToAttendance('faculty-attendance')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                      border: 'none', borderRadius: '12px', padding: '0.6rem 1.25rem',
                      color: 'white', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(108,99,255,0.25)', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    <PlusCircle size={15} />
                    Mark New Attendance
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {scheduleData.map((s, i) => <ScheduleRow key={i} {...s} />)}
                </div>
              </motion.div>

              {/* Analytics Section: Donut + Bar + Heatmap */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                {/* Student Presence Donut */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0',
                    padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                  }}
                >
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>Student Presence Ratio</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <DonutChart present={avgAttendance || 78} absent={14} late={8} />
                    <div style={{ flex: 1 }}>
                      {[
                        { label: 'Present Today', val: `${avgAttendance || 78}%`, color: '#6C63FF' },
                        { label: 'Absent Registry', val: '14%', color: '#FF4DA6' },
                        { label: 'Late Grace', val: '8%', color: '#00C2FF' },
                      ].map(({ label, val, color }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{label}</span>
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Department Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{
                    background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0',
                    padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                  }}
                >
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>Dept. Comparison</h3>
                  <DeptBarChart />
                </motion.div>
              </div>

              {/* Monthly Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0',
                  padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.01em' }}>Monthly Performance Heatmap</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 600 }}>Daily attendance records intensity log</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>Less</span>
                    {['#EBEAFF', '#C7C4FF', '#A8A2FF', '#8B83FF', '#6C63FF'].map(c => (
                      <div key={c} style={{ width: 14, height: 14, borderRadius: 4, background: c }} />
                    ))}
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>More</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                      <span key={d} style={{ height: 30, fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, display: 'flex', alignItems: 'center' }}>{d}</span>
                    ))}
                  </div>
                  <HeatmapWidget />
                </div>
              </motion.div>

              {/* Recent Activity Feed Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{
                  background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0',
                  padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Recent Activity Feed</h3>
                  <button style={{ fontSize: '0.78rem', color: '#6C63FF', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>View All Ledger →</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {activityFeed.map((a, i) => <ActivityFeedItem key={i} {...a} />)}
                </div>
              </motion.div>

              {/* SMS Console Outbound parent registry */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                id="sms-console-section"
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(108,99,255,0.15)' }}>
                      <MessageSquare size={20} color="#6C63FF" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Parent Outbound SMS Gateway</h3>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0', fontWeight: 600 }}>SMS broadcast sandbox logs for absent alerts</p>
                    </div>
                  </div>
                  <button onClick={fetchSmsLogs} disabled={isLoadingSmsLogs}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.6rem 1.25rem', background: '#f8fafc',
                      border: '1px solid #e2e8f0', borderRadius: '12px',
                      fontSize: '0.8rem', fontWeight: 800, color: '#475569', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <RefreshCw size={14} className={isLoadingSmsLogs ? 'animate-spin' : ''} />
                    Refresh Outbound Log
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
                  {/* SMS Logs Table */}
                  <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', maxHeight: 340, overflowY: 'auto' }}>
                    {smsLogs.length === 0 ? (
                      <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                        <MessageSquare size={36} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>No Outbound SMS Logs generated yet.</p>
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                            {['Student', 'Phone', 'Message Content', 'Timestamp', 'Status'].map(h => (
                              <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 800, color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {smsLogs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} className="hover-trigger">
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1e293b' }}>{log.studentName}</td>
                              <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#475569', fontWeight: 600 }}>{log.recipientNumber}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#64748b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.messageContent}</td>
                              <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: 600 }}>{log.sentTime}</td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <span style={{
                                  padding: '4px 10px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 900,
                                  background: log.status?.includes('DELIVERED') ? '#ecfdf5' : '#e0e7ff',
                                  color: log.status?.includes('DELIVERED') ? '#047857' : '#4338ca',
                                  border: `1px solid ${log.status?.includes('DELIVERED') ? '#a7f3d0' : '#c7d2fe'}`,
                                  textTransform: 'uppercase', letterSpacing: '0.04em'
                                }}>{log.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* SMS Sandbox */}
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      Sandbox SMS gateway
                    </p>
                    <form onSubmit={handleSendTestSms} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                      {[
                        { label: 'Parent Mobile Phone', type: 'tel', placeholder: 'e.g. +91 98765 43210', val: testPhone, set: setTestPhone, required: true },
                        { label: 'Student Full Name', type: 'text', placeholder: 'e.g. Rahul Sharma', val: testStudentName, set: setTestStudentName },
                      ].map(({ label, type, placeholder, val, set, required }) => (
                        <div key={label}>
                          <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                          <input type={type} placeholder={placeholder} required={required} value={val} onChange={e => set(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', background: 'white', color: '#1e293b', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                            onFocus={e => e.target.style.borderColor = '#6C63FF'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                          />
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Custom Message Body</label>
                        <textarea placeholder="Write alerts or test communications..." rows={3} value={testMessage} onChange={e => setTestMessage(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', background: 'white', color: '#1e293b', outline: 'none', resize: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                          onFocus={e => e.target.style.borderColor = '#6C63FF'}
                          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      <button type="submit" disabled={isSendingTestSms}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
                          boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                        }}
                      >
                        <Send size={14} />
                        {isSendingTestSms ? 'Dispatching...' : 'Send Outbound Alert'}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>

              {/* Section Filter Advanced Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Academic Grid Control</h3>
                  <div style={{ display: 'flex', gap: '0.375rem', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    {['All', 'A', 'B', 'C', 'D'].map(s => (
                      <button key={s} onClick={() => setSelectedSection(s)}
                        style={{
                          padding: '0.45rem 1rem', borderRadius: '9px', fontSize: '0.75rem', fontWeight: 800,
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          background: selectedSection === s ? 'linear-gradient(135deg, #6C63FF, #FF4DA6)' : 'transparent',
                          color: selectedSection === s ? 'white' : '#64748b',
                          boxShadow: selectedSection === s ? '0 4px 12px rgba(108,99,255,0.2)' : 'none'
                        }}
                      >{s === 'All' ? 'All Sections' : `Section ${s}`}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
                  {[
                    { icon: Activity, title: 'Conducted Classes', value: '48', color: '#6C63FF', bg: '#f5f3ff' },
                    { icon: Users, title: 'Registered Students', value: totalStudents || '134', color: '#10b981', bg: '#f0fdf4' },
                    { icon: CheckCircle, title: 'Syllabus Complete', value: `${avgAttendance || 87}%`, color: '#00C2FF', bg: '#f0faff' },
                    { icon: Clock, title: 'Pending Actions', value: pendingLeave || '7', color: '#F59E0B', bg: '#fffbeb' },
                    { icon: FileText, title: 'Generated Reports', value: '12', color: '#8B5CF6', bg: '#faf5ff' },
                    { icon: Star, title: 'Efficiency Index', value: '96%', color: '#FF4DA6', bg: '#fff0f6' },
                  ].map(({ icon: Icon, title, value, color, bg }) => (
                    <div key={title} style={{ background: bg, borderRadius: '18px', padding: '1.25rem', border: `1px solid ${color}15`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Icon size={16} color={color} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
                      </div>
                      <p style={{ fontSize: '1.85rem', fontWeight: 900, color, margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button onClick={handleFinalizeRegistry}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', color: '#047857', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#d1fae5'}
                    onMouseLeave={e => e.currentTarget.style.background = '#ecfdf5'}
                  >
                    <CheckCircle size={15} /> Lock & Finalize Registry
                  </button>
                  <button onClick={() => generateMasterReport(students)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#f5f3ff', border: '1px solid #c7d2fe', borderRadius: '14px', color: '#6C63FF', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f5f3ff'}
                  >
                    <Download size={15} /> Export Master Registry
                  </button>
                  <button onClick={handleSimulateSweep}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', color: '#475569', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <RefreshCw size={15} /> Simulate Auto-Sweep
                  </button>
                </div>
              </motion.div>

              {/* ClassSchedule Ledger */}
              <ClassSchedule />
            </div>

            {/* ── RIGHT COLUMN 30% ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Quick Actions Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <QuickAction icon={CheckCircle} label="Mark Session Attendance" color="#6C63FF" onClick={() => onNavigateToAttendance('faculty-attendance')} />
                  <QuickAction icon={UserPlus} label="Register Student Profile" color="#10b981" onClick={() => onNavigateToAttendance('students')} />
                  <QuickAction icon={FileText} label="Generate Class Reports" color="#FF4DA6" onClick={() => generateStudentReport(students)} />
                  <QuickAction icon={Download} label="Download Roster Registry" color="#00C2FF" onClick={() => generateRegistryExport(students)} />
                  <QuickAction icon={Clock} label="Approve Leave Requests" color="#F59E0B" onClick={() => onNavigateToAttendance('leave')} />
                  <QuickAction icon={BookOpen} label="Curriculum Scheme Hub" color="#8B5CF6" onClick={() => onNavigateToAttendance('curriculum')} />
                </div>
              </motion.div>

              {/* Notifications Center */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Notifications Ledger</h3>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, padding: '3px 10px', borderRadius: 99, background: '#fee2e2', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>5 Pending</span>
                </div>
                {notifications.map((n, i) => <NotifItem key={i} {...n} />)}
              </motion.div>

              {/* Faculty Performance progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
                  borderRadius: '24px', padding: '1.5rem',
                  boxShadow: '0 20px 48px rgba(15,23,42,0.25)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: 'white', margin: 0, letterSpacing: '-0.01em' }}>My Academic Index</h3>
                  <TrendingUp size={18} color="#6C63FF" />
                </div>
                {[
                  { label: 'Total Classes Conducted', value: '48', max: 60, color: '#6C63FF' },
                  { label: 'Attendance Completion Rate', value: '96%', max: 100, pct: 96, color: '#10b981' },
                  { label: 'Pending Assessment Tasks', value: '3', max: 10, pct: 30, color: '#FF4DA6' },
                  { label: 'Syllabus Reports Submitted', value: '12/12', max: 100, pct: 100, color: '#00C2FF' },
                ].map(({ label, value, pct, max, color }) => (
                  <div key={label} style={{ marginBottom: '1.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.72)', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 900 }}>{value}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct || (parseInt(value) / max * 100)}%` }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}50` }}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
                  <MiniBarChart data={[3, 5, 4, 6, 5, 7, 5, 8, 6, 9, 8, 9]} color="#6C63FF" />
                  <MiniBarChart data={[80, 82, 85, 84, 88, 87, 91, 90, 93, 92, 95, 96]} color="#10b981" />
                </div>
              </motion.div>

              {/* Upcoming Classes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>Upcoming Lectures</h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {upcomingClasses.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.85rem 0', borderBottom: i < upcomingClasses.length - 1 ? '1px solid #f8fafc' : 'none'
                    }}>
                      <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 99, background: c.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.subject}</p>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 600 }}>{c.section} · Room {c.room}</p>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: c.color, flexShrink: 0 }}>{c.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Curriculum Hub Syllabus */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>Curriculum Hub</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {[
                    { dept: 'Computer Science', scheme: 'C-25', color: '#6C63FF', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_1_4_ComputerScience&Engineering.pdf' },
                    { dept: 'Electrical Engg.', scheme: 'C-25', color: '#F59E0B', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_EE_1_4_Electrical&ElectronicsEngineering.pdf' },
                    { dept: 'Mechanical Engg.', scheme: 'C-25', color: '#10b981', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_ME_1_4_MechanicalEngineering.pdf' },
                    { dept: 'Civil Engg.', scheme: 'C-25', color: '#00C2FF', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_CE_1_4_CivilEngineering.pdf' },
                    { dept: 'Metallurgical', scheme: 'C-25', color: '#8B5CF6', url: 'https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_MT_1_4_MetallurgicalEngineering.pdf' },
                    { dept: 'C-20 Syllabus Portal', scheme: 'Web', color: '#FF4DA6', url: 'https://dtek.karnataka.gov.in/52/c-20-syllabus/en' },
                  ].map(({ dept, scheme, color, url }) => (
                    <button key={dept} onClick={() => window.open(url, '_blank')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem 1rem', background: '#f8fafc',
                        border: '1px solid #e2e8f0', borderRadius: '14px',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}40`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <BookMarked size={15} color={color} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', flex: 1 }}>{dept}</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2.5px 7px', borderRadius: 8, background: `${color}12`, color }}>{scheme}</span>
                      <ArrowUpRight size={13} color="#94a3b8" />
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Holidays */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                style={{ background: 'linear-gradient(135deg, #fffbeb, #fff0f6)', borderRadius: '24px', border: '1px solid #fcd34d', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#92400e', margin: 0, letterSpacing: '-0.01em' }}>Upcoming Holidays</h3>
                  <Calendar size={18} color="#F59E0B" />
                </div>
                {holidays.map(({ date, name }) => (
                  <div key={date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid rgba(252,211,77,0.3)' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400e' }}>{name}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', background: '#fef3c7', padding: '3px 10px', borderRadius: 10 }}>{date}</span>
                  </div>
                ))}
              </motion.div>

              {/* Faculty Availability */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Faculty Availability</h3>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', background: '#dcfce7', padding: '3px 10px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Live feed</span>
                </div>
                {['M Shiva Balaji', 'Shaik Irshan', 'D Charan Venkat', 'Sidda Reddy', 'Harsha Reddy'].map((name, i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${['#6C63FF', '#FF4DA6', '#00C2FF', '#10b981', '#F59E0B'][i]}, ${['#8B83FF', '#FF85C8', '#38BDF8', '#34D399', '#FCD34D'][i]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, color: 'white', fontSize: '0.78rem', flexShrink: 0
                    }}>{name.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                      <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: 0, fontWeight: 600 }}>SGP Faculty Directory</p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: i % 3 === 2 ? '#F59E0B' : '#22c55e', flexShrink: 0, boxShadow: i % 3 === 2 ? '0 0 0 3px rgba(245,158,11,0.2)' : '0 0 0 3px rgba(34,197,94,0.2)' }} />
                  </div>
                ))}
              </motion.div>

              {/* Pending Leave Approvals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                style={{
                  background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0',
                  padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Pending Approvals</h3>
                  <button onClick={() => onNavigateToAttendance('leave')}
                    style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FF4DA6', background: '#fff0f6', border: '1px solid #ffd1e8', padding: '3px 12px', borderRadius: 10, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {pendingLeave || 7} pending
                  </button>
                </div>
                {[
                  { name: 'Rahul Verma', type: 'Medical Leave', days: 3, urgency: 'high' },
                  { name: 'Sneha Patel', type: 'Personal Leave', days: 2, urgency: 'medium' },
                  { name: 'Amit Kumar', type: 'Family Emergency', days: 5, urgency: 'high' },
                ].map(({ name, type, days, urgency }) => (
                  <div key={name} style={{
                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                    padding: '0.85rem', background: '#f8fafc', borderRadius: '16px', marginBottom: '0.625rem',
                    border: `1px solid ${urgency === 'high' ? '#fca5a5' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF4DA6, #6C63FF)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0
                    }}>{name.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                      <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 600 }}>{type} · {days} days</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                      <button style={{ width: 28, height: 28, borderRadius: 10, background: '#ecfdf5', border: '1px solid #a7f3d0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#d1fae5'} onMouseLeave={e => e.currentTarget.style.background = '#ecfdf5'}>
                        <CheckCircle size={14} color="#047857" />
                      </button>
                      <button style={{ width: 28, height: 28, borderRadius: 10, background: '#fee2e2', border: '1px solid #fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fecaca'} onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}>
                        <XCircle size={14} color="#b91c1c" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* ══════════════ STATUS TOAST MESSAGE ══════════════ */}
      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60 }}
            style={{
              position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              background: status.type === 'success' ? '#ecfdf5' : '#fee2e2',
              color: status.type === 'success' ? '#047857' : '#b91c1c',
              padding: '1rem 2rem', borderRadius: '18px', zIndex: 9999,
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              border: `1px solid ${status.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)', fontWeight: 800, fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap'
            }}
          >
            {status.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ LOCK REGISTRY POPUP MODAL ══════════════ */}
      <AnimatePresence>
        {showRegistryPopup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
              backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 200, padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                background: 'white', borderRadius: '28px', padding: '3.5rem 2.75rem',
                maxWidth: 440, width: '100%', textAlign: 'center',
                boxShadow: '0 32px 80px rgba(16,185,129,0.25)',
                border: '1px solid rgba(16,185,129,0.15)'
              }}
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: 84, height: 84, background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.75rem', boxShadow: '0 8px 32px rgba(16,185,129,0.3)'
                }}
              >
                <CheckCircle size={44} color="white" />
              </motion.div>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#10b981', marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>Registry Finalized!</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, fontWeight: 600 }}>The Student attendance registry ledger has been locked, encrypted, and compiled successfully.</p>
              <button onClick={() => setShowRegistryPopup(false)}
                style={{
                  marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.95rem', borderRadius: '16px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                }}
              >
                <CheckCircle size={16} /> Complete & Lock
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ UPDATE ACCESS PIN KEY MODAL ══════════════ */}
      <AnimatePresence>
        {isUpdatingKey && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 100, padding: '1rem'
          }}>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              style={{
                background: 'white', borderRadius: '24px', padding: '2.5rem',
                maxWidth: 420, width: '100%',
                boxShadow: '0 24px 64px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(108,99,255,0.15)' }}>
                    <Lock size={20} color="#6C63FF" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.25rem', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Update Security Pin</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 600 }}>Security ledger credential modification</p>
                  </div>
                </div>
                <button onClick={() => setIsUpdatingKey(false)}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#FF4DA6'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <XCircle size={18} color="#94a3b8" />
                </button>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={handleUpdateKey}>
                {[
                  { label: 'Current Security Pin', val: oldKey, set: setOldKey, placeholder: 'Enter current PIN...' },
                  { label: 'New Security Pin', val: newKey, set: setNewKey, placeholder: 'Enter new 6-digit PIN...' },
                ].map(({ label, val, set, placeholder }) => (
                  <div key={label}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
                    <input type="password" placeholder={placeholder} required value={val} onChange={e => set(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', outline: 'none', color: '#0f172a', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#6C63FF'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                ))}

                {status.message && (
                  <div style={{
                    padding: '0.85rem', borderRadius: '12px',
                    background: status.type === 'success' ? '#ecfdf5' : '#fee2e2',
                    color: status.type === 'success' ? '#047857' : '#b91c1c',
                    fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem',
                    border: `1px solid ${status.type === 'success' ? '#a7f3d0' : '#fca5a5'}`
                  }}>
                    {status.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                    {status.message}
                  </div>
                )}

                <button type="submit"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    width: '100%', padding: '0.875rem', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #6C63FF, #FF4DA6)',
                    color: 'white', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                    fontFamily: 'inherit', marginTop: '0.5rem', boxShadow: '0 4px 12px rgba(108,99,255,0.2)'
                  }}
                >
                  <Send size={16} />
                  Update Access Credentials
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
