<script setup>
import { ref } from 'vue'
import PricingBookletCard from '~/components/PricingBookletCard.vue'

useHead({
  title: 'Список продуктів'
})

const { data: products } = await useFetch('/api/products')


const billingCycle = ref('annual')

function setCycle(type) {
  billingCycle.value = type
}
</script>

<template>
  <div class="bg-slate-100 min-h-screen font-sans p-10">
    <div class="mx-auto max-w-[1240px]">

      <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-4xl font-bold text-slate-800">Start Your 3 Day Free Trial</h1>

        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-green-600">Save up to 20%</span>

          <div class="overflow-hidden rounded-md border border-slate-200 bg-white">
            <button
                @click="setCycle('annual')"
                class="px-4 py-2 text-sm transition-colors"
                :class="{ 'bg-slate-100 font-semibold text-slate-700': billingCycle === 'annual', 'font-medium text-slate-500': billingCycle !== 'annual' }"
            >
              Annual
            </button>

            <button
                @click="setCycle('monthly')"
                class="px-4 py-2 text-sm transition-colors"
                :class="{ 'bg-slate-100 font-semibold text-slate-700': billingCycle === 'monthly', 'font-medium text-slate-500': billingCycle !== 'monthly' }"
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-8">
        <PricingBookletCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :cycle="billingCycle"
          :cta-to="`/checkout?id=${product.id}&cycle=${billingCycle}`"
        />
      </div>

    </div>
  </div>
</template>