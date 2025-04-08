<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import PrevisoesForm from '@/components/core/previsoes/PrevisoesForm.vue';
import PrevisoesList from '@/components/core/previsoes/PrevisoesList.vue';
import PrevisoesSheet from '@/components/core/previsoes/PrevisoesSheet.vue';
import PrevisoesTable from '@/components/core/previsoes/PrevisoesTable.vue';
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/daterange-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { useResponsive } from '@/composables/useResponsive';
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';

const { isDesktop } = useResponsive();
const { toast } = useToast()
const { previsoes } = useAPI()

const date = ref({
    start: new Date(),
    end: new Date()
})
const sheetOpen = ref(false)

const status = ref(CobrancaStatusVariant.ATIVA.value)
const loading = ref(false)
const loadingForm = ref(false)
const form = ref<any>(null)
const data = ref([])

const fetchDespesas = async () => {
    loading.value = true
    const params = {
        status: status.value,
        dataInicio: Utils.formatDateISO(date.value.start),
        dataFim: Utils.formatDateISO(date.value.end),
    }
    try {
        const { body } = await previsoes.listagem(params)
        data.value = body ?? []
    } catch (e) {
        console.log('erro ao buscar despesas')
    } finally {
        loading.value = false
    }
}

const changeStatus = (value: any) => {
    status.value = value
    fetchDespesas()
}

const submit = async (payload: any) => {
    loadingForm.value = true
    const { status, success } = await previsoes.inserir(payload)

    toast({
        title: status.message,
        description: status?.suggestion || '',
        variant: success ? 'default' : 'destructive',
        duration: 1300,
    });

    if (success) {
        sheetOpen.value = false
        form.value = null
        fetchDespesas()
    }
    loadingForm.value = false
}

onMounted(async () => {
    await fetchDespesas()
})
</script>

<template>
    <div>
        <page-header title="Previsões" />

        <Tabs :default-value="status" class="space-y-4">
            <Row flex-wrap="wrap" gap="10px" justify-content="space-between" class="w-full relative">
                <TabsList>
                    <TabsTrigger @click="changeStatus(CobrancaStatusVariant.ATIVA.value)"
                        :value="CobrancaStatusVariant.ATIVA.value">
                        Ativa
                    </TabsTrigger>
                    <TabsTrigger @click="changeStatus(CobrancaStatusVariant.FINALIZADA.value)"
                        :value="CobrancaStatusVariant.FINALIZADA.value">
                        Finalizada
                    </TabsTrigger>
                    <TabsTrigger @click="changeStatus(CobrancaStatusVariant.QUITADA.value)"
                        :value="CobrancaStatusVariant.QUITADA.value">
                        Quitada
                    </TabsTrigger>
                    <TabsTrigger @click="changeStatus(CobrancaStatusVariant.ENCERRADA.value)"
                        :value="CobrancaStatusVariant.ENCERRADA.value">
                        Encerrada
                    </TabsTrigger>
                </TabsList>
                <Row gap="10px" flex-wrap="wrap">
                    <Row flex-wrap="wrap" gap="10px" justify-content="flex-end" class="w-full mb-4">
                        <DateRangePicker :loading="loading" v-model="date" />
                        <Button :loading="loading" @click="fetchDespesas()" variant="outline">
                            <Icon class="mr-2" icon="lucide:funnel" />
                            Buscar
                        </Button>
                        <PrevisoesSheet titulo="Nova Previsão" v-model="sheetOpen">
                            <Button @click="sheetOpen = true" variant="outline">
                                Novo
                                <Icon class="ml-2 text-lg" icon="lucide:plus" />
                            </Button>
                            <template #form>
                                <PrevisoesForm v-model="form" :loading="loadingForm"
                                    @on-submit="(payload: any) => submit(payload)" />
                            </template>
                        </PrevisoesSheet>
                    </Row>
                </Row>
            </Row>


            <div class="w-full">
                <PrevisoesTable class="w-full" :data="data" v-if="isDesktop" />
                <ScrollArea class="max-h-[70vh] w-full overflow-y-auto" v-else>
                    <PrevisoesList class="w-full" :data="data" />
                </ScrollArea>
            </div>
        </Tabs>
    </div>
</template>