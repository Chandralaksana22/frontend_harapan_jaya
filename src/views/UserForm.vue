<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Hero from '@/components/Hero.vue'
import { useToast } from "vue-toastification";
const toast = useToast();
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
            toast.success("User updated successfully!", {
                timeout: 3000,
            });
        } else {
            await userStore.addUser(payload)
            toast.success("User added successfully!", {
                timeout: 3000,
            });
        }
        router.push('/')
    } catch (err) {
        console.error(err)
        toast.error("An error occurred while saving data.", {
            timeout: 4000,
        });
    } finally {
        loading.value = false
        showConfirm.value = false
    }

}


</script>

<template>
    <Hero />
    <div class="container mx-auto px-5 lg:px-10 py-10">
        <div class="flex justify-between mb-4">
            <h1 class="text-2xl font-bold"> {{ route.params.id ? 'Edit User' : 'Add User' }}</h1>
            <button @click="$router.push('/')" class="bg-blue-600 text-white px-4 py-2 rounded">Back</button>
        </div>
        <div>


            <form class="max-w-sm mx-auto" @submit.prevent="confirmSubmit">
                <div class="mb-5">
                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900 ">Your
                        Username</label>
                    <input type="username" id="username" v-model="username"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="username" />
                    <span class="text-red-500 text-sm">{{ errors?.username }}</span>
                </div>
                <div class="mb-5">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Your
                        Email</label>
                    <input type="email" id="email" v-model="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="name@flowbite.com" />
                    <span class="text-red-500 text-sm">{{ errors?.email }}</span>
                </div>
                <div class="mb-5">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Your
                        Name</label>
                    <input type="name" id="name" v-model="name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="name@flowbite.com" />
                    <span class="text-red-500 text-sm">{{ errors?.name }}</span>
                </div>
                <div class="mb-5">
                    <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 ">Your
                        Phone</label>
                    <input type="phone" id="phone" v-model="phone"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="Your phone number" />
                    <span class="text-red-500 text-sm">{{ errors?.phone }}</span>
                </div>
                <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 ">Select your
                    city</label>
                <select id="countries" v-model="city"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                    <option v-for="k in cities" :key="k" :value="k">{{ k }}</option>
                </select>

                <button type="submit"
                    class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
            </form>

        </div>
    </div>
    <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg w-96">
            <h2 class="text-lg font-bold mb-4">Confirmation</h2>
            <p>Are you sure you want to save this data?</p>
            <div class="mt-4 flex justify-end gap-2">
                <button @click="showConfirm = false" class="px-4 py-2 bg-gray-300 rounded">
                    Cancel
                </button>
                <button @click="submitData" class="px-4 py-2 bg-blue-600 text-white rounded" :disabled="loading">
                    {{ loading ? 'Saving...' : 'Yes, Save' }}
                </button>
            </div>
        </div>
    </div>

</template>
