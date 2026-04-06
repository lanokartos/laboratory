<script setup lang="ts">
import { computed } from 'vue'

interface ProductFeature {
  text: string
  subtext?: string
}

interface ProductCard {
  id: number
  title: string
  price: string
  monthlyPrice: string
  oldPrice: string
  billed: string
  monthlyBilled: string
  freeTrial: string
  savings: string
  monthlySavings: string
  buttonText: string
  features: ProductFeature[]
}

const props = withDefaults(defineProps<{
  product: ProductCard
  cycle: 'annual' | 'monthly' | string | string[]
  ctaTo?: string
  showButton?: boolean
}>(), {
  showButton: true
})

const resolvedCycle = computed(() => Array.isArray(props.cycle) ? props.cycle[0] : props.cycle)
</script>

<template>
  <div
    class="w-[380px] overflow-hidden rounded-2xl border-t-4 border-[#00c2cb] bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <h2 class="mb-4 text-2xl font-bold text-slate-800 md:text-3xl">
      <span v-if="resolvedCycle === 'annual'">{{ product.title }}</span>
      <span v-else>{{ product.title.replace('Annual', 'Monthly') }}</span>
    </h2>

    <div class="mb-4">
      <span class="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {{ product.freeTrial }}
      </span>
    </div>

    <div class="mb-1 flex items-baseline text-slate-800">
      <span class="text-5xl font-extrabold" v-if="resolvedCycle === 'annual'">${{ product.price }}</span>
      <span class="text-5xl font-extrabold" v-else>${{ product.monthlyPrice }}</span>
      <span class="text-lg font-medium text-slate-400">/month</span>
    </div>

    <div v-if="resolvedCycle === 'annual'">
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

    <NuxtLink
      v-if="props.showButton && ctaTo"
      :to="ctaTo"
      class="mb-8 block w-full rounded-md bg-amber-400 py-3 text-center text-lg font-bold text-slate-900"
    >
      {{ product.buttonText }}
    </NuxtLink>

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
</template>

