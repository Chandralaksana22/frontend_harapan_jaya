<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { useUserStore, type User } from '../stores/userStore'
import Hero from '@/components/Hero.vue'
const route = useRoute()
const userStore = useUserStore()
const user = ref<User | null>(null)

onMounted(async () => {
    const id = Number(route.params.id)
    const localUser = userStore.users.find(u => u.id === id)
    if (localUser) {
        user.value = localUser
    } else {
        try {
            const res = await api.get(`/users/${id}`)
            user.value = res.data
        } catch (error) {
            console.error('User tidak ditemukan di API dan store', error)
            user.value = null
        }
    }
})
</script>

<template>
    <Hero />
    <div class="container mx-auto px-5 lg:px-10 py-10">
        <div class="flex justify-between mb-4">
            <h1 class="text-2xl font-bold">Detail User</h1>
            <button @click="$router.push('/')" class="bg-blue-600 text-white px-4 py-2 rounded">Back</button>
        </div>
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ user?.name }}</h5>
            <div class="mb-1 flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
                    <path
                        d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z">
                    </path>
                </svg>
                <p class="font-normal text-gray-700 dark:text-gray-400">{{ user?.phone }}</p>
            </div>
            <div class="mb-1 flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
                    <path
                        d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z">
                    </path>
                </svg>
                <p class="font-normal text-gray-700 dark:text-gray-400">{{ user?.email }}</p>
            </div>
            <div class="mb-1 flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
                    <path
                        d="M112,80a16,16,0,1,1,16,16A16,16,0,0,1,112,80ZM64,80a64,64,0,0,1,128,0c0,59.95-57.58,93.54-60,94.95a8,8,0,0,1-7.94,0C121.58,173.54,64,140,64,80Zm16,0c0,42.2,35.84,70.21,48,78.5,12.15-8.28,48-36.3,48-78.5a48,48,0,0,0-96,0Zm122.77,67.63a8,8,0,0,0-5.54,15C213.74,168.74,224,176.92,224,184c0,13.36-36.52,32-96,32s-96-18.64-96-32c0-7.08,10.26-15.26,26.77-21.36a8,8,0,0,0-5.54-15C29.22,156.49,16,169.41,16,184c0,31.18,57.71,48,112,48s112-16.82,112-48C240,169.41,226.78,156.49,202.77,147.63Z">
                    </path>
                </svg>
                <p class="font-normal text-gray-700 dark:text-gray-400">{{ user?.address.city }}</p>
            </div>


        </div>
    </div>
</template>
