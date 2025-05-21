import type { AxiosInstance } from "axios";

const BASE_URL = '/anexos'

export default class AnexosAPI {

    private http: AxiosInstance

    constructor(http: AxiosInstance) {
        this.http = http
    }

    upload(file: any, origemId: number, origemLocal: string): Promise<any> {

        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${BASE_URL}/upload`, formData, {
            params: {
                origemId,
                origemLocal
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },

        });
    }

    download(id: number): Promise<any> {
        return this.http.get(`${BASE_URL}/${id}/download`, { responseType: 'blob' })
    }

    excluir(id: number): Promise<any> {
        return this.http.delete(`${BASE_URL}/${id}/excluir`)
    }

    list(origemId: number, origemLocal: string) {
        return this.http.get(`${BASE_URL}/list`, {
            params: {
                origemId,
                origemLocal
            },
        })
    }



}