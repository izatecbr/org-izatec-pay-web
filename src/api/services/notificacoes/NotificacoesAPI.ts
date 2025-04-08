import type { AxiosInstance } from "axios"

const BASE_URL = '/notificacoes/pagamentos'

export default class NotificacoesAPI {

    private http: AxiosInstance
    constructor(http: AxiosInstance) {
        this.http = http
    }

    notificarEmail(id: number): Promise<any> {
        return this.http.get(`${BASE_URL}/${id}/email`)
    }

    notificarWhatsapp(id: number): Promise<any> {
        return this.http.get(`${BASE_URL}/${id}/whats`)
    }

}