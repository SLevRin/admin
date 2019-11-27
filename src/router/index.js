import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    component: () => import('@/views/User/User.vue')
  },
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
