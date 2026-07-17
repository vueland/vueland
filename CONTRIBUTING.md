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

Проект использует **GitHub Flow** — одна долгоживущая ветка `master`, всё остальное короткоживущее.

- `master` — единственный стабильный ствол, всегда релизный. **Прямые пуши запрещены** (только через PR).
- Любая работа — в отдельной ветке, отходящей **от `master`**.
- Ветка вливается обратно в `master` через PR после прохождения CI и ревью (**squash merge**).
- Релиз автоматизирован через [changesets](https://github.com/changesets/changesets): бот открывает PR `chore: release packages` из ветки `changeset-release/master`; его merge публикует пакеты.

```
master ──●────────●────────●────────●─────▶  (релизный ствол)
          \        \                /
           feat/... ●    fix/... ●─╯   (короткоживущие ветки → PR → squash)
```

> Отдельной ветки `develop` **нет** — она упразднена. Не создавай её.

### Именование веток (обязательно)

Формат: `<type>/<короткое-kebab-описание>`

Допустимые `<type>` — те же, что и в commit-типах: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`, `ci`, `revert`.

```
feat/add-datepicker
fix/select-keyboard-nav
refactor/cfield-types
chore/update-deps
docs/tooltip-examples
```

Имя проверяется регуляркой `^(feat|fix|refactor|chore|docs|test|style|perf|ci|revert)/[a-z0-9][a-z0-9._-]*$` в двух местах (единый скрипт `scripts/check-branch-name.mjs`):

- **локально** — husky-хук `pre-push` не даст запушить ветку с невалидным именем;
- **в CI** — job `Branch name` блокирует merge PR.

Невалидную ветку переименуй: `git branch -m старое-имя feat/новое-описание`.

### Branch protection на `master`

Рекомендованные настройки репозитория (GitHub → Settings → Branches):

- Require a pull request before merging; запрет прямых пушей.
- Require status checks: `Lint`, `Typecheck`, `Test`, `Build packages`, `Commit lint`, `Branch name`, `E2E`.
- Require linear history; squash-only merge; запрет force-push и удаления ветки.

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

## Перед коммитом / пушем

- **commit** — `commitlint` (хук `commit-msg`) проверит сообщение, `lint-staged` (хук `pre-commit`) прогонит ESLint по коду и Prettier по JSON/YAML/Markdown/SCSS/CSS + `pnpm typecheck`.
- **push** — хук `pre-push` проверит имя ветки (`scripts/check-branch-name.mjs`).

Полезно прогнать локально перед PR:

```bash
pnpm typecheck   # нет TypeScript ошибок
pnpm test        # юнит-тесты (Vitest) проходят
pnpm test:e2e    # браузерные e2e (Playwright) проходят
```

## E2E тесты (Playwright)

Браузерные e2e живут в пакете `apps/e2e` и гоняются против playground.

```bash
pnpm test:e2e            # прогон (Playwright сам поднимет playground)
pnpm --filter @vueland/e2e test:e2e:ui   # интерактивный UI-режим
```

Первый запуск требует установки браузеров: `pnpm --filter @vueland/e2e exec playwright install`.

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

## TypeScript strictness roadmap

Базовый `strict: true` включён. Дополнительно включены (без правок кода): `noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`.

Оставшиеся флаги ужесточаются поэтапно — каждый отдельным PR с исправлением всплывающих ошибок (цифры замерены на пакете `ui`):

- [ ] **Фаза A** — `noImplicitAny: true` (сейчас в `tsconfig.base.json` стоит `noImplicitAny: false`) — ~16 ошибок.
- [ ] **Фаза B** — `noUncheckedIndexedAccess: true` — ~29 ошибок.
- [ ] **Фаза C** — `exactOptionalPropertyTypes: true` — ~45 ошибок.
- [ ] **Фаза D** — `vueCompilerOptions.strictTemplates: true` в `packages/ui/tsconfig.json` (сейчас `false`).

Флаги, влияющие на все пакеты, добавляются в `tsconfig.base.json`, а также в `packages/utils-jit/tsconfig.json` и `integrations/eslint-script-setup/tsconfig.json` — они **не** наследуют базовый конфиг.
