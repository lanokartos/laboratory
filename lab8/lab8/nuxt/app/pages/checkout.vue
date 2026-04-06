<script setup lang="ts">
import PricingBookletCard from '~/components/PricingBookletCard.vue'

const route = useRoute()
const { data: products } = await useFetch('/api/products')

const selectedProduct = products.value?.find(p => p.id == Number(route.query.id))
const cycleParam = Array.isArray(route.query.cycle) ? route.query.cycle[0] : route.query.cycle
const cycle = cycleParam || 'annual'

const form = ref({
  fullName: '',
  cardNumber: '',
  planId: Number(route.query.id),
  cycle: cycle
})

const sendData = async () => {
  const res = await $fetch('/api/subscription/create', {
    method: 'POST',
    body: form.value
  })
  alert(res.message)
}
</script>

<template>
  <div class="min-h-screen bg-[#f2f3f5] px-4 py-6 font-sans text-slate-900 md:px-10 md:py-10">
    <div class="mx-auto max-w-[1240px]">
      <NuxtLink to="/products" class="mb-4 inline-flex items-center text-sm text-slate-600 transition-colors hover:text-slate-800">
        &lt;&lt; back
      </NuxtLink>

      <h1 class="mb-2 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">You're Almost In - Start Your 3-Day Free Trial Now!</h1>
      <p class="mb-8 text-lg leading-snug text-slate-700 md:text-xl">Set up your account to gain instant access! You won't be charged if you decide to cancel within your trial period.</p>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <PricingBookletCard
          v-if="selectedProduct"
          :product="selectedProduct"
          :cycle="cycle"
          :show-button="false"
        />

        <div class="rounded-xl border border-slate-300 bg-[#f7f7f8] p-8">
          <div class="mx-auto max-w-[640px]">
            <h2 class="text-4xl font-bold text-slate-900">Order Summary</h2>

            <div class="mt-6 space-y-4 text-2xl text-slate-800 md:text-3xl">
              <div class="flex items-center justify-between border-b border-slate-300 pb-3">
                <span class="capitalize">{{ cycle }} Plan</span>
                <span>{{ selectedProduct ? (cycle === 'annual' ? selectedProduct.billed : `$${selectedProduct.monthlyPrice}`) : '$0.00' }}</span>
              </div>
              <div class="flex items-center justify-between border-b border-slate-300 pb-3">
                <span>Total Due <small class="text-[12px] text-slate-500">(*not including sales tax where applicable)</small></span>
                <span>{{ selectedProduct ? (cycle === 'annual' ? selectedProduct.billed : `$${selectedProduct.monthlyPrice}`) : '$0.00' }}</span>
              </div>
              <div class="flex items-center justify-between font-semibold text-slate-900">
                <span>Due Today</span>
                <span>$0.00</span>
              </div>
            </div>

            <div class="mt-6 bg-[#ececed] px-6 py-4 text-center text-2xl text-slate-700 md:text-3xl">
              Includes {{ selectedProduct?.freeTrial || '3-Day Free Trial' }}
            </div>

            <h3 class="mt-10 flex items-center gap-2 text-3xl font-bold text-slate-900">
              Billing Information
              <span class="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 text-[10px] text-slate-500">i</span>
            </h3>

            <form @submit.prevent="sendData" class="mt-5 space-y-4">
              <label class="block text-base text-slate-700">Card Details</label>

              <div class="grid grid-cols-[1.4fr_0.8fr_0.6fr] overflow-hidden rounded-md border border-slate-400 bg-white">
                <input
                  v-model="form.cardNumber"
                  type="text"
                  placeholder="Number"
                  class="checkout-input border-r border-slate-300"
                />
                <input type="text" placeholder="MM / YY" class="checkout-input border-r border-slate-300" />
                <input type="text" placeholder="CVC" class="checkout-input" />
              </div>

              <label class="block text-base text-slate-700">Address</label>
              <div class="space-y-2 rounded-md border border-slate-400 bg-white p-2">
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="Full name"
                  class="checkout-text-input"
                />
                <input type="text" placeholder="Address" class="checkout-text-input" />
              </div>

              <label class="flex items-start gap-3 pt-1 text-[12px] leading-snug text-slate-700">
                <input type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-400" />
                <span>
                  I consent to <span class="font-semibold underline">Terms of Use</span> and understand my {{ selectedProduct?.freeTrial || '3-day free trial' }} will automatically convert to {{ selectedProduct ? (cycle === 'annual' ? selectedProduct.billed : `$${selectedProduct.monthlyPrice}`) : '$0.00' }} {{ cycle === 'annual' ? 'per year' : 'per month' }} on 04/02/2026 unless I cancel my account at least one (1) business day before the end of the current billing period.
                </span>
              </label>

              <button
                type="submit"
                class="mt-2 inline-flex h-[50px] w-[140px] items-center justify-center rounded-md bg-slate-300 text-lg font-bold text-slate-700 transition hover:bg-slate-400"
              >
                Try It Free
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-input {
  width: 100%;
  height: 52px;
  background: transparent;
  padding: 0 12px;
  font-size: 16px;
  line-height: 1.2;
  color: #334155;
  outline: none;
}

.checkout-input::placeholder,
.checkout-text-input::placeholder {
  color: #94a3b8;
}

.checkout-text-input {
  width: 100%;
  height: 52px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 16px;
  line-height: 1.2;
  color: #334155;
  outline: none;
}
</style>