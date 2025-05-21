<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import AppCombobox from '@/components/common/app-combobox/AppCombobox.vue';
import { InputMoney } from '@/components/common/input-money';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SacadoState, type SacadoStateType } from '@/constants/app/sacado-state.interface';
import { TOKEN_STORAGE_KEY } from '@/constants/storage/token';
import Utils from '@/utils/index';
import { debounce } from 'lodash-es';
import { ref, watchEffect } from 'vue';

const { cadastros } = useAPI()

const isCompensacaoManualToken: boolean = Utils.jwtToObject(localStorage.getItem(TOKEN_STORAGE_KEY))?.compensacaoManual

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            codigoIdentificacao: "",
            parcela: null,
            valor: null,
            mensagem: "",
            vencimento: {
                data: "",
                hora: ""
            },
            sacado: {
                documento: "",
                nomeCompleto: "",
                email: "",
                whatsapp: ""
            },
            compensacaoManual: true
        })
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'onSubmit']);

const form = ref(Utils.clone(props.modelValue || {
    codigoIdentificacao: getCodigoIdenticacao(),
    parcela: 0,
    valor: null,
    mensagem: "",
    vencimento: {
        data: Utils.formatDateISO(new Date()),
        hora: "23:59"
    },
    sacado: {
        documento: "",
        nomeCompleto: "",
        email: "",
        whatsapp: ""
    },
    compensacaoManual: isCompensacaoManualToken
}));

const buscaSacadoLoading = ref(false)
const sacado = ref<any>(undefined)
const inputSelect = ref<any>(undefined)
const sacadoOptions = ref([])
const cadastrosList = ref<any[]>([])
const sacadoState = ref<SacadoStateType>(SacadoState.EMPTY)

function getCodigoIdenticacao() {
    const jwt: any = localStorage.getItem(TOKEN_STORAGE_KEY) || null
    return Utils.jwtToObject(jwt)?.codigoIntegracao
}

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
        sacadoState.value = SacadoState.EXIST;
    } else {
        sacadoState.value = SacadoState.NOT_EXIST;
    }
}, 500);

function onSearchInput(event: InputEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    sacado.value = inputValue;
    buscarCadastroFiltro(inputValue);
}


watchEffect(() => {
    if (inputSelect.value) {
        buscarCadastroFiltro(sacado.value);
    }

    if (sacado?.value) {
        const cadastroSelecionado = cadastrosList.value.find((item: any) => item.id == sacado?.value);

        form.value.sacado.nomeCompleto = cadastroSelecionado?.nomeCompleto ?? '';
        form.value.sacado.whatsapp = cadastroSelecionado?.whatsapp ?? '';
        form.value.sacado.documento = cadastroSelecionado?.documento ?? '';
        form.value.sacado.email = cadastroSelecionado?.email ?? '';
    }
});


const toggleCompensacao = () => {
    if (!isCompensacaoManualToken) {
        form.value.compensacaoManual = !form.value.compensacaoManual
    }

}

const submitForm = async () => {
    if (form.value?.sacado?.documento) {
        const pureDocument = Utils.removeCharacters(form.value.sacado.documento);
        form.value.sacado.documento = pureDocument;
    }

    /* if(isCompensacaoManualToken){
        form.value.compensacaoManual = isCompensacaoManualToken
    } */

    if (form.value?.sacado?.whatsapp) {
        const pureWhatsApp = Utils.removeCharacters(form.value.sacado.whatsapp);
        form.value.sacado.whatsapp = Number(pureWhatsApp) || null;
    }

    if (form.value?.valor) {
        const pureValor = Utils.moneyMaskToNumber(form.value.valor);
        form.value.valor = pureValor;
    }

    if (!form.value.sacado?.documento && !form.value.sacado?.nomeCompleto && !form.value.sacado?.email && !form.value.sacado?.whatsapp) {
        delete form.value.sacado;
    }

    emit('update:modelValue', form.value);
    emit('onSubmit', Utils.clone(form.value));

    form.value.sacado = {
        documento: "",
        nomeCompleto: "",
        email: "",
        whatsapp: ""
    };
};
</script>

<template>
    <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-3">
        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Sacado</span>

            <div class="col-span-12 flex">
                <AppCombobox class="w-full" button-class="w-full" popover-class="w-[37.4dvw]"
                    placeholder="Selecionar sacado" :loading="buscaSacadoLoading"
                    placeholder-input="Busque por nome ou documento." :options="sacadoOptions" :input="inputSelect"
                    v-model="sacado" @update:input="onSearchInput" />
            </div>
        </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Detalhe</span>

            <div class="col-span-6 sm:col-span-8">
                <Input v-model="form.mensagem" label="Descrição" placeholder="Descrição" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <InputMoney v-model="form.valor" label="Valor" placeholder="Valor" />
            </div>

            <div class="col-span-6 sm:col-span-5">
                <label for="hora" class="text-xs text-muted-foreground">Data</label>
                <Input v-model="form.vencimento.data" label="Data Vencimento" type="date" placeholder="Data Venct" />
            </div>

            <div class="col-span-6 sm:col-span-3">
                <label for="hora" class="text-xs text-muted-foreground">Hora</label>
                <Input id="hora" v-model="form.vencimento.hora" label="Hora Vencimento" type="time"
                    placeholder="Hora Venct" />
            </div>

            <div class="col-span-4">
                <span class="block py-2 h-[1.5rem]"></span>
                <Card  class="gap-2 h-[2.5rem] p-1"
                    :class="!isCompensacaoManualToken ? 'cursor-pointer' : 'cursor-not-allowed'"
                    @click="toggleCompensacao">
                    <div class="flex items-center justify-center pt-[0.48rem] space-x-2">
                        <Checkbox id="comp" class="col-span-12"
                            :class="isCompensacaoManualToken ? 'cursor-not-allowed' : 'cursor-pointer'"
                            v-model:checked="form.compensacaoManual" :disabled="isCompensacaoManualToken"
                            label="Compensação Manual" @click.stop />
                        <label for="comp"
                            class="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Compensação Manual
                        </label>
                    </div>
                </Card>
            </div>

        </Card>

        <div class="col-span-12">
            <Button class="w-full" type="submit" :loading="loading || buscaSacadoLoading">
                Confirmar
            </Button>
        </div>
    </form>
</template>
