import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLoginMode) {
                const params = new URLSearchParams();
                params.append('username', formData.email);
                params.append('password', formData.password);
                
                const response = await axios.post('http://localhost:8000/api/auth/login', params);
                localStorage.setItem('token', response.data.access_token);
                
                // Fetch user data
                const userResp = await axios.get('http://localhost:8000/api/auth/me', {
                    headers: { Authorization: `Bearer ${response.data.access_token}` }
                });
                
                onLoginSuccess(userResp.data);
                onClose();
            } else {
                await axios.post('http://localhost:8000/api/auth/register', {
                    full_name: formData.full_name,
                    email: formData.email,
                    password: formData.password
                });
                setIsLoginMode(true);
                setError('Registration successful! Please login.');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="modal-content"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h2>{isLoginMode ? <><LogIn size={24} color="var(--accent-primary)"/> Welcome Back</> : <><UserPlus size={24} color="var(--accent-primary)"/> Create Account</>}</h2>
                        <button className="modal-close" onClick={onClose}><X size={20} /></button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}
                        
                        {!isLoginMode && (
                            <div className="input-group">
                                <User size={18} className="input-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                />
                            </div>
                        )}
                        
                        <div className="input-group">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        
                        <div className="input-group">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn" 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
                        </button>
                    </form>

                    <div className="auth-switch">
                        <p>
                            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                            <button className="switch-btn" onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}>
                                {isLoginMode ? " Register now" : " Login instead"}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
