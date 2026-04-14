import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Tag } from 'lucide-react';

export default function IngredientSearch() {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const addTag = () => {
    const val = input.trim().toLowerCase();
    if (val && !tags.includes(val)) setTags(prev => [...prev, val]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && !input && tags.length) setTags(prev => prev.slice(0, -1));
  };

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));

  const handleSearch = () => {
    const allTags = input.trim() ? [...tags, input.trim().toLowerCase()] : tags;
    if (allTags.length === 0) return;
    navigate(`/search/ingredients?ingredients=${allTags.join(',')}`);
  };

  return (
    <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155', borderRadius: '14px', padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Tag size={16} color="#F97316" />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F8FAFC' }}>Search by Ingredients</span>
        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>— type an ingredient and press Enter</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', background: '#1E293B', border: '1px solid #334155', borderRadius: '10px', padding: '8px 12px' }}>
          {tags.map(tag => (
            <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 500 }}>
              {tag}
              <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F97316', padding: 0, display: 'flex', lineHeight: 1 }}>
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length ? 'Add more...' : 'e.g. paneer, tomato, onion...'}
            style={{ border: 'none', background: 'transparent', outline: 'none', color: '#F8FAFC', fontSize: '0.875rem', flex: 1, minWidth: '120px' }}
          />
        </div>
        <button onClick={handleSearch} disabled={tags.length === 0 && !input.trim()} className="btn btn-primary" style={{ flexShrink: 0 }}>
          <Search size={16} /> Find Recipes
        </button>
      </div>
      {tags.length > 0 && (
        <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
          Finding recipes with: {tags.join(', ')} — press Enter to add more ingredients
        </p>
      )}
    </div>
  );
}
