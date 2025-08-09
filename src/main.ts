import "./assets/main.css";
import { createApp, onMounted } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { initFlowbite } from "flowbite";
import "flowbite";
onMounted(() => {
  initFlowbite();
});
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
