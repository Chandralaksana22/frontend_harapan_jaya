import { defineStore } from "pinia";
import api from "../services/api";

export interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  email: string;
  address: {
    city: string;
    street: string;
  };
}

interface State {
  users: User[];
}

export const useUserStore = defineStore("user", {
  state: (): State => ({
    users: [],
  }),
  actions: {
    async fetchUsers() {
      const res = await api.get<User[]>("/users");
      const apiData = res.data;

      const localOnly = this.users.filter(
        (local) => !apiData.some((api) => api.id === local.id)
      );

      this.users = [...apiData, ...localOnly];
    },

    async addUser(user: Partial<User>) {
      await api.post("/users", user);

      const maxId = this.users.reduce((max, u) => (u.id > max ? u.id : max), 0);
      const newUser: User = {
        id: maxId + 1,
        name: user.name || "",
        username: user.username || "",
        phone: user.phone || "",
        email: user.email || "",
        address: {
          city: user.address?.city || "",
          street: user.address?.street || "",
        },
      };

      this.users.push(newUser);
      return newUser;
    },

    async updateUser(id: number, user: Partial<User>) {
      const idx = this.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;

      const isFromAPI = id <= 10;
      if (isFromAPI) {
        const res = await api.put(`/users/${id}`, user);
        this.users[idx] = res.data;
        return res.data;
      } else {
        this.users[idx] = { ...this.users[idx], ...user };
        return this.users[idx];
      }
    },

    async deleteUser(id: number) {
      await api.delete(`/users/${id}`);
      this.users = this.users.filter((u) => u.id !== id);
    },
  },
});
