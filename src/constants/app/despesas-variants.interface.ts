export const DespesasVariant: any = {
    'Moradia': [
        'Aluguel',
        'Condomínio',
        'Conservação de Gás',
        'Energia',
        'Água',
        'Internet',
        'Segurança'
    ],
    'Supermercado': [
        'Alimentação',
        'Limpeza',
        'Higiene',
        'Bebidas'
    ],
    'Transporte': [
        'Locação',
        'Combustível',
        'Revisão'
    ],
    'Lazer': [
        'Restaurante',
        'Viagens',
        'Passeios'
    ],
    'Investimento': [
        'Imóveis',
        'Saúde',
        'Educação',
        'Vestuário',
        'Transporte',
        'Lazer'
    ],
    'Negóscios': [
        'Aluguel',
        'Condomínio',
        'Conservação de Gás',
        'Energia',
        'Água',
        'Internet',
        'Equipamentos',
        'Suprimentos',
        'Contabilidade',
        'Funcionários',
        'Terceiros',
        'Transporte',
        'Refeição'
    ]
}


export type DespesasVariantType = keyof typeof DespesasVariant;