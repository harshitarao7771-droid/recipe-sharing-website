import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/recipe/RecipeForm';
import { getRecipe, updateRecipe } from '../services/recipeService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { DetailSkeleton } from '../components/ui/Skeleton';
import { Edit3 } from 'lucide-react';

export default function EditRecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getRecipe(id);
        const r = res.data;
        // Only author can edit
        if (r.author?._id !== user?._id) {
          addToast('You can only edit your own recipes', 'error');
          navigate(`/recipes/${id}`);
          return;
        }
        setRecipe(r);
      } catch {
        addToast('Recipe not found', 'error');
        navigate('/');
      } finally {
        setFetchLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await updateRecipe(id, formData);
      addToast('Recipe updated! ✨', 'success');
      navigate(`/recipes/${id}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <DetailSkeleton />;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#F97316,#EA6C0A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Edit3 size={20} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700 }}>Edit Recipe</h1>
        </div>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.95rem' }}>Update your recipe details below.</p>
      </div>
      {recipe && <RecipeForm initialData={recipe} onSubmit={handleSubmit} loading={loading} />}
    </div>
  );
}
