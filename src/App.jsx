import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import MealPlannerPage from './pages/MealPlannerPage';
import IngredientSearchResultsPage from './pages/IngredientSearchResultsPage';
import ShoppingListPage from './pages/ShoppingListPage';


function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

function AuthLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Auth pages â€” no Navbar/Footer */}
              <Route path="/login"    element={<AuthLayout><LoginPage /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

              {/* Main app layout */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/recipes/:id" element={<Layout><RecipeDetailPage /></Layout>} />
              <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />

              {/* Protected routes */}
              <Route path="/recipes/new" element={
                <Layout><ProtectedRoute><AddRecipePage /></ProtectedRoute></Layout>
              } />
              <Route path="/recipes/:id/edit" element={
                <Layout><ProtectedRoute><EditRecipePage /></ProtectedRoute></Layout>
              } />
              <Route path="/favorites" element={
                <Layout><ProtectedRoute><FavoritesPage /></ProtectedRoute></Layout>
              } />
              <Route path="/search/ingredients" element={<Layout><IngredientSearchResultsPage /></Layout>} />
              <Route path="/meal-planner" element={
                <Layout><ProtectedRoute><MealPlannerPage /></ProtectedRoute></Layout>
              } />

              <Route path="/shopping-list" element={<Layout><ProtectedRoute><ShoppingListPage /></ProtectedRoute></Layout>} />

              {/* 404 */}
              <Route path="*" element={
                <Layout>
                  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '5rem' }}>ðŸ½ï¸</div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>Page Not Found</h1>
                    <p style={{ color: '#94A3B8', margin: 0 }}>The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                </Layout>
              } />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}




