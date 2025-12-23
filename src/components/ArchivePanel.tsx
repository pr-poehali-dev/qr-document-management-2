import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky' | null;

interface User {
  role: UserRole;
  name: string;
  phone?: string;
}

interface ArchivePanelProps {
  user: User;
}

const ArchivePanel = ({ user }: ArchivePanelProps) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const archiveItems = [
    {
      id: 'QR-2024-8456',
      name: 'Паспорт РФ',
      client: 'Иванов Иван Иванович',
      phone: '+7 (999) 111-22-33',
      category: 'documents',
      receiveDate: '15.08.2024',
      returnDate: '20.08.2024',
      operator: 'Петрова А.С.',
    },
    {
      id: 'QR-2024-7231',
      name: 'Фото на визу',
      client: 'Сидорова Мария Петровна',
      phone: '+7 (999) 444-55-66',
      category: 'photos',
      receiveDate: '10.07.2024',
      returnDate: '15.07.2024',
      operator: 'Иванов С.П.',
    },
  ];

  const handleUnlock = () => {
    if (password === '202505') {
      setIsUnlocked(true);
      toast({
        title: '✅ Доступ разрешен',
        description: 'Архив открыт',
      });
    } else {
      toast({
        title: '❌ Неверный пароль',
        description: 'Доступ запрещен',
        variant: 'destructive',
      });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border-4 border-orange-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Icon name="Lock" size={40} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Защищенный архив</CardTitle>
            <CardDescription>Введите пароль для доступа к архиву</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            <Button onClick={handleUnlock} className="w-full bg-orange-500 hover:bg-orange-600">
              <Icon name="Unlock" className="mr-2" />
              Разблокировать
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-l-4 border-orange-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Icon name="Archive" size={28} className="text-orange-500" />
                <span>Архив навсегда</span>
              </CardTitle>
              <CardDescription className="mt-2">
                Все документы хранятся вечно и доступны только создателю
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsUnlocked(false)}>
              <Icon name="Lock" className="mr-2" size={18} />
              Заблокировать
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">842</div>
              <p className="text-sm text-gray-600 mt-1">Всего записей</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">347</div>
              <p className="text-sm text-gray-600 mt-1">Документы</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">289</div>
              <p className="text-sm text-gray-600 mt-1">Фото/Карты</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">206</div>
              <p className="text-sm text-gray-600 mt-1">Другое</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="Search" size={24} className="text-primary" />
            <span>Поиск в архиве</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input placeholder="QR-код, имя клиента, телефон..." className="flex-1" />
            <Button className="bg-primary hover-scale">
              <Icon name="Search" size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Icon name="Layers" size={16} />
            <span>Все</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <Icon name="FileText" size={16} />
            <span>Документы</span>
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center space-x-2">
            <Icon name="Image" size={16} />
            <span>Фото/Карты</span>
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center space-x-2">
            <Icon name="Package" size={16} />
            <span>Другое</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {archiveItems.map((item) => (
            <Card key={item.id} className="hover-scale">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                      item.category === 'documents' ? 'bg-blue-100' :
                      item.category === 'photos' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <Icon
                        name={item.category === 'documents' ? 'FileText' : item.category === 'photos' ? 'Image' : 'Package'}
                        size={28}
                        className={
                          item.category === 'documents' ? 'text-blue-600' :
                          item.category === 'photos' ? 'text-purple-600' : 'text-orange-600'
                        }
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mt-1">{item.client}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Hash" size={12} className="mr-1" />
                          {item.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Phone" size={12} className="mr-1" />
                          {item.phone}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Icon name="User" size={12} className="mr-1" />
                          {item.operator}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 mb-2">Выдан</Badge>
                    <p className="text-xs text-gray-500">Прием: {item.receiveDate}</p>
                    <p className="text-xs text-gray-500">Выдача: {item.returnDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents">
          <p className="text-center text-gray-500 py-12">Фильтр: Только документы</p>
        </TabsContent>

        <TabsContent value="photos">
          <p className="text-center text-gray-500 py-12">Фильтр: Только фото/карты</p>
        </TabsContent>

        <TabsContent value="other">
          <p className="text-center text-gray-500 py-12">Фильтр: Только другое</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArchivePanel;
