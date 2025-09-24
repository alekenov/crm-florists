import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { ArrowLeft, CheckCircle, AlertTriangle, Package, Save, Clipboard, Info } from "lucide-react";
import { inventoryAuditService } from "../api/services";
import { toast } from "sonner@2.0.3";

interface InventoryItem {
  id: number;
  name: string;
  category: 'flowers' | 'greenery' | 'accessories';
  unit: string;
  systemQuantity: number; // учетный остаток
  actualQuantity?: number; // фактический остаток
  image: string;
}

interface InventoryAuditProps {
  onClose: () => void;
  onSaveAudit?: (auditResults: InventoryAuditItem[]) => void;
}

interface InventoryAuditItem extends InventoryItem {
  actualQuantity: number;
  difference: number;
  status: 'match' | 'surplus' | 'deficit' | 'pending';
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Розы красные",
    category: 'flowers',
    unit: "шт",
    systemQuantity: 85,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Тюльпаны белые",
    category: 'flowers',
    unit: "шт",
    systemQuantity: 12,
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Лилии розовые",
    category: 'flowers',
    unit: "шт",
    systemQuantity: 24,
    image: "https://images.unsplash.com/photo-1565011523534-747a8601f1a4?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Эвкалипт",
    category: 'greenery',
    unit: "ветка",
    systemQuantity: 45,
    image: "https://images.unsplash.com/photo-1586744687037-b4f9c5d1fcd8?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    name: "Хризантемы желтые",
    category: 'flowers',
    unit: "шт",
    systemQuantity: 8,
    image: "https://images.unsplash.com/photo-1572731973537-34afe46c4bc6?w=100&h=100&fit=crop"
  },
  {
    id: 6,
    name: "Лента атласная",
    category: 'accessories',
    unit: "метр",
    systemQuantity: 150,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop"
  },
  {
    id: 7,
    name: "Гипсофила",
    category: 'flowers',
    unit: "ветка",
    systemQuantity: 3,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop"
  }
];

function getCategoryName(category: string): string {
  switch (category) {
    case 'flowers': return 'Цветы';
    case 'greenery': return 'Зелень';
    case 'accessories': return 'Аксессуары';
    default: return category;
  }
}

function getStatusBadge(status: 'match' | 'surplus' | 'deficit' | 'pending') {
  switch (status) {
    case 'match':
      return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Совпадает</Badge>;
    case 'surplus':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><AlertTriangle className="w-3 h-3 mr-1" />Излишек</Badge>;
    case 'deficit':
      return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Недостача</Badge>;
    case 'pending':
      return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Не проверено</Badge>;
  }
}

