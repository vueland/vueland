# Contributing to Vueland

## Требования

- Node.js >= 20.19.0
- pnpm >= 10

## Установка

```bash
pnpm install
```

## Разработка

```bash
# Playground
pnpm dev:play

# Docs
pnpm dev:docs
```

## Стратегия веток

Проект использует **GitHub Flow**:

- `master` — стабильная ветка, всегда рабочая. Релизы выходят отсюда.
- Все изменения делаются в отдельных ветках, бранчующихся от `master`.
- После ревью и прохождения CI ветка вливается в `master` через PR.

Именование веток:

```
feat/add-datepicker
fix/select-keyboard-nav
refactor/cfield-types
chore/update-deps
docs/tooltip-examples
```

## Коммиты

Проект использует [Conventional Commits](https://www.conventionalcommits.org/).  
Формат: `<type>(<scope>): <description>`

```
feat(CSelect): add multiple selection support
fix(CField): fix label not showing when focused
refactor(CIcon): migrate to defineComponent without type param
chore: update vue to 3.5.27
docs: add tooltip usage examples
```

Допустимые типы: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`, `ci`, `revert`.

Коммит-сообщение проверяется автоматически через `commitlint` при `git commit`.

## Перед коммитом

`lint-staged` автоматически прогонит ESLint по изменённым файлам. Убедись что:

```bash
pnpm typecheck   # нет TypeScript ошибок
pnpm test        # тесты проходят
```

## Создание нового компонента

1. Создай директорию `packages/ui/src/components/CMyComponent/`
2. Добавь `CMyComponent.vue` — компонент
3. Добавь `index.ts` — реэкспорт
4. Добавь `CMyComponent.scss` — стили (если нужны)
5. Добавь `__tests__/CMyComponent.spec.ts` — тесты
6. Реэкспортируй из `packages/ui/src/components/index.ts`

## Changeset (для публичных изменений API)

Если изменение влияет на публичное API пакета — нужен changeset:

```bash
pnpm changeset
```

Выбери пакет, тип изменения (`patch` / `minor` / `major`) и опиши что изменилось.  
Changeset-файл коммитится вместе с изменениями.
