import { createRouter, createWebHistory } from 'vue-router'
import Workspace from '../views/Workspace.vue'
import History from '../views/History.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'workspace',
      component: Workspace
    },
    {
      path: '/history',
      name: 'history',
      component: History
    }
  ]
})

export default router
