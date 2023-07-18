// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import( '@/views/Home.vue'),
      },
      {
        path: 'norme',
        name: 'Norme',
        component: () => import( '@/views/NormeHse.vue'),
      },
      {
        path: 'text',
        name: 'Texts',
        component: () => import( '@/views/TextHse.vue'),
      },
      {
        path: 'text/:id',
        name: 'textOne',
        component: () => import( '@/views/TextView.vue'),
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import( '@/views/ArticleHse.vue'),
      },
      {
        path: 'bulletin',
        name: 'Bulletin',
        component: () => import( '@/views/BulletinHse.vue'),
      },
      {
        path: 'valref',
        name: 'Valref',
        component: () => import( '@/views/ValeursReferentielles.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
