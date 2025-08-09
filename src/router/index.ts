import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/detail/:id",
      name: "Detail User",
      component: () => import("../views/UserDetail.vue"),
    },
    {
      path: "/edit/:id",
      name: "Edit User",
      component: () => import("../views/UserForm.vue"),
    },
    {
      path: "/add",
      name: "Add User",
      component: () => import("../views/UserForm.vue"),
    },
  ],
});

export default router;
