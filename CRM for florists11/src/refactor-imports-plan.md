# 📦 План обновления импортов после рефакторинга

## Изменения в импортах

### 1. Figma assets (imports → assets/figma)
**Было:**
```typescript
import svgPaths from "./imports/svg-wg56ef214f";
import component from "./imports/ЛентаТоваров.tsx";
```

**Станет:**
```typescript
import svgPaths from "./assets/figma/svg-wg56ef214f";
import component from "./assets/figma/ЛентаТоваров.tsx";
```

### 2. Хуки и утилиты из /src (остаются без изменений)
```typescript
// Эти импорты остаются как есть
import { useAppState } from './src/hooks/useAppState';
import { useApiClients } from './src/hooks/useApiClients';
import { formatCurrency } from './src/utils/currency';
import { mockData } from './src/data/mockData';
```

### 3. Компоненты (остаются без изменений)
```typescript
// Все импорты из /components/ остаются как есть
import { AppWrapper } from './components/AppWrapper';
import { EmptyState } from './components/common/EmptyState';
```

## Файлы, требующие обновления импортов

### Поиск файлов с импортами из /imports
```bash
grep -r "from.*\/imports\/" . --include="*.tsx" --include="*.ts"
grep -r "import.*imports\/" . --include="*.tsx" --include="*.ts"
```

### Автоматическое обновление
```bash
# Заменяем все импорты из ./imports/ на ./assets/figma/
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\.\/imports\//\.\/assets\/figma\//g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/"\.\/imports\//"\.\/assets\/figma\//g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/'\.\/imports\//'\.\/assets\/figma\//g"
```

## Проверка после обновления

1. **Проверить сборку:**
   ```bash
   npm run build
   ```

2. **Проверить runtime:**
   - Открыть приложение
   - Проверить все страницы
   - Убедиться, что SVG и изображения загружаются

3. **Проверить компоненты с Figma импортами:**
   - Компоненты в /imports/ которые используются в приложении

## Безопасность

- Создается резервная копия перед любыми изменениями
- Изменения применяются только к путям импортов
- Проверка корректности сборки после изменений

## Откат изменений (если потребуется)

```bash
# Вернуть импорты обратно
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/\.\/assets\/figma\//\.\/imports\//g'
```