import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { getRegisteredUsers, saveUser } from '@/utils/storage';
import type { UserRole, RegisteredUser, User } from '@/types/users';

interface UserManagementProps {
  user: User;
}

const UserManagement = ({ user }: UserManagementProps) => {
  const [newUser, setNewUser] = useState({
    name: '',
    role: '' as UserRole | '',
    phone: '',
    email: '',
  });

  const users = getRegisteredUsers();

  const roleNames: Record<UserRole, string> = {
    client: 'Покупатель',
    cashier: 'Кассир',
    'head-cashier': 'Главный кассир',
    admin: 'Администратор',
    creator: 'Создатель',
    nikitovsky: 'Никитовский',
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.role) {
      toast({
        title: 'Ошибка',
        description: 'Заполните имя и роль',
        variant: 'destructive',
      });
      return;
    }

    const existingUser = users.find(u => u.name.toLowerCase() === newUser.name.toLowerCase());
    if (existingUser) {
      toast({
        title: 'Ошибка',
        description: 'Пользователь с таким именем уже существует',
        variant: 'destructive',
      });
      return;
    }

    const registeredUser: RegisteredUser = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      role: newUser.role as UserRole,
      phone: newUser.phone || undefined,
      email: newUser.email || undefined,
      createdAt: new Date().toISOString(),
      createdBy: user.name,
    };

    saveUser(registeredUser);

    toast({
      title: '✅ Пользователь создан',
      description: `${newUser.name} зарегистрирован как ${roleNames[newUser.role as UserRole]}`,
    });

    setNewUser({ name: '', role: '', phone: '', email: '' });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'nikitovsky': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'creator': return 'bg-red-500';
      case 'admin': return 'bg-orange-500';
      case 'head-cashier': return 'bg-purple-500';
      case 'cashier': return 'bg-green-500';
      case 'client': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="UserPlus" size={24} className="text-primary" />
            <span>Регистрация нового пользователя</span>
          </CardTitle>
          <CardDescription>Создайте новый аккаунт в системе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="userName">Имя пользователя *</Label>
              <Input
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Введите имя"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Роль *</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}>
                <SelectTrigger id="userRole">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">👤 Покупатель</SelectItem>
                  <SelectItem value="cashier">💼 Кассир</SelectItem>
                  <SelectItem value="head-cashier">👔 Главный кассир</SelectItem>
                  <SelectItem value="admin">⚙️ Администратор</SelectItem>
                  <SelectItem value="creator">🔧 Создатель</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPhone">Телефон</Label>
              <Input
                id="userPhone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <Button onClick={handleCreateUser} className="mt-6 bg-primary hover-scale">
            <Icon name="UserPlus" className="mr-2" size={18} />
            Создать пользователя
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="Users" size={24} className="text-secondary" />
            <span>Все пользователи ({users.length})</span>
          </CardTitle>
          <CardDescription>Список зарегистрированных пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${getRoleBadgeColor(u.role)} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-600">
                      {u.phone && `${u.phone} • `}
                      {u.email && `${u.email} • `}
                      Создан: {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getRoleBadgeColor(u.role)}>
                  {roleNames[u.role]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
