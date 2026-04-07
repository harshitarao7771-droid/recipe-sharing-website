import { Link } from 'react-router-dom';
import { Heart, Clock, Users, Star, ChefHat } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toggleLike } from '../../services/recipeService';
import { useToast } from '../../contexts/ToastContext';

const CATEGORY_COLORS = {
  vegetarian: 'badge-green',
  'non-vegetarian': 'badge-red',
  vegan: 'badge-green',
  dessert: 'badge-purple',
  beverage: 'badge-blue',
  appetizer: 'badge-amber',
  breakfast: 'badge-amber',
  lunch: 'badge-orange',
  dinner: 'badge-orange',
};

const DIFF_COLORS = { easy: 'badge-green', medium: 'badge-amber', hard: 'badge-red' };

export default function RecipeCard({ recipe, onLikeToggle }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [likes, setLikes] = useState(recipe.likes || []);
  const [liking, setLiking] = useState(false);

  const isLiked = user && (likes.some(l => (l._id || l) === user._id));
  const imageUrl = recipe.image
    ? (recipe.image.startsWith('http') ? recipe.image : recipe.image)
    : null;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { addToast('Please login to like recipes', 'warning'); return; }
    if (liking) return;
    setLiking(true);
    try {
      const res = await toggleLike(recipe._id);
      setLikes(res.data.likes);
      if (onLikeToggle) onLikeToggle(recipe._id, res.data.likes);
    } catch {
      addToast('Failed to update like', 'error');
    } finally {
      setLiking(false);
    }
  };

  // Track viewed categories for personalization
  const handleCardClick = () => {
    if (recipe.category) {
      const viewedCategories = JSON.parse(localStorage.getItem('fv_viewed_categories') || '[]');
      if (!viewedCategories.includes(recipe.category)) {
        viewedCategories.push(recipe.category);
        // Keep only last 5 categories
        if (viewedCategories.length > 5) {
          viewedCategories.shift();
        }
        localStorage.setItem('fv_viewed_categories', JSON.stringify(viewedCategories));
      }
    }
  };

  return (
    <Link to={`/recipes/${recipe._id}`} onClick={handleCardClick} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="card animate-fade-in-up" style={{ overflow: 'hidden', height: '100%' }}>
        {/* Image */}
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={recipe.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div className="img-placeholder" style={{ width: '100%', height: '100%' }}>
              <ChefHat size={40} style={{ opacity: 0.3 }} />
            </div>
          )}
          {/* Category badge */}
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <span className={`badge ${CATEGORY_COLORS[recipe.category] || 'badge-orange'}`}>
              {recipe.category}
            </span>
          </div>
          {/* Like button */}
          <button
            onClick={handleLike}
            className="btn btn-icon"
            style={{
              position: 'absolute', top: '10px', right: '10px',
              background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: liking ? 'heartPulse 0.4s ease' : 'none'
            }}
          >
            <Heart
              size={15}
              fill={isLiked ? '#EF4444' : 'none'}
              stroke={isLiked ? '#EF4444' : '#94A3B8'}
            />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {/* Author */}
          {recipe.author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#F97316,#EA6C0A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                overflow: 'hidden'
              }}>
                {recipe.author.avatar
                  ? <img src={recipe.author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : recipe.author.name?.[0]?.toUpperCase()
                }
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{recipe.author.name}</span>
            </div>
          )}

          {/* Title */}
          <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {recipe.title}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F59E0B' }}>
              {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'New'}
            </span>
            {recipe.ratings?.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({recipe.ratings.length})</span>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '0.78rem' }}>
              <Clock size={13} />
              {(recipe.cookTime || 0) + (recipe.prepTime || 0)} min
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '0.78rem' }}>
              <Users size={13} />
              {recipe.servings} servings
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '0.78rem' }}>
              <Heart size={13} />
              {likes.length}
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ marginTop: '4px' }}>
            <span className={`badge ${DIFF_COLORS[recipe.difficulty] || 'badge-green'}`} style={{ fontSize: '0.7rem' }}>
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
