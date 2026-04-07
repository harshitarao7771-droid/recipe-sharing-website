import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, X, TrendingUp, Clock, Star, Flame,
  ChefHat, Carrot, Beef, Vegan, Cake, Coffee, UtensilsCrossed, Apple, Utensils, Sunset,
  Heart, Play, ArrowRight
} from 'lucide-react';
import RecipeCard from '../components/recipe/RecipeCard';
import { RecipeCardSkeleton } from '../components/ui/Skeleton';
import { getRecipes } from '../services/recipeService';

const CATEGORIES = ['all', 'vegetarian', 'non-vegetarian', 'vegan', 'dessert', 'beverage', 'appetizer', 'breakfast', 'lunch', 'dinner'];
const ICON_SIZE = 18;
const CATEGORY_ICONS = {
  all:            <ChefHat       size={ICON_SIZE} />,
  vegetarian:     <Carrot        size={ICON_SIZE} />,
  'non-vegetarian': <Beef        size={ICON_SIZE} />,
  vegan:          <Vegan         size={ICON_SIZE} />,
  dessert:        <Cake          size={ICON_SIZE} />,
  beverage:       <Coffee        size={ICON_SIZE} />,
  appetizer:      <UtensilsCrossed size={ICON_SIZE} />,
  breakfast:      <Apple         size={ICON_SIZE} />,
  lunch:          <Utensils      size={ICON_SIZE} />,
  dinner:         <Sunset        size={ICON_SIZE} />,
};
const SORTS = [
  { value: 'newest', label: 'Newest', icon: <Clock size={14} /> },
  { value: 'popular', label: 'Most Liked', icon: <Flame size={14} /> },
  { value: 'rating', label: 'Top Rated', icon: <Star size={14} /> },
  { value: 'cookTime', label: 'Quick', icon: <TrendingUp size={14} /> },
];

// Featured Collections Data
const FEATURED_COLLECTIONS = [
  {
    id: 1,
    title: '25 Essential Egg Recipes',
    count: 25,
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: '10 Rich & Buttery Recipes',
    count: 10,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Our 20 Most-Saved Healthy Recipes',
    count: 20,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  }
];

// Recipe Videos Data - Real cooking videos
const RECIPE_VIDEOS = [
  {
    id: 1,
    title: 'Perfect Homemade Pizza Recipe',
    channel: 'Tasty',
    category: 'Dinner',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    videoId: 'sv3TXMSv6Lw' // Tasty Pizza Recipe
  },
  {
    id: 2,
    title: 'Classic Chocolate Chip Cookies',
    channel: 'Preppy Kitchen',
    category: 'Dessert',
    thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    videoId: 'wyuec0E077w' // Chocolate Chip Cookies
  },
  {
    id: 3,
    title: 'Easy Chicken Stir Fry',
    channel: 'Tasty',
    category: 'Dinner',
    thumbnail: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    videoId: 'Ym5UJl3yKzw' // Chicken Stir Fry
  },
  {
    id: 4,
    title: 'Fluffy Pancakes Recipe',
    channel: 'Tasty',
    category: 'Breakfast',
    thumbnail: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop',
    videoId: 'gvPSpz0sdFI' // Fluffy Pancakes
  },
  {
    id: 5,
    title: 'Creamy Pasta Carbonara',
    channel: 'Binging with Babish',
    category: 'Lunch',
    thumbnail: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
    videoId: '3AAdKl1UYZs' // Pasta Carbonara
  },
  {
    id: 6,
    title: 'Fresh Garden Salad Bowl',
    channel: 'Pick Up Limes',
    category: 'Vegan',
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    videoId: 'VFsZiJeJNYk' // Healthy Salad Bowl
  }
];

