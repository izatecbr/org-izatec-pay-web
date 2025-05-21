import AdminLayoutVue from '@/layouts/admin.vue';
import Utils from '@/utils';
import { createRouter, createWebHistory, type RouteMeta } from 'vue-router';
import { TOKEN_STORAGE_KEY } from '../constants/storage/token';

interface IRouteMeta {
  title: string;
  requiresAuth?: boolean;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/pagamentos',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Login',
      } as RouteMeta & IRouteMeta,
    },
    {
      path: '/admin',
      component: AdminLayoutVue,
      redirect: '/admin/pagamentos',
      meta: {
        title: 'Admin',
        requiresAuth: true,
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/dashboard/examples/Home.vue'),
          meta: {
            title: 'Home',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'pagamentos',
          name: 'pagamentos',
          component: () => import('@/views/pagamentos/Index.vue'),
          meta: {
            title: 'Pagamentos',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'obrigacoes',
          name: 'obrigacoes',
          component: () => import('@/views/gerencial/obrigacoes/Index.vue'),
          meta: {
            title: 'Obrigacoes',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'recebiveis',
          name: 'recebiveis',
          component: () => import('@/views/gerencial/recebiveis/Index.vue'),
          meta: {
            title: 'Recebiveis',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'despesas',
          name: 'despesas',
          component: () => import('@/views/despesas/Index.vue'),
          meta: {
            title: 'Despesas',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'previsoes',
          name: 'previsoes',
          component: () => import('@/views/previsoes/Index.vue'),
          meta: {
            title: 'Previsões',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'cadastros',
          name: 'cadastros',
          component: () => import('@/views/cadastros/Index.vue'),
          meta: {
            title: 'Cadastros',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'cobrancas',
          name: 'cobrancas',
          component: () => import('@/views/cobrancas/Index.vue'),
          meta: {
            title: 'Cobranças',
            requiresCompensacaoManual: true,
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'notificacoes',
          name: 'notificacoes',
          component: () => import('@/views/notificacoes/Index.vue'),
          meta: {
            title: 'Notificações',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'task',
          name: 'tasks_index',
          component: () => import('@/views/dashboard/examples/tasks/Index.vue'),
          meta: {
            title: 'Tasks',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'user',
          name: 'user_index',
          component: () => import('@/views/dashboard/examples/user/Index.vue'),
          meta: {
            title: 'User',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'settings',
          name: 'settings_index',
          component: () => import('@/views/dashboard/examples/settings/Index.vue'),
          meta: {
            title: 'Settings',
            requiresAuth: true,
          } as RouteMeta & IRouteMeta,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('@/views/404.vue'),
      meta: {
        title: 'Page Not Found',
      } as RouteMeta & IRouteMeta,
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string;

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ name: 'login' });
    }

    const decodedToken = Utils.jwtToObject(token);
    if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return next({ name: 'login' });
    }
  }

  if (to.meta.requiresCompensacaoManual) {
    const cobrancaAllowed = Utils.jwtToObject(localStorage.getItem(TOKEN_STORAGE_KEY))?.compensacaoManual

    if (cobrancaAllowed) {
      return next({ name: 'pagamentos' })
    }
  }

  next();
});

export default router;
