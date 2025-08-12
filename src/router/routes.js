const routes = [
  {
    path: '/',
    redirect: '/login', // ریدایرکت پیش‌فرض به لاگین
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'logs',
        component: () => import('pages/LogsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'products',
        component: () => import('pages/ProductsPage.vue'),
        meta: { requiresAuth: true },

      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true },

      },
    ],
  },
]

export default routes
