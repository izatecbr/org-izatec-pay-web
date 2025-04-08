import type { AxiosInstance } from "axios"
import type { AppResponse } from "../../../types"
import type { CadastroRequest, CadastroResponse } from "./index.interface"

const BASE_URL = '/cadastros'

export default class CadastroAPI {

    private http: AxiosInstance

    constructor(http: AxiosInstance) {
        this.http = http
    }

    listagem(params: any): Promise<any> {
        return this.http.get(`${BASE_URL}`, {
            params: params
        })
    }

    listagemNome(nome: any): Promise<AppResponse<CadastroResponse[]>> {
        return this.http.get(`${BASE_URL}?filtro=${nome}`)
    }

    listagemCpfCnpj(cpfCpnj: string): Promise<AppResponse<CadastroResponse[]>> {
        return this.http.get(`${BASE_URL}/documento/${cpfCpnj}`)
    }

    salvar(payload: CadastroRequest, id: number | null | undefined = null): Promise<AppResponse<any>> {
        return id ? this.atualizar(payload, id) : this.inserir(payload)
    }

    inserir(payload: CadastroRequest): Promise<AppResponse<Number | null>> {
        return this.http.post(`${BASE_URL}`, payload)
    }

    atualizar(payload: CadastroRequest, id: number): Promise<AppResponse<Number | null>> {
        return this.http.put(`${BASE_URL}/${id}`, payload)
    }


}