// Filter function to ensure only recipe-related videos
const filterRecipeVideos = (videos) => {
  const recipeKeywords = ['recipe', 'cooking', 'food', 'kitchen', 'cook', 'bake', 'chef', 'meal', 'dish'];
  return videos.filter(video => {
    const titleLower = video.title.toLowerCase();
    return recipeKeywords.some(keyword => titleLower.includes(keyword));
  });
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [topRecipes, setTopRecipes] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await getRecipes(params);
      setRecipes(res.data.recipes);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page, search]);

  const fetchTopRecipes = useCallback(async () => {
    try {
      const res = await getRecipes({ limit: 6, sort: 'popular' });
      setTopRecipes(res.data.recipes);
    } catch {
      setTopRecipes([]);
    }
  }, []);

  const fetchRecommendedRecipes = useCallback(async () => {
    try {
      // Get user's favorite categories from localStorage (basic personalization)
      const viewedCategories = JSON.parse(localStorage.getItem('fv_viewed_categories') || '[]');
      
      // If user has viewed categories, fetch recipes from those categories
      if (viewedCategories.length > 0) {
        const randomCategory = viewedCategories[Math.floor(Math.random() * viewedCategories.length)];
        const res = await getRecipes({ limit: 8, sort: 'rating', category: randomCategory });
        setRecommendedRecipes(res.data.recipes);
      } else {
        // Fallback: show trending recipes (high rating + popular)
        const res = await getRecipes({ limit: 8, sort: 'rating' });
        setRecommendedRecipes(res.data.recipes);
      }
    } catch {
      setRecommendedRecipes([]);
    }
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);
  useEffect(() => { fetchTopRecipes(); }, [fetchTopRecipes]);
  useEffect(() => { fetchRecommendedRecipes(); }, [fetchRecommendedRecipes]);
  useEffect(() => { setSearchInput(search); }, [search]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    p.set(key, value);
    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam('search', searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    const p = new URLSearchParams(searchParams);
    p.delete('search');
    p.set('page', '1');
    setSearchParams(p);
  };

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section style={{
        padding: '90px 0 70px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '420px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero_food_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,14,27,0.75) 0%, rgba(10,14,27,0.6) 50%, rgba(10,14,27,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="animate-fade-in-up">
            <span className="badge badge-orange" style={{ fontSize: '0.8rem', marginBottom: '16px', display: 'inline-flex' }}>
              🍽️ Discover Amazing Recipes
            </span>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              margin: '12px 0 16px',
              lineHeight: 1.15
            }}>
              Cook with <span style={{ color: '#F97316' }}>Passion</span>,<br />
              Share with <span style={{ color: '#10B981' }}>Heart</span>
            </h1>
            <p style={{
              color: '#94A3B8',
              fontSize: '1.05rem',
              maxWidth: '520px',
              margin: '0 auto 32px',
              lineHeight: 1.6
            }}>
              Discover thousands of recipes from talented home cooks. Add your own creations, rate your favorites, and build your culinary story.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}
            className="animate-fade-in-up">
            <input
              className="input"
              placeholder="Search recipes, ingredients, or cuisines…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{
                paddingLeft: '48px',
                paddingRight: search ? '48px' : '130px',
                height: '52px',
                fontSize: '0.95rem',
                borderRadius: '14px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }}
            />
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748B',
              pointerEvents: 'none'
            }} />
            {search && (
              <button type="button" onClick={clearSearch} className="btn btn-ghost btn-icon"
                style={{ position: 'absolute', right: '90px', top: '50%', transform: 'translateY(-50%)' }}>
                <X size={16} />
              </button>
            )}
            <button type="submit" className="btn btn-primary"
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '40px',
                paddingInline: '16px',
                borderRadius: '10px'
              }}>
              Search
            </button>
          </form>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            marginTop: '36px',
            flexWrap: 'wrap'
          }}>
            {[
              ['🍳', 'Recipes', total > 0 ? `${total}+` : '∞'],
              ['👨‍🍳', 'Home Cooks', '500+'],
              ['⭐', 'Avg Rating', '4.8']
            ].map(([icon, label, val]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#F97316' }}>{val}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '32px' }}>
        {/* Category Filters with Icons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px'
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setParam('category', cat)}
              className={`tag ${category === cat ? 'active' : ''}`}
              style={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                textTransform: 'capitalize',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.875rem',
                lineHeight: 1,
                boxShadow: category === cat ? '0 0 12px rgba(249,115,22,0.35)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                opacity: 1,
                visibility: 'visible',
                width: '18px',
                height: '18px',
              }}>
                {CATEGORY_ICONS[cat]}
              </span>
              <span style={{ lineHeight: 1 }}>
                {cat === 'all' ? 'All' : cat}
              </span>
            </button>
          ))}
        </div>

        {/* Featured Collections Section */}
        {!search && category === 'all' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 700,
                margin: 0
              }}>
                Featured Collections
              </h2>
              <button className="btn btn-ghost btn-sm" style={{ gap: '4px' }}>
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {FEATURED_COLLECTIONS.map(collection => (
                <div key={collection.id} className="card" style={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  height: '240px'
                }}>
                  <img
                    src={collection.image}
                    alt={collection.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)'
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      margin: '0 0 4px 0',
                      color: '#fff'
                    }}>
                      {collection.title}
                    </h3>
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#94A3B8',
                      margin: 0
                    }}>
                      {collection.count} Recipes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* This Week's Top Recipes */}
        {!search && category === 'all' && topRecipes.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 700,
                margin: 0
              }}>
                This Week's Top Recipes
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {topRecipes.map((recipe, index) => (
                <Link
                  key={recipe._id}
                  to={`/recipes/${recipe._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card" style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    {/* Ranking Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1E293B, #334155)',
                      border: '2px solid #F97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#F97316',
                      zIndex: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }}>
                      {index + 1}
                    </div>
                    {/* Heart Icon */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 2
                    }}>
                      <Heart size={20} style={{ color: '#EF4444', fill: '#EF4444' }} />
                    </div>
                    <img
                      src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
                      alt={recipe.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '16px' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        margin: '0 0 8px 0'
                      }}>
                        {recipe.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        fontSize: '0.8rem',
                        color: '#94A3B8'
                      }}>
                        <span>⏱️ {recipe.cookTime || 30} min</span>
                        <span>⭐ {recipe.averageRating?.toFixed(1) || '4.5'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Recipe Videos Section */}
        {!search && category === 'all' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 700,
                margin: 0
              }}>
                Latest Recipe Videos 🎥
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {filterRecipeVideos(RECIPE_VIDEOS).map(video => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card" style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,115,22,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Category Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(249,115,22,0.95)',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {video.category}
                      </div>
                      {/* Play Button Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(249,115,22,0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                      >
                        <Play size={28} style={{ color: '#fff', fill: '#fff', marginLeft: '4px' }} />
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        margin: '0 0 6px 0',
                        lineHeight: 1.3
                      }}>
                        {video.title}
                      </h3>
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#94A3B8',
                        margin: 0
                      }}>
                        {video.channel}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Recommended for You Section */}
        {!search && category === 'all' && recommendedRecipes.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  margin: '0 0 6px 0'
                }}>
                  Recommended for You ✨
                </h2>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#94A3B8',
                  margin: 0
                }}>
                  Personalized picks based on your taste
                </p>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {recommendedRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </section>
        )}

        {/* Sort + results */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={15} style={{ color: '#64748B' }} />
            <span style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
              {loading ? 'Loading…' : `${total} recipe${total !== 1 ? 's' : ''} found`}
            </span>
            {search && (
              <span style={{ fontSize: '0.875rem', color: '#F97316' }}>for "{search}"</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {SORTS.map(s => (
              <button key={s.value} onClick={() => setParam('sort', s.value)}
                className={`btn btn-sm ${sort === s.value ? 'btn-primary' : 'btn-secondary'}`}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {Array.from({ length: 12 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        ) : recipes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#64748B'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍽️</div>
            <h3 style={{
              margin: '0 0 8px',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem'
            }}>
              No recipes found
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {search ? `No results for "${search}". Try different keywords.` : 'No recipes in this category yet. Be the first to add one!'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '40px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setParam('page', page - 1)}>
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p2 = i + 1;
              return (
                <button key={p2} onClick={() => setParam('page', p2)}
                  className={`btn btn-sm ${page === p2 ? 'btn-primary' : 'btn-secondary'}`}>
                  {p2}
                </button>
              );
            })}
            <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setParam('page', page + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
