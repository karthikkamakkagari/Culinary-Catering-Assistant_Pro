
import React, { useState } from 'react';
import { AuthUser } from '../types';
import { EyeIcon, EyeSlashIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from './icons'; // Assuming you have an ArrowPathIcon for "Switch to Signup"

interface LoginFormProps {
  onLogin: (user: AuthUser) => void;
  users: AuthUser[]; // For client-side validation
  onSwitchToSignup: () => void;
}

const FormField: React.FC<{ label: string; children: React.ReactNode; error?: string; id?: string }> = ({ label, children, error, id }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
  </div>
);


const LoginForm: React.FC<LoginFormProps> = ({ onLogin, users, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.username === username && u.password === password); // Insecure: for demo only!
    if (user) {
      if (user.isApproved) {
        onLogin(user);
      } else {
        setError('Your account is pending approval.');
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full">
      <div className="flex justify-center mb-6">
        <UserCircleIcon className="w-16 h-16 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Login</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm" role="alert">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Username" id="login-username">
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
            autoComplete="username"
          />
        </FormField>
        <FormField label="Password" id="login-password">
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-blue-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </FormField>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center text-base"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> Login
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-8">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
