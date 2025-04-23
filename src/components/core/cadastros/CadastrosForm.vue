<script lang="ts" setup>
import type { CadastroRequest } from '@/api/services/cadastros/index.interface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MaskaPattern } from '@/constants/ui/input-patterns.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            id: null,
            "documento": "",
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
                "email": true,
                "whatsapp": false
            }
        })
    },
    loading: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:modelValue', 'onSubmit']);

const form = ref<CadastroRequest>(Utils.clone(props.modelValue || {
    id: null,
    "documento": "",
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
        "email": true,
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

</script>

<template>
    <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-3">

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Dados Pessoais</span>

            <div class="col-span-12 sm:col-span-12">
                <Input v-model="form.nomeCompleto" label="Nome" placeholder="Nome" />
            </div>

            <div class="col-span-12 md:col-span-6">
                <label class="text-xs text-muted-foreground">Documento</label>
                <Input v-model="form.documento" label="Documento" placeholder="CPF\CNPJ\RG" />
            </div>

            <div class="col-span-12 md:col-span-6">
                <label class="text-xs text-muted-foreground">Aniversário</label>
                <Input v-model="form.dataNascimento" type="date" placeholder="Aniversário" />
            </div>

            <div class="col-span-12 md:col-span-6 grid grid-cols-12 gap-1">
                <div class="col-span-10">
                    <Input v-model="form.whatsapp" v-maska :data-maska="MaskaPattern.CELULAR" label="ex: 11 9 889891123"
                        placeholder="Whatsapp" />
                </div>
                <div class="col-span-2">
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

            <div class="col-span-12 md:col-span-6 grid grid-cols-12 gap-1">
                <div class="col-span-10">
                    <Input v-model="form.email" type="email" label="Email" placeholder="email@exemplo.com" />
                </div>
                <div class="col-span-2">
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

        </Card>

        <Card class="col-span-12 grid grid-cols-12 gap-2 p-1">
            <span class="col-span-12 text-xs text-muted-foreground">Endereço</span>

            <div class="col-span-12 md:col-span-9">
                <Input v-model="form.endereco.cep" v-maska :data-maska="MaskaPattern.CEP" label="CEP"
                    placeholder="CEP" />
            </div>

            <div class="col-span-12 sm:col-span-3">
                <Input v-model="form.endereco.numero" label="Número" placeholder="Número" />
            </div>

            <div class="col-span-12">
                <Input v-model="form.endereco.logradouro" label="Logradouro" placeholder="Logradouro" />
            </div>
        </Card>

        <div class="col-span-12">
            <Button class="w-full" type="submit" :loading="loading">
                Confirmar
            </Button>
        </div>
    </form>
</template>