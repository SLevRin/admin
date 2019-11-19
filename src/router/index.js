import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/message',
    component: () => import('@/views/Message/Message.vue')
  },
  {
    path: '/feedback',
    component: () => import('@/views/Feedback/Feedback.vue')
  },
  {
    path: '/*',
    redirect: '/message'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
