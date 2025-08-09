# Vue 3 User Management App with Vite

This template helps you get started developing a simple Vue 3 application with TypeScript and Axios, consuming the [jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users) API as the main data source.

---

## Features

This app implements the following features using the jsonplaceholder API:

1. **List Users**  
   - Endpoint: `GET https://jsonplaceholder.typicode.com/users`  
   - Display user data (name, phone, email, city) in a cards  
   - Show 3 users per page with pagination  
   - Store fetched users in local state using Vuex or Pinia  

2. **View User Details**  
   - Endpoint: `GET https://jsonplaceholder.typicode.com/users/{id}`  
   - Clicking a user shows detailed info (name, phone, email, city) in a new page  

3. **Add User**  
   - Endpoint: `POST https://jsonplaceholder.typicode.com/users`  
   - Form fields: username, name, phone, email, city (dropdown)  
   - Validation using Yup + vee-validate
   - Confirmation modal before submitting  
   - Show toast notifications for API responses  
   - Save new user to local state  
   - Redirect to user list after successful submission  

4. **Edit User**  
   - Endpoint: `PUT https://jsonplaceholder.typicode.com/users/{id}`  
   - Edit button opens form populated with existing user data  

5. **Delete User**  
   - Endpoint: `DELETE https://jsonplaceholder.typicode.com/users/{id}`  
   - Delete button triggers confirmation modal  
   - On confirm, user data is deleted and user list refreshed  

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).

---

## Type Support for `.vue` Imports in TypeScript

TypeScript does not handle type information for `.vue` files by default. We replace the `tsc` CLI with `vue-tsc` for type checking. Use [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension for enhanced TypeScript support in Vue files.

---

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).

---

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
