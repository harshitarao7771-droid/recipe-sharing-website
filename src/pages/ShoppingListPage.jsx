import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Check, ChefHat, CalendarDays } from 'lucide-react';
import api from '../services/api';
import { getRecipes } from '../services/recipeService';

function getMonday(d = new Date()) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0,0,0,0);
  return monday;
}

export default function ShoppingListPage() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [mealSummary, setMealSummary] = useState([]);

  useEffect(() => {
    const generateShoppingList = async () => {
      setLoading(true);
      try {
        const monday = getMonday();
        const res = await api.get(`/mealplan?weekStart=${monday.toISOString()}`);
        const days = res.data.days || {};

        // Collect all meal names from the plan
        const meals = [];
        Object.entries(days).forEach(([day, mealSlots]) => {
          if (typeof mealSlots === 'object') {
            Object.entries(mealSlots).forEach(([mealType, value]) => {
              const name = typeof value === 'string' ? value : value?.recipeName;
              if (name && name.trim()) {
                meals.push({ day, mealType, name: name.trim() });
              }
            });
          }
        });

        setMealSummary(meals);

        // Search each meal name in DB and fetch ingredients
        const ingredientMap = new Map();
        await Promise.all(meals.map(async (meal) => {
          try {
            const searchRes = await getRecipes({ search: meal.name, limit: 1 });
            const recipe = searchRes.data.recipes?.[0];
            if (recipe && recipe.ingredients?.length > 0) {
              recipe.ingredients.forEach(ing => {
                const key = ing.name.toLowerCase().trim();
                if (ingredientMap.has(key)) {
                  ingredientMap.get(key).sources.push(`${recipe.title} (${meal.mealType} - ${meal.day})`);
                } else {
                  ingredientMap.set(key, {
                    id: `${key}-${Date.now()}-${Math.random()}`,
                    name: ing.name,
                    amount: ing.amount,
                    sources: [`${recipe.title} (${meal.mealType} - ${meal.day})`],
                    checked: false,
                    fromPlan: true
                  });
                }
              });
            } else {
              // Recipe not found in DB — add meal name as item
              const key = meal.name.toLowerCase();
              if (!ingredientMap.has(key)) {
                ingredientMap.set(key, {
                  id: `${key}-${Date.now()}`,
                  name: meal.name,
                  amount: '',
                  sources: [`${meal.mealType} - ${meal.day}`],
                  checked: false,
                  fromPlan: true
                });
              }
            }
          } catch {}
        }));

        setItems([...ingredientMap.values()]);
      } catch (err) {
        console.error('Failed to generate shopping list:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    generateShoppingList();
  }, []);

  const addManual = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setItems(prev => [...prev, {
      id: Date.now(),
      name: input.trim(),
      amount: '',
      sources: [],
      checked: false,
      fromPlan: false
    }]);
    setInput('');
  };

  const toggleItem = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const deleteItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clearChecked = () => setItems(prev => prev.filter(i => !i.checked));

  const planItems = items.filter(i => i.fromPlan);
  const manualItems = items.filter(i => !i.fromPlan);

  const ItemRow = ({ item }) => (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: item.fromPlan ? 'rgba(249,115,22,0.05)' : 'rgba(30,41,59,0.5)', border: `1px solid ${item.fromPlan ? 'rgba(249,115,22,0.2)' : '#334155'}` }}>
      <button onClick={() => toggleItem(item.id)} style={{ width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, marginTop: '2px', border: '2px solid', borderColor: item.checked ? '#10B981' : (item.fromPlan ? '#F97316' : '#475569'), background: item.checked ? '#10B981' : 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.checked && <Check size={13} />}
      </button>
      <div style={{ flex: 1 }}>
        <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#64748B' : '#F8FAFC', fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</span>
        {item.sources.length > 0 && (
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '3px', textTransform: 'capitalize' }}>
            {item.sources.join(' · ')}
          </div>
        )}
      </div>
      {item.amount && <span style={{ color: '#F97316', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{item.amount}</span>}
      <button onClick={() => deleteItem(item.id)} className="btn btn-ghost btn-icon" style={{ color: '#EF4444', flexShrink: 0 }}><Trash2 size={15} /></button>
    </li>
  );

  return (
    <div className="container" style={{ maxWidth: '640px', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <ShoppingCart size={28} color="#F97316" />
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>Shopping List</h1>
      </div>
      <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '24px' }}>
        Auto-generated from this week's meal plan
      </p>

      {/* This week's meals summary */}
      {mealSummary.length > 0 && (
        <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CalendarDays size={15} color="#F97316" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F97316' }}>This Week's Meals</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {mealSummary.map((m, i) => (
              <span key={i} style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize' }}>
                {m.name} ({m.mealType})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Manual Add */}
      <form onSubmit={addManual} style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <input className="input" placeholder="Add an item manually..." value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1 }} />
        <button type="submit" className="btn btn-secondary"><Plus size={16} /> Add</button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          <ShoppingCart size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>Generating shopping list from meal plan...</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p style={{ marginBottom: '8px', fontWeight: 500 }}>No items yet.</p>
          <p style={{ fontSize: '0.85rem' }}>
            Add meals to your <a href="/meal-planner" style={{ color: '#F97316' }}>Meal Planner</a> to auto-generate your shopping list, or add items manually above.
          </p>
        </div>
      ) : (
        <>
          {planItems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ChefHat size={16} color="#F97316" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F97316' }}>
                  Ingredients from Meal Plan ({planItems.length} items)
                </span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {planItems.map(item => <ItemRow key={item.id} item={item} />)}
              </ul>
            </div>
          )}

          {manualItems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Plus size={16} color="#94A3B8" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#94A3B8' }}>Added Manually</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {manualItems.map(item => <ItemRow key={item.id} item={item} />)}
              </ul>
            </div>
          )}

          {items.some(i => i.checked) && (
            <button onClick={clearChecked} className="btn btn-secondary btn-sm">
              Clear checked items
            </button>
          )}
        </>
      )}
    </div>
  );
}
