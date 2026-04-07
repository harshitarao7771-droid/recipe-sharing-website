import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ChefHat, Search, Sun, Moon, Menu, X,
  PlusCircle, User, Heart, LogOut, LogIn
} from 'lucide-react';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [dropOpen, setDropOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal);
    else navigate(`/?search=${encodeURIComponent(searchVal)}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#F97316,#EA6C0A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(249,115,22,0.4)'
          }}>
            <ChefHat size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem', color: isDark ? '#F8FAFC' : '#1E293B' }}>
            Flavor<span style={{ color: '#F97316' }}>Verse</span>
          </span>
        </Link>

        {/* Search — desktop */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '420px', display: 'flex', position: 'relative' }} className="hidden md:flex">
          <input
            className="input"
            placeholder="Search recipes, ingredients…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            style={{ paddingLeft: '42px', height: '40px', fontSize: '0.875rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
        </form>

        <div style={{ flex: 1 }} />

        {/* Desktop actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          <button className="btn btn-ghost btn-icon" onClick={toggle} title="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <Link to="/recipes/new" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Add Recipe
              </Link>
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => setDropOpen(p => !p)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '10px' }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F97316' }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
                {dropOpen && (
                  <div style={{
                    position: 'absolute', top: '48px', right: 0, minWidth: '200px',
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    border: '1px solid #334155', borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 200,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>{user.email}</p>
                    </div>
                    <Link to={`/profile/${user._id}`} onClick={() => setDropOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '0.875rem' }}
                      className="hover:bg-slate-700"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/favorites" onClick={() => setDropOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '0.875rem' }}
                    >
                      <Heart size={15} /> Saved Recipes
                    </Link>
                    <div style={{ borderTop: '1px solid #334155' }}>
                      <button onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '0.875rem' }}
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="btn btn-ghost btn-icon md:hidden" onClick={() => setMenuOpen(p => !p)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid #334155', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input
              className="input"
              placeholder="Search recipes…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
          </form>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={toggle}>
              {isDark ? <><Sun size={15} /> Light</> : <><Moon size={15} /> Dark</>}
            </button>
            {user ? (
              <>
                <Link to="/recipes/new" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                  <PlusCircle size={14} /> Add Recipe
                </Link>
                <Link to={`/profile/${user._id}`} className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                  <User size={14} /> Profile
                </Link>
                <Link to="/favorites" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                  <Heart size={14} /> Favorites
                </Link>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
