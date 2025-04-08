export interface JwtReponse {
    jti?: string
    sub?: string
    iat?: number
    exp?: number
    codigoIntegracao?: string
    cpfCnpj?: string
    empresa?: number
    authorities?: string[]
}
