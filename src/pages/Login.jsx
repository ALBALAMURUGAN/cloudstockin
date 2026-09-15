import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Box, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('admin@cloudstock.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      addToast('Welcome back to CloudStock!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-brown-600/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-300/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-lg">
                <Box className="w-7 h-7 text-brown-900" />
              </div>
              <span className="text-3xl font-bold text-white">CloudStock</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Smart Inventory &<br />
              <span className="text-gradient-brown bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">Supply Chain</span><br />
              Management
            </h1>
            <p className="text-brown-300 text-lg mb-8 leading-relaxed">
              Streamline your operations with cloud-powered inventory tracking, warehouse management, and intelligent analytics.
            </p>
            <div className="space-y-4">
              {['Real-time inventory tracking', 'Multi-warehouse management', 'AI-powered analytics & insights'].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                  <span className="text-brown-200 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-brown-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-brown flex items-center justify-center">
              <Box className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brown-900">CloudStock</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-brown-200/50 p-8">
            <h2 className="text-2xl font-bold text-brown-900 mb-1">Welcome back</h2>
            <p className="text-sm text-brown-400 mb-6">Sign in to your CloudStock account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brown-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-white outline-none transition-all"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brown-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-white outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-brown-300 text-brown-600 focus:ring-brown-500" />
                  <span className="text-xs text-brown-500">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-brown-600 hover:text-brown-800 transition-colors">Forgot password?</Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl gradient-brown text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-brown-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-brown-700 hover:text-brown-900 transition-colors">Create account</Link>
              </p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-brown-50 border border-brown-200/50">
              <p className="text-[10px] text-brown-400 font-medium mb-1">Demo Credentials</p>
              <p className="text-xs text-brown-600">admin@cloudstock.io / password123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
