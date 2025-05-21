import type { AxiosInstance } from "axios"
import type { CepResponse } from "./index.interface"

const BASE_URL = '/publico'

export default class PublicAPI {

    private http: AxiosInstance

    constructor(http: AxiosInstance) {
        this.http = http
    }

    buscarCeps(cep: string | null): Promise<CepResponse> {
        return this.http.get(`${BASE_URL}/ceps/${cep}`)
    }

}
