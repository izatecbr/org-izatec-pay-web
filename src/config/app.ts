interface IDashboardMenus {
  title: string
  icon: string
  path: string
  description?: string
  hidden?: boolean
}

export const SIDEBAR_EXPAND_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const APP_MENU: Record<string, { name: string, routes: IDashboardMenus[] }> = {
  /* home: {
    name: 'Consulta',
    routes: [
      {
        title: 'Dashboard',
        icon: 'Home',
        path: 'home',
      },
    ],
  }, */
  main: {
    name: 'Operacional',
    routes: [
      {
        title: 'Pagamentos',
        icon: 'Receipt',
        path: 'pagamentos',
      },
      {
        title: 'Cobranças',
        icon: 'CalendarClock',
        path: 'cobrancas',
      },
      {
        path: 'despesas',
        title: 'Despesas',
        icon: 'BanknoteArrowDown',
        description: 'Despesas'
      },
      {
        path: 'previsoes',
        title: 'Previsões',
        icon: 'Calendar',
        description: 'Previsões'
      },
      {
        path: 'notificacoes',
        title: 'Notificações',
        icon: 'Bell',
        description: 'Notificações'
      },
      {
        path: 'cadastros',
        title: 'Cadastros',
        icon: 'Users',
        description: 'Cadastros'
      },

    ],
  },
  /*settings: {
    name: 'Gerencial',
    routes: [
      {
        title: 'Consultas',
        icon: 'Search',
        path: 'home',
      },
    ],
  }, */
};

export const globalSearch = {

};
