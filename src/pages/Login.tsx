import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { apiService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, role } = await apiService.login(username, password);

      localStorage.setItem('auth_token', token);
      localStorage.setItem('role', role);

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-900 rounded-full">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">ThreatGuard</h1>
          <p className="text-gray-600 mt-2">
            Security Operations Center
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>

            <input
              id="username"
              type="text"  // 🔥 no email validation anymore
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="flex justify-between items-center text-sm mt-4">
          <span className="text-gray-600">
            Use valid username/password
          </span>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Forgot Password?
          </button>
        </div>

        </form>
      </Card>
    </div>
  );
}
