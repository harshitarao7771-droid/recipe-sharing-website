import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Camera, Edit3, ChefHat, Heart, BookOpen, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getUserProfile, updateProfile, deleteRecipe } from '../services/recipeService';
import RecipeCard from '../components/recipe/RecipeCard';
import { RecipeCardSkeleton } from '../components/ui/Skeleton';

export default function ProfilePage() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const isOwn = user && user._id === id;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile(id);
        setProfile(res.data.user);
        setRecipes(res.data.recipes);
        setEditForm({ name: res.data.user.name, bio: res.data.user.bio || '' });
      } catch {
        addToast('User not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', editForm.name);
      fd.append('bio', editForm.bio);
      if (avatarFile) fd.append('avatar', avatarFile);
      const res = await updateProfile(fd);
      setProfile(res.data);
      updateUser({ name: res.data.name, avatar: res.data.avatar, bio: res.data.bio });
      setEditOpen(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      addToast('Profile updated! ✨', 'success');
    } catch (err) { addToast(err.message, 'error'); }
    finally { setEditLoading(false); }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await deleteRecipe(recipeId);
      setRecipes(p => p.filter(r => r._id !== recipeId));
      addToast('Recipe deleted', 'info');
    } catch (err) { addToast(err.message, 'error'); }
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: '20px', marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Profile header */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, color: '#fff', overflow: 'hidden', border: '3px solid #F97316' }}>
            {profile?.avatar
              ? <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : profile?.name?.[0]?.toUpperCase()
            }
          </div>
          {isOwn && (
            <label style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              <Camera size={14} color="#fff" />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </label>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700 }}>{profile?.name}</h1>
            {isOwn && (
              <button onClick={() => setEditOpen(true)} className="btn btn-secondary btn-sm">
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
          </div>
          {profile?.bio && <p style={{ color: '#94A3B8', margin: '0 0 16px', lineHeight: 1.6 }}>{profile.bio}</p>}

          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: <BookOpen size={16} style={{ color: '#F97316' }} />, label: 'Recipes', value: recipes.length },
              { icon: <Heart size={16} style={{ color: '#EF4444' }} />, label: 'Total Likes', value: recipes.reduce((sum, r) => sum + (r.likes?.length || 0), 0) },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {s.icon}
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.value}</span>
                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #334155' }}>
        {[{ key: 'recipes', label: `Recipes (${recipes.length})`, icon: <ChefHat size={15} /> }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="btn btn-ghost"
            style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === tab.key ? '2px solid #F97316' : '2px solid transparent', color: activeTab === tab.key ? '#F97316' : '#94A3B8', paddingBottom: '12px' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
          <ChefHat size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-serif)' }}>No recipes yet</h3>
          {isOwn && <Link to="/recipes/new" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Share your first recipe</Link>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {recipes.map(r => (
            <div key={r._id} style={{ position: 'relative' }}>
              <RecipeCard recipe={r} />
              {isOwn && (
                <div style={{ position: 'absolute', bottom: '58px', right: '10px', display: 'flex', gap: '6px' }}>
                  <Link to={`/recipes/${r._id}/edit`} className="btn btn-sm"
                    style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid #334155', color: '#F8FAFC', backdropFilter: 'blur(8px)' }}>
                    <Edit3 size={12} />
                  </Link>
                  <button onClick={() => handleDelete(r._id)} className="btn btn-sm"
                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444' }}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit profile modal */}
      {editOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="btn btn-ghost btn-icon"><X size={16} /></button>
            </div>

            {/* Avatar preview */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#fff', overflow: 'hidden', border: '3px solid #F97316' }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : profile?.avatar
                    ? <img src={profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : profile?.name?.[0]?.toUpperCase()
                }
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', color: '#F97316', cursor: 'pointer', fontSize: '0.875rem' }}>
                <Camera size={14} /> Change photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Name</label>
                <input className="input" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Bio</label>
                <textarea className="input" rows={3} placeholder="Tell us about yourself…" value={editForm.bio}
                  onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={() => setEditOpen(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleEditSave} className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? 'Saving…' : <><Check size={15} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
