<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { useUserStore, type User } from '../stores/userStore'

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
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Detail User</h1>
        <div v-if="user" class="space-y-2">
            <p><strong>Nama:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Telepon:</strong> {{ user.phone }}</p>
            <p><strong>Kota:</strong> {{ user.address.city }}</p>
        </div>
    </div>
</template>
