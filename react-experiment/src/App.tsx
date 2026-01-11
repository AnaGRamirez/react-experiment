import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Profile } from './components/Profile';
import { Dashboard } from './components/Dashboard';

const AppContent = () => {
  const { user } = useAuth();

  return user ? <Dashboard /> : <Profile />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

