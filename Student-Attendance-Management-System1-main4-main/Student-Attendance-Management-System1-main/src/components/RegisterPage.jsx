import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, Smartphone, BadgeCheck, Rocket } from 'lucide-react';
import logoImg from '../assets/logo_shield.png';
import { api } from '../api';

const RegisterPage = ({ onRegister, onSwitchToLogin, onBackToHome }) => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Access keys do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const user = await api.register({
                username,
                password,
                email,
                role: role,
                phoneNumber,
                rollNumber
            });
            onRegister(user);
        } catch (err) {
            setError(err.message || 'Onboarding failure.');
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
                padding: '2.5rem 1.5rem',
                background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 40%, #db2777 75%, #ec4899 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle background glow blobs */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '450px', height: '450px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '380px', height: '380px', background: 'rgba(0,0,0,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* ── Main Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                style={{
                    maxWidth: '480px',
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
                        Portal Onboarding
                    </h2>
                    <p style={{ color: '#6b7280', fontWeight: 500, fontSize: '0.92rem' }}>
                        Create your institutional node identity
                    </p>
                </div>

                {/* ── Registration Form ── */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    
                    {/* Full Name */}
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="Your Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <label style={labelStyle}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <BadgeCheck size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="Unique ID"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="email"
                                style={inputStyle}
                                placeholder="name@sgp.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label style={labelStyle}>Role Access</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '1rem', appearance: 'auto', cursor: 'pointer' }}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Faculty</option>
                            <option value="HOD">HOD</option>
                            <option value="ADMIN">System Admin</option>
                        </select>
                    </div>

                    {/* Student Dynamic Fields */}
                    <AnimatePresence>
                        {role === 'STUDENT' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', overflow: 'hidden' }}
                            >
                                {/* Roll Number */}
                                <div>
                                    <label style={labelStyle}>Roll Number</label>
                                    <input
                                        type="text"
                                        style={{ ...inputStyle, paddingLeft: '1rem' }}
                                        placeholder="SGP/..."
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                        required={role === 'STUDENT'}
                                    />
                                </div>

                                {/* Mobile Hub */}
                                <div>
                                    <label style={labelStyle}>Mobile Hub</label>
                                    <div style={{ position: 'relative' }}>
                                        <Smartphone size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            type="tel"
                                            style={inputStyle}
                                            placeholder="+91..."
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required={role === 'STUDENT'}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password / Pin */}
                    <div>
                        <label style={labelStyle}>Pin</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="password"
                                style={inputStyle}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Verify Pin */}
                    <div>
                        <label style={labelStyle}>Verify Pin</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="password"
                                style={inputStyle}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ padding: '0.7rem 1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {/* Buttons Row */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                        
                        {/* Register Button */}
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
                                transition: 'all 0.3s ease',
                                boxShadow: '0 6px 20px rgba(192,38,211,0.35)',
                            }}
                        >
                            {isLoading ? 'Processing...' : 'Register'}
                            {!isLoading && <Rocket size={18} />}
                        </button>

                        {/* Cancel & Return */}
                        <button
                            type="button"
                            onClick={onBackToHome}
                            style={{
                                width: '100%',
                                height: '50px',
                                background: 'white',
                                color: '#4b5563',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { e.target.style.background = '#f9fafb'; }}
                            onMouseLeave={(e) => { e.target.style.background = 'white'; }}
                        >
                            Cancel &amp; Return
                        </button>

                    </div>
                </form>

                {/* ── Footer Links ── */}
                <div style={{ marginTop: '1.8rem', textAlign: 'center' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            style={{ color: '#c026d3', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
