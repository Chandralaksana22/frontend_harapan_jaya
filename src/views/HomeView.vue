<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import Hero from '@/components/Hero.vue'

const userStore = useUserStore()
const router = useRouter()
const currentPage = ref(1)
const perPage = 3
const idUserToDelete = ref<number | null>(null)
const showModal = ref(false)
const q = ref<string>('')
const filteredUsers = ref<any[]>([])
const sortOrder = ref<'asc' | 'desc'>('asc')
const showAlert = ref(false)
onMounted(() => {
  userStore.fetchUsers().then(() => {
    filteredUsers.value = [...userStore.users]
    sortUsers()
  })
})


const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage))

function searchUsers() {
  if (q.value.length < 3) {
    showAlert.value = true
    return
  }
  showAlert.value = false
  filteredUsers.value = userStore.users.filter(u =>
    u.name.toLowerCase().includes(q.value.toLowerCase()) ||
    u.email.toLowerCase().includes(q.value.toLowerCase()) ||
    u.phone.toLowerCase().includes(q.value.toLowerCase())
  )
  sortUsers()
  currentPage.value = 1
}

function resetSearch() {
  q.value = ''
  showAlert.value = false
  filteredUsers.value = userStore.users
  sortUsers()
  currentPage.value = 1
}
function sortUsers() {
  filteredUsers.value.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (sortOrder.value === 'asc') {
      return nameA.localeCompare(nameB)
    } else {
      return nameB.localeCompare(nameA)
    }
  })
}
function openDeleteModal(id: number) {
  idUserToDelete.value = id
  showModal.value = true
}

function closeDeleteModal() {
  idUserToDelete.value = null
  showModal.value = false
}

async function confirmDelete() {
  if (idUserToDelete.value !== null) {
    await userStore.deleteUser(idUserToDelete.value)
    filteredUsers.value = userStore.users
    closeDeleteModal()
  }
}

</script>
<template>
  <Hero />
  <div class="px-5 lg:px-10 pt-10 container mx-auto">
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold">Explore Users</h1>
      <div class="flex gap-2">
        <button @click="router.push('/add')" class="bg-blue-600 text-white px-4 py-2 rounded">Add User</button>
        <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; sortUsers()"
          class="bg-gray-600 text-white px-4 py-2 rounded">
          Sort: {{ sortOrder.toUpperCase() }}
        </button>
      </div>
    </div>
    <form class="flex gap-4 mb-5" @submit.prevent="searchUsers">
      <input type="text" v-model="q" class="px-3 py-2 border border-gray-400 rounded-lg" placeholder="Cari user...">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Cari</button>
      <button type="button" @click="resetSearch" class="bg-gray-500 text-white px-4 py-2 rounded">Reset</button>
    </form>

    <div v-if="showAlert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert">
      <span class="font-medium">Minimal 3 karakter!</span> Coba masukkan kata kunci yang lebih panjang.
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div v-for="u in paginatedUsers" :key="u?.id">
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">

          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ u?.name }}</h5>
          <div class="mb-1 flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
              <path
                d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z">
              </path>
            </svg>
            <p class="font-normal text-gray-700 ">{{ u?.phone }}</p>
          </div>
          <div class="mb-1 flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
              <path
                d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z">
              </path>
            </svg>
            <p class="font-normal text-gray-700">{{ u?.email }}</p>
          </div>
          <div class="mb-1 flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
              <path
                d="M112,80a16,16,0,1,1,16,16A16,16,0,0,1,112,80ZM64,80a64,64,0,0,1,128,0c0,59.95-57.58,93.54-60,94.95a8,8,0,0,1-7.94,0C121.58,173.54,64,140,64,80Zm16,0c0,42.2,35.84,70.21,48,78.5,12.15-8.28,48-36.3,48-78.5a48,48,0,0,0-96,0Zm122.77,67.63a8,8,0,0,0-5.54,15C213.74,168.74,224,176.92,224,184c0,13.36-36.52,32-96,32s-96-18.64-96-32c0-7.08,10.26-15.26,26.77-21.36a8,8,0,0,0-5.54-15C29.22,156.49,16,169.41,16,184c0,31.18,57.71,48,112,48s112-16.82,112-48C240,169.41,226.78,156.49,202.77,147.63Z">
              </path>
            </svg>
            <p class="font-normal text-gray-700 ">{{ u?.address.city }}</p>
          </div>
          <div class="flex flex-wrap gap-2 mt-4">
            <button @click="router.push(`/detail/${u?.id}`)"
              class="w-fit inline-flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white focus:outline-none bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg me-2 mb-2 ">
              View Detail
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f7f7f7" viewBox="0 0 256 256">
                <path
                  d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z">
                </path>
              </svg>
            </button>
            <button @click="router.push(`/edit/${u?.id}`)"
              class="w-fit inline-flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white focus:outline-none bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg me-2 mb-2 ">
              Edit
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f7f7f7" viewBox="0 0 256 256">
                <path
                  d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM136,75.31,152.69,92,68,176.69,51.31,160ZM48,208V179.31L76.69,208Zm48-3.31L79.32,188,164,103.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z">
                </path>
              </svg>
            </button>
            <button @click="openDeleteModal(u?.id)"
              class="w-fit inline-flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white focus:outline-none bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg me-2 mb-2 ">
              Delete
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f7f7f7" viewBox="0 0 256 256">
                <path
                  d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z">
                </path>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
    <div class="flex justify-center mt-4 gap-2 mb-10">
      <button v-for="n in totalPages" :key="n" @click="currentPage = n"
        :class="['px-3 py-1 border rounded', currentPage === n ? 'bg-blue-500 text-white' : '']">
        {{ n }}
      </button>
    </div>
  </div>
  <div v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow-sm ">
        <button @click="closeDeleteModal" type="button"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
          aria-label="Close modal">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
          </svg>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 " fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 ">Are you sure you want to delete this
            user?</h3>
          <button @click="confirmDelete" type="button"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
            Yes, I'm sure
          </button>
          <button @click="closeDeleteModal" type="button"
            class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 ">
            No, cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
