<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { onMounted, ref } from 'vue'
import axios from 'axios'


const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const cities = ref<string[]>([])
const showConfirm = ref(false)
const loading = ref(false)

const schema = yup.object({
    username: yup.string().required('Username wajib diisi'),
    name: yup.string().required('Nama wajib diisi'),
    phone: yup.string().required('Telepon wajib diisi'),
    email: yup.string().email('Format email salah').required('Email wajib diisi'),
    city: yup.string().required('Kota wajib dipilih')
})
const { handleSubmit, errors, values } = useForm({ validationSchema: schema })
const { value: username } = useField<string>('username')
const { value: name } = useField<string>('name')
const { value: phone } = useField<string>('phone')
const { value: email } = useField<string>('email')
const { value: city } = useField<string>('city')

// Ambil data kota
async function fetchCities() {
    try {
        const res = await axios.post(
            'https://countriesnow.space/api/v0.1/countries/cities',
            { country: 'Indonesia' }
        )
        cities.value = res.data.data
    } catch (err) {
        console.error('Gagal ambil data kota:', err)
    }
}

// Preload data untuk edit
onMounted(() => {
    fetchCities()
    if (route.params.id) {
        const u = userStore.users.find(x => x.id === Number(route.params.id))
        if (u) {
            username.value = u.username
            name.value = u.name
            phone.value = u.phone
            email.value = u.email
            city.value = u.address.city
        }
    }
})

// Fungsi submit utama
const confirmSubmit = handleSubmit(() => {
    showConfirm.value = true
})

async function submitData() {
    loading.value = true
    const payload = {
        username: values.username,
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: { city: values.city }
    }

    try {
        if (route.params.id) {

            await userStore.updateUser(Number(route.params.id), payload)
            alert('User berhasil diperbarui!')
        } else {

            await userStore.addUser(payload)
            alert('User berhasil ditambahkan!')
        }
        router.push('/')
    } catch (err) {
        console.error(err)
        alert('Terjadi kesalahan saat menyimpan data.')
    } finally {
        loading.value = false
        showConfirm.value = false
    }
}


</script>

<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">
            {{ route.params.id ? 'Edit User' : 'Tambah User' }}
        </h1>

        <form @submit.prevent="confirmSubmit" class="space-y-4 max-w-md">
            <div>
                <label>Username</label>
                <input v-model="username" class="border p-2 w-full" />
                <span class="text-red-500 text-sm">{{ errors.username }}</span>
            </div>
            <div>
                <label>Nama</label>
                <input v-model="name" class="border p-2 w-full" />
                <span class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>
            <div>
                <label>Telepon</label>
                <input v-model="phone" class="border p-2 w-full" />
                <span class="text-red-500 text-sm">{{ errors.phone }}</span>
            </div>
            <div>
                <label>Email</label>
                <input v-model="email" class="border p-2 w-full" />
                <span class="text-red-500 text-sm">{{ errors.email }}</span>
            </div>
            <div>
                <label>Kota</label>
                <select v-model="city" class="border p-2 w-full">
                    <option value="">Pilih Kota</option>
                    <option v-for="k in cities" :key="k" :value="k">{{ k }}</option>
                </select>
                <span class="text-red-500 text-sm">{{ errors.city }}</span>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
                Simpan
            </button>
        </form>

        <!-- Modal Konfirmasi -->
        <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg w-96">
                <h2 class="text-lg font-bold mb-4">Konfirmasi</h2>
                <p>Apakah Anda yakin ingin menyimpan data ini?</p>
                <div class="mt-4 flex justify-end gap-2">
                    <button @click="showConfirm = false" class="px-4 py-2 bg-gray-300 rounded">
                        Batal
                    </button>
                    <button @click="submitData" class="px-4 py-2 bg-blue-600 text-white rounded" :disabled="loading">
                        {{ loading ? 'Menyimpan...' : 'Ya, Simpan' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
