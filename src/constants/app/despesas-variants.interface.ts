export const DespesasVariant: any = {
    "Moradia": [
        "Aluguel",
        "Água",
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
        "Combustível",
        "Locação",
        "Revisão"
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
    "Negócios": [
        "Acessórios",
        "Aluguel",
        "Água",
        "Conservação",
        "Contabilidade",
        "Energia",
        "Equipamentos",
        "Funcionários",
        "Gás",
        "Impostos",
        "Internet",
        "Mercadorias",
        "Refeição",
        "Suprimentos",
        "Terceiros",
        "Transporte"
    ]
}

export type DespesasVariantType = keyof typeof DespesasVariant;