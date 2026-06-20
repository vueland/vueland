# CForm

`CForm` — компонент-обёртка для форм. Координирует валидацию всех дочерних полей ([`CTextField`](/ru/components/CTextField), [`CInput`](/ru/components/CInput) и любых других компонентов на основе `CInput`), блокирует нативную отправку браузера и поддерживает async-валидаторы.

<script setup>
import BasicFormExample from '../../examples/CForm/BasicFormExample.vue'
import AsyncFormExample from '../../examples/CForm/AsyncFormExample.vue'
import ProfileFormExample from '../../examples/CForm/ProfileFormExample.vue'
import AirlineFormExample from '../../examples/CForm/AirlineFormExample.vue'
</script>

## Основной пример

Форма входа с валидацией email и пароля по событию blur.

<BasicFormExample />

::: details Показать код
```vue
<template>
  <CForm ref="formRef">
    <template #default="{ validate, reset }">
      <CTextField
        v-model="form.email"
        label="Email"
        type="email"
        :rules="emailRules"
        validate-on="blur"
      >
        <template #prepend><CIcon name="fas:envelope" :size="16" source="fa" /></template>
      </CTextField>

      <CTextField
        v-model="form.password"
        :type="showPwd ? 'text' : 'password'"
        label="Пароль"
        :rules="passwordRules"
        validate-on="blur"
      >
        <template #prepend><CIcon name="fas:lock" :size="16" source="fa" /></template>
        <template #append>
          <CIcon
            :name="showPwd ? 'fas:eye-slash' : 'fas:eye'"
            :size="16"
            source="fa"
            style="cursor:pointer"
            @click="showPwd = !showPwd"
          />
        </template>
      </CTextField>

      <CBtn @click="() => handleSubmit(validate)">Войти</CBtn>
      <CBtn variant="text" @click="handleReset">Сбросить</CBtn>
    </template>
  </CForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const showPwd = ref(false)
const form = ref({ email: '', password: '' })

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email обязателен' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Некорректный email' }),
]
const passwordRules = [
  (v: string) => ({ valid: !!v, message: 'Пароль обязателен' }),
  (v: string) => ({ valid: v.length >= 6, message: 'Минимум 6 символов' }),
]

async function handleSubmit(validate: () => Promise<boolean>) {
  if (await validate()) console.log('submit', form.value)
}

function handleReset() {
  form.value = { email: '', password: '' }
}
</script>
```
:::

---

## Форма профиля

Редактор профиля с двухколоночной раскладкой, readonly-полем и необязательными контактными данными.

<ProfileFormExample />

::: details Показать код
```vue
<template>
  <CForm ref="formRef">
    <template #default="{ validate, reset }">
      <div class="form-grid">
        <CTextField v-model="form.firstName" label="Имя" :rules="requiredRule" validate-on="blur" preset="input.indigo" />
        <CTextField v-model="form.lastName" label="Фамилия" :rules="requiredRule" validate-on="blur" preset="input.indigo" />

        <CTextField v-model="form.email" label="Email" type="email" :rules="emailRules" validate-on="blur" preset="input.indigo">
          <template #prepend><CIcon name="fas:envelope" :size="14" source="fa" /></template>
        </CTextField>

        <CTextField v-model="form.phone" label="Телефон" type="tel" :rules="phoneRules" validate-on="blur" preset="input.indigo">
          <template #prepend><CIcon name="fas:phone" :size="14" source="fa" /></template>
        </CTextField>

        <!-- readonly поле — логин изменить нельзя -->
        <CTextField v-model="form.username" label="Логин" readonly preset="input.indigo">
          <template #prepend><CIcon name="fas:at" :size="14" source="fa" /></template>
          <template #details>
            <span style="opacity:.6; font-size:12px">Логин нельзя изменить</span>
          </template>
        </CTextField>

        <div>
          <CBtn class="bg-indigo" style="color:#fff" @click="() => handleSave(validate)">Сохранить</CBtn>
          <CBtn variant="text" @click="handleReset">Отмена</CBtn>
        </div>
      </div>
    </template>
  </CForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const form = ref({ firstName: 'Alex', lastName: 'Johnson', email: 'alex@example.com', phone: '', username: 'alexjohnson' })
const original = { ...form.value }

const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Обязательное поле' })]
const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Обязательное поле' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Некорректный email' }),
]
const phoneRules = [
  (v: string) => ({ valid: !v || /^\+?[\d\s\-()]{7,}$/.test(v), message: 'Некорректный номер' }),
]

async function handleSave(validate: () => Promise<boolean>) {
  if (await validate()) console.log('saved', form.value)
}

function handleReset() {
  form.value = { ...original }
}
</script>
```
:::

