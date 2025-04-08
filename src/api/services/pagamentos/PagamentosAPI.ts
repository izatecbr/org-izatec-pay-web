import type { AxiosInstance } from "axios"

const BASE_URL = '/pagamentos'

export default class PagamentosAPI {
    private http: AxiosInstance
    constructor(http: AxiosInstance) {
        this.http = http
    }

    listagem(params: any): Promise<any> {
        return this.http.get(`${BASE_URL}`, {
            params: params
        })
    }

    qrcode(codigo: any): Promise<any> {
        return this.http.get(`${BASE_URL}/${codigo}/imagem/qrcode`, { responseType: 'arraybuffer' })
    }

    inserir(payload: any): Promise<any> {
        return this.http.post(`${BASE_URL}`, payload)
    }
}