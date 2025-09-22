import { useState } from "react";
import { Edit3 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Customer {
  notes?: string;
}

interface CustomerNotesProps {
  customer: Customer;
  onUpdateNotes: (notes: string) => void;
}

export function CustomerNotes({ customer, onUpdateNotes }: CustomerNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(customer.notes || '');

  const handleSave = () => {
    onUpdateNotes(notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(customer.notes || '');
    setIsEditing(false);
  };

  return (
    <>
      {/* Mobile Notes */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900">Заметки</h3>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Добавьте заметку о клиенте..."
              className="min-h-[80px] resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSave}
                className="bg-gray-800 hover:bg-gray-900"
              >
                Сохранить
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancel}
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-gray-600">
            {customer.notes || (
              <span className="text-gray-400 italic">Нажмите для добавления заметки...</span>
            )}
          </div>
        )}
      </div>

      {/* Desktop Notes Card */}
      <Card className="hidden lg:block">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Заметки</CardTitle>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Добавьте заметку о клиенте..."
                className="min-h-[100px] resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  className="flex-1"
                >
                  Сохранить
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 min-h-[60px] flex items-center">
              {customer.notes || (
                <span className="text-gray-400 italic">Нажмите для добавления заметки...</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}