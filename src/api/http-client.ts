import axios from "axios"
import { TOKEN_STORAGE_KEY } from "../constants/storage/token"
import AcessoAPI from "./services/acesso/AcessoAPI"
import CadastroAPI from "./services/cadastros/CadastroAPI"
import CobrancaAPI from "./services/cobrancas/CobrancaAPI"
import DespesasAPI from "./services/despesas/DespesaAPI"
import NotificacoesAPI from "./services/notificacoes/NotificacoesAPI"
import PagamentosAPI from "./services/pagamentos/PagamentosAPI"
import PublicPagamentosAPI from "./services/pagamentos/PublicPagamentosAPI"
import PrevisoesAPI from "./services/previsoes/PrevisoesAPI"
import PublicAPI from "./services/public/PublicAPI"

export interface IServices {
    previsoes: PrevisoesAPI,
    acesso: AcessoAPI
    cobrancas: CobrancaAPI
    pagamentos: PagamentosAPI,
    publicPagamentos: PublicPagamentosAPI,
    cadastros: CadastroAPI,
    notificacoes: NotificacoesAPI,
    despesas: DespesasAPI,
    publico: PublicAPI
}

export const useHttpClient = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL

    const api = axios.create({
        baseURL: API_BASE_URL,
    })

    api.interceptors.request.use(
        async (req) => {

            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            const isNotPublicRoute = !req.url?.includes('acesso');

            if (isNotPublicRoute) {
                req.headers['Authorization'] = token;
            }

            req.headers["Content-type"] = "application/json"

            return req
        },
        (err) => Promise.reject(err)
    )

    api.interceptors.response.use(
        (res: any): any => {
            if (res.status === 403) {
                localStorage.removeItem(TOKEN_STORAGE_KEY)
                window.location.href = '/login'
            }
            const { data } = res
            return { success: true, status: data.status, body: data.body }
        },
        (err) => {
            if (err.response.status === 403) {
                localStorage.removeItem(TOKEN_STORAGE_KEY)
                window.location.href = '/login'
            }
            const { data } = err.response
            return { success: false, status: data.status, body: data.body }
        }
    )

    return api
}

export const useAPI = () => {
    const api = useHttpClient()

    const services: IServices = {
        previsoes: new PrevisoesAPI(api),
        acesso: new AcessoAPI(api),
        cobrancas: new CobrancaAPI(api),
        pagamentos: new PagamentosAPI(api),
        publicPagamentos: new PublicPagamentosAPI(api),
        cadastros: new CadastroAPI(api),
        notificacoes: new NotificacoesAPI(api),
        despesas: new DespesasAPI(api),
        publico: new PublicAPI(api)
    }

    return services
}
