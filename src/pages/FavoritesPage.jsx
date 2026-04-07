import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChefHat } from 'lucide-react';
import { getFavorites } from '../services/recipeService';
import { useToast } from '../contexts/ToastContext';
import RecipeCard from '../components/recipe/RecipeCard';
import { RecipeCardSkeleton } from '../components/ui/Skeleton';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getFavorites();
        setFavorites(res.data);
      } catch {
        addToast('Failed to load favorites', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#EF4444,#DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} color="#fff" fill="#fff" />
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700 }}>My Saved Recipes</h1>
        </div>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.95rem' }}>
          {loading ? 'Loading…' : `${favorites.length} recipe${favorites.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
        </div>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748B' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💔</div>
          <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#94A3B8' }}>No saved recipes yet</h3>
          <p style={{ margin: '0 0 24px', fontSize: '0.875rem' }}>Browse recipes and click the bookmark icon to save your favorites.</p>
          <Link to="/" className="btn btn-primary">
            <ChefHat size={16} /> Discover Recipes
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {favorites.map(r => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}
