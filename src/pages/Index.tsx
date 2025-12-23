import { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';

type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky' | null;

interface User {
  role: UserRole;
  name: string;
  phone?: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole, name: string, phone?: string) => {
    setUser({ role, name, phone });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;