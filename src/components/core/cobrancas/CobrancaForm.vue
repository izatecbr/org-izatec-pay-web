<script lang="ts" setup>
import { useAPI } from '@/api/http-client';
import AppCombobox from '@/components/common/app-combobox/AppCombobox.vue';
import { InputMoney } from '@/components/common/input-money';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PagamentoModelo } from '@/constants/app/pagamento-modelo.interface';
import { RecorrenciaPagamento } from '@/constants/app/recorrencia-pagamento.interface';
import { SacadoState, type SacadoStateType } from '@/constants/app/sacado-state.interface';
import { TOKEN_STORAGE_KEY } from '@/constants/storage/token';
import Utils from '@/utils/index';
import { debounce } from 'lodash-es';
import { computed, ref, watchEffect } from 'vue';

const { cadastros } = useAPI()

const emit = defineEmits(['update:modelValue', 'onSubmit']);
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            "codigoIdentificacao": "",
            "valor": null,
            "titulo": "",
            "sacado": null,
            "negociacao": null
        })
    },
    loading: {
        type: Boolean,
        default: false
    }
});


const buscaSacadoLoading = ref(false)
const modelos = Object.values(PagamentoModelo) as { value: string, label: string }[]
const recorrencias = Object.values(RecorrenciaPagamento) as { value: string, label: string }[]
const isRecorrente = computed(() => form.value.negociacao?.modelo === PagamentoModelo.RECORRENTE.value)

const sacadoState = ref<SacadoStateType>(SacadoState.EMPTY)

const sacado = ref<any>(undefined)
const inputSelect = ref<any>(undefined)
const sacadoOptions = ref([])
const cadastrosList = ref<any[]>([])

const form = ref(Utils.clone(props.modelValue || {
    codigoIdentificacao: getCodigoIdenticacao(),
    valor: null,
    titulo: "",
    sacado: { "documento": "", "nomeCompleto": "", "email": "", "whatsapp": "" },
    negociacao: {
        modelo: PagamentoModelo.RECORRENTE.value,
        recorrencia: RecorrenciaPagamento.MENSAL.value,
        quantidadeParcelas: 1,
        proximoVencimento: Utils.formatDateISO(new Date())
    }
}));

const canSubmit = computed(() => {
    const invalidMoneyInput = [null, undefined, "", 0,]
    return form.value.sacado?.nomeCompleto != '' && form.value.titulo != "" && !invalidMoneyInput.includes(form.value.valor)
})


watchEffect(() => {
    if (form.value.negociacao?.modelo == PagamentoModelo.RECORRENTE.value) {
        form.value.negociacao.quantidadeParcelas = 0
    }

    if (inputSelect.value) {
        buscarCadastroFiltro(sacado.value)
    }

    if (sacado?.value) {
        const cadastroSelecionado = cadastrosList.value.find((item: any) => item.id == sacado?.value)

        form.value.sacado.nomeCompleto = cadastroSelecionado?.nomeCompleto ?? ''
        form.value.sacado.whatsapp = cadastroSelecionado?.whatsapp ?? ''
        form.value.sacado.documento = cadastroSelecionado?.documento ?? ''
        form.value.sacado.email = cadastroSelecionado?.email ?? ''

    }
})

function getCodigoIdenticacao() {
    const jwt: any = localStorage.getItem(TOKEN_STORAGE_KEY) || null
    return Utils.jwtToObject(jwt)?.codigoIntegracao
}

const buscarCadastroFiltro = debounce(async (value: string) => {
    buscaSacadoLoading.value = true;
    const { body, success, status } = await cadastros.listagemNome(value);
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



const submitForm = async () => {

    if (form.value?.sacado?.documento) {
        const pureDocumento = Utils.removeCharacters(form.value.sacado.documento)
        form.value.sacado.documento = pureDocumento
    }

    if (form.value?.sacado?.whatsapp) {
        const pureWhatsApp = Utils.removeCharacters(form.value.sacado.whatsapp)
        form.value.sacado.whatsapp = Number(pureWhatsApp) || null
    }


    if (!form.value?.sacado?.nomeCompleto) {
        delete form.value.sacado
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
    <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-1">

        <Card class="col-span-12 grid grid-cols-12 gap-1 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Sacado</span>

            <div class="col-span-12">
                <AppCombobox class="w-full" button-class="w-full" popover-class="w-[37.4dvw]"
                    placeholder="Selecionar sacado" :loading="buscaSacadoLoading"
                    placeholder-input="Busque por nome ou documento." :options="sacadoOptions" :input="inputSelect"
                    v-model="sacado" @update:input="onSearchInput" />
                <!--<div :class="cadastroExist ? 'col-span-4' : 'col-span-5'">
                    <Input v-model="form.sacado.documento" label="Documento" placeholder="CPF\CNPJ\RG" />
                </div>
                <div class="col-span-7">
                    <Badge v-if="!cadastroNotExist" variant="soft" class="w-full h-full">
                        {{ cadastroExist ? (form.sacado?.nomeCompleto ?? 'Nome do sacado não foi informado') : 'Digite o documento para buscar um Sacado.' }}
                        <Loading v-if="buscaSacadoLoading" />
                    </Badge>
                    <Badge v-else class="w-full h-full" variant="outline">
                       <p class=" text-justify" > {{ 'Sacado não foi encontrado. Tente revisar o documento, ou cadastrar um novo sacado.' }}</p>
                       <Loading v-if="buscaSacadoLoading" />
                    </Badge>
                </div>
                <div v-if="cadastroExist" class="col-span-1">
                    <Popover >
                        <PopoverTrigger as-child>
                            <Button class="w-full p-0">
                                <Icon icon="ph:user" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                                <Column>
                                    <strong>Whatsapp</strong>
                                    <p>{{ form?.sacado?.whatsapp || 'Não informado' }}</p>
                                </Column>
                                <Column>
                                    <strong>Email</strong>
                                    <p>{{ form?.sacado?.email || 'Não informado' }}</p>
                                </Column>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div> -->
            </div>
        </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-1 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Detalhe</span>

            <div class="col-span-8">
                <Input v-model="form.titulo" label="Descrição" placeholder="Descrição" />
            </div>

            <div class="col-span-4 ">
                <InputMoney v-model="form.valor" label="Valor" placeholder="Valor" />
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
                <Input v-model="form.negociacao.quantidadeParcelas" :min="1" :disabled="isRecorrente"
                    :max="isRecorrente ? 1 : undefined" type="number" placeholder="ex: 12" />
            </div>

        </Card>


        <div class="col-span-12">
            <Button class="w-full" type="submit" :disabled="!canSubmit" :loading="loading || buscaSacadoLoading">
                Confirmar
            </Button>
        </div>
    </form>
</template>