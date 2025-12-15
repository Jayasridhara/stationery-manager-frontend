import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/apiClient';

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [adminExists, setAdminExists] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await authAPI.register(username, password, role);
            const userRole = res?.user?.role || role;
            if (onRegister) onRegister(userRole);
            if (userRole === 'admin') navigate('/items');
            else navigate('/browse');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        authAPI.adminExists()
            .then(res => { if (mounted && res && typeof res.exists === 'boolean') setAdminExists(res.exists); })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            {!adminExists && <option value="admin">Admin</option>}
                            <option value="buyer">Buyer</option>
                        </select>
                        {adminExists && <p className="text-xs text-gray-500 mt-1">An admin account already exists; only buyer accounts can be created.</p>}
                    </div>
                    <button type="submit" disabled={isLoading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md">
                        {isLoading ? 'Creating...' : 'Register'}
                    </button>
                </form>
                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                <p className="mt-4 text-center text-sm">
                    Back to <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
