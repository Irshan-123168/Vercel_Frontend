import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { api } from '../api';

const LoginPage = ({ onLogin, onSwitchToRegister, onBackToHome }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [showPassword, setShowPassword] = useState(false);
    const [recoveryType, setRecoveryType] = useState(null); // null, 'password', 'username'
    const [recoveryMessage, setRecoveryMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [cookiesAgreed, setCookiesAgreed] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [modalTab, setModalTab] = useState('terms'); // 'terms' or 'cookies'

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

    return (
        <div 
            className="animated-mesh"
            style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated Floating Orbs */}
            <div className="floating-orb" style={{ top: '5%', right: '5%', width: '350px', height: '350px', background: 'rgba(255, 255, 255, 0.12)', animationDelay: '0s' }}></div>
            <div className="floating-orb" style={{ bottom: '10%', left: '2%', width: '450px', height: '450px', background: 'rgba(0, 0, 0, 0.15)', animationDelay: '-7s' }}></div>
            <div className="floating-orb" style={{ top: '50%', left: '15%', width: '250px', height: '250px', background: 'rgba(236, 72, 153, 0.15)', animationDelay: '-14s' }}></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ 
                    maxWidth: '450px', 
                    width: '100%', 
                    padding: '3rem', 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '100%', height: 'auto', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', padding: '1.5rem' }}>
                        <img src="/src/assets/logo.png" alt="Sanjay Gandhi Polytechnic Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {recoveryType ? (recoveryType === 'password' ? 'Recover Access' : 'Forgot Username') : 'Welcome Back'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {recoveryType ? `Enter your registered email to retrieve your ${recoveryType}` : 'Sign in to access your portal'}
                    </p>
                </div>

                {!recoveryType ? (
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="form-group">
                            <label className="form-label">Role Configuration</label>
                            <select 
                                className="form-input"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ background: 'white' }}
                            >
                                <option value="STUDENT">Institutional Learner</option>
                                <option value="TEACHER">Faculty</option>
                                <option value="HOD">Departmental Head (HOD)</option>
                                <option value="ADMIN">System Superintendent (Admin)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Username or Institutional Email</label>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setRecoveryType('username');
                                        setError('');
                                        setRecoveryMessage('');
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 400, cursor: 'pointer' }}
                                >
                                    Forgot Username?
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                <input 
                                    type="text"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="Enter Username or Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setRecoveryType('password');
                                        setError('');
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 400, cursor: 'pointer' }}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '20px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="terms-checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        style={{ 
                                            width: '18px', 
                                            height: '18px', 
                                            cursor: 'pointer',
                                            accentColor: 'var(--primary-color)',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                                <label htmlFor="terms-checkbox" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4', fontWeight: 500 }}>
                                    I agree to the <button type="button" onClick={() => { setModalTab('terms'); setShowTermsModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 700, padding: 0, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>Terms and Conditions</button>
                                </label>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '20px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="cookies-checkbox"
                                        checked={cookiesAgreed}
                                        onChange={(e) => setCookiesAgreed(e.target.checked)}
                                        style={{ 
                                            width: '18px', 
                                            height: '18px', 
                                            cursor: 'pointer',
                                            accentColor: 'var(--primary-color)',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                                <label htmlFor="cookies-checkbox" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4', fontWeight: 500 }}>
                                    I accept the <button type="button" onClick={() => { setModalTab('cookies'); setShowTermsModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 700, padding: 0, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>Cookie Usage Policy</button>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full" 
                            style={{ 
                                height: '52px', 
                                fontSize: '1rem', 
                                marginTop: '1.5rem',
                                opacity: agreed && cookiesAgreed ? 1 : 0.6,
                                cursor: agreed && cookiesAgreed ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s ease'
                            }}
                            disabled={isLoading || !agreed || !cookiesAgreed}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRecovery} className="space-y-5">
                        <div className="form-group">
                            <label className="form-label">Recovery Identification (Email)</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                <input 
                                    type="email"
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="Enter your registered email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {recoveryMessage && (
                            <div style={{ padding: '0.75rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
                                {recoveryMessage}
                            </div>
                        )}

                        {error && (
                            <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full" 
                            style={{ height: '52px', fontSize: '1rem', marginTop: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (recoveryType === 'password' ? 'Request Access Key' : 'Request Username')}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>

                        <button 
                            type="button" 
                            onClick={() => {
                                setRecoveryType(null);
                                setError('');
                                setRecoveryMessage('');
                            }}
                            style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Back to Sign In
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Don't have an account? {' '}
                        <button onClick={onSwitchToRegister} style={{ color: 'var(--primary-color)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                            Get Started
                        </button>
                    </p>
                    <button onClick={onBackToHome} style={{ marginTop: '1.5rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>
                        &larr; Return to Home
                    </button>
                </div>
            </motion.div>

            {/* Terms and Conditions Modal */}
            {showTermsModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{ maxWidth: '500px', width: '100%', padding: '2.5rem', background: 'white', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}
                    >
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                            <button 
                                onClick={() => setModalTab('terms')}
                                style={{ 
                                    padding: '0.5rem 0', 
                                    background: 'none', 
                                    border: 'none', 
                                    borderBottom: modalTab === 'terms' ? '2px solid var(--primary-color)' : 'none',
                                    color: modalTab === 'terms' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Terms & Conditions
                            </button>
                            <button 
                                onClick={() => setModalTab('cookies')}
                                style={{ 
                                    padding: '0.5rem 0', 
                                    background: 'none', 
                                    border: 'none', 
                                    borderBottom: modalTab === 'cookies' ? '2px solid var(--primary-color)' : 'none',
                                    color: modalTab === 'cookies' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Cookie Policy
                            </button>
                        </div>

                        {modalTab === 'terms' ? (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                <p style={{ marginBottom: '1rem' }}><strong>1. Use of Service:</strong> You agree to use the Student Attendance Management System for institutional purposes only.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>2. Account Security:</strong> You are responsible for maintaining the confidentiality of your access key and account.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>3. Data Privacy:</strong> Your attendance data will be stored securely and used for academic reporting and student tracking.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>4. Respectful Conduct:</strong> Users must interact with the system in a respectful and professional manner at all times.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>5. System Integrity:</strong> Any attempt to bypass security measures or manipulate attendance records is strictly prohibited and subject to disciplinary action.</p>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                <p style={{ marginBottom: '1rem' }}><strong>1. Essential Cookies:</strong> These cookies are necessary for the basic functionality of the system, including session management and authentication.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>2. Performance Monitoring:</strong> We use minimal cookies to ensure the system performs efficiently and to identify any technical issues.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>3. Security:</strong> Cookies are used to prevent unauthorized access and protect user data from malicious activities.</p>
                                <p style={{ marginBottom: '1rem' }}><strong>4. Local Storage:</strong> The application may use local storage to remember your preferences and enhance your user experience.</p>
                                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', marginTop: '1rem' }}>
                                    <p style={{ margin: 0, fontStyle: 'italic' }}>By clicking "I Accept" on the login page, you consent to our use of these essential cookies to provide you with a secure portal experience.</p>
                                </div>
                            </div>
                        )}
                        <button 
                            onClick={() => setShowTermsModal(false)}
                            className="btn btn-primary w-full"
                            style={{ height: '48px' }}
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
