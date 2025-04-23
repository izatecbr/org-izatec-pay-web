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
import { computed, defineProps, ref, watchEffect } from 'vue';

const { cadastros } = useAPI()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            "codigoExterno": "",
            "valor": 0,
            "mensagem": "",
            "parcela": 0,
            "despesa": 0,
            "vencimento": {
                "data": "",
                "hora": ""
            },
            "favorecido": {
                "documento": "",
                "nomeCompleto": "",
                "email": "",
                "whatsapp": ""
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
    "parcela": 1,
    "despesa": 1,
    "vencimento": {
        data: Utils.formatDateISO(new Date()),
        hora: "23:59"
    },
    "mensagem": "",
    "favorecido": {
        "documento": "",
        "nomeCompleto": "",
        "email": "",
        "whatsapp": ""
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

watchEffect(() => {


    if (inputSelect.value) {
        buscarCadastroFiltro(sacado.value)
    }

    if (sacado?.value) {
        const cadastroSelecionado = cadastrosList.value.find((item: any) => item.id == sacado?.value)

        form.value.favorecido.nomeCompleto = cadastroSelecionado?.nomeCompleto ?? ''
        form.value.favorecido.whatsapp = cadastroSelecionado?.whatsapp ?? ''
        form.value.favorecido.documento = cadastroSelecionado?.documento ?? ''
        form.value.favorecido.email = cadastroSelecionado?.email ?? ''

    }


})

const buscarCadastroFiltro = debounce(async (value: InputEvent) => {

    buscaSacadoLoading.value = true
    const { body, success, status } = await cadastros.listagemNome(value.data)
    buscaSacadoLoading.value = false
    if (body) {
        cadastrosList.value = body ?? []
        sacadoOptions.value = body.map((item: any) => {
            return {
                value: item.id,
                label: `${item.nomeCompleto}${item?.documento ? ` - ${item?.documento}` : ''}`
            }
        }) ?? []
    }

}, 500)

function onSearchInput(value: InputEvent) {
    sacado.value = value;
    buscarCadastroFiltro(value);
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


                <!--<div class="col-span-6">
                    <Input v-model="form.favorecido.documento" label="Documento"
                        placeholder="CPF\CNPJ\RG" />
                </div>

                <div class="col-span-6">
                    <Input v-model="form.favorecido.nomeCompleto" label="Nome Completo" placeholder="Nome Completo" />
                </div>

                <div class="col-span-6">
                    <Input v-model="form.favorecido.email" type="email" label="Email" placeholder="Email" />
                </div>

                <div class="col-span-6">
                    <Input v-model="form.favorecido.whatsapp" v-maska :data-maska="MaskaPattern.CELULAR"
                        label="ex: 11 9 889891123" placeholder="Whatsapp" />
                </div> -->

            </Card>
        </Transition>

        <Card class="col-span-12 grid grid-cols-12 gap-1 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Detalhe</span>

            <div class="col-span-8">
                <Input v-model="form.mensagem" label="Descrição" placeholder="Descrição" />
            </div>

            <div class="col-span-4">
                <InputMoney v-model="form.valor" label="Valor" placeholder="Valor" />
            </div>


            <div class="col-span-6 sm:col-span-8">
                <label for="hora" class="text-xs text-muted-foreground">Data</label>
                <Input v-model="form.vencimento.data" label="Data Vencimento" type="date" placeholder="Data Venct" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <label for="hora" class="text-xs text-muted-foreground">Hora</label>
                <Input id="hora" v-model="form.vencimento.hora" label="Hora Vencimento" type="time"
                    placeholder="Hora Venct" />
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

        <div class="col-span-12">
            <Button class="w-full" type="submit" :loading="loading">
                Confirmar
            </Button>
        </div>
    </form>
</template>