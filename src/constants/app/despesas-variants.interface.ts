export const DespesasVariant: any = {
    "Moradia": [
        "Aluguel",
        "Água Encanada",
        "Água Mineral",
        "Condomínio",
        "Conservação",
        "Energia",
        "Gás",
        "Internet",
        "Segurança"
    ],
    "Supermercado": [
        "Alimentação",
        "Bebidas",
        "Higiene",
        "Limpeza"
    ],
    "Transporte": [
        "Aquisição",
        "Locação",
        "Combustível",
        "Revisão",
        "Infrações"
    ],
    "Lazer": [
        "Entretenimento",
        "Passeios",
        "Restaurante",
        "Viagens"
    ],
    "Investimento": [
        "Educação",
        "Imóveis",
        "Saúde",
        "Transporte",
        "Vestuário"
    ],
    "Saúde": [
        "Academia",
        "Personal",
        "Alimentação",
        "Suplementação",
        "Nutrição"
    ],
    "Negócios": [
        "Acessórios",
        "Aluguel",
        "Água Encanada",
        "Água Mineral",
        "Cortesia",
        "Conservação",
        "Contabilidade",
        "Energia",
        "Equipamentos",
        "Funcionários",
        "Gás",
        "Impostos",
        "Internet",
        "Infraestrutura",
        "Mercadorias",
        "Publicidade",
        "Refeição",
        "Repasse",
        "Serviços",
        "Suprimentos",
        "Telefonia",
        "Terceiros",
        "Transporte"
    ]
}

export type DespesasVariantType = keyof typeof DespesasVariant;