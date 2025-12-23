import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky' | null;

interface User {
  role: UserRole;
  name: string;
  phone?: string;
}

interface ItemManagementProps {
  user: User;
}

const ItemManagement = ({ user }: ItemManagementProps) => {
  const [newItem, setNewItem] = useState({
    category: '',
    clientName: '',
    clientSurname: '',
    clientPhone: '',
    clientEmail: '',
    itemName: '',
    receiveDate: '',
    returnDate: '',
    depositAmount: '',
    returnAmount: '',
    notes: '',
  });

  const handleCreateItem = () => {
    if (!newItem.category || !newItem.clientName || !newItem.itemName) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const qrCode = `QR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    toast({
      title: '✅ Документ создан',
      description: `QR-код: ${qrCode}`,
    });

    setNewItem({
      category: '',
      clientName: '',
      clientSurname: '',
      clientPhone: '',
      clientEmail: '',
      itemName: '',
      receiveDate: '',
      returnDate: '',
      depositAmount: '',
      returnAmount: '',
      notes: '',
    });
  };

  const handlePrintForm = (filled: boolean) => {
    toast({
      title: '🖨️ Печать',
      description: filled ? 'Печать заполненной анкеты...' : 'Печать пустой анкеты...',
    });
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Icon name="FileText" size={20} className="text-blue-500" />
              <span>Документы</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">47</div>
              <p className="text-sm text-gray-600 mt-1">из 100 мест</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '47%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Icon name="Image" size={20} className="text-purple-500" />
              <span>Фото/Карты</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500">63</div>
              <p className="text-sm text-gray-600 mt-1">из 100 мест</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '63%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Icon name="Package" size={20} className="text-orange-500" />
              <span>Другое</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500">28</div>
              <p className="text-sm text-gray-600 mt-1">без ограничений</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="Plus" size={24} className="text-primary" />
            <span>Прием документа</span>
          </CardTitle>
          <CardDescription>Заполните анкету для нового документа</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documents">📄 Документы</SelectItem>
                  <SelectItem value="photos">📷 Фото/Карты</SelectItem>
                  <SelectItem value="other">📦 Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemName">Название предмета *</Label>
              <Input
                id="itemName"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                placeholder="Например: Паспорт РФ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Имя клиента *</Label>
              <Input
                id="clientName"
                value={newItem.clientName}
                onChange={(e) => setNewItem({ ...newItem, clientName: e.target.value })}
                placeholder="Имя"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSurname">Фамилия клиента</Label>
              <Input
                id="clientSurname"
                value={newItem.clientSurname}
                onChange={(e) => setNewItem({ ...newItem, clientSurname: e.target.value })}
                placeholder="Фамилия"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Телефон *</Label>
              <Input
                id="clientPhone"
                value={newItem.clientPhone}
                onChange={(e) => setNewItem({ ...newItem, clientPhone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email (опционально)</Label>
              <Input
                id="clientEmail"
                type="email"
                value={newItem.clientEmail}
                onChange={(e) => setNewItem({ ...newItem, clientEmail: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiveDate">Дата приема</Label>
              <Input
                id="receiveDate"
                type="date"
                value={newItem.receiveDate}
                onChange={(e) => setNewItem({ ...newItem, receiveDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnDate">Планируемая дата выдачи</Label>
              <Input
                id="returnDate"
                type="date"
                value={newItem.returnDate}
                onChange={(e) => setNewItem({ ...newItem, returnDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depositAmount">Сумма при сдаче (₽)</Label>
              <Input
                id="depositAmount"
                type="number"
                value={newItem.depositAmount}
                onChange={(e) => setNewItem({ ...newItem, depositAmount: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnAmount">Сумма при получении (₽)</Label>
              <Input
                id="returnAmount"
                type="number"
                value={newItem.returnAmount}
                onChange={(e) => setNewItem({ ...newItem, returnAmount: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Примечания</Label>
              <Textarea
                id="notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                placeholder="Дополнительная информация о документе..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleCreateItem} className="bg-primary hover-scale">
              <Icon name="Save" className="mr-2" size={18} />
              Сохранить и создать QR
            </Button>
            <Button onClick={() => handlePrintForm(true)} variant="outline" className="hover-scale">
              <Icon name="Printer" className="mr-2" size={18} />
              Печать заполненной анкеты
            </Button>
            <Button onClick={() => handlePrintForm(false)} variant="outline" className="hover-scale">
              <Icon name="FileText" className="mr-2" size={18} />
              Печать пустой анкеты
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="Search" size={24} className="text-secondary" />
            <span>Быстрый поиск</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input placeholder="Введите QR-код или имя клиента..." className="flex-1" />
            <Button className="bg-secondary hover-scale">
              <Icon name="Search" size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagement;
