import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect after successful login
  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'student') {
        navigate('/student', { replace: true });
      } else if (user.role === 'food_court_admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'super_admin') {
        navigate('/super-admin', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      // Redirect will happen automatically via useEffect after user is set
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Username"
        type="text"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        icon={<Mail className="h-5 w-5" />}
        placeholder="Enter your username"
      />

      <Input
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="h-5 w-5" />}
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="ml-2 text-gray-700 group-hover:text-gray-900">Remember me</span>
        </label>

        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full group" size="lg" isLoading={isLoading}>
        <span>Sign in</span>
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">New to our platform?</span>
        </div>
      </div>

      <Link to="/register">
        <Button type="button" variant="secondary" className="w-full" size="lg">
          Create an account
        </Button>
      </Link>
    </form>
  );
}