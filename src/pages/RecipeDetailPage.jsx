import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock, Users, ChefHat, Heart, Bookmark, Share2,
  Trash2, Edit3, MessageCircle, Send, Star, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { DetailSkeleton } from '../components/ui/Skeleton';
import StarRating from '../components/ui/StarRating';
import {
  getRecipe, toggleLike, rateRecipe,
  getComments, addComment, deleteComment, toggleFavorite
} from '../services/recipeService';

const DIFF_COLORS = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [rRes, cRes] = await Promise.all([getRecipe(id), getComments(id)]);
        setRecipe(rRes.data);
        setComments(cRes.data);
        if (user) {
          const liked = rRes.data.likes?.some(l => (l._id || l) === user._id);
          const myR = rRes.data.ratings?.find(r => r.user === user._id || r.user?._id === user._id);
          if (myR) setUserRating(myR.score);
          // Check favorites
          if (user.favorites) setIsFav(user.favorites.some(f => (f._id || f) === id));
        }
      } catch {
        addToast('Recipe not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleLike = async () => {
    if (!user) { addToast('Login to like', 'warning'); return; }
    if (liking) return;
    setLiking(true);
    try {
      const res = await toggleLike(id);
      setRecipe(p => ({ ...p, likes: res.data.likes }));
    } catch { addToast('Failed', 'error'); }
    finally { setLiking(false); }
  };

  const handleRate = async (score) => {
    if (!user) { addToast('Login to rate', 'warning'); return; }
    if (ratingLoading) return;
    setRatingLoading(true);
    try {
      const res = await rateRecipe(id, score);
      setUserRating(score);
      setRecipe(p => ({ ...p, averageRating: res.data.averageRating, ratings: [...(p.ratings || []).filter(r => r.user !== user._id), { user: user._id, score }] }));
      addToast(`Rated ${score} star${score > 1 ? 's' : ''}! â­`, 'success');
    } catch { addToast('Failed to rate', 'error'); }
    finally { setRatingLoading(false); }
  };

  const handleFavorite = async () => {
    if (!user) { addToast('Login to save recipes', 'warning'); return; }
    try {
      await toggleFavorite(id);
      setIsFav(p => !p);
      addToast(isFav ? 'Removed from favorites' : 'Saved to favorites! â¤ï¸', isFav ? 'info' : 'success');
    } catch { addToast('Failed', 'error'); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: recipe?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      addToast('Link copied to clipboard!', 'success');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { addToast('Login to comment', 'warning'); return; }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await addComment(id, commentText.trim());
      setComments(p => [res.data, ...p]);
      setCommentText('');
    } catch (err) { addToast(err.message, 'error'); }
    finally { setCommentLoading(false); }
  };

  const handleDeleteComment = async (cid) => {
    try {
      await deleteComment(cid);
      setComments(p => p.filter(c => c._id !== cid));
      addToast('Comment deleted', 'info');
    } catch { addToast('Failed to delete', 'error'); }
  };

  const toggleIngredient = (i) => {
    setCheckedIngredients(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  };

  if (loading) return <div className="container" style={{ paddingTop: '40px' }}><DetailSkeleton /></div>;
  if (!recipe) return null;

  const isLiked = user && recipe.likes?.some(l => (l._id || l) === user._id);
  const isAuthor = user && recipe.author?._id === user._id;
  const totalTime = (recipe.cookTime || 0) + (recipe.prepTime || 0);

  return (
    <div>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="img-placeholder" style={{ width: '100%', height: '100%' }}>
            <ChefHat size={80} style={{ opacity: 0.2 }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 50%, transparent 100%)' }} />

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm"
          style={{ position: 'absolute', top: '20px', left: '20px', backdropFilter: 'blur(8px)', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Action buttons */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
          {isAuthor && (
            <>
              <Link to={`/recipes/${id}/edit`} className="btn btn-sm"
                style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC' }}>
                <Edit3 size={14} /> Edit
              </Link>
            </>
          )}
          <button onClick={handleShare} className="btn btn-sm"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC' }}>
            <Share2 size={14} />
          </button>
        </div>

        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: '24px', left: 0, right: 0 }} className="container">
          <span className={`badge badge-orange`} style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
            {recipe.category}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2 }}>
            {recipe.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {recipe.author && (
              <Link to={`/profile/${recipe.author._id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#CBD5E1' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', overflow: 'hidden' }}>
                  {recipe.author.avatar ? <img src={recipe.author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : recipe.author.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{recipe.author.name}</span>
              </Link>
            )}
            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Â·</span>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(recipe.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(300px, 30%)', gap: '32px' }} className="grid-cols-1 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div style={{ minWidth: 0 }}>
            {/* Stats bar */}
            <div className="card" style={{ padding: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {[
                { icon: <Clock size={18} style={{ color: '#F97316' }} />, label: 'Total Time', value: `${totalTime} min` },
                { icon: <Clock size={18} style={{ color: '#60A5FA' }} />, label: 'Prep', value: `${recipe.prepTime || 0} min` },
                { icon: <Clock size={18} style={{ color: '#10B981' }} />, label: 'Cook', value: `${recipe.cookTime} min` },
                { icon: <Users size={18} style={{ color: '#A78BFA' }} />, label: 'Servings', value: recipe.servings },
                {
                  icon: <ChefHat size={18} style={{ color: DIFF_COLORS[recipe.difficulty] }} />,
                  label: 'Difficulty',
                  value: <span style={{ textTransform: 'capitalize', color: DIFF_COLORS[recipe.difficulty] }}>{recipe.difficulty}</span>
                },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {s.icon}
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '28px', fontSize: '0.95rem' }}>{recipe.description}</p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <button onClick={handleLike} className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
                style={isLiked ? { animation: liking ? 'heartPulse 0.4s' : 'none' } : {}}>
                <Heart size={16} fill={isLiked ? '#fff' : 'none'} /> {recipe.likes?.length || 0} Likes
              </button>
              <button onClick={handleFavorite} className={`btn ${isFav ? 'btn-secondary' : 'btn-secondary'}`}
                style={isFav ? { background: 'rgba(249,115,22,0.15)', borderColor: '#F97316', color: '#F97316' } : {}}>
                <Bookmark size={16} fill={isFav ? '#F97316' : 'none'} stroke={isFav ? '#F97316' : undefined} />
                {isFav ? 'Saved' : 'Save Recipe'}
              </button>
              <button onClick={handleShare} className="btn btn-secondary">
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Rating */}
            <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600 }}>Rate this Recipe</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <StarRating rating={recipe.averageRating} size={22} />
                <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                  {recipe.averageRating > 0 ? `${recipe.averageRating.toFixed(1)}/5` : 'No ratings yet'} ({recipe.ratings?.length || 0} ratings)
                </span>
              </div>
              {user && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Your rating:</span>
                  <StarRating rating={userRating} size={20} interactive onRate={handleRate} />
                  {userRating > 0 && <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 600 }}>{userRating} star{userRating > 1 ? 's' : ''}</span>}
                </div>
              )}
            </div>

            {/* Ingredients (interactive) */}
            <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 16px', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Ingredients
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>Click to check off</span>
              </h2>
              <div>
                {recipe.ingredients?.map((ing, i) => (
                  <div key={i} className={`ingredient-row ${checkedIngredients.includes(i) ? 'checked' : ''}`}
                    onClick={() => toggleIngredient(i)}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                      border: `2px solid ${checkedIngredients.includes(i) ? '#10B981' : '#334155'}`,
                      background: checkedIngredients.includes(i) ? '#10B981' : 'transparent',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {checkedIngredients.includes(i) && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>âœ“</span>}
                    </div>
                    <span style={{ flex: 1, fontSize: '0.95rem' }}>{ing.name}</span>
                    <span style={{ color: '#F97316', fontWeight: 600, fontSize: '0.875rem' }}>{ing.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 16px', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>Instructions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recipe.steps?.map((step, i) => (
                  <div key={i} className="step-card">
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                      {step.stepNumber}
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.7, color: '#CBD5E1', flex: 1 }}>{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {recipe.tags?.length > 0 && (
              <div style={{ marginBottom: '32px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Tags:</span>
                {recipe.tags.map(t => (
                  <Link key={t} to={`/?search=${t}`} className="tag" style={{ textDecoration: 'none' }}>#{t}</Link>
                ))}
              </div>
            )}

            {/* Comments */}
            <div>
              <h2 style={{ margin: '0 0 20px', fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle size={22} style={{ color: '#F97316' }} />
                Comments <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#64748B' }}>({comments.length})</span>
              </h2>

              {user ? (
                <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                    {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <input className="input" placeholder="Add a commentâ€¦" value={commentText}
                      onChange={e => setCommentText(e.target.value)} style={{ flex: 1 }} />
                    <button type="submit" className="btn btn-primary btn-icon" disabled={commentLoading || !commentText.trim()}>
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ marginBottom: '24px', color: '#64748B', fontSize: '0.875rem' }}>
                  <Link to="/login" style={{ color: '#F97316' }}>Login</Link> to leave a comment.
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.length === 0 ? (
                  <p style={{ color: '#64748B', fontSize: '0.875rem', textAlign: 'center', padding: '24px' }}>Be the first to comment!</p>
                ) : comments.map(c => (
                  <div key={c._id} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#475569,#334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                      {c.user?.avatar ? <img src={c.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.user?.name}</span>
                          <span style={{ color: '#64748B', fontSize: '0.75rem', marginLeft: '8px' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        {user && c.user?._id === user._id && (
                          <button onClick={() => handleDeleteComment(c._id)} className="btn btn-ghost btn-icon" style={{ padding: '2px', color: '#EF4444' }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.5 }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Author card */}
            {recipe.author && (
              <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 12px', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: '#fff', overflow: 'hidden' }}>
                  {recipe.author.avatar ? <img src={recipe.author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : recipe.author.name?.[0]?.toUpperCase()}
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600 }}>{recipe.author.name}</h3>
                {recipe.author.bio && <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>{recipe.author.bio}</p>}
                <Link to={`/profile/${recipe.author._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  View Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


