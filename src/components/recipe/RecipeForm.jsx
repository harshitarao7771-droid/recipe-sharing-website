import { useState, useEffect } from 'react';
import { Plus, Minus, Upload, X, ChefHat } from 'lucide-react';

const CATEGORIES = ['vegetarian', 'non-vegetarian', 'vegan', 'dessert', 'beverage', 'appetizer', 'breakfast', 'lunch', 'dinner'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function RecipeForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'vegetarian', difficulty: 'easy',
    cookTime: '', prepTime: '', servings: 2,
    ingredients: [{ name: '', amount: '' }],
    steps: [{ stepNumber: 1, instruction: '' }],
    tags: '',
    ...initialData,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
      }));
      if (initialData.image) setImagePreview(initialData.image);
    }
  }, []);

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));

  // Ingredients
  const addIngredient = () => set('ingredients', [...form.ingredients, { name: '', amount: '' }]);
  const removeIngredient = (i) => set('ingredients', form.ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i, field, val) => {
    const arr = [...form.ingredients];
    arr[i] = { ...arr[i], [field]: val };
    set('ingredients', arr);
  };

  // Steps
  const addStep = () => set('steps', [...form.steps, { stepNumber: form.steps.length + 1, instruction: '' }]);
  const removeStep = (i) => {
    const arr = form.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    set('steps', arr);
  };
  const updateStep = (i, val) => {
    const arr = [...form.steps];
    arr[i] = { ...arr[i], instruction: val };
    set('steps', arr);
  };

  // Image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.cookTime || form.cookTime <= 0) e.cookTime = 'Cook time is required';
    if (form.ingredients.some(i => !i.name.trim() || !i.amount.trim())) e.ingredients = 'All ingredient fields are required';
    if (form.steps.some(s => !s.instruction.trim())) e.steps = 'All step instructions are required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'ingredients' || k === 'steps') data.append(k, JSON.stringify(v));
      else if (k === 'tags') data.append(k, JSON.stringify(v.split(',').map(t => t.trim()).filter(Boolean)));
      else data.append(k, v);
    });
    if (imageFile) data.append('image', imageFile);
    onSubmit(data);
  };

  const inputStyle = (field) => ({ ...(errors[field] ? { borderColor: '#EF4444' } : {}) });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Basic Info */}
      <section className="card" style={{ padding: '24px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChefHat size={20} style={{ color: '#F97316' }} /> Basic Information
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>
              Recipe Title *
            </label>
            <input className="input" placeholder="e.g. Creamy Butternut Squash Pasta" value={form.title}
              onChange={e => set('title', e.target.value)} style={inputStyle('title')} />
            {errors.title && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.title}</p>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Description *</label>
            <textarea className="input" placeholder="Describe your recipe in a few sentences…" value={form.description}
              onChange={e => set('description', e.target.value)} style={inputStyle('description')} rows={3} />
            {errors.description && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.description}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Category *</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}
                style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Difficulty</label>
              <select className="input" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                {DIFFICULTIES.map(d => <option key={d} value={d} style={{ textTransform: 'capitalize' }}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Prep Time (min)</label>
              <input className="input" type="number" min="0" placeholder="15" value={form.prepTime}
                onChange={e => set('prepTime', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Cook Time (min) *</label>
              <input className="input" type="number" min="1" placeholder="30" value={form.cookTime}
                onChange={e => set('cookTime', e.target.value)} style={inputStyle('cookTime')} />
              {errors.cookTime && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.cookTime}</p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Servings</label>
              <input className="input" type="number" min="1" placeholder="4" value={form.servings}
                onChange={e => set('servings', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500 }}>Tags (comma-separated)</label>
              <input className="input" placeholder="italian, pasta, creamy" value={form.tags}
                onChange={e => set('tags', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* Image Upload */}
      <section className="card" style={{ padding: '24px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={20} style={{ color: '#F97316' }} /> Recipe Photo
        </h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {imagePreview && (
            <div style={{ position: 'relative' }}>
              <img src={imagePreview} alt="preview" style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }} />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="btn btn-icon" style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', padding: '4px', borderRadius: '50%' }}>
                <X size={12} color="#fff" />
              </button>
            </div>
          )}
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: '160px', height: '120px', border: '2px dashed #334155', borderRadius: '12px',
            cursor: 'pointer', gap: '8px', color: '#64748B', fontSize: '0.8rem', transition: 'border-color 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#F97316'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#334155'}
          >
            <Upload size={24} style={{ color: '#F97316' }} />
            Upload photo
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </label>
        </div>
      </section>

      {/* Ingredients */}
      <section className="card" style={{ padding: '24px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700 }}>Ingredients</h2>
        {errors.ingredients && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: '12px' }}>{errors.ingredients}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {form.ingredients.map((ing, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input className="input" placeholder="Ingredient name" value={ing.name}
                onChange={e => updateIngredient(i, 'name', e.target.value)} style={{ flex: 2 }} />
              <input className="input" placeholder="Amount (e.g. 2 cups)" value={ing.amount}
                onChange={e => updateIngredient(i, 'amount', e.target.value)} style={{ flex: 1 }} />
              <button type="button" onClick={() => removeIngredient(i)}
                className="btn btn-icon btn-ghost" disabled={form.ingredients.length === 1}
                style={{ color: '#EF4444', flexShrink: 0 }}>
                <Minus size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
            <Plus size={15} /> Add Ingredient
          </button>
        </div>
      </section>

      {/* Steps */}
      <section className="card" style={{ padding: '24px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700 }}>Instructions</h2>
        {errors.steps && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: '12px' }}>{errors.steps}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {form.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, marginTop: '8px',
                background: 'linear-gradient(135deg,#F97316,#EA6C0A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: '#fff'
              }}>
                {step.stepNumber}
              </div>
              <textarea className="input" placeholder={`Describe step ${step.stepNumber}…`} value={step.instruction}
                rows={2} onChange={e => updateStep(i, e.target.value)} style={{ flex: 1 }} />
              <button type="button" onClick={() => removeStep(i)}
                className="btn btn-icon btn-ghost" disabled={form.steps.length === 1}
                style={{ color: '#EF4444', flexShrink: 0, marginTop: '6px' }}>
                <Minus size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addStep} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
            <Plus size={15} /> Add Step
          </button>
        </div>
      </section>

      {/* Submit */}
      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ alignSelf: 'flex-end' }}>
        {loading ? (
          <><span className="animate-spin-slow" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} /> Saving…</>
        ) : 'Save Recipe'}
      </button>
    </form>
  );
}
