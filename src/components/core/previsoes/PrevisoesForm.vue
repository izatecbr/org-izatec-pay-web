<script lang="ts" setup>
import { useAPI } from '@/api/http-client';
import AppCombobox from '@/components/common/app-combobox/AppCombobox.vue';
import { InputMoney } from '@/components/common/input-money';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DespesasVariant, type DespesasVariantType } from '@/constants/app/despesas-variants.interface';
import { PagamentoModelo } from '@/constants/app/pagamento-modelo.interface';
import { RecorrenciaPagamento } from '@/constants/app/recorrencia-pagamento.interface';
import Utils from '@/utils/index';
import { debounce } from 'lodash-es';
import { computed, ref, watchEffect } from 'vue';

const { cadastros } = useAPI()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            "codigoExterno": "",
            "valor": 0,
            "titulo": "",
            "descricao": "",
            "favorecido": {
                "documento": "",
                "nomeCompleto": "",
                "email": "",
                "whatsapp": ""
            },
            "negociacao": {
                "proximoVencimento": "",
                "proximaParcela": 0,
                "quantidadeParcelas": 0,
                "modelo": PagamentoModelo.RECORRENTE.value,
                "recorrencia": "MENSAL"
            },
            "aplicacao": {
                "grupo": "",
                "categoria": ""
            }
        })
    },
    loading: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:modelValue', 'onSubmit']);

const form = ref(Utils.clone(props.modelValue || {
    "codigoExterno": "",
    "valor": null,
    "titulo": "",
    "descricao": "",
    "favorecido": {
        "documento": "",
        "nomeCompleto": "",
        "email": "",
        "whatsapp": ""
    },
    "negociacao": {
        "proximoVencimento": Utils.formatDateISO(new Date()),
        "proximaParcela": 0,
        "quantidadeParcelas": 0,
        "modelo": PagamentoModelo.RECORRENTE.value,
        "recorrencia": "MENSAL"
    },
    "aplicacao": {
        "grupo": "",
        "categoria": ""
    }
}));

const modelos = Object.values(PagamentoModelo) as { value: string, label: string }[]
const recorrencias = Object.values(RecorrenciaPagamento) as { value: string, label: string }[]
const grupos = Object.keys(DespesasVariant) as DespesasVariantType[];

const buscaSacadoLoading = ref(false)
const sacado = ref<any>(undefined)
const inputSelect = ref<any>(undefined)
const sacadoOptions = ref([])
const cadastrosList = ref<any[]>([])

const categorias = computed<any>(() => {
    return form.value.aplicacao.grupo ? DespesasVariant[form.value.aplicacao.grupo] : [];
});
const categoriasAppCombobox = computed<any>(() => {
    return categorias.value.map((item: string) => {
        return {
            value: item,
            label: item
        }
    }) ?? [];
});
const isRecorrente = computed(() => form.value.negociacao.modelo === PagamentoModelo.RECORRENTE.value)

watchEffect(() => {
    if (form.value.negociacao?.modelo == PagamentoModelo.RECORRENTE.value) {
        form.value.negociacao.quantidadeParcelas = 0
    }

    if (inputSelect.value) {
        buscarCadastroFiltro(sacado.value)
    }

    if (sacado?.value) {
        const cadastroSelecionado = cadastrosList.value.find((item: any) => item.id == sacado?.value)

        form.value.favorecido.id = cadastroSelecionado?.id ?? null
        form.value.favorecido.nomeCompleto = cadastroSelecionado?.nomeCompleto ?? ''
        form.value.favorecido.whatsapp = cadastroSelecionado?.whatsapp ?? ''
        form.value.favorecido.documento = cadastroSelecionado?.documento ?? ''
        form.value.favorecido.email = cadastroSelecionado?.email ?? ''

    }


})

const buscarCadastroFiltro = debounce(async (value: string) => {
    buscaSacadoLoading.value = true;
    const { body } = await cadastros.listagemNome(value);
    buscaSacadoLoading.value = false;

    if (body) {
        cadastrosList.value = body ?? [];
        sacadoOptions.value = body.map((item: any) => {
            return {
                value: item.id,
                label: `${item.nomeCompleto}${item?.documento ? ` - ${item?.documento}` : ''}`,
            };
        }) ?? [];
    }
}, 500);

function onSearchInput(event: InputEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    sacado.value = inputValue;
    buscarCadastroFiltro(inputValue);
}

const categoriasFiltradas = ref<any[]>([]);

