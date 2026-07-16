# CForm

`CForm` is a wrapper component for forms. It coordinates validation across all child fields ([`CTextField`](/en/components/CTextField), [`CInput`](/en/components/CInput), and any other `CInput`-based components), prevents native browser submission, and supports async validators.

<script setup>
import BasicFormExample from '../../examples/CForm/BasicFormExample.vue'
import AsyncFormExample from '../../examples/CForm/AsyncFormExample.vue'
import ProfileFormExample from '../../examples/CForm/ProfileFormExample.vue'
import AirlineFormExample from '../../examples/CForm/AirlineFormExample.vue'
</script>

## Basic example

A login form with email and password validation triggered on blur.

<BasicFormExample />

::: details Show code

```vue
<template>
  <c-form ref="formRef">
    <template #default="{ validate, reset }">
      <c-text-field
        v-model="form.email"
        label="Email"
        type="email"
        :rules="emailRules"
        validate-on="blur"
      >
        <template #prepend><c-icon name="fas:envelope" :size="16" source="fa" /></template>
      </c-text-field>

      <c-text-field
        v-model="form.password"
        :type="showPwd ? 'text' : 'password'"
        label="Password"
        :rules="passwordRules"
        validate-on="blur"
      >
        <template #prepend><c-icon name="fas:lock" :size="16" source="fa" /></template>
        <template #append>
          <c-icon
            :name="showPwd ? 'fas:eye-slash' : 'fas:eye'"
            :size="16"
            source="fa"
            style="cursor:pointer"
            @click="showPwd = !showPwd"
          />
        </template>
      </c-text-field>

      <c-btn @click="() => handleSubmit(validate)">Sign in</c-btn>
      <c-btn variant="text" @click="handleReset">Reset</c-btn>
    </template>
  </c-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const showPwd = ref(false)
const form = ref({ email: '', password: '' })

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Email is required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]
const passwordRules = [
  (v: string) => ({ valid: !!v, message: 'Password is required' }),
  (v: string) => ({ valid: v.length >= 6, message: 'Minimum 6 characters' }),
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

## Profile form

A multi-field profile editor with a two-column layout, a readonly field, and an optional phone/website.

<ProfileFormExample />

::: details Show code

```vue
<template>
  <c-form ref="formRef">
    <template #default="{ validate, reset }">
      <c-row class="gap-y-4">
        <c-col cols="12" sm="6">
          <c-text-field
            v-model="form.firstName"
            label="First name"
            :rules="requiredRule"
            validate-on="blur"
            preset="input.indigo"
          />
        </c-col>
        <c-col cols="12" sm="6">
          <c-text-field
            v-model="form.lastName"
            label="Last name"
            :rules="requiredRule"
            validate-on="blur"
            preset="input.indigo"
          />
        </c-col>

        <c-col cols="12" sm="6">
          <c-text-field
            v-model="form.email"
            label="Email"
            type="email"
            :rules="emailRules"
            validate-on="blur"
            preset="input.indigo"
          >
            <template #prepend><c-icon name="fas:envelope" :size="14" source="fa" /></template>
          </c-text-field>
        </c-col>

        <c-col cols="12" sm="6">
          <c-text-field
            v-model="form.phone"
            label="Phone"
            type="tel"
            :rules="phoneRules"
            validate-on="blur"
            preset="input.indigo"
          >
            <template #prepend><c-icon name="fas:phone" :size="14" source="fa" /></template>
          </c-text-field>
        </c-col>

        <c-col cols="12">
          <!-- readonly field — username cannot be changed -->
          <c-text-field v-model="form.username" label="Username" readonly preset="input.indigo">
            <template #prepend><c-icon name="fas:at" :size="14" source="fa" /></template>
            <template #details>
              <span style="opacity:.6; font-size:12px">Username cannot be changed</span>
            </template>
          </c-text-field>
        </c-col>

        <c-col cols="12">
          <div class="d-flex gap-2">
            <c-btn class="bg-indigo" style="color:#fff" @click="() => handleSave(validate)"
              >Save</c-btn
            >
            <c-btn variant="text" @click="handleReset">Cancel</c-btn>
          </div>
        </c-col>
      </c-row>
    </template>
  </c-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const form = ref({
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@example.com',
  phone: '',
  username: 'alexjohnson',
})
const original = { ...form.value }

