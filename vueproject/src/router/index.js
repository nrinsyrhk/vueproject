import { createRouter, createWebHistory } from 'vue-router'
import Form from '../pages/Form.vue'
import Display from '../pages/Display.vue'

const routes = [
  {
    path: '/',
    name: 'Form',
    component: Form
  },
  {
    path: '/display',
    name: 'Display',
    component: Display
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
