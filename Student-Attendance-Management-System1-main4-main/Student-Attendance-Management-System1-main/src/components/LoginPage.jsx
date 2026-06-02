import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { api } from '../api';
import logoImg from '../assets/logo_shield.png';

const LoginPage = ({ onLogin, onSwitchToRegister, onBackToHome }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [showPassword, setShowPassword] = useState(false);
    const [recoveryType, setRecoveryType] = useState(null);
    const [recoveryMessage, setRecoveryMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [cookiesAgreed, setCookiesAgreed] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [modalTab, setModalTab] = useState('terms');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await api.login(email, password);
            if (user) onLogin(user);
            else setError('Authentication failed. Please verify your credentials.');
        } catch (err) {
            setError(err.message || 'Server connection failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecovery = async (e) => {
        e.preventDefault();
        setError('');
        setRecoveryMessage('');
        setIsLoading(true);
        try {
            const result = recoveryType === 'password'
                ? await api.forgotPassword(email)
                : await api.forgotUsername(email);
            setRecoveryMessage(result.message || (recoveryType === 'password'
                ? 'Your access key has been sent to your email.'
                : 'Your username has been sent to your email.'));
        } catch (err) {
            setError(err.message || 'Recovery request failed.');
        } finally {
            setIsLoading(false);
        }
    };

    /* ── shared input style ── */
    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 2.8rem',
        border: '1.5px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '0.92rem',
        outline: 'none',
        background: '#fafafa',
        color: '#111',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    };

    const labelStyle = {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#374151',
        marginBottom: '0.4rem',
        display: 'block',
    };

    return (
        <div
    style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
    }}
>
    <motion.div
    animate={{
        x: [0, 80, -60, 0],
        y: [0, 60, -100, 0],
    }}
    transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
    }}
    style={{
        position: "absolute",
        top: "35%",
        left: "45%",
        width: "350px",
        height: "350px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        filter: "blur(90px)",
    }}
/>
    {/* Animated Gradient Background */}
    <motion.div
        animate={{
            background: [
                "linear-gradient(135deg,#7c3aed,#c026d3,#ec4899)",
                "linear-gradient(135deg,#2563eb,#7c3aed,#c026d3)",
                "linear-gradient(135deg,#06b6d4,#2563eb,#7c3aed)",
                "linear-gradient(135deg,#ec4899,#7c3aed,#2563eb)",
                "linear-gradient(135deg,#7c3aed,#c026d3,#ec4899)"
            ]
        }}
        transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
        }}
        style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
        }}
    />
    <motion.div
    animate={{
        x: [0, 120, -80, 0],
        y: [0, -80, 100, 0],
        scale: [1, 1.2, 0.9, 1],
    }}
    transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
    }}
    style={{
        position: "absolute",
        top: "-120px",
        left: "-120px",
        width: "500px",
        height: "500px",
        background: "rgba(255,255,255,0.15)",
        borderRadius: "50%",
        filter: "blur(100px)",
    }}
/>

<motion.div
    animate={{
        x: [0, -120, 80, 0],
        y: [0, 120, -80, 0],
        scale: [1, 0.8, 1.3, 1],
    }}
    transition={{
        duration: 22,
        repeat: Infinity,
        ease: "easeInOut",
    }}
    style={{
        position: "absolute",
        bottom: "-120px",
        right: "-120px",
        width: "450px",
        height: "450px",
        background: "rgba(255,255,255,0.12)",
        borderRadius: "50%",
        filter: "blur(100px)",
    }}
/>
{/* Animated Background */}
<motion.div
  animate={{
    backgroundPosition: [
      "0% 50%",
      "100% 50%",
      "0% 50%",
    ],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  }}
  style={{
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(-45deg, #7c3aed, #c026d3, #ec4899, #2563eb, #06b6d4)",
    backgroundSize: "400% 400%",
    zIndex: 0,
  }}
/>
<motion.div
    animate={{
        x: [0, 80, -60, 0],
        y: [0, 60, -100, 0],
    }}
    transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
    }}
    style={{
        position: "absolute",
        top: "35%",
        left: "45%",
        width: "350px",
        height: "350px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        filter: "blur(90px)",
    }}
