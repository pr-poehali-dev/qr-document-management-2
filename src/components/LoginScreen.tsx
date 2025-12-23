import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { findUserByName, getNikirovskyBlockTime, setNikirovskyBlock, clearNikirovskyBlock } from '@/utils/storage';
import NumericKeyboard from '@/components/NumericKeyboard';
import type { UserRole } from '@/types/users';

interface LoginScreenProps {
  onLogin: (role: UserRole, name: string, phone?: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [step, setStep] = useState<'select' | 'nikitovsky' | 'standard'>('select');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [nikitovskyBlocked, setNikitovskyBlocked] = useState<number | null>(null);
  const [unblockPassword, setUnblockPassword] = useState('');
  const [showUnblockInput, setShowUnblockInput] = useState(false);

  useEffect(() => {
    const blockTime = getNikirovskyBlockTime();
    setNikitovskyBlocked(blockTime);
  }, []);

  const rolePasswords: Record<UserRole, string> = {
    cashier: '25',
    'head-cashier': '202520',
    admin: '2025',
    creator: '202505',
    nikitovsky: '20252025',
    client: '',
  };

  const handleSelectRole = (type: 'nikitovsky' | 'standard') => {
    setStep(type);
    setPassword('');
  };

  const handleKeyPress = (key: string) => {
    setPassword(prev => prev + key);
  };

  const handleBackspace = () => {
    setPassword(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPassword('');
  };

  const handleNikitovskyLogin = () => {
    if (nikitovskyBlocked && Date.now() < nikitovskyBlocked) {
      const hoursLeft = Math.ceil((nikitovskyBlocked - Date.now()) / (1000 * 60 * 60));
      toast({
        title: '🔒 Доступ заблокирован',
        description: `Вход в Никитовский заблокирован на ${hoursLeft} часа`,
        variant: 'destructive',
      });
      return;
    }

    if (!password) {
      toast({
        title: 'Ошибка',
        description: 'Введите пароль',
        variant: 'destructive',
      });
      return;
    }

    if (password === rolePasswords.nikitovsky) {
      onLogin('nikitovsky', 'Никитовский');
      toast({
        title: '✅ Вход выполнен',
        description: 'Добро пожаловать, Никитовский!',
      });
    } else {
      toast({
        title: '❌ Неверный пароль',
        description: 'Доступ запрещен',
        variant: 'destructive',
      });
    }
  };

  const handleStandardLogin = () => {
    if (lockedUntil && Date.now() < lockedUntil) {
      const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
      toast({
        title: '🔒 Вход заблокирован',
        description: `Подождите ${secondsLeft} секунд`,
        variant: 'destructive',
      });
      return;
    }

    if (!name) {
      toast({
        title: 'Ошибка',
        description: 'Введите имя',
        variant: 'destructive',
      });
      return;
    }

    const user = findUserByName(name);

    if (!user) {
      toast({
        title: '❌ Пользователь не найден',
        description: 'Данное имя не зарегистрировано в системе',
        variant: 'destructive',
      });
      return;
    }

    if (user.role === 'client') {
      if (!phone) {
        toast({
          title: 'Ошибка',
          description: 'Введите номер телефона',
          variant: 'destructive',
        });
        return;
      }
      onLogin(user.role, user.name, phone);
      toast({
        title: '✅ Вход выполнен',
        description: `Добро пожаловать, ${user.name}!`,
      });
      return;
    }

    if (!password) {
      toast({
        title: 'Ошибка',
        description: 'Введите пароль',
        variant: 'destructive',
      });
      return;
    }

    if (password === rolePasswords[user.role]) {
      setAttempts(0);
      onLogin(user.role, user.name);
      toast({
        title: '✅ Вход выполнен',
        description: `Добро пожаловать, ${user.name}!`,
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

  const handleBlockNikitovsky = () => {
    setNikirovskyBlock();
    const blockTime = getNikirovskyBlockTime();
    setNikitovskyBlocked(blockTime);
    toast({
      title: '🔒 Блокировка активирована',
      description: 'Вход в Никитовский заблокирован на 2 часа',
      variant: 'destructive',
    });
  };

  const handleUnblock = () => {
    if (clearNikirovskyBlock(unblockPassword)) {
      setNikitovskyBlocked(null);
      setUnblockPassword('');
      setShowUnblockInput(false);
      toast({
        title: '✅ Блокировка снята',
        description: 'Доступ восстановлен',
      });
    } else {
      toast({
        title: '❌ Неверный пароль',
        description: 'Пароль разблокировки неверен',
        variant: 'destructive',
      });
    }
  };

  if (step === 'select') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
        <Card className="w-full max-w-2xl bg-zinc-800 border-zinc-700 text-white animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-2xl flex items-center justify-center">
                <Icon name="QrCode" size={40} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Система QR-документов</CardTitle>
            <CardDescription className="text-zinc-400">Выберите тип входа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleSelectRole('nikitovsky')}
                className="h-32 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white"
              >
                <Icon name="Crown" size={40} className="mb-2" />
                <span className="text-xl font-bold">Никитовский</span>
                <span className="text-sm opacity-80">Главный администратор</span>
              </Button>

              <Button
                onClick={() => handleSelectRole('standard')}
                className="h-32 flex flex-col items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white"
              >
                <Icon name="Users" size={40} className="mb-2" />
                <span className="text-xl font-bold">Стандартный вход</span>
                <span className="text-sm opacity-80">Сотрудники и клиенты</span>
              </Button>
            </div>

            <Button
              onClick={handleBlockNikitovsky}
              variant="outline"
              className="w-full bg-red-900/20 border-red-700 text-red-400 hover:bg-red-900/40"
            >
              <Icon name="ShieldOff" className="mr-2" />
              Заблокировать вход в Никитовский на 2 часа
            </Button>

            {nikitovskyBlocked && Date.now() < nikitovskyBlocked && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <p className="text-red-400 text-sm font-medium mb-2">
                  🔒 Вход в Никитовский заблокирован
                </p>
                <p className="text-red-300 text-xs mb-3">
                  Осталось: {Math.ceil((nikitovskyBlocked - Date.now()) / (1000 * 60))} минут
                </p>
                {!showUnblockInput ? (
                  <Button
                    onClick={() => setShowUnblockInput(true)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    Снять блокировку (пароль: 2025)
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={unblockPassword}
                      onChange={(e) => setUnblockPassword(e.target.value)}
                      placeholder="Введите пароль"
                      className="bg-zinc-700 border-zinc-600 text-white text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleUnblock()}
                    />
                    <Button onClick={handleUnblock} size="sm" className="bg-red-700 hover:bg-red-600">
                      OK
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'nikitovsky') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-700 text-white animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <Button
              onClick={() => { setStep('select'); setPassword(''); }}
              variant="ghost"
              className="absolute top-4 left-4 text-zinc-400 hover:text-white"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center">
                <Icon name="Crown" size={40} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Вход Никитовского</CardTitle>
            <CardDescription className="text-zinc-400">Используйте экранную клавиатуру</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-300 text-center block">Пароль</Label>
              <div className="bg-zinc-700 border-2 border-zinc-600 rounded-lg p-4 text-center">
                <div className="text-4xl font-bold tracking-widest text-white min-h-[50px] flex items-center justify-center">
                  {password ? '•'.repeat(password.length) : '- - - - - - - -'}
                </div>
              </div>
            </div>

            <NumericKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              onClear={handleClear}
            />

            <Button
              onClick={handleNikitovskyLogin}
              disabled={!!(nikitovskyBlocked && Date.now() < nikitovskyBlocked)}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-medium py-6 text-lg"
            >
              <Icon name="LogIn" className="mr-2" />
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      <Card className="w-full max-w-md bg-zinc-800 border-zinc-700 text-white animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <Button
            onClick={() => setStep('select')}
            variant="ghost"
            className="absolute top-4 left-4 text-zinc-400 hover:text-white"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-2xl flex items-center justify-center">
              <Icon name="User" size={40} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">Стандартный вход</CardTitle>
          <CardDescription className="text-zinc-400">Войдите с зарегистрированным именем</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Имя пользователя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              disabled={!!lockedUntil && Date.now() < lockedUntil}
            />
          </div>

          {name && findUserByName(name)?.role === 'client' && (
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
          )}

          {name && findUserByName(name) && findUserByName(name)?.role !== 'client' && (
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
                onKeyDown={(e) => e.key === 'Enter' && handleStandardLogin()}
              />
            </div>
          )}

          <Button
            onClick={handleStandardLogin}
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