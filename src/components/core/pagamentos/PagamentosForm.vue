<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import { InputMoney } from '@/components/common/input-money';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SacadoState, type SacadoStateType } from '@/constants/app/sacado-state.interface';
import { TOKEN_STORAGE_KEY } from '@/constants/storage/token';
import Utils from '@/utils/index';
import { debounce } from 'lodash-es';
import { computed, ref, watchEffect } from 'vue';

const { cadastros } = useAPI()

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
    }
}));

const buscaSacadoLoading = ref(false)

const sacadoState = ref<SacadoStateType>(SacadoState.EMPTY)
const cadastroExist = computed(() => sacadoState.value == SacadoState.EXIST)
const cadastroNotExist = computed(() => sacadoState.value == SacadoState.NOT_EXIST)

function getCodigoIdenticacao() {
    const jwt: any = localStorage.getItem(TOKEN_STORAGE_KEY) || null
    return Utils.jwtToObject(jwt)?.codigoIntegracao
}

const canSubmit = computed(() => {
    const invalidMoneyInput = [null, undefined, "", 0,]
    return form.value.sacado?.documento != '' && form.value.sacado?.nomeCompleto != '' && form.value.titulo != "" && !invalidMoneyInput.includes(form.value.valor)
})

const buscarCadastroPorCPF = debounce(async (value: string) => {
    buscaSacadoLoading.value = true
    const { body, success, status } = await cadastros.listagemCpfCnpj(Utils.removeCharacters(value) || '')
    buscaSacadoLoading.value = false
    if (body) {
        sacadoState.value = SacadoState.EXIST
        form.value.sacado.nomeCompleto = body?.nomeCompleto ?? ''
        form.value.sacado.whatsapp = `${body.whatsapp ?? ''}`
        form.value.sacado.email = body?.email ?? ''
    } else {
        sacadoState.value = SacadoState.NOT_EXIST
    }

}, 500)

watchEffect(() => {
    if (form.value.sacado.documento) {
        buscarCadastroPorCPF(form.value.sacado.documento)
    }

    if (form.value.sacado.documento === '') {
        form.value.sacado.nomeCompleto = ''
        form.value.sacado.whatsapp = ''
        form.value.sacado.email = ''
        sacadoState.value = SacadoState.EMPTY
    }
})


const submitForm = async () => {
    if (form.value?.sacado?.documento) {
        const pureDocument = Utils.removeCharacters(form.value.sacado.documento)
        form.value.sacado.documento = pureDocument
    }

    if (form.value?.sacado?.whatsapp) {
        const pureWhatsApp = Utils.removeCharacters(form.value.sacado.whatsapp)
        form.value.sacado.whatsapp = Number(pureWhatsApp) || null
    }

    if (form.value?.valor) {
        const pureValor = Utils.moneyMaskToNumber(form.value.valor)
        form.value.valor = pureValor
    }

    if (!form.value.sacado?.documento && !form.value.sacado?.nomeCompleto && !form.value.sacado?.email && !form.value.sacado?.whatsapp) {
        delete form.value.sacado
    }

    emit('update:modelValue', form.value);
    emit('onSubmit', Utils.clone(form.value));

    form.value.sacado = {
        documento: "",
        nomeCompleto: "",
        email: "",
        whatsapp: ""
    }
};

</script>

<template>
    <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-3">

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
                <span class="col-span-12 text-xs text-muted-foreground">Sacado</span>

                <div class="col-span-6 sm:col-span-6">
                    <Input v-model="form.sacado.documento" label="Documento"
                        placeholder="CPF\CNPJ\RG" />
                </div>

                <div class="col-span-6 sm:col-span-6">
                    <Input v-model="form.sacado.nomeCompleto" label="Nome Completo" placeholder="Nome Completo" />
                </div>

                <div class="col-span-6 sm:col-span-6">
                    <Input v-model="form.sacado.email" type="email" label="Email" placeholder="Email" />
                </div>

                <div class="col-span-6 sm:col-span-6">
                    <Input v-model="form.sacado.whatsapp" label="ex: 11 9 889891123" placeholder="Whatsapp" />
                </div>
            </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Detalhe</span>

            <div class="col-span-6 sm:col-span-8 ">
                <Input v-model="form.mensagem" label="Descrição" placeholder="Descrição" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <InputMoney v-model="form.valor" label="Valor" placeholder="Valor" />
            </div>

            <div class="col-span-6 sm:col-span-8">
                <label for="hora" class="text-xs text-muted-foreground">Data</label>
                <Input v-model="form.vencimento.data" label="Data Vencimento" type="date" placeholder="Data Venct" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <label for="hora" class="text-xs text-muted-foreground">Hora</label>
                <Input id="hora" v-model="form.vencimento.hora" label="Hora Vencimento" type="time" placeholder="Hora Venct" />
            </div>

        </Card>

        <div class="col-span-12">
            <Button class="w-full" type="submit" :loading="loading || buscaSacadoLoading">
                Confirmar
            </Button>
        </div>
    </form>
</template>