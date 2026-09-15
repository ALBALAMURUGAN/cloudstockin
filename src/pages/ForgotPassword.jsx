import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Box, Send } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast('Reset link sent to your email', 'success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brown-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl gradient-brown flex items-center justify-center"><Box className="w-6 h-6 text-white" /></div>
          <span className="text-2xl font-bold text-brown-900">CloudStock</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-brown-200/50 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Send className="w-6 h-6 text-emerald-600" /></div>
              <h2 className="text-xl font-bold text-brown-900 mb-2">Check your email</h2>
              <p className="text-sm text-brown-400 mb-6">We sent a password reset link to {email}</p>
              <Link to="/login" className="text-sm font-medium text-brown-700 hover:text-brown-900">Back to login</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-brown-900 mb-1">Forgot password?</h2>
              <p className="text-sm text-brown-400 mb-6">Enter your email to receive a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brown-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:bg-white outline-none transition-all" placeholder="you@company.com" required />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl gradient-brown text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all">Send Reset Link</button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs font-medium text-brown-600 hover:text-brown-800 inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" />Back to login</Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