const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Required' })]
const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]
const phoneRules = [
  (v: string) => ({ valid: !v || /^\+?[\d\s\-()]{7,}$/.test(v), message: 'Invalid phone' }),
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

## Multi-step form

A multi-step airline booking form with per-step validation, async submission, and a success screen.

<AirlineFormExample />

::: details Show code

```vue
<template>
  <c-form ref="formRef">
    <template #default="{ validate, reset }">
      <!-- Step 1: Flight details -->
      <div v-if="currentStep === 0">
        <c-text-field
          v-model="flight.from"
          label="From"
          :rules="requiredRule"
          validate-on="blur"
          preset="input.blue"
        />
        <c-text-field
          v-model="flight.to"
          label="To"
          :rules="requiredRule"
          validate-on="blur"
          preset="input.blue"
        />
        <c-text-field
          v-model="flight.departure"
          label="Departure date"
          placeholder="DD.MM.YYYY"
          :rules="departureDateRule"
          validate-on="blur"
          preset="input.blue"
        />
        <c-text-field
          v-model="flight.passengers"
          label="Passengers"
          type="number"
          :rules="passengersRule"
          validate-on="blur"
          preset="input.blue"
        />
      </div>

      <!-- Step 2: Passenger info -->
      <div v-if="currentStep === 1">
        <c-text-field
          v-model="passenger.firstName"
          label="First name"
          :rules="requiredRule"
          validate-on="blur"
          preset="input.teal"
        />
        <c-text-field
          v-model="passenger.lastName"
          label="Last name"
          :rules="requiredRule"
          validate-on="blur"
          preset="input.teal"
        />
        <c-text-field
          v-model="passenger.passport"
          label="Passport"
          :rules="passportRule"
          validate-on="blur"
          preset="input.teal"
        />
        <c-text-field
          v-model="passenger.email"
          label="Email"
          type="email"
          :rules="emailRules"
          validate-on="blur"
          preset="input.teal"
        />
      </div>

      <!-- Step 3: Payment -->
      <div v-if="currentStep === 2">
        <c-text-field
          v-model="payment.card"
          label="Card number"
          :rules="cardRule"
          validate-on="blur"
          preset="input.deepPurple"
        />
        <c-text-field
          v-model="payment.expiry"
          label="Expiry (MM/YY)"
          :rules="expiryRule"
          validate-on="blur"
          preset="input.deepPurple"
        />
        <c-text-field
          v-model="payment.cvv"
          label="CVV"
          type="password"
          :rules="cvvRule"
          validate-on="blur"
          preset="input.deepPurple"
        />
      </div>

      <c-btn v-if="currentStep > 0" variant="text" @click="currentStep--">Back</c-btn>
      <c-btn @click="() => handleNext(validate)">
        {{ currentStep === 2 ? 'Pay & Confirm' : 'Continue' }}
      </c-btn>
    </template>
  </c-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentStep = ref(0)
const flight = ref({ from: '', to: '', departure: '', passengers: '1' })
const passenger = ref({ firstName: '', lastName: '', passport: '', email: '' })
const payment = ref({ card: '', expiry: '', cvv: '' })

const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Required' })]
const passengersRule = [
  (v: string) => ({ valid: Number(v) >= 1 && Number(v) <= 9, message: '1–9 passengers' }),
]
const passportRule = [
  (v: string) => ({ valid: /^[A-Z0-9]{6,9}$/i.test(v), message: 'Invalid passport number' }),
]
const emailRules = [
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]
const cardRule = [
  (v: string) => ({ valid: v.replace(/\s/g, '').length === 16, message: '16-digit card number' }),
]
const expiryRule = [(v: string) => ({ valid: /^\d{2}\/\d{2}$/.test(v), message: 'MM/YY format' })]
const cvvRule = [(v: string) => ({ valid: /^\d{3,4}$/.test(v), message: '3–4 digits' })]

async function handleNext(validate: () => Promise<boolean>) {
  if (await validate()) currentStep.value++
}
</script>
```

:::

---

## Async validation

Rules can return a `Promise`. `CForm.validate()` runs all fields in parallel via `Promise.all`.

<AsyncFormExample />

::: details Show code

```vue
<template>
  <c-form>
    <template #default="{ validate, reset }">
      <c-text-field
        v-model="form.username"
        label="Username"
        :rules="usernameRules"
        validate-on="blur"
      >
        <template #details="{ errorMessage, hasError, validating }">
          <span v-if="validating" style="color: var(--c-sys-color-primary)">Checking…</span>
          <span v-else-if="hasError" style="color: var(--c-sys-color-error)">{{
            errorMessage
          }}</span>
          <span v-else style="opacity:.6">Letters and numbers only</span>
        </template>
      </c-text-field>

      <c-text-field
        v-model="form.email"
        label="Email"
        type="email"
        :rules="emailRules"
        validate-on="blur"
      />

      <c-btn @click="() => handleSubmit(validate)">Register</c-btn>
    </template>
  </c-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ username: '', email: '' })
const taken = ['admin', 'root', 'vueland']

const usernameRules = [
  (v: string) => ({
    valid: /^[a-zA-Z0-9_]{3,}$/.test(v),
    message: 'Min 3 chars, letters/numbers/_',
  }),
  async (v: string) => {
    await new Promise((r) => setTimeout(r, 600))
    return { valid: !taken.includes(v.toLowerCase()), message: `"${v}" is already taken` }
  },
]
const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
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

| Prop    | Type     | Default | Description                                                                                          |
| ------- | -------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `label` | `string` | —       | `aria-label` for the `<form>` element. When present, the browser automatically assigns `role="form"` |

### Slots

| Slot      | Props                 | Description                                    |
| --------- | --------------------- | ---------------------------------------------- |
| `default` | `{ validate, reset }` | Form content with validate and reset functions |

#### `default` slot props

| Prop       | Type                     | Description                                                                     |
| ---------- | ------------------------ | ------------------------------------------------------------------------------- |
| `validate` | `() => Promise<boolean>` | Run validation on all registered fields. Returns `true` if every field is valid |
| `reset`    | `() => void`             | Reset validation state on all registered fields                                 |

### Events

| Event    | Arguments | Description                                                                      |
| -------- | --------- | -------------------------------------------------------------------------------- |
| `submit` | `Event`   | Emitted when the form is submitted. The native submit is prevented automatically |

### Expose

| Method     | Signature                | Description                                     |
| ---------- | ------------------------ | ----------------------------------------------- |
| `validate` | `() => Promise<boolean>` | Run validation on all registered fields         |
| `reset`    | `() => void`             | Reset validation state on all registered fields |

```vue
<template>
  <c-form ref="formRef">
    <template #default><!-- fields --></template>
  </c-form>
  <c-btn @click="formRef?.validate()">Validate externally</c-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const formRef = ref()
</script>
```

### CSS variables

`CForm` does not define its own CSS variables. Its base style is `width: 100%` on the `.c-form` class.

---

## How it works

1. Child components (`CTextField`, `CInput`) register their `validate` function with the nearest `CForm` via `provide/inject` on mount.
2. `CForm.validate()` runs all registered functions via `Promise.all` (in parallel).
3. When a child unmounts, its function is automatically removed.

```
CForm
 ├─ CTextField  → registers validate on mount
 ├─ CTextField  → registers validate on mount
 └─ CInput      → registers validate on mount

form.validate()
  → Promise.all([field1.validate(), field2.validate(), field3.validate()])
  → true / false
```

---

## ARIA and accessibility

| Attribute     | Value                 | Description                                          |
| ------------- | --------------------- | ---------------------------------------------------- |
| `novalidate`  | present               | Disables native browser validation                   |
| `aria-label`  | value of `label` prop | Identifies the form to screen readers                |
| `role="form"` | auto                  | Assigned by the browser when `aria-label` is present |

:::tip
Pass a meaningful `label` when there are multiple forms on the page so screen reader users can distinguish between them.
:::
