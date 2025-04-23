<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import CadastrosForm from '@/components/core/cadastros/CadastrosForm.vue';
import CadastrosList from '@/components/core/cadastros/CadastrosList.vue';
import CadastrosSheet from '@/components/core/cadastros/CadastrosSheet.vue';
import CadastrosTable from '@/components/core/cadastros/CadastrosTable.vue';
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { useResponsive } from '@/composables/useResponsive';
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface';
import type { FormMode } from '@/types';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';

const { isDesktop } = useResponsive();
const { toast } = useToast();
const { cadastros } = useAPI();

const date = ref({
    start: new Date(),
    end: new Date(),
});
const sheetOpen = ref(false);
const formMode = ref<FormMode>('new');
const nomeFiltro = ref('');
const status = ref(CobrancaStatusVariant.ATIVA.value);
const loading = ref(false);
const loadingForm = ref(false);
const form = ref<any>(null);
const data = ref([]);

const fetchCadatros = async () => {
    loading.value = true;
    const { body } = await cadastros.listagemNome(nomeFiltro.value);
    data.value = body ?? [];
    loading.value = false;
};

const submit = async (payload: any) => {
    loadingForm.value = true;
    const { status, success } = await cadastros.salvar(payload, payload?.id);
    toast({
        title: status.message,
        description: status?.suggestion || '',
        variant: success ? 'default' : 'destructive',
        duration: 1300,
    });
    if (success) {
        closeForm();
        fetchCadatros();
    }
    loadingForm.value = false;
};

const resetForm = () => {
    form.value = null;
};

const openNewForm = () => {
    formMode.value = 'new';
    resetForm();
    sheetOpen.value = true;
};

const handleEdit = (value: any) => {
    formMode.value = 'edit';
    form.value = {
        ...value,
        endereco: value?.endereco ?? {
            cep: "",
            numero: "",
            logradouro: ""
        }
    };
    sheetOpen.value = true;
};

const closeForm = () => {
    sheetOpen.value = false;
    form.value = null;
};

onMounted(async () => {
    await fetchCadatros();
});
</script>

<template>
    <div>
        <page-header title="Cadastros" />

        <Tabs :default-value="status" class="space-y-4">
            <Row flex-wrap="wrap" gap="10px" justify-content="space-between" class="w-full relative">

                <Row gap="10px" flex-wrap="wrap">
                    <Row flex-wrap="wrap" gap="10px" justify-content="flex-end" class="w-full mb-4">
                        <Input :loading="loading" placeholder="Nome" v-model="nomeFiltro" />
                        <Button :loading="loading" @click="fetchCadatros()" variant="outline">
                            <Icon class="mr-2" icon="lucide:funnel" />
                            Buscar
                        </Button>
                    </Row>
                </Row>
                <CadastrosSheet :titulo="formMode === 'new' ? 'Novo Cadastro' : 'Editar Cadastro'" v-model="sheetOpen">
                    <Button @click="openNewForm" variant="outline">
                        Novo
                        <Icon class="ml-2 text-lg" icon="lucide:plus" />
                    </Button>
                    <template #form>
                        <CadastrosForm v-if="sheetOpen" v-model="form" :loading="loadingForm" @on-submit="submit" />
                    </template>
                </CadastrosSheet>
            </Row>

            <div class="w-full">
                <CadastrosTable @on-edit="handleEdit" :data="data" v-if="isDesktop" />
                <ScrollArea class="max-h-[70vh] w-full overflow-y-auto" v-else>
                    <CadastrosList class="w-full" :data="data" />
                </ScrollArea>
            </div>
        </Tabs>
    </div>
</template>
