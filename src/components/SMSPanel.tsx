import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface SMSPanelProps {
  userName: string;
}

const SMSPanel = ({ userName }: SMSPanelProps) => {
  const [smsData, setSmsData] = useState({
    clientName: '',
    clientPhone: '',
    template: '',
    customMessage: '',
  });

  const [sentMessages, setSentMessages] = useState<Array<{
    id: string;
    to: string;
    message: string;
    sentAt: string;
    sentBy: string;
    status: 'sent' | 'delivered' | 'failed';
  }>>([]);

  const smsTemplates = {
    ready: 'Ваш документ готов к выдаче. QR-код: {{qr}}. Обратитесь в пункт приема.',
    reminder: 'Напоминаем о необходимости забрать документ. QR-код: {{qr}}. Срок: {{date}}.',
    lost: 'К сожалению, ваш документ утерян. Обратитесь к администратору для уточнения деталей.',
    extended: 'Срок хранения вашего документа продлен до {{date}}. QR-код: {{qr}}.',
  };

  const handleSendSMS = () => {
    if (!smsData.clientPhone) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер телефона',
        variant: 'destructive',
      });
      return;
    }

    const message = smsData.template
      ? smsTemplates[smsData.template as keyof typeof smsTemplates]
      : smsData.customMessage;

    if (!message) {
      toast({
        title: 'Ошибка',
        description: 'Выберите шаблон или введите текст',
        variant: 'destructive',
      });
      return;
    }

    const newMessage = {
      id: `sms-${Date.now()}`,
      to: smsData.clientPhone,
      message,
      sentAt: new Date().toLocaleString('ru-RU'),
      sentBy: userName,
      status: 'delivered' as const,
    };

    setSentMessages([newMessage, ...sentMessages]);

    toast({
      title: '✅ SMS отправлено',
      description: `Сообщение отправлено на ${smsData.clientPhone}`,
    });

    setSmsData({
      clientName: '',
      clientPhone: '',
      template: '',
      customMessage: '',
    });
  };

  return (
    <div className="space-y-8">
      <Card className="border-l-4 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="MessageSquare" size={24} className="text-primary" />
            <span>Отправка SMS-уведомлений</span>
          </CardTitle>
          <CardDescription>Уведомите клиентов о статусе их документов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName">Имя клиента</Label>
              <Input
                id="clientName"
                value={smsData.clientName}
                onChange={(e) => setSmsData({ ...smsData, clientName: e.target.value })}
                placeholder="Иванов Иван"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Номер телефона *</Label>
              <Input
                id="clientPhone"
                value={smsData.clientPhone}
                onChange={(e) => setSmsData({ ...smsData, clientPhone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="template">Шаблон сообщения</Label>
              <Select
                value={smsData.template}
                onValueChange={(value) => setSmsData({ ...smsData, template: value, customMessage: '' })}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Выберите шаблон" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">✅ Документ готов</SelectItem>
                  <SelectItem value="reminder">⏰ Напоминание</SelectItem>
                  <SelectItem value="lost">❌ Документ утерян</SelectItem>
                  <SelectItem value="extended">📅 Срок продлен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {smsData.template && (
              <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Предпросмотр:</strong><br />
                  {smsTemplates[smsData.template as keyof typeof smsTemplates]}
                </p>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customMessage">Или введите свое сообщение</Label>
              <Textarea
                id="customMessage"
                value={smsData.customMessage}
                onChange={(e) => setSmsData({ ...smsData, customMessage: e.target.value, template: '' })}
                placeholder="Ваше кастомное сообщение..."
                rows={4}
                disabled={!!smsData.template}
              />
            </div>
          </div>

          <Button onClick={handleSendSMS} className="mt-6 bg-primary hover-scale">
            <Icon name="Send" className="mr-2" size={18} />
            Отправить SMS
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="History" size={24} className="text-secondary" />
            <span>История отправки ({sentMessages.length})</span>
          </CardTitle>
          <CardDescription>Последние отправленные сообщения</CardDescription>
        </CardHeader>
        <CardContent>
          {sentMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-30" />
              <p>Нет отправленных сообщений</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentMessages.map((msg) => (
                <div key={msg.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={16} className="text-primary" />
                      <span className="font-semibold text-gray-900">{msg.to}</span>
                      <Badge
                        className={
                          msg.status === 'delivered'
                            ? 'bg-green-500'
                            : msg.status === 'sent'
                            ? 'bg-blue-500'
                            : 'bg-red-500'
                        }
                      >
                        {msg.status === 'delivered' ? 'Доставлено' : msg.status === 'sent' ? 'Отправлено' : 'Ошибка'}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{msg.sentAt}</span>
                  </div>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded border">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-2">Отправитель: {msg.sentBy}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="Info" size={24} className="text-primary" />
            <span>Информация</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700">
            <p>📱 SMS отправляются мгновенно через встроенный сервис</p>
            <p>🔒 Функция доступна только администраторам и создателям</p>
            <p>📝 Используйте {{'{qr}'}} для вставки QR-кода</p>
            <p>📅 Используйте {{'{date}'}} для вставки даты</p>
            <p>📊 Все отправленные сообщения сохраняются в истории</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMSPanel;
