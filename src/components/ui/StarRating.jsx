import { Star } from 'lucide-react';
import { useState } from 'react';

export default function StarRating({ rating = 0, max = 5, interactive = false, onRate, size = 16 }) {
  const [hovered, setHovered] = useState(0);

  const display = hovered || rating;

  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => {
        const val = i + 1;
        const filled = val <= display;
        return (
          <Star
            key={i}
            size={size}
            fill={filled ? '#F59E0B' : 'none'}
            stroke={filled ? '#F59E0B' : '#475569'}
            style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.15s' }}
            onMouseEnter={() => interactive && setHovered(val)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate && onRate(val)}
          />
        );
      })}
    </div>
  );
}