function onSearchCategoria(event: InputEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    categoriasFiltradas.value = categorias.value.filter((categoria: string) =>
        categoria.toLowerCase().includes(inputValue.toLowerCase())
    );
}


const submitForm = async () => {

    if (form.value?.favorecido?.documento) {
        const pureDocumento = Utils.removeCharacters(form.value.favorecido.documento)
        form.value.favorecido.documento = pureDocumento
    }

    if (form.value?.favorecido?.whatsapp) {
        const pureWhatsApp = Utils.removeCharacters(form.value.favorecido.whatsapp)
        form.value.favorecido.whatsapp = Number(pureWhatsApp) || null
    }

    if (!form.value?.favorecido?.documento && form.value?.favorecido?.nomeCompleto) {
        form.value.favorecido.documento = null
    }

    if (form.value?.valor) {
        const pureValor = Utils.moneyMaskToNumber(form.value.valor)
        form.value.valor = pureValor
    }
    emit('update:modelValue', form.value);
    emit('onSubmit', Utils.clone(form.value));
};

const canSubmit = computed(() => {
    const emptyValues = [null, undefined, "", 0,]
    return !emptyValues.includes(form.value.favorecido.id) && !emptyValues.includes(form.value.valor) &&
        !emptyValues.includes(form.value.titulo) && !emptyValues.includes(form.value.negociacao.proximoVencimento)
        && !emptyValues.includes(form.value.aplicacao.grupo)
        && !emptyValues.includes(form.value.aplicacao.categoria) && !emptyValues.includes(form.value.negociacao.modelo)
        && !emptyValues.includes(form.value.negociacao.recorrencia)
})

</script>

<template>
    <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-3">

        <Transition name="fade" mode="default">
            <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">

                <span class="col-span-12 text-xs text-muted-foreground">Favorecido</span>

                <div class="col-span-12">
                    <AppCombobox class="w-full" button-class="w-full" popover-class="w-[37.4dvw]"
                        placeholder="Selecionar favorecido" :loading="buscaSacadoLoading"
                        placeholder-input="Busque por nome ou documento." :options="sacadoOptions" :input="inputSelect"
                        v-model="sacado" @update:input="onSearchInput" />
                </div>

            </Card>
        </Transition>

        <Card class="col-span-12 grid grid-cols-12 gap-1 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Detalhe</span>

            <div class="col-span-8">
                <Input v-model="form.titulo" label="Descrição" placeholder="Descrição" />
            </div>

            <div class="col-span-4">
                <InputMoney v-model="form.valor" label="Valor" placeholder="Valor" />
            </div>

            <div class="col-span-6">
                <label class="text-sm text-muted-foreground">Grupo</label>
                <Select v-model="form.aplicacao.grupo">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="grupo in grupos" :key="grupo" :value="grupo as any">
                            {{ grupo }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="col-span-6">
                <label class="text-sm text-muted-foreground">Categoria</label>
                <AppCombobox class="w-full" button-class="w-full" popover-class="w-[17.4dvw]"
                    placeholder="Selecione uma categoria" placeholder-input="Digite para buscar..."
                    :options="categoriasAppCombobox" v-model="form.aplicacao.categoria" @update:input="onSearchCategoria"
                    :disabled="!form.aplicacao.grupo" />
            </div>

        </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-1 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Negociação</span>

            <div class="col-span-6">
                <label class="text-sm text-muted-foreground">Modelo</label>
                <Select v-model="form.negociacao.modelo">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="modelo in modelos" :key="modelo.value" :value="modelo.value">
                            {{ modelo.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>


            <div class="col-span-6">
                <label class="text-sm text-muted-foreground">Recorrência</label>
                <Select v-model="form.negociacao.recorrencia">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma recorrência" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="recorrencia in recorrencias" :key="recorrencia.value"
                            :value="recorrencia.value">
                            {{ recorrencia.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div :class="'col-span-6'">
                <label class="text-sm text-muted-foreground">Prox. Vencto.</label>
                <Input v-model="form.negociacao.proximoVencimento" type="date" placeholder="Data Venct" />
            </div>


            <div :class="'col-span-6'">
                <label class="text-sm text-muted-foreground">Qtd. Parcelas</label>
                <Input v-model="form.negociacao.quantidadeParcelas" :min="0" :disabled="isRecorrente"
                    :max="isRecorrente ? 0 : undefined" type="number" placeholder="ex: 12" />
            </div>

        </Card>


        <div class="col-span-12">
            <Button :disabled="!canSubmit" class="w-full" type="submit" :loading="loading || buscaSacadoLoading">
                Confirmar
            </Button>
        </div>
    </form>
</template>