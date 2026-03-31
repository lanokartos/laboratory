<script setup lang="ts">
import { ref, computed, watch } from 'vue'

useHead({ title: 'Products Table' })

const { data } = await useFetch<any>('https://dummyjson.com/products?limit=200')
const allProducts = data.value?.products || []

const search = ref('')
const currentPage = ref(1)
const perPage = 10
const selectedRows = ref<Set<number>>(new Set())

watch(search, () => {
    currentPage.value = 1
})

const sortBy = ref('')
const sortOrder = ref(1)

const filteredItems = computed(() => {
    let result = [...allProducts]
    
    if (search.value) {
        const query = search.value.toLowerCase()
        result = result.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.brand?.toLowerCase().includes(query)
        )
    }

    if (sortBy.value) {
        result.sort((a, b) => {
            const valA = a[sortBy.value]
            const valB = b[sortBy.value]
            if (valA < valB) return -1 * sortOrder.value
            if (valA > valB) return 1 * sortOrder.value
            return 0
        })
    }

    return result
})

const displayedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredItems.value.slice(start, start + perPage)
})

function doSort(field: string) {
    if (sortBy.value === field) {
        sortOrder.value *= -1
    } else {
        sortBy.value = field
        sortOrder.value = 1
    }
}

function nextPage() {
    if (currentPage.value * perPage < filteredItems.value.length) {
        currentPage.value++
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

function toggleSelect(id: number) {
    if (selectedRows.value.has(id)) {
        selectedRows.value.delete(id)
    } else {
        selectedRows.value.add(id)
    }
}

const columns = [
    { id: 'select', accessorKey: 'select', header: '' },
    { id: 'title', accessorKey: 'title', header: 'Назва / Бренд' },
    { id: 'price', accessorKey: 'price', header: 'Ціна' },
    { id: 'rating', accessorKey: 'rating', header: 'Оцінка' },
    { id: 'category', accessorKey: 'category', header: 'Категорія' },
    { id: 'thumbnail', accessorKey: 'thumbnail', header: 'Фото' }
]
</script>

<template>
    <div class="min-h-screen bg-[#f9fafb] p-4 md:p-8">
        <div class="mx-auto max-w-7xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 bg-white p-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">Список товарів</h1>
                        <p class="text-sm text-slate-500 mt-1">Всього знайдено: {{ filteredItems.length }}</p>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <UInput 
                            v-model="search" 
                            placeholder="Пошук за назвою або брендом..." 
                            size="md"
                            class="w-full md:w-80"
                        />
                        <UButton variant="ghost" color="neutral" @click="search = ''">Скинути</UButton>
                    </div>
                </div>
            </div>

            <UTable 
                :data="displayedItems" 
                :columns="columns"
                :ui="{ 
                    base: 'min-w-full w-full table-auto border-collapse',
                    th: 'py-3.5 px-4 text-left text-[14px] font-bold text-slate-600 border-b-2 border-slate-200 whitespace-nowrap bg-slate-50',
                    td: 'py-4 px-4 border-b border-slate-200 bg-white'
                }"
                class="w-full shadow-sm"
            >
                <template #select-cell="{ row }">
                    <UCheckbox 
                        :model-value="selectedRows.has(row.original.id)" 
                        @update:model-value="toggleSelect(row.original.id)"
                    />
                </template>

                <template #title-cell="{ row }">
                    <div class="flex flex-col text-left py-1 w-full min-w-[250px]">
                        <span class="text-[15px] font-bold text-slate-900 uppercase underline decoration-slate-300 underline-offset-4">{{ row.original.title }}</span>
                        <span class="text-xs text-slate-500 mt-1 uppercase">{{ row.original.brand || 'General' }}</span>
                    </div>
                </template>

                <template #price-header>
                    <button class="text-[14px] font-bold text-slate-600 flex gap-1 items-center hover:text-slate-900 transition-colors" @click="doSort('price')">
                        Ціна ↕
                    </button>
                </template>

                <template #price-cell="{ row }">
                    <span class="text-base font-bold text-slate-800 whitespace-nowrap">${{ row.original.price }}</span>
                </template>

                <template #rating-header>
                    <button class="text-[14px] font-bold text-slate-600 flex gap-1 items-center hover:text-slate-900 transition-colors" @click="doSort('rating')">
                        Оцінка ↕
                    </button>
                </template>

                <template #rating-cell="{ row }">
                    <span class="text-base font-bold text-slate-800">{{ row.original.rating }}</span>
                </template>

                <template #category-cell="{ row }">
                    <span class="text-base font-medium text-slate-700 capitalize">{{ row.original.category }}</span>
                </template>

                <template #thumbnail-cell="{ row }">
                    <div class="h-14 w-14 flex items-center justify-center rounded border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
                        <img 
                            :src="row.original.thumbnail" 
                            class="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </template>
            </UTable>

            <div class="flex items-center justify-between bg-slate-50 p-5">
                <p class="text-sm text-slate-600">
                    Сторінка <span class="font-bold text-slate-900">{{ currentPage }}</span> з {{ Math.ceil(filteredItems.length / perPage) || 1 }}
                </p>
                
                <div class="flex gap-2">
                    <UButton 
                        variant="soft"
                        color="neutral" 
                        :disabled="currentPage === 1"
                        @click="prevPage"
                    >
                        &lt; Назад
                    </UButton>
                    <UButton 
                        variant="soft"
                        color="neutral"
                        :disabled="currentPage * perPage >= filteredItems.length"
                        @click="nextPage"
                    >
                        Вперед &gt;
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>




