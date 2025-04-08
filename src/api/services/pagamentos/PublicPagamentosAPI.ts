import type { AxiosInstance } from "axios"

const BASE_URL = '/publico/pagamentos'

export default class PublicPagamentosAPI {
    private http: AxiosInstance

    constructor(http: AxiosInstance) {
        this.http = http
    }

    qrcode(codigo: any): Promise<any> {
        return this.http.get(`${BASE_URL}/${codigo}/qrcode`, { responseType: 'arraybuffer' })
    }

    conteudo(id: number): Promise<any> {
        return this.http.get(`${BASE_URL}/${id}/conteudo`)
    }
}