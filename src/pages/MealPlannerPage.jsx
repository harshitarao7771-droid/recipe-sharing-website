import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MEALS = ['breakfast','lunch','dinner'];

function getMonday(d = new Date()) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0,0,0,0);
  return monday;
}

export default function MealPlannerPage() {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(getMonday());
  const [plan, setPlan] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadPlan = async () => {
    try {
      const res = await api.get(`/mealplan?weekStart=${weekStart.toISOString()}`);
      setPlan(res.data.days || {});
    } catch {}
  };

  useEffect(() => { if (user) loadPlan(); }, [weekStart, user]);

  const handleChange = (day, meal, value) => {
    setPlan(p => ({
      ...p,
      [day]: { ...p[day], [meal]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/mealplan', { weekStart: weekStart.toISOString(), days: plan });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const formatDate = (date, dayIndex) => {
    const d = new Date(date);
    d.setDate(d.getDate() + dayIndex);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!user) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', color: '#94A3B8', fontSize: '1.1rem' }}>
      Please login to use the Meal Planner 🔐
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
            📅 Weekly Meal Planner
          </h1>
          <p style={{ color: '#94A3B8', margin: '4px 0 0' }}>
            Plan your meals for the week
          </p>
        </div>

        {/* Week Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={prevWeek} style={{
            background: '#1E293B', border: '1px solid #334155',
            color: '#F8FAFC', padding: '8px 16px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '1rem'
          }}>← Prev</button>

          <span style={{ color: '#F97316', fontWeight: 600, fontSize: '0.95rem' }}>
            {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} –{' '}
            {new Date(weekStart.getTime() + 6*86400000)
              .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>

          <button onClick={nextWeek} style={{
            background: '#1E293B', border: '1px solid #334155',
            color: '#F8FAFC', padding: '8px 16px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '1rem'
          }}>Next →</button>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving} style={{
          background: saved ? '#10B981' : '#F97316',
          border: 'none', color: '#fff', padding: '10px 24px',
          borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
          fontSize: '0.95rem', transition: 'background 0.3s'
        }}>
          {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Plan'}
        </button>
      </div>

      {/* Meal Plan Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', 
          borderSpacing: '8px', minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ color: '#94A3B8', fontWeight: 600, 
                textAlign: 'left', padding: '8px', width: '100px' }}>Meal</th>
              {DAYS.map((day, i) => (
                <th key={day} style={{
                  background: '#1E293B', borderRadius: '10px',
                  padding: '12px 8px', color: '#F8FAFC', fontWeight: 600,
                  textAlign: 'center', fontSize: '0.875rem'
                }}>
                  <div>{day}</div>
                  <div style={{ color: '#F97316', fontSize: '0.75rem', 
                    fontWeight: 400, marginTop: '2px' }}>
                    {formatDate(weekStart, i)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEALS.map(meal => (
              <tr key={meal}>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    background: meal === 'breakfast' ? 'rgba(249,115,22,0.15)' :
                                meal === 'lunch'     ? 'rgba(16,185,129,0.15)' :
                                                      'rgba(99,102,241,0.15)',
                    color: meal === 'breakfast' ? '#F97316' :
                           meal === 'lunch'     ? '#10B981' : '#818CF8',
                    padding: '4px 10px', borderRadius: '20px',
                    fontSize: '0.8rem', fontWeight: 600,
                    textTransform: 'capitalize'
                  }}>{meal}</span>
                </td>
                {DAYS.map(day => (
                  <td key={day} style={{ padding: '4px' }}>
                    <input
                      value={plan[day]?.[meal] || ''}
                      onChange={e => handleChange(day, meal, e.target.value)}
                      placeholder={`Add ${meal}...`}
                      style={{
                        width: '100%', background: '#1E293B',
                        border: '1px solid #334155', borderRadius: '8px',
                        color: '#F8FAFC', padding: '10px 8px',
                        fontSize: '0.8rem', outline: 'none',
                        transition: 'border-color 0.2s', boxSizing: 'border-box'
                      }}
                      onFocus={e => e.target.style.borderColor = '#F97316'}
                      onBlur={e => e.target.style.borderColor = '#334155'}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Breakfast', color: '#F97316' },
          { label: 'Lunch',     color: '#10B981' },
          { label: 'Dinner',    color: '#818CF8' }
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', 
              borderRadius: '50%', background: color }} />
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{label}</span>
          </div>
        ))}
        <span style={{ color: '#475569', fontSize: '0.85rem', marginLeft: 'auto' }}>
          💡 Type any recipe name or meal description in each cell
        </span>
      </div>
    </div>
  );
}