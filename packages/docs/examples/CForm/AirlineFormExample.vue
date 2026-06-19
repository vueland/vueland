<template>
  <div class="ex-wrap">
    <CCard class="elevation-3 airline-card">
      <!-- Header -->
      <div class="airline-header">
        <div class="airline-logo">
          <CIcon name="fas:globe" :size="22" source="fa" />
          <span>VueAir</span>
        </div>
        <div class="airline-steps">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step"
            :class="{ active: currentStep === i, done: currentStep > i }"
          >
            <div class="step-dot">
              <CIcon v-if="currentStep > i" name="fas:check" :size="10" source="fa" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
        </div>
      </div>

      <CCardBody class="pa-6">
        <CForm ref="formRef">
          <template #default="{ validate }">

            <!-- Step 1: Flight search -->
            <div v-if="currentStep === 0">
              <h3 class="section-title">Flight details</h3>
              <div class="form-grid">
                <CTextField
                  v-model="flight.from"
                  label="From"
                  :rules="requiredRule"
                  validate-on="blur"
                  preset="input.blue"
                >
                  <template #prepend>
                    <CIcon name="fas:map-marker-alt" :size="14" source="fa" />
                  </template>
                </CTextField>

                <CTextField
                  v-model="flight.to"
                  label="To"
                  :rules="requiredRule"
                  validate-on="blur"
                  preset="input.blue"
                >
                  <template #prepend>
                    <CIcon name="fas:map-marker-alt" :size="14" source="fa" />
                  </template>
                </CTextField>

                <CTextField
                  v-model="flight.departure"
                  label="Departure date"
                  placeholder="DD.MM.YYYY"
                  :rules="departureDateRule"
                  validate-on="blur"
                  preset="input.blue"
                >
                  <template #prepend>
                    <CIcon name="fas:calendar-alt" :size="14" source="fa" />
                  </template>
                </CTextField>

                <CTextField
                  v-model="flight.passengers"
                  label="Passengers"
                  type="number"
                  :rules="passengersRule"
                  validate-on="blur"
                  preset="input.blue"
                >
                  <template #prepend>
                    <CIcon name="fas:user" :size="14" source="fa" />
                  </template>
                </CTextField>

                <div class="form-full">
                  <div class="class-select">
                    <span class="class-label">Class</span>
                    <div class="class-options">
                      <button
                        v-for="cls in classes"
                        :key="cls"
                        class="class-btn"
                        :class="{ selected: flight.class === cls }"
                        @click="flight.class = cls"
                      >
                        {{ cls }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Passenger details -->
            <div v-if="currentStep === 1">
              <h3 class="section-title">Passenger information</h3>
              <div class="form-grid">
                <CTextField
                  v-model="passenger.firstName"
                  label="First name"
                  :rules="requiredRule"
                  validate-on="blur"
                  preset="input.teal"
                />
                <CTextField
                  v-model="passenger.lastName"
                  label="Last name"
                  :rules="requiredRule"
                  validate-on="blur"
                  preset="input.teal"
                />
                <div class="form-full">
                  <CTextField
                    v-model="passenger.passport"
                    label="Passport number"
                    :rules="passportRule"
                    validate-on="blur"
                    preset="input.teal"
                  >
                    <template #prepend>
                      <CIcon name="fas:briefcase" :size="14" source="fa" />
                    </template>
                  </CTextField>
                </div>
                <div class="form-full">
                  <CTextField
                    v-model="passenger.email"
                    label="Contact email"
                    type="email"
                    :rules="emailRules"
                    validate-on="blur"
                    preset="input.teal"
                  >
                    <template #prepend>
                      <CIcon name="fas:envelope" :size="14" source="fa" />
                    </template>
                  </CTextField>
                </div>
                <div class="form-full">
                  <CTextField
                    v-model="passenger.phone"
                    label="Phone number"
                    type="tel"
                    :rules="phoneRules"
                    validate-on="blur"
                    preset="input.teal"
                  >
                    <template #prepend>
                      <CIcon name="fas:phone" :size="14" source="fa" />
                    </template>
                  </CTextField>
                </div>
              </div>
            </div>

            <!-- Step 3: Payment -->
            <div v-if="currentStep === 2">
              <h3 class="section-title">Payment details</h3>
              <div class="booking-summary">
                <div class="summary-row">
                  <span>Route</span>
                  <strong>{{ flight.from }} → {{ flight.to }}</strong>
                </div>
                <div class="summary-row">
                  <span>Date</span>
                  <strong>{{ flight.departure }}</strong>
                </div>
                <div class="summary-row">
                  <span>Passengers</span>
                  <strong>{{ flight.passengers }} × {{ flight.class }}</strong>
                </div>
                <div class="summary-row total">
                  <span>Total</span>
                  <strong>$ {{ totalPrice }}</strong>
                </div>
              </div>

              <div class="form-grid mt-4">
                <div class="form-full">
                  <CTextField
                    v-model="payment.card"
                    label="Card number"
                    :rules="cardRule"
                    validate-on="blur"
                    preset="input.deepPurple"
                  >
                    <template #prepend>
                      <CIcon name="fas:credit-card" :size="14" source="fa" />
                    </template>
                  </CTextField>
                </div>
                <CTextField
                  v-model="payment.expiry"
                  label="Expiry (MM/YY)"
                  :rules="expiryRule"
                  validate-on="blur"
                  preset="input.deepPurple"
                />
                <CTextField
                  v-model="payment.cvv"
                  label="CVV"
                  type="password"
                  :rules="cvvRule"
                  validate-on="blur"
                  preset="input.deepPurple"
                >
                  <template #prepend>
                    <CIcon name="fas:shield-alt" :size="14" source="fa" />
                  </template>
                </CTextField>
              </div>
            </div>

            <!-- Success -->
            <div v-if="currentStep === 3" class="success-screen">
              <div class="success-icon text-green">
                <CIcon name="fas:check" :size="32" source="fa" />
              </div>
              <h3>Booking confirmed!</h3>
              <p>
                Your flight from <strong>{{ flight.from }}</strong> to
                <strong>{{ flight.to }}</strong> on <strong>{{ flight.departure }}</strong>
                has been booked.
              </p>
              <p style="opacity: .6; font-size: 13px">
                Confirmation sent to {{ passenger.email }}
              </p>
              <CBtn class="bg-blue elevation-1 mt-4" style="color:#fff" @click="handleRestart">
                Book another flight
              </CBtn>
            </div>

            <!-- Navigation -->
            <div v-if="currentStep < 3" class="form-actions mt-4">
              <CBtn
                v-if="currentStep > 0"
                variant="text"
                @click="currentStep--"
              >
                Back
              </CBtn>
              <CBtn
                class="elevation-1"
                :class="stepColor"
                style="color: #fff"
                :disabled="submitting"
                @click="() => handleNext(validate)"
              >
                {{ submitting ? 'Processing…' : currentStep === 2 ? 'Pay & Confirm' : 'Continue' }}
              </CBtn>
            </div>

          </template>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const formRef = ref()
const currentStep = ref(0)
const submitting = ref(false)

const steps = ['Flight', 'Passenger', 'Payment']
const classes = ['Economy', 'Business', 'First']

const classPrices: Record<string, number> = { Economy: 299, Business: 799, First: 1499 }

const flight = ref({ from: '', to: '', departure: '', passengers: '1', class: 'Economy' })
const passenger = ref({ firstName: '', lastName: '', passport: '', email: '', phone: '' })
const payment = ref({ card: '', expiry: '', cvv: '' })

const totalPrice = computed(() =>
  (classPrices[flight.value.class] * Number(flight.value.passengers)).toLocaleString(),
)

const stepColor = computed(() =>
  currentStep.value === 0 ? 'bg-blue' : currentStep.value === 1 ? 'bg-teal' : 'bg-deep-purple',
)

const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Required' })]

const departureDateRule = [
  (v: string) => ({ valid: !!v?.trim(), message: 'Required' }),
  (v: string) => ({ valid: /^\d{2}\.\d{2}\.\d{4}$/.test(v), message: 'Use DD.MM.YYYY format' }),
]

const passengersRule = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: Number(v) >= 1 && Number(v) <= 9, message: '1–9 passengers' }),
]

