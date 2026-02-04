import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './auth';
import { AppLayout } from './layout';
import { HomePage } from './pages/Home';
import { PageContainer } from './pages/PageContainer';
import NotFound from './pages/NotFound';
import { MigrationChecklistProvider } from './context/MigrationChecklistContext';
import './styles/global.css';

const App = () => (
  <AuthProvider>
    <ProtectedRoute>
      <BrowserRouter>
        <MigrationChecklistProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/page/:pageId" element={<PageContainer />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MigrationChecklistProvider>
      </BrowserRouter>
    </ProtectedRoute>
  </AuthProvider>
);

export default App;
