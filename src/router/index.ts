import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Layout from '../layout/index.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/view',
      name: 'view',
      component: () => import('../views/OnlineView.vue')
    },
    {
      path: '/link',
      name: 'link',
      component: () => import('../views/LinkView.vue')
    },
    {
      path: '/',
      name: 'homes',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: HomeView
        },
        {
          path: '/share',
          name: 'share',
          component: () => import('../views/ShareView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/LoginView.vue')
    }
  ]
})

export default router
