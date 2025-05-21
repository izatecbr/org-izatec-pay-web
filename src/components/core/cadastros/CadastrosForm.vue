<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client';
import type { CadastroRequest } from '@/api/services/cadastros/index.interface';
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MaskaPattern } from '@/constants/ui/input-patterns.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { debounce } from 'lodash-es';
import { ref, watch } from 'vue';

const { publico } = useFilesAPI()

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            id: null,
            "documento": "",
            "informacoesAdicionais": "",
            "descricao": "",
            "nomeCompleto": "",
            "email": "",
            "whatsapp": "",
            "dataNascimento": Utils.formatDateISO(new Date()),
            "endereco": {
                "cep": "",
                "numero": "",
                "logradouro": ""
            },
            "notificacao": {
                "email": false,
                "whatsapp": false
            }
        })
    },
    loading: {
        type: Boolean,
        default: false
    },
    anexo: {
        type: File,
        default: null,
    }
});
const emit = defineEmits(['update:modelValue', 'update:anexo', 'onSubmit']);

const loadingCep = ref(false)
const fileInputKey = ref(0);
const form = ref<CadastroRequest>(Utils.clone(props.modelValue || {
    id: null,
    "documento": "",
    "informacoesAdicionais": "",
    "nomeCompleto": "",
    "email": "",
    "whatsapp": "",
    "dataNascimento": Utils.formatDateISO(new Date()),
    "endereco": {
        "cep": "",
        "numero": "",
        "logradouro": ""
    },
    "notificacao": {
        "email": false,
        "whatsapp": false
    }
}));

const toggleNotificacao = (type: 'email' | 'whatsapp') => {
    form.value.notificacao[type] = !form.value.notificacao[type];
};

const submitForm = async () => {

    if (form.value?.documento) {
        const pureDocumento = Utils.removeCharacters(form.value?.documento)
        form.value.documento = pureDocumento || ''
    }

    if (form.value?.whatsapp) {
        const pureWhatsApp = Utils.removeCharacters(form.value?.whatsapp)
        form.value.whatsapp = Number(pureWhatsApp)
    }

    if (form.value?.endereco?.cep) {
        const pureCep = Utils.removeCharacters(form.value?.endereco?.cep)
        form.value.endereco.cep = pureCep || ''
    }

    emit('update:modelValue', form.value);
    emit('onSubmit', Utils.clone(form.value));
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        emit('update:anexo', target.files[0])
    } else {
        emit('update:anexo', null)
    }
};

const clearFileSelection = () => {
    emit('update:anexo', null)
    fileInputKey.value++;
};


const montarLogradouro = debounce(async (value: string) => {
    loadingCep.value = true
    const response: any = await publico.buscarCeps(value)
    const endereco = response?.data || null
    loadingCep.value = false

    if (endereco) {
        form.value.endereco.logradouro = `${endereco?.logradouro ?? ''} - ${endereco?.bairro ?? ''} - ${endereco?.localidade ?? ''}/${endereco?.uf ?? ''}`
    }
}, 500)

watch(() => form.value.endereco.cep, (value) => {
    if (value) {
        montarLogradouro(form.value.endereco.cep)
    } else {
        form.value.endereco.logradouro = ''
    }
})

</script>

<template>
    <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-3">

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Dados Pessoais</span>

            <div class="col-span-12 sm:col-span-12">
                <Input v-model="form.nomeCompleto" label="Nome" placeholder="Nome" />
            </div>

            <div class="col-span-12 grid grid-cols-12 gap-1">
                <div class="col-span-11">
                    <Input v-model="form.email" type="email" label="Email" placeholder="email@exemplo.com" />
                </div>
                <div class="col-span-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button type="button" @click="toggleNotificacao('email')" class="h-full w-full p-0"
                                    size="sm" :variant="form.notificacao.email ? 'soft' : 'outline'">
                                    <Icon class="text-md" icon="ph:bell" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Integração com notificação via email.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6">
                <label class="text-xs text-muted-foreground">Documento</label>
                <Input v-model="form.documento" label="Documento" placeholder="CPF\CNPJ\RG" />
            </div>

            <div class="col-span-12 md:col-span-6">
                <label class="text-xs text-muted-foreground">Aniversário</label>
                <Input v-model="form.dataNascimento" type="date" placeholder="Aniversário" />
            </div>

        </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Endereço</span>

            <div class="col-span-12 md:col-span-4">
                <Input :loading="loadingCep" v-model="form.endereco.cep" v-maska :data-maska="MaskaPattern.CEP"
                    label="CEP" placeholder="CEP" />
            </div>

            <div class="col-span-12 sm:col-span-2">
                <Input v-model="form.endereco.numero" label="Número" placeholder="Nº" />
            </div>


            <div class="col-span-12 md:col-span-6 grid grid-cols-12 gap-1">

                <div class="col-span-9">
                    <Input v-model="form.whatsapp" v-maska :data-maska="MaskaPattern.CELULAR" label="ex: 11 9 889891123"
                        placeholder="Whatsapp" />
                </div>
                <div class="col-span-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button type="button" @click="toggleNotificacao('whatsapp')" class="h-full w-full p-0"
                                    size="sm" :variant="form.notificacao.whatsapp ? 'soft' : 'outline'">
                                    <Icon class="text-md" icon="ph:bell" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Integração com notificação via whatsapp.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>


            <div class="col-span-12">
                <Input v-model="form.endereco.logradouro" label="Logradouro" placeholder="Logradouro" />
            </div>
        </Card>


        <Card v-if="!modelValue?.id" class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Anexo de documento</span>

            <div class="col-span-12 sm:col-span-12 w-full">
                <Row class="w-full">
                    <div class="w-full">
                        <Input :key="fileInputKey" :placeholder="anexo?.name ?? 'Selecionar Arquivo'" type="file"
                            accept="*/*" @change="handleFileChange" class="w-full" />
                    </div>
                    <Button type="button" v-if="anexo" variant="outline" @click="clearFileSelection">
                        <Icon icon="ph:backspace" class="text-base" />
                    </Button>
                </Row>
            </div>

        </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Informações Adicionais</span>

            <div class="col-span-12 sm:col-span-12">
                <Textarea v-model="form.informacoesAdicionais" rows="2" label="Informações Adicionais"
                    placeholder="Opcional" />
            </div>

        </Card>


        <div class="col-span-12">
            <Button class="w-full" type="submit" :loading="loading">
                Confirmar
            </Button>
        </div>
    </form>
</template>