function AuditItemComponent({ 
  item, 
  onActualQuantityChange 
}: { 
  item: InventoryAuditItem;
  onActualQuantityChange: (id: number, quantity: number) => void;
}) {
  const handleInputChange = (value: string) => {
    const quantity = parseInt(value) || 0;
    onActualQuantityChange(item.id, quantity);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-start space-x-4">
        {/* Image */}
        <div 
          className="w-12 h-12 bg-cover bg-center rounded-full flex-shrink-0"
          style={{ backgroundImage: `url('${item.image}')` }}
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-sm px-2 py-1 bg-white border border-gray-300 text-gray-600 rounded-full">
                {getCategoryName(item.category)}
              </span>
            </div>
            {getStatusBadge(item.status)}
          </div>
          
          {/* Quantities comparison */}
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Учетный остаток</label>
              <div className="text-sm font-medium text-gray-900">
                {item.systemQuantity} {item.unit}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Фактический остаток</label>
              <Input
                type="number"
                value={item.actualQuantity || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="0"
                className="h-8 text-sm"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Разница</label>
              <div className={`text-sm font-medium ${
                item.difference > 0 ? 'text-blue-600' : 
                item.difference < 0 ? 'text-red-600' : 
                'text-green-600'
              }`}>
                {item.difference > 0 ? '+' : ''}{item.difference !== 0 ? item.difference : '0'} {item.unit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InventoryAudit({ onClose, onSaveAudit }: InventoryAuditProps) {
  const [auditId, setAuditId] = useState<number | null>(null);
  const [auditItems, setAuditItems] = useState<InventoryAuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load or create audit on mount
  useEffect(() => {
    const loadOrCreateAudit = async () => {
      try {
        // First try to get current audit
        let audit = await inventoryAuditService.getCurrentAudit();

        // If no current audit, start a new one
        if (!audit) {
          audit = await inventoryAuditService.startAudit();
          toast.success("Новая инвентаризация начата");
        }

        if (audit && audit.items) {
          setAuditId(audit.id);
          // Transform API data to component format
          const transformedItems = audit.items.map((item: any) => ({
            id: item.inventory_id,
            name: item.name,
            category: item.category,
            unit: item.unit,
            systemQuantity: item.system_quantity,
            actualQuantity: item.actual_quantity || 0,
            difference: item.difference || 0,
            status: getItemStatus(item.system_quantity, item.actual_quantity),
            image: getItemImage(item.name, item.category)
          }));
          setAuditItems(transformedItems);
        }
      } catch (error) {
        console.error("Error loading audit:", error);
        toast.error("Ошибка загрузки инвентаризации");
      } finally {
        setLoading(false);
      }
    };

    loadOrCreateAudit();
  }, []);

  const getItemStatus = (systemQty: number, actualQty: number | null): 'match' | 'surplus' | 'deficit' | 'pending' => {
    if (!actualQty || actualQty === 0) return 'pending';
    const diff = actualQty - systemQty;
    if (diff === 0) return 'match';
    if (diff > 0) return 'surplus';
    return 'deficit';
  };

  const getItemImage = (name: string, category: string): string => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('роз')) return "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop";
    if (lowercaseName.includes('тюльпан')) return "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=100&h=100&fit=crop";
    if (lowercaseName.includes('лил')) return "https://images.unsplash.com/photo-1565011523534-747a8601f1a4?w=100&h=100&fit=crop";
    if (lowercaseName.includes('эвкалипт')) return "https://images.unsplash.com/photo-1586744687037-b4f9c5d1fcd8?w=100&h=100&fit=crop";
    if (lowercaseName.includes('хризантем')) return "https://images.unsplash.com/photo-1572731973537-34afe46c4bc6?w=100&h=100&fit=crop";
    if (lowercaseName.includes('лент')) return "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop";
    if (lowercaseName.includes('гипсофил')) return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop";
    return "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop";
  };

  const handleActualQuantityChange = (id: number, actualQuantity: number) => {
    setAuditItems(prev => prev.map(item => {
      if (item.id === id) {
        const difference = actualQuantity - item.systemQuantity;
        let status: 'match' | 'surplus' | 'deficit' | 'pending' = 'pending';
        
        if (actualQuantity === 0) {
          status = 'pending';
        } else if (difference === 0) {
          status = 'match';
        } else if (difference > 0) {
          status = 'surplus';
        } else {
          status = 'deficit';
        }
        
        return {
          ...item,
          actualQuantity,
          difference,
          status
        };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    if (!auditId) return;

    try {
      // Prepare items for API
      const itemsToSave = auditItems
        .filter(item => item.status !== 'pending')
        .map(item => ({
          inventory_id: item.id,
          actual_quantity: item.actualQuantity
        }));

      if (itemsToSave.length === 0) {
        toast.warning("Нет проверенных позиций для сохранения");
        return;
      }

      // Save items
      await inventoryAuditService.saveAuditItems(auditId, itemsToSave);

      // Complete audit if all items checked
      const allChecked = auditItems.every(item => item.status !== 'pending');
      if (allChecked) {
        await inventoryAuditService.completeAudit(auditId);
        toast.success("Инвентаризация завершена и корректировки применены");
      } else {
        toast.success("Результаты сохранены");
      }

      if (onSaveAudit) {
        onSaveAudit(auditItems.filter(item => item.status !== 'pending'));
      }

      onClose();
    } catch (error) {
      console.error("Error saving audit:", error);
      toast.error("Ошибка сохранения результатов");
    }
  };

  const stats = {
    total: auditItems.length,
    checked: auditItems.filter(item => item.status !== 'pending').length,
    matches: auditItems.filter(item => item.status === 'match').length,
    discrepancies: auditItems.filter(item => item.status === 'surplus' || item.status === 'deficit').length
  };

  const progress = Math.round((stats.checked / stats.total) * 100);

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-medium text-gray-900">Инвентаризация</h1>
        </div>
        <Button 
          onClick={handleSave}
          disabled={stats.checked === 0}
          className="bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Инвентаризация склада</h1>
              <p className="text-gray-600 mt-1">Проверка фактических остатков товаров</p>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            disabled={stats.checked === 0}
            className="px-6"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить результаты
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Всего позиций</div>
                    <div className="text-xl font-semibold text-gray-900">{stats.total}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clipboard className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Проверено</div>
                    <div className="text-xl font-semibold text-gray-900">{stats.checked}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Совпадений</div>
                    <div className="text-xl font-semibold text-green-600">{stats.matches}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Расхождений</div>
                    <div className="text-xl font-semibold text-red-600">{stats.discrepancies}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Прогресс инвентаризации</h3>
                <div className="text-sm text-gray-600">{progress}% завершено</div>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Инструкция по проведению инвентаризации</h4>
                  <p className="text-blue-800 text-sm">
                    Пересчитайте фактическое количество каждого товара на складе и введите данные в столбец "Фактический остаток". 
                    Система автоматически рассчитает разности и выделит расхождения для последующей корректировки.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Table */}
          <Card>
            <CardHeader>
              <CardTitle>Инвентаризационная ведомость</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Фото</TableHead>
                      <TableHead>Наименование товара</TableHead>
                      <TableHead className="w-32">Категория</TableHead>
                      <TableHead className="w-32">Учетный остаток</TableHead>
                      <TableHead className="w-32">Фактический остаток</TableHead>
                      <TableHead className="w-32">Разница</TableHead>
                      <TableHead className="w-32">Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div 
                            className="w-12 h-12 bg-cover bg-center rounded-lg"
                            style={{ backgroundImage: `url('${item.image}')` }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded text-xs inline-block ${
                            item.category === 'flowers' ? 'bg-pink-100 text-pink-700' :
                            item.category === 'greenery' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {getCategoryName(item.category)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.systemQuantity} {item.unit}</div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.actualQuantity || ''}
                            onChange={(e) => handleActualQuantityChange(item.id, parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-24"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${
                            item.difference > 0 ? 'text-blue-600' : 
                            item.difference < 0 ? 'text-red-600' : 
                            'text-green-600'
                          }`}>
                            {item.difference > 0 ? '+' : ''}{item.difference !== 0 ? item.difference : '0'} {item.unit}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Final Summary */}
          {stats.checked === stats.total && stats.checked > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Инвентаризация завершена!</h4>
                    <p className="text-green-800 text-sm">
                      {stats.matches} товаров сходятся с учетными данными, {stats.discrepancies} позиций требуют корректировки остатков.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Stats */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Проверено:</span>
              <span className="font-medium text-gray-900">{stats.checked}/{stats.total}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">{stats.matches} совпадений</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">{stats.discrepancies} расхождений</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Прогресс</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border-b border-gray-100">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs font-bold">i</span>
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Как проводить инвентаризацию:</p>
              <p className="text-sm text-blue-700 mt-1">
                Пересчитайте фактическое количество каждого товара и введите данные в поле "Фактический остаток"
              </p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="pb-20">
          {auditItems.map((item) => (
            <AuditItemComponent
              key={item.id}
              item={item}
              onActualQuantityChange={handleActualQuantityChange}
            />
          ))}
        </div>

        {/* Summary */}
        {stats.checked === stats.total && stats.checked > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Инвентаризация завершена!</span>
              </div>
              <p className="text-sm text-gray-600">
                {stats.matches} товаров сходятся, {stats.discrepancies} требуют корректировки
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}