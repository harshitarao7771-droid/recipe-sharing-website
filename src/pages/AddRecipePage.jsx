import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/recipe/RecipeForm';
import { createRecipe } from '../services/recipeService';
import { useToast } from '../contexts/ToastContext';
import { ChefHat } from 'lucide-react';

export default function AddRecipePage() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await createRecipe(formData);
      addToast('Recipe published! 🎉', 'success');
      navigate(`/recipes/${res.data._id}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChefHat size={22} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700 }}>Share a Recipe</h1>
        </div>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.95rem' }}>
          Fill in the details below. Good recipes have clear instructions, accurate timings, and a great photo!
        </p>
      </div>
      <RecipeForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
