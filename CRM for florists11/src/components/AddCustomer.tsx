import { useState } from "react";
import { ArrowLeft, Phone, User, UserPlus, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

// Temporary inline components to avoid import issues
function PageHeader({ title, subtitle, onBack, actions }: { 
  title: string; 
  subtitle?: string; 
  onBack?: () => void; 
  actions?: React.ReactNode; 
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 mr-3">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
        )}
        <div>
          <h1 className="text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex gap-1">{actions}</div>}
    </div>
  );
}

interface AddCustomerProps {
  onClose: () => void;
  onCreateCustomer: (customerData: {
    name: string;
    phone: string;
  }) => void;
}

export function AddCustomer({ onClose, onCreateCustomer }: AddCustomerProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +7 (XXX) XXX-XX-XX
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+7 (${digits.slice(1)})`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  const isFormValid = () => {
    return formData.phone.trim(); // Only phone is required
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      const customerData = {
        name: formData.name.trim() || undefined, // Only include name if provided
        phone: formData.phone.trim()
      };
      
      onCreateCustomer(customerData);
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <PageHeader 
          title="Новый клиент" 
          onBack={onClose}
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Новый клиент</h1>
            <p className="text-gray-600 mt-1">Добавление клиента в базу данных</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Информация о клиентах</h4>
                    <p className="text-blue-800 text-sm">
                      Мы собираем только имя и номер телефона клиента. Email и другие персональные данные не требуются. 
                      Имя может быть указано опционально - если клиент не назвал имя, он будет сохранен только с номером телефона.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Данные клиента
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Имя клиента
                        <span className="text-gray-400 text-sm">(опционально)</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Введите имя клиента"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full"
                        maxLength={100}
                      />
                      <p className="text-xs text-gray-500">
                        Если клиент не назвал имя, оставьте поле пустым
                      </p>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        Номер телефона
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="tel"
                        placeholder="+7 (777) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Номер телефона будет отформатирован автоматически
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Отменить
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!isFormValid() || isSubmitting}
                      className="px-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Создать клиента
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-900">
              <User className="w-4 h-4 text-gray-500" />
              Имя клиента
            </label>
            <Input
              type="text"
              placeholder="Введите имя"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-input-background border-0 rounded-lg"
              maxLength={100}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-900">
              <Phone className="w-4 h-4 text-gray-500" />
              Номер телефона
            </label>
            <Input
              type="tel"
              placeholder="+7 (777) 123-45-67"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full bg-input-background border-0 rounded-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
            <div className="max-w-md mx-auto flex gap-3">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Отменить
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : 'Создать клиента'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}