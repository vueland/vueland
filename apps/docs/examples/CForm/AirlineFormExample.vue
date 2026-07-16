<script setup lang="ts">
    import { computed, ref } from 'vue'

    const formRef = ref()

    const currentStep = ref(0)

    const submitting = ref(false)

    const flight = ref<{ from: string; to: string; departure: Date | null; passengers: string; class: string }>(
        { from: '', to: '', departure: null, passengers: '1', class: 'Economy' },
    )

    const passenger = ref({ firstName: '', lastName: '', passport: '', email: '', phone: '' })

    const payment = ref({ card: '', expiry: '', cvv: '' })

    const steps = ['Flight', 'Passenger', 'Payment']

    const classes = ['Economy', 'Business', 'First']

    const classPrices: Record<string, number> = { Economy: 299, Business: 799, First: 1499 }

    const today = new Date()

    const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Required' })]

    const departureDateRule = [
        (v: Date | null) => ({ valid: !!v, message: 'Select departure date' }),
    ]

    const passengersRule = [
        (v: string) => ({ valid: !!v, message: 'Required' }),
        (v: string) => ({ valid: Number(v) >= 1 && Number(v) <= 9, message: '1–9 passengers' }),
    ]

    const passportRule = [
        (v: string) => ({ valid: !!v?.trim(), message: 'Required' }),
        (v: string) => ({ valid: /^[A-Z0-9]{6,9}$/.test(v.toUpperCase()), message: 'Invalid passport' }),
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

    const totalPrice = computed(() =>
        (classPrices[flight.value.class] * Number(flight.value.passengers)).toLocaleString(),
    )

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
        flight.value = { from: '', to: '', departure: null, passengers: '1', class: 'Economy' }
        passenger.value = { firstName: '', lastName: '', passport: '', email: '', phone: '' }
        payment.value = { card: '', expiry: '', cvv: '' }
    }
</script>

