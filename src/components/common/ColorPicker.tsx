import React from 'react';

interface ColorOption {
  id: string;
  name: string;
  color: string;
}

interface ColorPickerProps {
  colors: ColorOption[];
  selectedColors: string[];
  onChange: (colors: string[]) => void;
  multiple?: boolean;
}

export function ColorPicker({ colors, selectedColors, onChange, multiple = false }: ColorPickerProps) {
  const handleColorToggle = (colorId: string) => {
    if (multiple) {
      if (selectedColors.includes(colorId)) {
        onChange(selectedColors.filter(id => id !== colorId));
      } else {
        onChange([...selectedColors, colorId]);
      }
    } else {
      onChange([colorId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color.id}
          type="button"
          onClick={() => handleColorToggle(color.id)}
          className={`w-8 h-8 rounded-full border-2 transition-all ${
            selectedColors.includes(color.id)
              ? 'border-gray-800 scale-110'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{
            background: color.id === 'mix' ? color.color : color.color,
            ...(color.id === 'white' && { borderColor: '#d1d5db' })
          }}
          title={color.name}
        />
      ))}
    </div>
  );
}