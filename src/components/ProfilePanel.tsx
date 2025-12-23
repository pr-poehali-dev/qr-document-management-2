import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky' | null;

interface User {
  role: UserRole;
  name: string;
  phone?: string;
}

interface ProfilePanelProps {
  user: User;
}

const ProfilePanel = ({ user }: ProfilePanelProps) => {
  const roleInfo: Record<UserRole, { name: string; color: string; permissions: string[] }> = {
    client: {
      name: 'Покупатель',
      color: 'bg-blue-500',
      permissions: ['Просмотр своих документов', 'Отправка документов на хранение', 'Доступ к QR-кодам'],
    },
    cashier: {
      name: 'Кассир',
      color: 'bg-green-500',
      permissions: ['Прием документов', 'Выдача документов', 'Просмотр анкет'],
    },
    'head-cashier': {
      name: 'Главный кассир',
      color: 'bg-purple-500',
      permissions: ['Все права кассира', 'Создание клиентов', 'Возврат товаров', 'Управление операциями'],
    },
    admin: {
      name: 'Администратор',
      color: 'bg-orange-500',
      permissions: ['Управление системой', 'Создание клиентов', 'Доступ к архиву', 'Отправка SMS', 'Управление скидками'],
    },
    creator: {
      name: 'Создатель',
      color: 'bg-red-500',
      permissions: ['Полный доступ', 'Доступ к архиву навсегда', 'Настройка системы', 'Управление пользователями'],
    },
    nikitovsky: {
      name: 'Никитовский',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      permissions: ['Максимальные права', 'Добавление ролей', 'Изменение настроек', 'Блокировка пользователей', 'Все функции системы'],
    },
  };

  const myDocuments = user.role === 'client' ? [
    { id: 'QR-2025-045', name: 'Паспорт РФ', date: '20.12.2024', status: 'На хранении' },
    { id: 'QR-2025-067', name: 'Фото 3x4', date: '18.12.2024', status: 'Готово к выдаче' },
  ] : [];

  return (
    <div className="space-y-8">
      <Card className="border-l-4" style={{ borderLeftColor: roleInfo[user.role]?.color.includes('gradient') ? '#F97316' : roleInfo[user.role]?.color.replace('bg-', '#').replace('500', '') }}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 ${roleInfo[user.role]?.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-lg mt-1">
                <Badge className={`${roleInfo[user.role]?.color} text-white`}>
                  {roleInfo[user.role]?.name}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Icon name="User" size={18} />
                <span>Информация</span>
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Роль:</span> {roleInfo[user.role]?.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Имя:</span> {user.name}
                </p>
                {user.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Телефон:</span> {user.phone}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Icon name="Shield" size={18} />
                <span>Права доступа</span>
              </h3>
              <ul className="space-y-1 text-sm">
                {roleInfo[user.role]?.permissions.map((permission, index) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-600">
                    <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.role === 'client' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon name="Package" size={24} className="text-primary" />
              <span>Мои документы</span>
            </CardTitle>
            <CardDescription>Документы на хранении</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <Icon name="QrCode" size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.id}</p>
                      <p className="text-xs text-gray-500 mt-1">Принят: {doc.date}</p>
                    </div>
                  </div>
                  <div>
                    <Badge className={doc.status === 'На хранении' ? 'bg-blue-500' : 'bg-green-500'}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {user.role !== 'client' && (
        <Card className="bg-gradient-to-br from-primary to-secondary text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Icon name="Award" size={24} />
              <span>Статистика работы</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">156</div>
                <p className="text-sm opacity-90">Операций</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24</div>
                <p className="text-sm opacity-90">Сегодня</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <p className="text-sm opacity-90">Точность</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePanel;
