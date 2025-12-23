import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MainPanel from './MainPanel';
import ItemManagement from './ItemManagement';
import ArchivePanel from './ArchivePanel';
import ProfilePanel from './ProfilePanel';

type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky' | null;

interface User {
  role: UserRole;
  name: string;
  phone?: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type ActiveTab = 'main' | 'profile' | 'management' | 'archive' | 'cashier' | 'admin';

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('main');

  const roleNames: Record<UserRole, string> = {
    client: 'Покупатель',
    cashier: 'Кассир',
    'head-cashier': 'Главный кассир',
    admin: 'Администратор',
    creator: 'Создатель',
    nikitovsky: 'Никитовский',
  };

  const canAccessManagement = ['admin', 'creator', 'nikitovsky', 'head-cashier'].includes(user.role || '');
  const canAccessArchive = ['admin', 'creator', 'nikitovsky'].includes(user.role || '');
  const canAccessCashier = ['cashier', 'head-cashier', 'admin', 'creator', 'nikitovsky'].includes(user.role || '');
  const canAccessAdmin = ['admin', 'creator', 'nikitovsky'].includes(user.role || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <header className="bg-white shadow-md border-b-4 border-primary">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="QrCode" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QR-Документы</h1>
                <p className="text-sm text-gray-600">
                  {roleNames[user.role]} • {user.name}
                </p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" className="hover-scale">
              <Icon name="LogOut" className="mr-2" size={18} />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('main')}
              className={`px-6 py-4 font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'main'
                  ? 'text-primary border-b-4 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Icon name="Home" size={20} />
              <span>Главная</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'profile'
                  ? 'text-primary border-b-4 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Icon name="User" size={20} />
              <span>Профиль</span>
            </button>

            {canAccessManagement && (
              <button
                onClick={() => setActiveTab('management')}
                className={`px-6 py-4 font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'management'
                    ? 'text-secondary border-b-4 border-secondary bg-purple-50'
                    : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
                }`}
              >
                <Icon name="Settings" size={20} />
                <span>Управление</span>
              </button>
            )}

            {canAccessArchive && (
              <button
                onClick={() => setActiveTab('archive')}
                className={`px-6 py-4 font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'archive'
                    ? 'text-accent border-b-4 border-accent bg-orange-50'
                    : 'text-gray-600 hover:text-accent hover:bg-gray-50'
                }`}
              >
                <Icon name="Archive" size={20} />
                <span>Архив</span>
              </button>
            )}

            {canAccessCashier && (
              <button
                onClick={() => setActiveTab('cashier')}
                className={`px-6 py-4 font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'cashier'
                    ? 'text-primary border-b-4 border-primary bg-blue-50'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon name="ShoppingCart" size={20} />
                <span>Касса</span>
              </button>
            )}

            {canAccessAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-6 py-4 font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'admin'
                    ? 'text-secondary border-b-4 border-secondary bg-purple-50'
                    : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
                }`}
              >
                <Icon name="Shield" size={20} />
                <span>Администратор</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {activeTab === 'main' && <MainPanel user={user} />}
          {activeTab === 'profile' && <ProfilePanel user={user} />}
          {activeTab === 'management' && canAccessManagement && <ItemManagement user={user} />}
          {activeTab === 'archive' && canAccessArchive && <ArchivePanel user={user} />}
          {activeTab === 'cashier' && canAccessCashier && (
            <div className="text-center py-20">
              <Icon name="ShoppingCart" size={64} className="mx-auto text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-2">Касса</h2>
              <p className="text-gray-600">Модуль кассы в разработке</p>
            </div>
          )}
          {activeTab === 'admin' && canAccessAdmin && (
            <div className="text-center py-20">
              <Icon name="Shield" size={64} className="mx-auto text-secondary mb-4" />
              <h2 className="text-3xl font-bold mb-2">Панель администратора</h2>
              <p className="text-gray-600">Модуль администрирования в разработке</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
