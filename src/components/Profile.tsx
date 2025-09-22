import { useState } from "react";
import { ArrowLeft, User, Store, Users, Edit3, Check, X, Plus, Trash2, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface FloristProfile {
  id: number;
  name: string;
  phone: string;
  position: 'director' | 'manager' | 'seller' | 'courier';
  bio?: string;
}

interface ShopInfo {
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  description?: string;
}

interface Colleague {
  id: number;
  name: string;
  phone: string;
  position: 'director' | 'manager' | 'seller' | 'courier';
  isActive: boolean;
  joinedDate: Date;
}

interface ProfileProps {
  onClose?: () => void;
  showHeader?: boolean;
}

export function Profile({ onClose, showHeader = true }: ProfileProps) {
  // Мок-данные профиля
  const [floristProfile, setFloristProfile] = useState<FloristProfile>({
    id: 1,
    name: "Анна Иванова",
    phone: "+7 (777) 123-45-67",
    position: 'director',
    bio: "Профессиональный флорист с многолетним опытом. Специализируюсь на создании свадебных композиций и эксклюзивных букетов."
  });

  const [shopInfo, setShopInfo] = useState<ShopInfo>({
    name: "Цветочная мастерская 'Лепесток'",
    address: "г. Алматы, ул. Абая 150, ТЦ 'Dostyk Plaza'",
    phone: "+7 (727) 123-45-67",
    workingHours: "Пн-Вс: 09:00 - 21:00",
    description: "Авторская цветочная мастерская с индивидуальным подходом к каждому клиенту. Создаем уникальные композиции для особых моментов."
  });

  const [colleagues, setColleagues] = useState<Colleague[]>([
    {
      id: 1,
      name: "Мария Петрова",
      phone: "+7 (777) 234-56-78",
      position: 'manager',
      isActive: true,
      joinedDate: new Date(2023, 1, 15)
    },
    {
      id: 2,
      name: "Елена Козлова",
      phone: "+7 (777) 345-67-89",
      position: 'seller',
      isActive: true,
      joinedDate: new Date(2023, 5, 20)
    },
    {
      id: 3,
      name: "Дария Сидорова",
      phone: "+7 (777) 456-78-90",
      position: 'courier',
      isActive: false,
      joinedDate: new Date(2024, 2, 10)
    }
  ]);

  const [editingSection, setEditingSection] = useState<'profile' | 'shop' | 'colleagues' | null>(null);
  const [tempProfile, setTempProfile] = useState<FloristProfile>(floristProfile);
  const [tempShop, setTempShop] = useState<ShopInfo>(shopInfo);
  const [newColleague, setNewColleague] = useState<Partial<Colleague>>({
    name: '',
    phone: '',
    position: 'courier'
  });
  const [editingColleagueId, setEditingColleagueId] = useState<number | null>(null);
  const [tempColleague, setTempColleague] = useState<Colleague | null>(null);
  const [showAddColleagueForm, setShowAddColleagueForm] = useState(false);

  const positionLabels = {
    director: 'Директор',
    manager: 'Менеджер',
    seller: 'Продавец',
    courier: 'Курьер'
  };

  const handleSaveProfile = () => {
    setFloristProfile(tempProfile);
    setEditingSection(null);
  };

  const handleSaveShop = () => {
    setShopInfo(tempShop);
    setEditingSection(null);
  };

  const handleCancelEdit = () => {
    setTempProfile(floristProfile);
    setTempShop(shopInfo);
    setEditingSection(null);
    setEditingColleagueId(null);
    setTempColleague(null);
  };

  const handleAddColleague = () => {
    if (newColleague.name && newColleague.phone && newColleague.position) {
      const colleague: Colleague = {
        id: Date.now(),
        name: newColleague.name,
        phone: newColleague.phone,
        position: newColleague.position as any,
        isActive: true,
        joinedDate: new Date()
      };
      setColleagues([...colleagues, colleague]);
      setNewColleague({ name: '', phone: '', position: 'courier' });
      setShowAddColleagueForm(false);
    }
  };

  const handleToggleColleague = (id: number) => {
    setColleagues(prev =>
      prev.map(colleague =>
        colleague.id === id
          ? { ...colleague, isActive: !colleague.isActive }
          : colleague
      )
    );
  };

  const handleRemoveColleague = (id: number) => {
    setColleagues(prev => prev.filter(colleague => colleague.id !== id));
  };

  const handleEditColleague = (colleague: Colleague) => {
    setEditingColleagueId(colleague.id);
    setTempColleague({ ...colleague });
  };

  const handleSaveColleague = () => {
    if (tempColleague && editingColleagueId) {
      setColleagues(prev =>
        prev.map(colleague =>
          colleague.id === editingColleagueId
            ? tempColleague
            : colleague
        )
      );
      setEditingColleagueId(null);
      setTempColleague(null);
    }
  };

  const handleCancelColleagueEdit = () => {
    setEditingColleagueId(null);
    setTempColleague(null);
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      {showHeader && (
        <div className="flex items-center p-4 border-b border-gray-100 lg:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 mr-3"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="text-gray-900">Профиль</h1>
        </div>
      )}
      
      {/* Mobile Title without header */}
      {!showHeader && (
        <div className="p-4 border-b border-gray-100 lg:hidden">
          <h1 className="text-gray-900">Профиль</h1>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <h1>Профиль</h1>
      </div>

      <div className={`${showHeader ? "pb-6" : "pb-20"} lg:pb-6`}>
        {/* Desktop Layout - Grid */}
        <div className="hidden lg:block p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Florist Profile Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Личные данные
                  </CardTitle>
                  {editingSection !== 'profile' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2"
                      onClick={() => setEditingSection('profile')}
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editingSection === 'profile' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Имя</label>
                          <Input
                            value={tempProfile.name}
                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                            className="h-10"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Телефон</label>
                          <Input
                            value={tempProfile.phone}
                            onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Должность</label>
                        <Select 
                          value={tempProfile.position} 
                          onValueChange={(value: any) => setTempProfile({ ...tempProfile, position: value })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="director">Директор</SelectItem>
                            <SelectItem value="manager">Менеджер</SelectItem>
                            <SelectItem value="seller">Продавец</SelectItem>
                            <SelectItem value="courier">Курьер</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">О себе</label>
                        <Textarea
                          value={tempProfile.bio || ''}
                          onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                          className="min-h-[80px] resize-none"
                          placeholder="Расскажите о себе и подходе к работе..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSaveProfile} size="sm">
                          Сохранить
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit} size="sm">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="text-gray-900 font-medium">{floristProfile.name}</div>
                        <div className="text-sm text-gray-600">{positionLabels[floristProfile.position]}</div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">{floristProfile.phone}</span>
                      </div>
                      {floristProfile.bio && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {floristProfile.bio}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shop Info Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Информация о магазине
                  </CardTitle>
                  {editingSection !== 'shop' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2"
                      onClick={() => setEditingSection('shop')}
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editingSection === 'shop' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Название</label>
                        <Input
                          value={tempShop.name}
                          onChange={(e) => setTempShop({ ...tempShop, name: e.target.value })}
                          className="h-10"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Адрес</label>
                        <Input
                          value={tempShop.address}
                          onChange={(e) => setTempShop({ ...tempShop, address: e.target.value })}
                          className="h-10"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Телефон</label>
                          <Input
                            value={tempShop.phone}
                            onChange={(e) => setTempShop({ ...tempShop, phone: e.target.value })}
                            className="h-10"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Часы работы</label>
                          <Input
                            value={tempShop.workingHours}
                            onChange={(e) => setTempShop({ ...tempShop, workingHours: e.target.value })}
                            className="h-10"
                            placeholder="например: Пн-Вс: 09:00 - 21:00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Описание</label>
                        <Textarea
                          value={tempShop.description || ''}
                          onChange={(e) => setTempShop({ ...tempShop, description: e.target.value })}
                          className="min-h-[80px] resize-none"
                          placeholder="Расскажите о вашем магазине..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSaveShop} size="sm">
                          Сохранить
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit} size="sm">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="text-gray-900 font-medium">{shopInfo.name}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{shopInfo.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="text-sm">{shopInfo.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">{shopInfo.workingHours}</span>
                        </div>
                      </div>
                      {shopInfo.description && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {shopInfo.description}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Team */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Команда ({colleagues.length})
                  </CardTitle>
                  {!showAddColleagueForm && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddColleagueForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добави��ь
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Add New Colleague Form */}
                  {showAddColleagueForm && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Добавить коллегу</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setShowAddColleagueForm(false);
                            setNewColleague({ name: '', phone: '', position: 'courier' });
                          }}
                          className="p-1 h-6 w-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <Input
                          placeholder="Имя"
                          value={newColleague.name || ''}
                          onChange={(e) => setNewColleague({ ...newColleague, name: e.target.value })}
                          className="h-10"
                        />
                        <Input
                          placeholder="Телефон"
                          value={newColleague.phone || ''}
                          onChange={(e) => setNewColleague({ ...newColleague, phone: e.target.value })}
                          className="h-10"
                        />
                        <Select 
                          value={newColleague.position || 'courier'} 
                          onValueChange={(value: any) => setNewColleague({ ...newColleague, position: value })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Должность" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="director">Директор</SelectItem>
                            <SelectItem value="manager">Менеджер</SelectItem>
                            <SelectItem value="seller">Продавец</SelectItem>
                            <SelectItem value="courier">Курьер</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={handleAddColleague}
                          disabled={!newColleague.name || !newColleague.phone}
                          size="sm"
                        >
                          Добавить
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Colleagues Table */}
                  {colleagues.length > 0 ? (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Сотрудник</TableHead>
                            <TableHead>Должность</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead className="w-24">Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {colleagues.map((colleague) => (
                            <TableRow key={colleague.id}>
                              {editingColleagueId === colleague.id && tempColleague ? (
                                <>
                                  <TableCell>
                                    <Input
                                      value={tempColleague.name}
                                      onChange={(e) => setTempColleague({ ...tempColleague, name: e.target.value })}
                                      className="h-8"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Select 
                                      value={tempColleague.position} 
                                      onValueChange={(value: any) => setTempColleague({ ...tempColleague, position: value })}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="director">Директор</SelectItem>
                                        <SelectItem value="manager">Менеджер</SelectItem>
                                        <SelectItem value="seller">Продавец</SelectItem>
                                        <SelectItem value="courier">Курьер</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <div className={`px-2 py-1 rounded text-xs inline-block ${
                                      tempColleague.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {tempColleague.isActive ? 'Активен' : 'Неактивен'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button 
                                        onClick={handleSaveColleague}
                                        size="sm"
                                        variant="ghost"
                                        className="p-1 h-8 w-8"
                                      >
                                        <Check className="w-4 h-4 text-green-600" />
                                      </Button>
                                      <Button 
                                        variant="ghost"
                                        onClick={handleCancelColleagueEdit}
                                        size="sm"
                                        className="p-1 h-8 w-8"
                                      >
                                        <X className="w-4 h-4 text-gray-500" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell>
                                    <div>
                                      <div className={`font-medium ${colleague.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {colleague.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {colleague.phone}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        С {formatJoinDate(colleague.joinedDate)}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-gray-600">
                                      {positionLabels[colleague.position]}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className={`px-2 py-1 rounded text-xs inline-block ${
                                      colleague.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {colleague.isActive ? 'Активен' : 'Неактивен'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-8 w-8"
                                        onClick={() => handleEditColleague(colleague)}
                                      >
                                        <Edit3 className="w-4 h-4 text-gray-500" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-8 w-8"
                                        onClick={() => handleToggleColleague(colleague.id)}
                                      >
                                        {colleague.isActive ? (
                                          <X className="w-4 h-4 text-gray-500" />
                                        ) : (
                                          <Check className="w-4 h-4 text-green-600" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-8 w-8"
                                        onClick={() => handleRemoveColleague(colleague.id)}
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="text-gray-900 mb-1">Нет коллег</h4>
                      <p className="text-sm text-gray-500">Добавьте первого коллегу в команду</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Original */}
        <div className="lg:hidden">
          {/* Florist Profile Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-900">Личные данные</h2>
              {editingSection !== 'profile' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1"
                  onClick={() => setEditingSection('profile')}
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </Button>
              )}
            </div>

            {editingSection === 'profile' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Имя</label>
                  <Input
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Телефон</label>
                  <Input
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Должность</label>
                  <Select 
                    value={tempProfile.position} 
                    onValueChange={(value: any) => setTempProfile({ ...tempProfile, position: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">Директор</SelectItem>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="seller">Продавец</SelectItem>
                      <SelectItem value="courier">Курьер</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">О себе</label>
                  <Textarea
                    value={tempProfile.bio || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    className="min-h-[80px] resize-none"
                    placeholder="Расскажите о себе и подходе к работе..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleSaveProfile}
                  >
                    Сохранить
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-gray-900">{floristProfile.name}</div>
                  <div className="text-sm text-gray-600">{positionLabels[floristProfile.position]}</div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{floristProfile.phone}</span>
                </div>
                {floristProfile.bio && (
                  <div className="text-sm text-gray-600 pt-2">
                    {floristProfile.bio}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shop Info Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-900">Информация о магазине</h2>
              {editingSection !== 'shop' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1"
                  onClick={() => setEditingSection('shop')}
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </Button>
              )}
            </div>

            {editingSection === 'shop' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Название</label>
                  <Input
                    value={tempShop.name}
                    onChange={(e) => setTempShop({ ...tempShop, name: e.target.value })}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Адрес</label>
                  <Input
                    value={tempShop.address}
                    onChange={(e) => setTempShop({ ...tempShop, address: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Телефон</label>
                  <Input
                    value={tempShop.phone}
                    onChange={(e) => setTempShop({ ...tempShop, phone: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Часы работы</label>
                  <Input
                    value={tempShop.workingHours}
                    onChange={(e) => setTempShop({ ...tempShop, workingHours: e.target.value })}
                    className="h-12"
                    placeholder="например: Пн-Вс: 09:00 - 21:00"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Описание</label>
                  <Textarea
                    value={tempShop.description || ''}
                    onChange={(e) => setTempShop({ ...tempShop, description: e.target.value })}
                    className="min-h-[80px] resize-none"
                    placeholder="Расскажите о вашем магазине..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleSaveShop}
                  >
                    Сохранить
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-gray-900">{shopInfo.name}</div>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{shopInfo.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{shopInfo.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{shopInfo.workingHours}</span>
                </div>
                {shopInfo.description && (
                  <div className="text-sm text-gray-600 pt-2">
                    {shopInfo.description}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Team Section */}
          <div className="p-4">
            <div className="mb-3">
              <h2 className="text-gray-900">Команда</h2>
            </div>

            {/* Add New Colleague */}
            {!showAddColleagueForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowAddColleagueForm(true)}
                className="w-full mb-4 h-12 text-gray-600 border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить коллегу
              </Button>
            ) : (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-900">Добавить коллегу</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setShowAddColleagueForm(false);
                      setNewColleague({ name: '', phone: '', position: 'courier' });
                    }}
                    className="p-1 h-6 w-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Имя"
                    value={newColleague.name || ''}
                    onChange={(e) => setNewColleague({ ...newColleague, name: e.target.value })}
                  />
                  <Input
                    placeholder="Телефон"
                    value={newColleague.phone || ''}
                    onChange={(e) => setNewColleague({ ...newColleague, phone: e.target.value })}
                  />
                  <Select 
                    value={newColleague.position || 'courier'} 
                    onValueChange={(value: any) => setNewColleague({ ...newColleague, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Должность" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">Директор</SelectItem>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="seller">Продавец</SelectItem>
                      <SelectItem value="courier">Курьер</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAddColleague}
                    disabled={!newColleague.name || !newColleague.phone}
                    className="w-full"
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            )}

            {/* Colleagues List */}
            <div className="space-y-3">
              {colleagues.map((colleague) => (
                <div 
                  key={colleague.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  {editingColleagueId === colleague.id && tempColleague ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Имя</label>
                        <Input
                          value={tempColleague.name}
                          onChange={(e) => setTempColleague({ ...tempColleague, name: e.target.value })}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Телефон</label>
                        <Input
                          value={tempColleague.phone}
                          onChange={(e) => setTempColleague({ ...tempColleague, phone: e.target.value })}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Должность</label>
                        <Select 
                          value={tempColleague.position} 
                          onValueChange={(value: any) => setTempColleague({ ...tempColleague, position: value })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="director">Директор</SelectItem>
                            <SelectItem value="manager">Менеджер</SelectItem>
                            <SelectItem value="seller">Продавец</SelectItem>
                            <SelectItem value="courier">Курьер</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveColleague}
                          size="sm"
                          className="flex-1"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Сохранить
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleCancelColleagueEdit}
                          size="sm"
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-1">
                          <span className={`${colleague.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                            {colleague.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{positionLabels[colleague.position]}</div>
                        <div className="text-sm text-gray-500">{colleague.phone}</div>
                        <div className="text-xs text-gray-400">
                          С {formatJoinDate(colleague.joinedDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => handleEditColleague(colleague)}
                        >
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => handleToggleColleague(colleague.id)}
                        >
                          {colleague.isActive ? (
                            <X className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Check className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => handleRemoveColleague(colleague.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {colleagues.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 mb-1">Нет коллег</h4>
                  <p className="text-sm text-gray-500">Добавьте первого коллегу в команду</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}