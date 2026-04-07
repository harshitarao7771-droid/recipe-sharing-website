import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff, ChefHat, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      addToast('Account created! Welcome to FlavorVerse 🎉', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.message, 'error');
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#EF4444', '#F59E0B', '#10B981'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'stretch' }}>
      {/* Left decorative */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1c1a2e 50%, #0F172A 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px', position: 'relative', overflow: 'hidden'
      }} className="hidden md:flex">
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, margin: '0 0 12px', color: '#F8FAFC' }}>
            Join FlavorVerse
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '320px', lineHeight: 1.6, margin: '0 auto' }}>
            Share your culinary creations with a passionate community. Every recipe tells a story — what's yours?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '32px', alignItems: 'flex-start' }}>
            {['✓ Post unlimited recipes', '✓ Save recipes you love', '✓ Rate & review dishes', '✓ Connect with chefs'].map(f => (
              <span key={f} style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--color-bg-dark)', overflowY: 'auto' }}>
        <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '400px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '36px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem', color: '#F8FAFC' }}>
              Flavor<span style={{ color: '#F97316' }}>Verse</span>
            </span>
          </Link>

          <h1 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 700 }}>Create your account</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: '0 0 28px' }}>
            Already have an account? <Link to="/login" style={{ color: '#F97316', textDecoration: 'none', fontWeight: 500 }}>Sign in →</Link>
          </p>

          {errors.general && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '0.875rem', color: '#EF4444' }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-name" className={`input ${errors.name ? 'error' : ''}`} placeholder="Gordon Ramsay" value={form.name}
                  onChange={e => set('name', e.target.value)} style={{ paddingLeft: '42px' }} />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              </div>
              {errors.name && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-email" className={`input ${errors.email ? 'error' : ''}`} type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)} style={{ paddingLeft: '42px' }} />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              </div>
              {errors.email && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" className={`input ${errors.password ? 'error' : ''}`} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingLeft: '42px', paddingRight: '42px' }} />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="btn btn-ghost btn-icon" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#334155', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(strength / 3) * 100}%`, background: strengthColors[strength], transition: 'width 0.3s, background 0.3s', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strengthColors[strength], fontWeight: 500 }}>{strengthLabels[strength]}</span>
                </div>
              )}
              {errors.password && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-confirm" className={`input ${errors.confirm ? 'error' : ''}`} type="password" placeholder="••••••••"
                  value={form.confirm} onChange={e => set('confirm', e.target.value)} style={{ paddingLeft: '42px' }} />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              </div>
              {errors.confirm && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.confirm}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
              {loading
                ? <><span className="animate-spin-slow" style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} /> Creating account…</>
                : 'Create Account'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