---

## Многошаговая форма

Форма бронирования авиабилета с валидацией на каждом шаге, async-отправкой и экраном успеха.

<AirlineFormExample />

::: details Показать код
```vue
<template>
  <CForm ref="formRef">
    <template #default="{ validate, reset }">

      <!-- Шаг 1: Детали рейса -->
      <div v-if="currentStep === 0">
        <CTextField v-model="flight.from" label="Откуда" :rules="requiredRule" validate-on="blur" preset="input.blue" />
        <CTextField v-model="flight.to" label="Куда" :rules="requiredRule" validate-on="blur" preset="input.blue" />
        <CTextField v-model="flight.departure" label="Дата вылета" placeholder="ДД.ММ.ГГГГ" :rules="departureDateRule" validate-on="blur" preset="input.blue" />
        <CTextField v-model="flight.passengers" label="Пассажиры" type="number" :rules="passengersRule" validate-on="blur" preset="input.blue" />
      </div>

      <!-- Шаг 2: Данные пассажира -->
      <div v-if="currentStep === 1">
        <CTextField v-model="passenger.firstName" label="Имя" :rules="requiredRule" validate-on="blur" preset="input.teal" />
        <CTextField v-model="passenger.lastName" label="Фамилия" :rules="requiredRule" validate-on="blur" preset="input.teal" />
        <CTextField v-model="passenger.passport" label="Номер паспорта" :rules="passportRule" validate-on="blur" preset="input.teal" />
        <CTextField v-model="passenger.email" label="Email" type="email" :rules="emailRules" validate-on="blur" preset="input.teal" />
      </div>

      <!-- Шаг 3: Оплата -->
      <div v-if="currentStep === 2">
        <CTextField v-model="payment.card" label="Номер карты" :rules="cardRule" validate-on="blur" preset="input.deepPurple" />
        <CTextField v-model="payment.expiry" label="Срок (ММ/ГГ)" :rules="expiryRule" validate-on="blur" preset="input.deepPurple" />
        <CTextField v-model="payment.cvv" label="CVV" type="password" :rules="cvvRule" validate-on="blur" preset="input.deepPurple" />
      </div>

      <CBtn v-if="currentStep > 0" variant="text" @click="currentStep--">Назад</CBtn>
      <CBtn @click="() => handleNext(validate)">
        {{ currentStep === 2 ? 'Оплатить и подтвердить' : 'Далее' }}
      </CBtn>

    </template>
  </CForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentStep = ref(0)
const flight = ref({ from: '', to: '', departure: '', passengers: '1' })
const passenger = ref({ firstName: '', lastName: '', passport: '', email: '' })
const payment = ref({ card: '', expiry: '', cvv: '' })

const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Обязательное поле' })]
const passengersRule = [
  (v: string) => ({ valid: Number(v) >= 1 && Number(v) <= 9, message: '1–9 пассажиров' }),
]
const passportRule = [
  (v: string) => ({ valid: /^[A-Z0-9]{6,9}$/i.test(v), message: 'Некорректный номер паспорта' }),
]
const emailRules = [
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Некорректный email' }),
]
const cardRule = [
  (v: string) => ({ valid: v.replace(/\s/g, '').length === 16, message: '16-значный номер карты' }),
]
const expiryRule = [(v: string) => ({ valid: /^\d{2}\/\d{2}$/.test(v), message: 'Формат ММ/ГГ' })]
const cvvRule = [(v: string) => ({ valid: /^\d{3,4}$/.test(v), message: '3–4 цифры' })]

async function handleNext(validate: () => Promise<boolean>) {
  if (await validate()) currentStep.value++
}
</script>
```
:::

