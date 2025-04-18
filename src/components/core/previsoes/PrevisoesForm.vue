<script lang="ts" setup>
import { useAPI } from '@/api/http-client';
import { InputMoney } from '@/components/common/input-money';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DespesasVariant, type DespesasVariantType } from '@/constants/app/despesas-variants.interface';
import { PagamentoModelo } from '@/constants/app/pagamento-modelo.interface';
import { RecorrenciaPagamento } from '@/constants/app/recorrencia-pagamento.interface';
import { MaskaPattern } from '@/constants/ui/input-patterns.interface';
import Utils from '@/utils/index';
import { addDays } from 'date-fns';
import { debounce } from 'lodash-es';
import { computed, defineProps, ref, watchEffect } from 'vue';

const { cadastros } = useAPI()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            "codigoExteno": "",
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
                "modelo": "UNICO",
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
    "codigoExteno": "",
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
        "proximoVencimento": Utils.formatDateISO(addDays(new Date(), 30)),
        "proximaParcela": 0,
        "quantidadeParcelas": 0,
        "modelo": "UNICO",
        "recorrencia": "MENSAL"
    },
    "aplicacao": {
        "grupo": "",
        "categoria": ""
    }
}));

const modelos = Object.values(PagamentoModelo) as {value: string, label: string}[]
const recorrencias = Object.values(RecorrenciaPagamento) as {value: string, label: string}[]
const grupos = Object.keys(DespesasVariant) as DespesasVariantType[];

const categorias = computed<any>(() => {
    return form.value.aplicacao.grupo ? DespesasVariant[form.value.aplicacao.grupo] : [];
});
const isRecorrente = computed(() => form.value.negociacao.modelo === PagamentoModelo.RECORRENTE.value)

watchEffect(() => {
    if (form.value.negociacao?.modelo == PagamentoModelo.RECORRENTE.value) {
        form.value.negociacao.quantidadeParcelas = 1
    }

    if (form.value.favorecido.documento) {
        buscarCadastroPorCPF(form.value.favorecido.documento)
    }
})

const buscarCadastroPorCPF = debounce(async (value: string) => {
    const { body, success, status } = await cadastros.listagemCpfCnpj(Utils.removeCharacters(value) || '')

    if(success && body){
        form.value.favorecido.nomeCompleto = body.nomeCompleto
        form.value.favorecido.whatsapp = `${body.whatsapp}`
        form.value.favorecido.email = body.email
    }
}, 500)

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

</script>

<template>
    <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-3">
        <div class="col-span-12 sm:col-span-8">
            <Input v-model="form.titulo" label="Descrição" placeholder="Descrição" />
        </div>

        <div class="col-span-12 sm:col-span-4">
            <InputMoney v-model="form.valor" label="Valor" placeholder="Valor" />
        </div>

        <Transition name="fade" mode="default">
            <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">

                <span class="col-span-12 text-xs text-muted-foreground">Favorecido</span>

                <div class="col-span-12 sm:col-span-6">
                    <Input v-model="form.favorecido.documento" label="Documento"
                        placeholder="CPF\CNPJ\RG" />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <Input v-model="form.favorecido.nomeCompleto" label="Nome Completo" placeholder="Nome Completo" />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <Input v-model="form.favorecido.email" type="email" label="Email" placeholder="Email" />
                </div>

                <div class="col-span-12 sm:col-span-6">
                    <Input v-model="form.favorecido.whatsapp" v-maska :data-maska="MaskaPattern.CELULAR"
                        label="ex: 11 9 889891123" placeholder="Whatsapp" />
                </div>

            </Card>
        </Transition>

        <Card class="col-span-12 grid grid-cols-12 gap-1 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Detalhe</span>
            <div class="col-span-12 sm:col-span-6">
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

            <div class="col-span-12 sm:col-span-6">
                <label class="text-sm text-muted-foreground">Categoria</label>
                <Select v-model="form.aplicacao.categoria" :disabled="!form.aplicacao.grupo">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="categoria in categorias" :key="categoria" :value="categoria">
                            {{ categoria }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-1 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Negociação</span>

            <div :class="isRecorrente ? 'col-span-12 sm:col-span-6 md:col-span-6' : 'col-span-12 sm:col-span-6'">
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


            <div class="col-span-12 sm:col-span-6 md:col-span-6">
                <label class="text-sm text-muted-foreground">Recorrência</label>
                <Select v-model="form.negociacao.recorrencia">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma recorrência" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="recorrencia in recorrencias" :key="recorrencia.value" :value="recorrencia.value">
                            {{ recorrencia.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div :class="'col-span-12 sm:col-span-12 md:col-span-6'">
                <label class="text-sm text-muted-foreground">Prox. Vencto.</label>
                <Input v-model="form.negociacao.proximoVencimento" type="date" placeholder="Data Venct" />
            </div>


            <div :class="'col-span-12 sm:col-span-12 md:col-span-6'">
                <label class="text-sm text-muted-foreground">Qtd. Parcelas</label>
                <Input v-model="form.negociacao.quantidadeParcelas" :min="1" :disabled="isRecorrente"
                    :max="isRecorrente ? 1 : undefined" type="number" placeholder="ex: 12" />
            </div>

        </Card>


        <div class="col-span-12">
            <Button class="w-full" type="submit" :loading="loading">
                Confirmar
            </Button>
        </div>
    </form>
</template>