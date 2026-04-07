export function RecipeCardSkeleton() {
  return (
    <div className="card overflow-hidden" style={{ height: '380px' }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: '16px 16px 0 0' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '6px' }} />
        <div className="skeleton" style={{ height: '20px', width: '85%', borderRadius: '6px' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '6px' }} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <div className="skeleton" style={{ height: '14px', width: '60px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '14px', width: '60px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '14px', width: '60px', borderRadius: '6px' }} />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div className="skeleton" style={{ height: '400px', borderRadius: '20px', marginBottom: '24px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="skeleton" style={{ height: '36px', width: '60%', borderRadius: '8px' }} />
        <div className="skeleton" style={{ height: '16px', width: '80%', borderRadius: '6px' }} />
        <div className="skeleton" style={{ height: '16px', width: '70%', borderRadius: '6px' }} />
      </div>
    </div>
  );
}
