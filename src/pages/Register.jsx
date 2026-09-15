import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Box, ArrowRight, User, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      addToast('Account created! Please check your email to verify.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brown-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl gradient-brown flex items-center justify-center">
            <Box className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-brown-900">CloudStock</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-brown-200/50 p-8">
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Create account</h2>
          <p className="text-sm text-brown-400 mb-6">Start managing your inventory today</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brown-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-white outline-none transition-all" placeholder="John Doe" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brown-700 mb-1.5">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                <input type="text" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-white outline-none transition-all" placeholder="Acme Inc." />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brown-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-white outline-none transition-all" placeholder="you@company.com" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brown-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-white outline-none transition-all" placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl gradient-brown text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-brown-400">Already have an account? <Link to="/login" className="font-semibold text-brown-700 hover:text-brown-900">Sign in</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