const passportRule = [
  (v: string) => ({ valid: !!v?.trim(), message: 'Required' }),
  (v: string) => ({ valid: /^[A-Z0-9]{6,9}$/.test(v.toUpperCase()), message: 'Invalid passport number' }),
]

const emailRules = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
]

const phoneRules = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: /^\+?[\d\s\-()]{7,}$/.test(v), message: 'Invalid phone' }),
]

const cardRule = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: v.replace(/\s/g, '').length === 16, message: '16-digit card number' }),
]

const expiryRule = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: /^\d{2}\/\d{2}$/.test(v), message: 'MM/YY format' }),
]

const cvvRule = [
  (v: string) => ({ valid: !!v, message: 'Required' }),
  (v: string) => ({ valid: /^\d{3,4}$/.test(v), message: '3–4 digits' }),
]

async function handleNext(validate: () => Promise<boolean>) {
  const valid = await validate()
  if (!valid) return

  if (currentStep.value === 2) {
    submitting.value = true
    await new Promise((r) => setTimeout(r, 1000))
    submitting.value = false
  }

  currentStep.value++
}

function handleRestart() {
  currentStep.value = 0
  flight.value = { from: '', to: '', departure: '', passengers: '1', class: 'Economy' }
  passenger.value = { firstName: '', lastName: '', passport: '', email: '', phone: '' }
  payment.value = { card: '', expiry: '', cvv: '' }
}
</script>