/>
            {/* Subtle background glow blobs */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '420px', height: '420px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '360px', height: '360px', background: 'rgba(0,0,0,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* ── Main Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                style={{
                    maxWidth: '460px',
                    width: '100%',
                    background: 'white',
                    borderRadius: '24px',
                    padding: '2.5rem 2.2rem',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.28)',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* ── Institution Logo Card ── */}
                <div
                    style={{
                        background: 'white',
                        border: '1px solid #f1f5f9',
                        borderRadius: '16px',
                        padding: '1.2rem 1.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.2rem',
                        marginBottom: '1.8rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    }}
                >
                    <img
                        src={logoImg}
                        alt="SGP Logo"
                        style={{ width: '84px', height: '84px', objectFit: 'contain', flexShrink: 0 }}
                    />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600 }}>T.E.H.R.D Trust's</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#111', lineHeight: '1.2' }}>Sanjay Gandhi Polytechnic</div>
                        <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '3px' }}>(Recognised by AICTE, New Delhi &amp; Govt. of Karnataka)</div>
                        <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>ISO 9001:2015 Certified</div>
                    </div>
                </div>

                {/* ── Heading ── */}
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111', marginBottom: '0.35rem' }}>
                        {recoveryType
                            ? (recoveryType === 'password' ? 'Recover Access' : 'Forgot Username')
                            : 'Welcome Back'}
                    </h2>
                    <p style={{ color: '#6b7280', fontWeight: 500, fontSize: '0.92rem' }}>
                        {recoveryType
                            ? `Enter your registered email to retrieve your ${recoveryType}`
                            : 'Sign in to access your portal'}
                    </p>
                </div>

                {/* ── Login Form ── */}
                {!recoveryType ? (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                        {/* Role */}
                        <div>
                            <label style={labelStyle}>Role Configuration</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ ...inputStyle, paddingLeft: '1rem', appearance: 'auto', cursor: 'pointer' }}
                            >
                                <option value="STUDENT">Institutional Learner</option>
                                <option value="TEACHER">Faculty</option>
                                <option value="HOD">Departmental Head (HOD)</option>
                                <option value="ADMIN">System Superintendent (Admin)</option>
                            </select>
                        </div>

                        {/* Email */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label style={{ ...labelStyle, marginBottom: 0 }}>Username or Institutional Email</label>
                                <button
                                    type="button"
                                    onClick={() => { setRecoveryType('username'); setError(''); setRecoveryMessage(''); }}
                                    style={{ background: 'none', border: 'none', color: '#c026d3', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Forgot Username?
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    style={inputStyle}
                                    placeholder="Enter Username or Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                                <button
                                    type="button"
                                    onClick={() => { setRecoveryType('password'); setError(''); }}
                                    style={{ background: 'none', border: 'none', color: '#c026d3', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    style={{ ...inputStyle, paddingRight: '3rem' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                                <input
                                    type="checkbox"
                                    id="terms-checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', accentColor: '#c026d3' }}
                                />
                                <label htmlFor="terms-checkbox" style={{ fontSize: '0.82rem', color: '#6b7280', cursor: 'pointer', lineHeight: '1.4', fontWeight: 500 }}>
                                    I agree to the{' '}
                                    <button type="button" onClick={() => { setModalTab('terms'); setShowTermsModal(true); }} style={{ background: 'none', border: 'none', color: '#c026d3', fontWeight: 700, padding: 0, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.82rem' }}>
                                        Terms and Conditions
                                    </button>
                                </label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                                <input
                                    type="checkbox"
                                    id="cookies-checkbox"
                                    checked={cookiesAgreed}
                                    onChange={(e) => setCookiesAgreed(e.target.checked)}
                                    style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', accentColor: '#c026d3' }}
                                />
                                <label htmlFor="cookies-checkbox" style={{ fontSize: '0.82rem', color: '#6b7280', cursor: 'pointer', lineHeight: '1.4', fontWeight: 500 }}>
                                    I accept the{' '}
                                    <button type="button" onClick={() => { setModalTab('cookies'); setShowTermsModal(true); }} style={{ background: 'none', border: 'none', color: '#c026d3', fontWeight: 700, padding: 0, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.82rem' }}>
                                        Cookie Usage Policy
                                    </button>
                                </label>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ padding: '0.7rem 1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !agreed || !cookiesAgreed}
                            style={{
                                width: '100%',
                                height: '50px',
                                background: agreed && cookiesAgreed
                                    ? 'linear-gradient(135deg, #c026d3, #ec4899)'
                                    : '#d1d5db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: agreed && cookiesAgreed ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '0.5rem',
                                transition: 'all 0.3s ease',
                                boxShadow: agreed && cookiesAgreed ? '0 6px 20px rgba(192,38,211,0.35)' : 'none',
                            }}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>
                ) : (
                    /* ── Recovery Form ── */
                    <form onSubmit={handleRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                            <label style={labelStyle}>Recovery Identification (Email)</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="email"
                                    style={inputStyle}
                                    placeholder="Enter your registered email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {recoveryMessage && (
                            <div style={{ padding: '0.7rem 1rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '10px', color: '#065f46', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                                {recoveryMessage}
                            </div>
                        )}
                        {error && (
                            <div style={{ padding: '0.7rem 1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                height: '50px',
                                background: 'linear-gradient(135deg, #c026d3, #ec4899)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 6px 20px rgba(192,38,211,0.35)',
                            }}
                        >
                            {isLoading ? 'Processing...' : (recoveryType === 'password' ? 'Request Access Key' : 'Request Username')}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setRecoveryType(null); setError(''); setRecoveryMessage(''); }}
                            style={{ width: '100%', background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.25rem' }}
                        >
                            ← Back to Sign In
                        </button>
                    </form>
                )}

                {/* ── Footer Links ── */}
                <div style={{ marginTop: '1.8rem', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            style={{ color: '#c026d3', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Get Started
                        </button>
                    </p>
                    <button
                        onClick={onBackToHome}
                        style={{ marginTop: '1rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500 }}
                    >
                        ← Return to Home
                    </button>
                </div>
            </motion.div>

            {/* ── Terms & Cookies Modal ── */}
            {showTermsModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', background: 'white', borderRadius: '20px', position: 'relative', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,0.3)' }}
                    >
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                            <button
                                onClick={() => setModalTab('terms')}
                                style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: modalTab === 'terms' ? '2px solid #c026d3' : 'none', color: modalTab === 'terms' ? '#c026d3' : '#6b7280', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Terms &amp; Conditions
                            </button>
                            <button
                                onClick={() => setModalTab('cookies')}
                                style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: modalTab === 'cookies' ? '2px solid #c026d3' : 'none', color: modalTab === 'cookies' ? '#c026d3' : '#6b7280', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Cookie Policy
                            </button>
                        </div>

                        {modalTab === 'terms' ? (
                            <div style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                <p style={{ marginBottom: '1rem' }}><strong>1. Use of Service:</strong> You agree to use the Student Attendance Management System for institutional purposes only.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>2. Account Security:</strong> You are responsible for maintaining the confidentiality of your access key and account.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>3. Data Privacy:</strong> Your attendance data will be stored securely and used for academic reporting and student tracking.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>4. Respectful Conduct:</strong> Users must interact with the system in a respectful and professional manner at all times.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>5. System Integrity:</strong> Any attempt to bypass security measures or manipulate attendance records is strictly prohibited.</p>
                            </div>
                        ) : (
                            <div style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                <p style={{ marginBottom: '1rem' }}><strong>1. Essential Cookies:</strong> Necessary for basic functionality including session management and authentication.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>2. Performance Monitoring:</strong> Minimal cookies to ensure system performance and identify technical issues.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>3. Security:</strong> Cookies used to prevent unauthorized access and protect user data.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>4. Local Storage:</strong> May be used to remember preferences and enhance your experience.</p>
                                <div style={{ background: '#fdf4ff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #c026d3', marginTop: '1rem' }}>
                                    <p style={{ margin: 0, fontStyle: 'italic' }}>By clicking "I Accept" on the login page, you consent to our use of these essential cookies.</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setShowTermsModal(false)}
                            style={{
                                width: '100%',
                                height: '48px',
                                background: 'linear-gradient(135deg, #c026d3, #ec4899)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(192,38,211,0.3)',
                            }}
                        >
                            I Understand
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
