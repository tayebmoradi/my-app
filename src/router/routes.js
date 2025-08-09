const routes = [
  {
    path: '/',
    redirect: '/login'  // ریدایرکت پیش‌فرض به لاگین
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true } }
    ]
  },

    {
    path: '/logs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('pages/LogsPage.vue'), meta: { requiresAuth: true } }
    ]
  },
]

export default routes