<style scoped>
.ex-wrap {
  padding: 24px;
  display: flex;
  justify-content: center;
}
.airline-card {
  max-width: 520px;
  width: 100%;
}
.airline-header {
  background: linear-gradient(135deg, #1565c0 0%, #0288d1 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}
.airline-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.airline-steps {
  display: flex;
  gap: 24px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  opacity: 0.5;
  transition: opacity .2s;
}
.step.active,
.step.done {
  opacity: 1;
}
.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  background: transparent;
  transition: background .2s;
}
.step.done .step-dot {
  background: #fff;
  color: #1565c0;
}
.step.active .step-dot {
  background: rgba(255,255,255,.25);
}
.step-label {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.section-title {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  opacity: .8;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.form-full {
  grid-column: 1 / -1;
}
.mt-4 { margin-top: 16px; }
.class-select {
  display: flex;
  align-items: center;
  gap: 12px;
}
.class-label {
  font-size: 13px;
  opacity: .6;
  white-space: nowrap;
}
.class-options {
  display: flex;
  gap: 6px;
}
.class-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--c-app-border-color, #e0e0e0);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  transition: all .15s;
  color: inherit;
}
.class-btn.selected {
  border-color: var(--c-app-primary-color, #1976d2);
  background: var(--c-app-primary-color, #1976d2);
  color: #fff;
}
.booking-summary {
  background: var(--c-app-bg-color, #f5f5f5);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}
.summary-row span {
  opacity: .6;
}
.summary-row.total {
  border-top: 1px solid var(--c-app-border-color, #e0e0e0);
  padding-top: 8px;
  margin-top: 4px;
  font-size: 15px;
}
.form-actions {
  display: flex;
  gap: 8px;
  flex-direction: row-reverse;
}
.success-screen {
  text-align: center;
  padding: 16px 0;
}
.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.success-screen h3 {
  margin: 0 0 8px;
  font-size: 18px;
}
.success-screen p {
  margin: 0 0 8px;
  font-size: 14px;
}
@media (max-width: 500px) {
  .airline-steps { gap: 12px; }
  .step-label { display: none; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
