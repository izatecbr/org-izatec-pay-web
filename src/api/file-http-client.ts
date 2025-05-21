import axios from "axios"
import { TOKEN_STORAGE_KEY } from "../constants/storage/token"
import AnexosAPI from "./services/anexos/AnexosAPI"
import PagamentosAPI from "./services/pagamentos/PagamentosAPI"
import PublicPagamentosAPI from "./services/pagamentos/PublicPagamentosAPI"
import PublicAPI from "./services/public/PublicAPI"

export interface IServices {
    pagamentos: PagamentosAPI,
    publicPagamentos: PublicPagamentosAPI,
    publico: PublicAPI,
    anexos: AnexosAPI
}

export const useFilesHttpClient = () => {
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
            //req.headers["Content-type"] = "application/json"

            return req
        },
        (err) => Promise.reject(err)
    )

    return api
}

export const useFilesAPI = () => {
    const api = useFilesHttpClient()

    const services: IServices = {
        pagamentos: new PagamentosAPI(api),
        publicPagamentos: new PublicPagamentosAPI(api),
        publico: new PublicAPI(api),
        anexos: new AnexosAPI(api)
    }

    return services
}