---

## Async-валидация

Правила могут возвращать `Promise`. `CForm.validate()` запускает все поля параллельно через `Promise.all`.

<AsyncFormExample />

::: details Показать код
```vue
<template>
  <CForm>
    <template #default="{ validate, reset }">
      <CTextField
        v-model="form.username"
        label="Логин"
        :rules="usernameRules"
        validate-on="blur"
      >
        <template #details="{ errorMessage, hasError, validating }">
          <span v-if="validating" style="color: var(--c-app-primary-color)">Проверяем…</span>
          <span v-else-if="hasError" style="color: var(--c-app-error-color)">{{ errorMessage }}</span>
          <span v-else style="opacity:.6">Только буквы и цифры</span>
        </template>
      </CTextField>

      <CTextField v-model="form.email" label="Email" type="email" :rules="emailRules" validate-on="blur" />

      <CBtn @click="() => handleSubmit(validate)">Зарегистрироваться</CBtn>
    </template>
  </CForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ username: '', email: '' })
const taken = ['admin', 'root', 'vueland']

const usernameRules = [
  (v: string) => ({ valid: /^[a-zA-Z0-9_]{3,}$/.test(v), message: 'Мин. 3 символа, буквы/цифры/_' }),
  async (v: string) => {
    await new Promise(r => setTimeout(r, 600))
    return { valid: !taken.includes(v.toLowerCase()), message: `Логин "${v}" уже занят` }
  },
]
const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Обязательное поле' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Некорректный email' }),
]

async function handleSubmit(validate: () => Promise<boolean>) {
  if (await validate()) console.log('submit', form.value)
}
</script>
```
:::

---

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | `aria-label` для элемента `<form>`. При наличии браузер автоматически добавляет `role="form"` |

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ validate, reset }` | Содержимое формы с функциями validate и reset |

#### Пропсы слота `default`

| Prop | Type | Description |
|------|------|-------------|
| `validate` | `() => Promise<boolean>` | Запускает валидацию всех зарегистрированных полей. Возвращает `true`, если все поля валидны |
| `reset` | `() => void` | Сбрасывает состояние валидации всех зарегистрированных полей |

### События

| Событие | Аргументы | Описание |
|---------|-----------|----------|
| `submit` | `Event` | Эмитится при отправке формы. Нативный submit блокируется автоматически |

### Expose

| Метод | Сигнатура | Описание |
|-------|-----------|----------|
| `validate` | `() => Promise<boolean>` | Запустить валидацию всех полей |
| `reset` | `() => void` | Сбросить состояние валидации всех полей |

```vue
<template>
  <CForm ref="formRef">
    <template #default><!-- поля --></template>
  </CForm>
  <CBtn @click="formRef?.validate()">Валидировать извне</CBtn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const formRef = ref()
</script>
```

---

## Как это работает

1. Дочерние компоненты (`CTextField`, `CInput`) регистрируют свою функцию `validate` в ближайшем родительском `CForm` через `provide/inject` при монтировании.
2. При вызове `CForm.validate()` все зарегистрированные функции запускаются параллельно через `Promise.all`.
3. При размонтировании дочернего компонента его функция автоматически удаляется.

```
CForm
 ├─ CTextField  → регистрирует validate при монтировании
 ├─ CTextField  → регистрирует validate при монтировании
 └─ CInput      → регистрирует validate при монтировании

form.validate()
  → Promise.all([field1.validate(), field2.validate(), field3.validate()])
  → true / false
```

---

## ARIA и доступность

| Атрибут | Значение | Описание |
|---------|----------|----------|
| `novalidate` | присутствует | Отключает нативную браузерную валидацию |
| `aria-label` | значение пропа `label` | Идентифицирует форму для скринридеров |
| `role="form"` | авто | Назначается браузером при наличии `aria-label` |

:::tip
Передавайте осмысленный `label`, если на странице несколько форм — это позволит пользователям скринридеров различать их между собой.
:::
