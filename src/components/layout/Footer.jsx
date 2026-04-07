import { Link } from 'react-router-dom';
import { ChefHat, Globe, X, Camera, Heart } from 'lucide-react';

const categories = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Dessert', 'Breakfast', 'Dinner'];

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #334155',
      background: 'rgba(15,23,42,0.9)',
      padding: '48px 0 24px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg,#F97316,#EA6C0A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ChefHat size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem' }}>
                Flavor<span style={{ color: '#F97316' }}>Verse</span>
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 16px' }}>
              A community for food lovers — discover, share, and celebrate amazing recipes from around the world.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[{ icon: <Globe size={16} />, href: '#' }, { icon: <X size={16} />, href: '#' }, { icon: <Camera size={16} />, href: '#' }].map((s, i) => (
                <a key={i} href={s.href} className="btn btn-ghost btn-icon" style={{ border: '1px solid #334155' }}>{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ margin: '0 0 16px', fontWeight: 600, fontSize: '0.9rem', color: '#F8FAFC' }}>Browse</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/?category=${cat.toLowerCase()}`}
                    style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = '#F97316'}
                    onMouseOut={e => e.target.style.color = '#94A3B8'}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ margin: '0 0 16px', fontWeight: 600, fontSize: '0.9rem', color: '#F8FAFC' }}>Community</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Add a Recipe', to: '/recipes/new' },
                { label: 'My Favorites', to: '/favorites' },
                { label: 'My Profile', to: '/profile/me' },
                { label: 'Register', to: '/register' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to}
                    style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = '#F97316'}
                    onMouseOut={e => e.target.style.color = '#94A3B8'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: '20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} FlavorVerse. All rights reserved.
          </p>
          <p style={{ color: '#64748B', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={12} fill="#EF4444" stroke="#EF4444" /> by food lovers, for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
