import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky' | null;

interface User {
  role: UserRole;
  name: string;
  phone?: string;
}

interface MainPanelProps {
  user: User;
}

const MainPanel = ({ user }: MainPanelProps) => {
  const stats = [
    { title: 'Документы', value: '47', icon: 'FileText', color: 'bg-blue-500', max: 100 },
    { title: 'Фото/Карты', value: '63', icon: 'Image', color: 'bg-purple-500', max: 100 },
    { title: 'Другое', value: '28', icon: 'Package', color: 'bg-orange-500', max: 0 },
    { title: 'В архиве', value: '842', icon: 'Archive', color: 'bg-green-500', max: 0 },
  ];

  const recentItems = [
    { id: 'QR-2025-001', name: 'Паспорт РФ', client: 'Иванов И.И.', date: '23.12.2024', status: 'active' },
    { id: 'QR-2025-002', name: 'Фото на документы', client: 'Петрова А.С.', date: '23.12.2024', status: 'active' },
    { id: 'QR-2025-003', name: 'Водительские права', client: 'Сидоров П.К.', date: '22.12.2024', status: 'ready' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-scale border-l-4" style={{ borderLeftColor: stat.color.replace('bg-', '#').replace('500', '') }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon name={stat.icon as any} size={20} className="text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.max > 0 && (
                <p className="text-xs text-gray-500 mt-1">из {stat.max} мест</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon name="Clock" size={24} className="text-primary" />
              <span>Последние операции</span>
            </CardTitle>
            <CardDescription>Недавно добавленные документы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Icon name="QrCode" size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.client} • {item.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.status === 'active' ? 'На хранении' : 'Готов к выдаче'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-secondary text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Icon name="Sparkles" size={24} />
              <span>Быстрые действия</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-lg transition-all flex items-center space-x-3">
              <Icon name="Plus" size={20} />
              <span className="font-medium">Принять документ</span>
            </button>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-lg transition-all flex items-center space-x-3">
              <Icon name="Search" size={20} />
              <span className="font-medium">Найти документ</span>
            </button>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-lg transition-all flex items-center space-x-3">
              <Icon name="QrCode" size={20} />
              <span className="font-medium">Сканировать QR</span>
            </button>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-lg transition-all flex items-center space-x-3">
              <Icon name="Printer" size={20} />
              <span className="font-medium">Печать анкеты</span>
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="Info" size={24} className="text-primary" />
            <span>О системе</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100</div>
              <p className="text-gray-600">Мест для документов</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">100</div>
              <p className="text-gray-600">Мест для фото/карт</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">∞</div>
              <p className="text-gray-600">Вечное хранение</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPanel;