<template>
    <div class="d-flex justify-center pa-6">
        <div class="elevation-2 airline-card">
            <!-- Header -->
            <div class="airline-header px-6 pt-5 pb-4">
                <div class="brand mb-4 d-flex justify-center align-center">
                    <c-icon
                        name="fas:globe"
                        :size="18"
                        source="fa"
                    />
                    <span class="fs-lg fw-bold">VueAir</span>
                </div>
                <div class="steps d-flex align-center">
                    <div
                        v-for="(step, i) in steps"
                        :key="i"
                        class="step-item d-flex align-center"
                        :class="{ 'step-item--active': currentStep === i, 'step-item--done': currentStep > i }"
                    >
                        <div class="step-dot d-flex align-center justify-center">
                            <c-icon
                                v-if="currentStep > i"
                                name="fas:check"
                                :size="9"
                                source="fa"
                            />
                            <span v-else>{{ i + 1 }}</span>
                        </div>
                        <span class="step-label fs-xs fw-semi-bold text-uppercase">{{ step }}</span>
                        <div
                            v-if="i < steps.length - 1"
                            class="step-line"
                        />
                    </div>
                </div>
            </div>

            <div class="px-6 pb-6 pt-5">
                <c-form ref="formRef">
                    <template #default="{ validate }">
                        <!-- Step 1: Flight -->
                        <div
                            v-if="currentStep === 0"
                            class="d-flex flex-col gap-4"
                        >
                            <div
                                class="fs-sm fw-semi-bold"
                                style="opacity:.6"
                            >
                                Flight details
                            </div>
                            <div class="airline-field-grid">
                                <div class="airline-field-grid__item">
                                    <c-text-field
                                        v-model="flight.from"
                                        label="From"
                                        :rules="requiredRule"
                                        validate-on="blur"
                                        preset="input.blue"
                                    >
                                        <template #prepend>
                                            <c-icon
                                                name="fas:map-marker-alt"
                                                :size="13"
                                                source="fa"
                                            />
                                        </template>
                                    </c-text-field>
                                </div>
                                <div class="airline-field-grid__item">
                                    <c-text-field
                                        v-model="flight.to"
                                        label="To"
                                        :rules="requiredRule"
                                        validate-on="blur"
                                        preset="input.blue"
                                    >
                                        <template #prepend>
                                            <c-icon
                                                name="fas:map-marker-alt"
                                                :size="13"
                                                source="fa"
                                            />
                                        </template>
                                    </c-text-field>
                                </div>
                                <div class="airline-field-grid__item">
                                    <c-date-input
                                        v-model="flight.departure"
                                        label="Departure date"
                                        :rules="departureDateRule"
                                        :min-date="today"
                                        validate-on="blur"
                                        clearable
                                        preset="input.blue"
                                    />
                                </div>
                                <div class="airline-field-grid__item">
                                    <c-text-field
                                        v-model="flight.passengers"
                                        label="Passengers"
                                        type="number"
                                        :rules="passengersRule"
                                        validate-on="blur"
                                        preset="input.blue"
                                    >
                                        <template #prepend>
                                            <c-icon
                                                name="fas:user"
                                                :size="13"
                                                source="fa"
                                            />
                                        </template>
                                    </c-text-field>
                                </div>
                            </div>
                            <div class="d-flex align-center gap-3">
                                <span
                                    class="fs-sm"
                                    style="opacity:.55"
                                >Class</span>
                                <div class="d-flex gap-2">
                                    <button
                                        v-for="cls in classes"
                                        :key="cls"
                                        class="class-btn fs-sm"
                                        :class="{ 'class-btn--active': flight.class === cls }"
                                        @click="flight.class = cls"
                                    >
                                        {{ cls }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Passenger -->
                        <div
                            v-if="currentStep === 1"
                            class="d-flex flex-col gap-4"
                        >
                            <div
                                class="fs-sm fw-semi-bold"
                                style="opacity:.6"
                            >
                                Passenger information
                            </div>
                            <div class="airline-field-grid">
                                <div class="airline-field-grid__item">
                                    <c-text-field
                                        v-model="passenger.firstName"
                                        label="First name"
                                        :rules="requiredRule"
                                        validate-on="blur"
                                        preset="input.blue"
                                    />
                                </div>
                                <div class="airline-field-grid__item">
                                    <c-text-field
                                        v-model="passenger.lastName"
                                        label="Last name"
                                        :rules="requiredRule"
                                        validate-on="blur"
                                        preset="input.blue"
                                    />
                                </div>
                            </div>
                            <c-text-field
                                v-model="passenger.passport"
                                label="Passport number"
                                :rules="passportRule"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:briefcase"
                                        :size="13"
                                        source="fa"
                                    />
                                </template>
                            </c-text-field>
                            <c-text-field
                                v-model="passenger.email"
                                label="Contact email"
                                type="email"
                                :rules="emailRules"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:envelope"
                                        :size="13"
                                        source="fa"
                                    />
                                </template>
                            </c-text-field>
                            <c-text-field
                                v-model="passenger.phone"
                                label="Phone number"
                                type="tel"
                                :rules="phoneRules"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:phone"
                                        :size="13"
                                        source="fa"
                                    />
                                </template>
                            </c-text-field>
                        </div>

                        <!-- Step 3: Payment -->
                        <div
                            v-if="currentStep === 2"
                            class="d-flex flex-col gap-4"
                        >
                            <div
                                class="fs-sm fw-semi-bold"
                                style="opacity:.6"
                            >
                                Payment details
                            </div>
                            <div class="summary">
                                <div class="summary-row">
                                    <span>Route</span><strong>{{ flight.from }} → {{ flight.to }}</strong>
                                </div>
                                <div class="summary-row">
                                    <span>Date</span><strong>{{ flight.departure?.toLocaleDateString('en-GB') }}</strong>
                                </div>
                                <div class="summary-row">
                                    <span>Passengers</span><strong>{{ flight.passengers }} × {{ flight.class }}</strong>
                                </div>
                                <div class="summary-row summary-row--total">
                                    <span>Total</span><strong>${{ totalPrice }}</strong>
                                </div>
                            </div>
                            <c-text-field
                                v-model="payment.card"
                                label="Card number"
                                :rules="cardRule"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:credit-card"
                                        :size="13"
                                        source="fa"
                                    />
                                </template>
                            </c-text-field>
                            <div class="airline-field-grid">
                                <div class="airline-field-grid__item">
                                    <c-text-field
                                        v-model="payment.expiry"
                                        label="Expiry (MM/YY)"
                                        :rules="expiryRule"
                                        validate-on="blur"
                                        preset="input.blue"
                                    />
                                </div>
                                <div class="airline-field-grid__item">
                                    <c-text-field
                                        v-model="payment.cvv"
                                        label="CVV"
                                        type="password"
                                        :rules="cvvRule"
                                        validate-on="blur"
                                        preset="input.blue"
                                    >
                                        <template #prepend>
                                            <c-icon
                                                name="fas:shield-alt"
                                                :size="13"
                                                source="fa"
                                            />
                                        </template>
                                    </c-text-field>
                                </div>
                            </div>
                        </div>

                        <!-- Success -->
                        <div
                            v-if="currentStep === 3"
                            class="d-flex flex-col align-center gap-3 py-4"
                        >
                            <div class="success-icon d-flex align-center justify-center">
                                <c-icon
                                    name="fas:check"
                                    :size="28"
                                    source="fa"
                                />
                            </div>
                            <div class="fs-lg fw-bold">
                                Booking confirmed!
                            </div>
                            <div
                                class="fs-sm text-center"
                                style="opacity:.65"
                            >
                                {{ flight.from }} → {{ flight.to }} on {{ flight.departure?.toLocaleDateString('en-GB') }}<br />
                                Confirmation sent to {{ passenger.email }}
                            </div>
                            <c-btn
                                class="btn-primary mt-2"
                                @click="handleRestart"
                            >
                                Book another flight
                            </c-btn>
                        </div>

                        <!-- Navigation -->
                        <div
                            v-if="currentStep < 3"
                            class="d-flex align-center gap-3 mt-5"
                        >
                            <c-btn
                                v-if="currentStep > 0"
                                class="btn-ghost"
                                @click="currentStep--"
                            >
                                ← Back
                            </c-btn>
                            <c-btn
                                class="btn-primary"
                                :disabled="submitting"
                                @click="() => handleNext(validate)"
                            >
                                {{ submitting ? 'Processing…' : currentStep === 2 ? 'Pay & Confirm' : 'Continue →' }}
                            </c-btn>
                        </div>
                    </template>
                </c-form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.airline-card {
  max-width: 520px;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: var(--vp-c-bg, #fff);
}

.airline-header {
  background: linear-gradient(135deg, #1a6ef5 0%, #0fb8d4 100%);
  color: #fff;
}

.airline-field-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 22px 16px;
}

.airline-field-grid__item {
  flex: 1 1 220px;
  min-width: min(100%, 220px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.steps { width: 100%; }

.step-item {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: .4;
  transition: opacity .2s;
  flex-shrink: 0;
}
.step-item--active,
.step-item--done { opacity: 1; }

.step-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.8);
  flex-shrink: 0;
  transition: background .2s;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}
.step-dot span {
  display: block;
  line-height: 1;
}
.step-item--done .step-dot {
  background: #fff;
  color: #1a6ef5;
  border-color: #fff;
}
.step-item--active .step-dot {
  background: rgba(255,255,255,.2);
}

.step-label {
  letter-spacing: .05em;
  white-space: nowrap;
}

.step-line {
  flex: 1;
  min-width: 16px;
  height: 1px;
  background: rgba(255,255,255,.3);
  margin: 0 8px;
}

.class-btn {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--vp-c-divider, #e0e0e0);
  background: transparent;
  cursor: pointer;
  color: inherit;
  transition: all .15s;
}
.class-btn--active {
  border-color: #2f8cff;
  background: #2f8cff;
  color: #fff;
}

.summary {
  background: var(--vp-c-bg-soft, #f5f5f5);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}
.summary-row span { opacity: .55; }
.summary-row--total {
  border-top: 1px solid var(--vp-c-divider, #e0e0e0);
  padding-top: 10px;
  margin-top: 2px;
  font-size: 15px;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, #27d98c, #2f8cff);
  color: #fff;
  line-height: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #27d98c, #2f8cff);
  color: #fff !important;
  font-weight: 600;
}
.btn-ghost {
  background: transparent !important;
  border: 1.5px solid var(--vp-c-divider, #ddd) !important;
  color: var(--vp-c-text-2) !important;
}

@media (max-width: 480px) {
  .steps { gap: 12px; }
  .step-label { display: none; }

  .airline-field-grid__item {
    flex-basis: 100%;
  }
}
</style>
