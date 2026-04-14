import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChefHat, Search, Sun, Moon, Menu, X,
  PlusCircle, User, Heart, LogOut, LogIn,
  CalendarDays, Home, ShoppingCart, Tag
} from 'lucide-react';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [tags, setTags] = useState([]);
  const [dropOpen, setDropOpen] = useState(false);

  const addTag = (val) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) addTag(inputVal);
    const allTags = inputVal.trim()
      ? [...tags, inputVal.trim().toLowerCase()]
      : tags;
    if (allTags.length === 0) return;
    if (onSearch) onSearch(allTags.join(','));
    else navigate(`/?search=${encodeURIComponent(allTags.join(','))}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  const tagColors = ['#F97316','#10B981','#3B82F6','#8B5CF6','#EC4899','#F59E0B'];

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '64px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249,115,22,0.4)' }}>
            <ChefHat size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem', color: isDark ? '#F8FAFC' : '#1E293B' }}>
            Recipe<span style={{ color: '#F97316' }}>App</span>
          </span>
        </Link>

        <div style={{ flex: 1 }} />

        {/* Desktop ingredient search */}
        <form onSubmit={handleSearch} className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30,41,59,0.8)', border: '1px solid #334155', borderRadius: '10px', padding: '6px 10px', minWidth: '280px', maxWidth: '400px', flexWrap: 'wrap' }}>
          <Tag size={14} color="#F97316" style={{ flexShrink: 0 }} />
          {tags.map((tag, i) => (
            <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: tagColors[i % tagColors.length] + '22', color: tagColors[i % tagColors.length], border: '1px solid ' + tagColors[i % tagColors.length] + '55', borderRadius: '20px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600 }}>
              {tag}
              <span onClick={(e) => { e.preventDefault(); removeTag(tag); }} style={{ cursor: 'pointer', fontWeight: 700 }}>x</span>
            </span>
          ))}
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? 'Type ingredient, press Enter...' : 'Add more...'}
            style={{ flex: 1, minWidth: '80px', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.82rem', color: '#F8FAFC' }}
          />
          <button type="submit" style={{ background: '#F97316', border: 'none', borderRadius: '6px', padding: '4px 10px', color: '#fff', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <Search size={13} /> Find
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          <button className="btn btn-ghost btn-icon" onClick={toggle} title="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/" className="btn btn-ghost btn-icon" title="Home">
            <Home size={18} />
          </Link>
          {user ? (
            <>
              <Link to="/meal-planner" className="btn btn-ghost btn-icon" title="Meal Planner">
                <CalendarDays size={18} />
              </Link>
              <Link to="/shopping-list" className="btn btn-ghost btn-icon" title="Shopping List">
                <ShoppingCart size={18} />
              </Link>
              <Link to="/recipes/new" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Add Recipe
              </Link>
              <div style={{ position: 'relative' }}>
                <button className="btn btn-ghost btn-icon" onClick={() => setDropOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '10px' }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F97316' }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
                {dropOpen && (
                  <div style={{ position: 'absolute', top: '48px', right: 0, minWidth: '200px', background: isDark ? '#1E293B' : '#FFFFFF', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 200, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>{user.email}</p>
                    </div>
                    <Link to={`/profile/${user._id}`} onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '0.875rem' }}>
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/favorites" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '0.875rem' }}>
                      <Heart size={15} /> Saved Recipes
                    </Link>
                    <Link to="/meal-planner" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '0.875rem' }}>
                      <CalendarDays size={15} /> Meal Planner
                    </Link>
                    <Link to="/shopping-list" onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', color: isDark ? '#F8FAFC' : '#1E293B', fontSize: '0.875rem' }}>
                      <ShoppingCart size={15} /> Shopping List
                    </Link>
                    <div style={{ borderTop: '1px solid #334155' }}>
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '0.875rem' }}>
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm"><LogIn size={15} /> Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        <button className="btn btn-ghost btn-icon md:hidden" onClick={() => setMenuOpen(p => !p)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div style={{ borderTop: '1px solid #334155', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px',
            padding: '8px 10px', borderRadius: '10px', minHeight: '44px',
            background: isDark ? '#1E293B' : '#F1F5F9',
            border: '1.5px solid', borderColor: isDark ? '#334155' : '#CBD5E1'
          }}>
            <Tag size={14} color="#F97316" style={{ flexShrink: 0 }} />
            {tags.map((tag, i) => (
              <span key={tag} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: tagColors[i % tagColors.length] + '22',
                color: tagColors[i % tagColors.length],
                border: `1px solid ${tagColors[i % tagColors.length]}55`,
                borderRadius: '20px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600
              }}>
                {tag}
                <span onClick={() => removeTag(tag)} style={{ cursor: 'pointer', fontWeight: 700 }}>×</span>
              </span>
            ))}
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? 'Type ingredient, press Enter...' : 'Add more...'}
              style={{
                flex: 1, minWidth: '100px', border: 'none', outline: 'none',
                background: 'transparent', fontSize: '0.85rem',
                color: isDark ? '#F8FAFC' : '#1E293B'
              }}
            />
          </div>
          <button onClick={handleSearch} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Search size={14} /> Find Recipes
          </button>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={toggle}>
              {isDark ? <><Sun size={15} /> Light</> : <><Moon size={15} /> Dark</>}
            </button>
            <Link to="/" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}><Home size={14} /> Home</Link>
            {user ? (
              <>
                <Link to="/recipes/new" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}><PlusCircle size={14} /> Add Recipe</Link>
                <Link to="/meal-planner" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}><CalendarDays size={14} /> Meal Planner</Link>
                <Link to="/shopping-list" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}><ShoppingCart size={14} /> Shopping List</Link>
                <Link to={`/profile/${user._id}`} className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}><User size={14} /> Profile</Link>
                <Link to="/favorites" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}><Heart size={14} /> Favorites</Link>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}><LogOut size={14} /> Logout</button>
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


