import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, AlertCircle, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function RegisterPage() {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate phone length (max 15 characters)
    if (formData.phone && formData.phone.length > 15) {
      setError('Phone number must be 15 characters or less');
      return;
    }

    try {
      // Register the user (this will also log them in automatically)
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });

      // User is now logged in and will be redirected by AuthContext
    } catch (err: any) {
      // Parse backend validation errors
      if (err.data) {
        const errors = err.data;
        if (errors.username) {
          setError(`Username: ${errors.username[0]}`);
        } else if (errors.email) {
          setError(`Email: ${errors.email[0]}`);
        } else if (errors.phone) {
          setError(`Phone: ${errors.phone[0]}`);
        } else if (errors.password) {
          setError(`Password: ${errors.password[0]}`);
        } else {
          setError(err.message || 'Registration failed. Please try again.');
        }
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          required
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          icon={<User className="h-5 w-5" />}
          placeholder="John"
        />

        <Input
          label="Last Name"
          type="text"
          required
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          icon={<User className="h-5 w-5" />}
          placeholder="Doe"
        />
      </div>

      <Input
        label="Username"
        type="text"
        required
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        icon={<User className="h-5 w-5" />}
        placeholder="johndoe"
      />

      <Input
        label="Email Address"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        icon={<Mail className="h-5 w-5" />}
        placeholder="john@example.com"
      />

      <Input
        label="Phone Number (Optional)"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        icon={<Phone className="h-5 w-5" />}
        placeholder="+1 234 567 8900"
        maxLength={15}
      />

      <Input
        label="Password"
        type="password"
        required
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        icon={<Lock className="h-5 w-5" />}
        placeholder="Create a strong password"
      />

      <Input
        label="Confirm Password"
        type="password"
        required
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        icon={<Lock className="h-5 w-5" />}
        placeholder="Re-enter your password"
      />

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-900">
            <p className="font-medium mb-1">Account Benefits:</p>
            <ul className="space-y-1 text-indigo-700">
              <li>• Quick and easy food ordering</li>
              <li>• Track your order status in real-time</li>
              <li>• Manage your digital wallet</li>
            </ul>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full group" size="lg" isLoading={isLoading}>
        <span>Create Account</span>
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Already have an account?</span>
        </div>
      </div>

      <Link to="/login">
        <Button type="button" variant="secondary" className="w-full" size="lg">
          Sign in instead
        </Button>
      </Link>
    </form>
  );
}