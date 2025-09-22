#!/bin/bash

echo "🌸 Рефакторинг проекта цветочного магазина"

# Создаем директории для организации файлов
mkdir -p archive/{cleanup-scripts,temp-files,old-docs,test-files}
mkdir -p docs/{api,architecture,guidelines}

echo "📁 Перемещаем cleanup скрипты..."
mv *.sh archive/cleanup-scripts/ 2>/dev/null || true

echo "📄 Перемещаем временные файлы..."
mv temp-*.txt archive/temp-files/ 2>/dev/null || true
mv test-*.html archive/test-files/ 2>/dev/null || true

echo "📚 Организуем документацию..."
# API документация
mv *API*.md docs/api/ 2>/dev/null || true
mv api.md docs/api/ 2>/dev/null || true
mv *.yaml docs/api/ 2>/dev/null || true

# Архитектурная документация
mv ARCHITECTURE.md docs/architecture/ 2>/dev/null || true
mv DATABASE_SCHEMA.md docs/architecture/ 2>/dev/null || true
mv COMPONENTS.md docs/architecture/ 2>/dev/null || true

# Старые отчеты о cleanup
mv *CLEANUP*.md archive/old-docs/ 2>/dev/null || true
mv *REMOVED*.md archive/old-docs/ 2>/dev/null || true
mv *SIMPLIFIED*.md archive/old-docs/ 2>/dev/null || true
mv *FINAL*.md archive/old-docs/ 2>/dev/null || true
mv *ERRORS*.md archive/old-docs/ 2>/dev/null || true
mv *REACT*.md archive/old-docs/ 2>/dev/null || true
mv *SUPABASE*.md archive/old-docs/ 2>/dev/null || true
mv *GROUPING*.md archive/old-docs/ 2>/dev/null || true
mv *OLD*.md archive/old-docs/ 2>/dev/null || true
mv *PROJECT*.md archive/old-docs/ 2>/dev/null || true
mv *REFACTORING*.md archive/old-docs/ 2>/dev/null || true
mv *TESTING*.md archive/old-docs/ 2>/dev/null || true

# JavaScript файлы
mv *.js archive/cleanup-scripts/ 2>/dev/null || true

# Прочие файлы
mv routes-map.md docs/ 2>/dev/null || true
mv add_schema.yaml docs/api/ 2>/dev/null || true
mv openapi_append.yaml docs/api/ 2>/dev/null || true

echo "✅ Очистка корневой директории завершена!"
echo ""
echo "📊 Итог:"
echo "- Cleanup скрипты: archive/cleanup-scripts/"
echo "- Временные файлы: archive/temp-files/"
echo "- Тестовые файлы: archive/test-files/"
echo "- Старая документация: archive/old-docs/"
echo "- API документация: docs/api/"
echo "- Архитектурная документация: docs/architecture/"