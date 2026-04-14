import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Tag, ChefHat } from 'lucide-react';
import RecipeCard from '../components/recipe/RecipeCard';
import api from '../services/api';

export default function IngredientSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const ingredients = searchParams.get('ingredients') || '';
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const ingredientList = ingredients.split(',').map(i => i.trim()).filter(Boolean);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/recipes/search/ingredients?ingredients=${ingredients}`);
        setRecipes(res.data.recipes || []);
      } catch { setRecipes([]); }
      finally { setLoading(false); }
    };
    if (ingredients) fetch();
  }, [ingredients]);

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Tag size={22} color="#F97316" />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
            Ingredient Search Results
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Recipes containing:</span>
          {ingredientList.map(ing => (
            <span key={ing} style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '20px', padding: '2px 12px', fontSize: '0.8rem', fontWeight: 500 }}>
              {ing}
            </span>
          ))}
        </div>
        {!loading && <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '8px' }}>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found</p>}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Searching recipes...</div>
      ) : recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <ChefHat size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 8px' }}>No recipes found</h3>
          <p style={{ margin: '0 0 20px', fontSize: '0.875rem' }}>Try different ingredients or add recipes with these ingredients.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {recipes.map(r => (
            <div key={r._id} style={{ position: 'relative' }}>
              {r.matchCount > 0 && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(249,115,22,0.9)', color: '#fff', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {r.matchCount}/{ingredientList.length} match
                </div>
              )}
              <RecipeCard recipe={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
