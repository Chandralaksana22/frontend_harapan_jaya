import "./assets/main.css";
import { createApp, onMounted } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { initFlowbite } from "flowbite";
import "flowbite";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

onMounted(() => {
  initFlowbite();
});
const app = createApp(App);

app.use(Toast);

app.use(createPinia());
app.use(router);

app.mount("#app");
