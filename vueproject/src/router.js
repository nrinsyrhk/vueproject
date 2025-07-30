import { createRouter, createWebHistory } from 'vue-router'
import form from './components/form.vue'
import display from './components/display.vue'

const routes = [
  { path: '/form', name: 'form', component: form },
  { path: '/display', name: 'display', component: display }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
