<script setup>
import { ref } from 'vue'

useHead({
  title: 'Список продуктів'
})

const { data: products } = await useFetch('/api/products')

// 3. Стан активної підписки. 'annual' — це початкове значення (стан за замовчуванням).
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

        <NuxtLink
            to="/products-table"
            class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Open table view
        </NuxtLink>

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
        <div v-for="product in products" :key="product.id"
             class="w-[380px] overflow-hidden rounded-2xl border-t-4 border-[#00c2cb] bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

          <h2 class="mb-4 text-2xl font-bold text-slate-800 md:text-3xl">
            <span v-if="billingCycle === 'annual'">{{ product.title }}</span>
            <span v-else>{{ product.title.replace('Annual', 'Monthly') }}</span>
          </h2>

          <div class="mb-4">
            <span class="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {{ product.freeTrial }}
            </span>
          </div>

          <div class="mb-1 flex items-baseline text-slate-800">
            <span class="text-5xl font-extrabold" v-if="billingCycle === 'annual'">${{ product.price }}</span>
            <span class="text-5xl font-extrabold" v-else>${{ product.monthlyPrice }}</span>
            <span class="text-lg font-medium text-slate-400">/month</span>
          </div>

          <div v-if="billingCycle === 'annual'">
            <p class="mb-1 text-sm text-slate-400">
              billed yearly at
              <span class="mx-1 line-through">${{ product.oldPrice }}</span>
              <span class="font-bold text-slate-500">{{ product.billed }}</span>
            </p>
            <p class="mb-4 inline-block rounded bg-green-100 px-2 py-1 text-xl font-semibold text-green-700">
              {{ product.savings }}
            </p>
          </div>

          <div v-else>
            <p class="mb-1 text-sm text-slate-400">
              {{ product.monthlyBilled }}
            </p>
            <p class="mb-4 inline-block rounded bg-green-100 px-2 py-1 text-xl font-semibold text-green-700">
              {{ product.monthlySavings }}
            </p>
          </div>

          <button class="mb-8 w-full rounded-md bg-amber-400 py-3 text-lg font-bold text-slate-900 transition-colors hover:bg-amber-500">
            {{ product.buttonText }}
          </button>

          <hr class="mb-5 border-slate-200">

          <ul class="space-y-4 font-medium">
            <li v-for="feature in product.features" :key="feature.text" class="flex items-start">
              <span class="mr-3 mt-1 text-sm text-green-400">✦</span>
              <p class="text-[13px] font-semibold leading-tight text-slate-600">
                {{ feature.text }}
                <br v-if="feature.subtext">
                <span v-if="feature.subtext" class="text-[11px] font-normal text-slate-400">
                  {{ feature.subtext }}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>