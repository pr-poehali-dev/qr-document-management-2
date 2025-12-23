import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky';

interface LoginScreenProps {
  onLogin: (role: UserRole, name: string, phone?: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const rolePasswords: Record<UserRole, string> = {
    cashier: '25',
    'head-cashier': '202520',
    admin: '2025',
    creator: '202505',
    nikitovsky: '20252025',
    client: '',
  };

  const roleNames: Record<UserRole, string> = {
    client: 'Покупатель',
    cashier: 'Кассир',
    'head-cashier': 'Главный кассир',
    admin: 'Администратор',
    creator: 'Создатель',
    nikitovsky: 'Никитовский',
  };

  const handleLogin = () => {
    if (lockedUntil && Date.now() < lockedUntil) {
      const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
      toast({
        title: '🔒 Вход заблокирован',
        description: `Подождите ${secondsLeft} секунд`,
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRole) {
      toast({
        title: 'Ошибка',
        description: 'Выберите роль',
        variant: 'destructive',
      });
      return;
    }

    if (selectedRole === 'client') {
      if (!name || !phone) {
        toast({
          title: 'Ошибка',
          description: 'Введите имя и номер телефона',
          variant: 'destructive',
        });
        return;
      }
      onLogin(selectedRole, name, phone);
      return;
    }

    if (!name || !password) {
      toast({
        title: 'Ошибка',
        description: 'Введите имя и пароль',
        variant: 'destructive',
      });
      return;
    }

    if (password === rolePasswords[selectedRole]) {
      setAttempts(0);
      onLogin(selectedRole, name);
      toast({
        title: '✅ Вход выполнен',
        description: `Добро пожаловать, ${roleNames[selectedRole]}!`,
      });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        const lockTime = Date.now() + 90000;
        setLockedUntil(lockTime);
        setAttempts(0);
        toast({
          title: '🔒 Вход заблокирован',
          description: 'Слишком много попыток. Подождите 90 секунд',
          variant: 'destructive',
        });
        setTimeout(() => setLockedUntil(null), 90000);
      } else {
        toast({
          title: '❌ Неверный пароль',
          description: `Осталось попыток: ${3 - newAttempts}`,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Card className="w-full max-w-md bg-zinc-800 border-zinc-700 text-white animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-2xl flex items-center justify-center">
              <Icon name="QrCode" size={40} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">Система QR-документов</CardTitle>
          <CardDescription className="text-zinc-400">Выберите роль для входа в систему</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-zinc-300">Роль</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger id="role" className="bg-zinc-700 border-zinc-600 text-white">
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 border-zinc-600">
                <SelectItem value="client" className="text-white hover:bg-zinc-600">👤 Покупатель</SelectItem>
                <SelectItem value="cashier" className="text-white hover:bg-zinc-600">💼 Кассир</SelectItem>
                <SelectItem value="head-cashier" className="text-white hover:bg-zinc-600">👔 Главный кассир</SelectItem>
                <SelectItem value="admin" className="text-white hover:bg-zinc-600">⚙️ Администратор</SelectItem>
                <SelectItem value="creator" className="text-white hover:bg-zinc-600">🔧 Создатель</SelectItem>
                <SelectItem value="nikitovsky" className="text-white hover:bg-zinc-600">👑 Никитовский</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">
              {selectedRole === 'client' ? 'Ваше имя' : 'Имя пользователя'}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={selectedRole === 'client' ? 'Введите имя' : 'Введите имя'}
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              disabled={!!lockedUntil && Date.now() < lockedUntil}
            />
          </div>

          {selectedRole === 'client' ? (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">Номер телефона</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Введите номер"
                className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
                disabled={!!lockedUntil && Date.now() < lockedUntil}
              />
            </div>
          ) : (
            selectedRole && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
                  disabled={!!lockedUntil && Date.now() < lockedUntil}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            )
          )}

          <Button
            onClick={handleLogin}
            disabled={!!lockedUntil && Date.now() < lockedUntil}
            className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-medium py-6 text-lg"
          >
            {lockedUntil && Date.now() < lockedUntil ? (
              <>
                <Icon name="Lock" className="mr-2" />
                Вход заблокирован
              </>
            ) : (
              <>
                <Icon name="LogIn" className="mr-2" />
                Войти
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
