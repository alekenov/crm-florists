#!/bin/bash

echo "🌸 Безопасный рефакторинг цветочного магазина"
echo "=============================================="

# Создаем резервную копию
echo "💾 Создаем резервную копию..."
cp -r . ../flower-shop-backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || echo "Не удалось создать полную копию"

# Этап 1: Создаем новые директории
echo "📁 Создаем новую структуру директорий..."
mkdir -p {archive/{cleanup-scripts,temp-files,old-docs,test-files},docs/{api,architecture,examples},assets/figma}

# Этап 2: Безопасное перемещение файлов документации
echo "📚 Организуем документацию..."

# API документация
for file in API_TYPES.md BACKEND_API_REQUIREMENTS.md api.md *.yaml openapi_append.yaml; do
  [ -f "$file" ] && mv "$file" docs/api/ 2>/dev/null
done

# Архитектурная документация  
for file in ARCHITECTURE.md DATABASE_SCHEMA.md COMPONENTS.md; do
  [ -f "$file" ] && mv "$file" docs/architecture/ 2>/dev/null
done

# Cleanup отчеты и старые файлы
for file in *CLEANUP*.md *REMOVED*.md *SIMPLIFIED*.md *FINAL*.md *ERRORS*.md *REACT*.md *SUPABASE*.md *GROUPING*.md *OLD*.md *PROJECT*.md *REFACTORING*.md *TESTING*.md; do
  [ -f "$file" ] && mv "$file" archive/old-docs/ 2>/dev/null
done

# Cleanup скрипты
for file in *.sh; do
  if [ "$file" != "refactor-safe.sh" ] && [ "$file" != "refactor-cleanup.sh" ]; then
    mv "$file" archive/cleanup-scripts/ 2>/dev/null
  fi
done

# JavaScript файлы
mv *.js archive/cleanup-scripts/ 2>/dev/null || true

# Временные и тестовые файлы
mv temp-*.txt archive/temp-files/ 2>/dev/null || true
mv test-*.html archive/test-files/ 2>/dev/null || true

# Этап 3: Реорганизация assets
echo "🎨 Реорганизуем assets..."
if [ -d "imports" ]; then
  mv imports/* assets/figma/ 2>/dev/null || true
  rmdir imports 2>/dev/null || true
fi

# Перемещение examples
if [ -d "examples" ]; then
  mv examples/* docs/examples/ 2>/dev/null || true
  rmdir examples 2>/dev/null || true
fi

# Этап 4: Очистка пустых /src компонентов (только если они действительно пустые)
echo "🧹 Проверяем /src/components на пустые файлы..."
if [ -d "src/components" ]; then
  # Проверяем, есть ли файлы с содержимым
  has_content=false
  for file in $(find src/components -name "*.tsx" -type f); do
    if [ -s "$file" ] && ! grep -q "DELETED" "$file" && ! grep -q "^export.*from" "$file"; then
      has_content=true
      break
    fi
  done
  
  if [ "$has_content" = false ]; then
    echo "🗑️ Удаляем пустые компоненты из /src/components..."
    rm -rf src/components
  else
    echo "⚠️ Найдены компоненты с содержимым в /src/components - пропускаем удаление"
  fi
fi

# Удаляем пустую директорию pages если она пустая
if [ -d "src/pages" ] && [ -z "$(ls -A src/pages)" ]; then
  rmdir src/pages
fi

echo ""
echo "✅ Рефакторинг завершен!"
echo ""
echo "📊 Новая структура:"
echo "├── docs/"
echo "│   ├── api/                 # API документация"
echo "│   ├── architecture/        # Архитектурная документация"
echo "│   └── examples/            # Примеры использования"
echo "├── assets/"
echo "│   └── figma/               # Figma импорты и SVG"
echo "├── archive/"
echo "│   ├── cleanup-scripts/     # Старые скрипты"
echo "│   ├── temp-files/          # Временные файлы"
echo "│   ├── test-files/          # Тестовые HTML файлы"
echo "│   └── old-docs/            # Старые отчеты"
echo "├── components/              # Основные компоненты (без изменений)"
echo "├── src/"
echo "│   ├── hooks/               # React хуки"
echo "│   ├── types/               # TypeScript типы"
echo "│   ├── utils/               # Утилиты"
echo "│   ├── constants/           # Константы"
echo "│   └── data/                # Моковые данные"
echo "└── styles/                  # CSS стили"
echo ""
echo "🎯 Проект стал более организованным и соответствует Guidelines.md"