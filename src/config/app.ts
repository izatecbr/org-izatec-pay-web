import { TOKEN_STORAGE_KEY } from "../constants/storage/token"
import Utils from "../utils"

interface IDashboardMenus {
  title: string
  icon: string
  path: string
  description?: string
  hidden?: boolean
}

const cobrancaAllowed = Utils.jwtToObject(localStorage.getItem(TOKEN_STORAGE_KEY))?.compensacaoManual

export const SIDEBAR_EXPAND_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const APP_MENU: Record<string, { name: string, routes: IDashboardMenus[] }> = {
  main: {
    name: 'Operacional',
    routes: [
      {
        title: 'Pagamentos',
        icon: 'Receipt',
        path: 'pagamentos',
      },
      ...(cobrancaAllowed ? [] : [
        {
          title: 'Cobranças',
          icon: 'CalendarClock',
          path: 'cobrancas',
        }
      ]),
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
  gerencial: {
    name: 'Gerencial',
    routes: [
      {
        title: 'Recebiveis',
        icon: 'ChartSpline',
        path: 'recebiveis',
      },
      {
        title: 'Obrigações',
        icon: 'Calendar',
        path: 'obrigacoes',
      },
    ],
  },
};


export const globalSearch = {

};
