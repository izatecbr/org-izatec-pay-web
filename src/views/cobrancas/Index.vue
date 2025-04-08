<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import CobrancaForm from '@/components/core/cobrancas/CobrancaForm.vue';
import CobrancaList from '@/components/core/cobrancas/CobrancaList.vue';
import CobrancaSheet from '@/components/core/cobrancas/CobrancaSheet.vue';
import CobrancasTable from '@/components/core/cobrancas/CobrancasTable.vue';
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/daterange-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/toast';
import { useResponsive } from '@/composables/useResponsive';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';

const { isDesktop } = useResponsive();
const { toast } = useToast()
const { cobrancas } = useAPI()

const date = ref({
    start: new Date(),
    end: new Date()
})
const sheetOpen = ref(false)

const loading = ref(false)
const loadingForm = ref(false)
const form = ref<any>(null)
const data = ref([])

const fetchCobrancas = async () => {
    loading.value = true
    const params = {
        dataInicio: Utils.formatDateISO(date.value.start),
        dataFim: Utils.formatDateISO(date.value.end),
    }
    const { body } = await cobrancas.listagem(params)
    data.value = body ?? []
    loading.value = false
}


const submit = async (payload: any) => {
    loadingForm.value = true
    const { status, success } = await cobrancas.inserir(payload)

    toast({
        title: status.message,
        description: status?.suggestion || '',
        variant: success ? 'default' : 'destructive',
        duration: 1300,
    });

    if (success) {
        sheetOpen.value = false
        form.value = null
        fetchCobrancas()
    }
    loadingForm.value = false
}

onMounted(async () => {
    await fetchCobrancas()
})
</script>

<template>
    <div>
        <page-header title="Cobranças" />

        <Row flex-wrap="wrap" gap="10px" justify-content="flex-end" class="w-full mb-4">
            <DateRangePicker :loading="loading" v-model="date" />
            <Button :loading="loading" @click="fetchCobrancas()" variant="outline">
                <Icon class="mr-2" icon="lucide:funnel" />
                Buscar
            </Button>
            <CobrancaSheet titulo="Nova Cobrança" v-model="sheetOpen">
                <Button @click="sheetOpen = true" variant="outline">
                    Novo
                    <Icon class="ml-2 text-lg" icon="lucide:plus" />
                </Button>
                <template #form>
                    <CobrancaForm v-model="form" :loading="loadingForm"
                        @on-submit="(payload: any) => submit(payload)" />
                </template>
            </CobrancaSheet>
        </Row>

        <div class="w-full">
            <CobrancasTable :data="data" v-if="isDesktop" />
            <ScrollArea class="max-h-[70vh] w-full overflow-y-auto" v-else>
                <CobrancaList class="w-full" :data="data" />
            </ScrollArea>
        </div>
    </div>
</template>