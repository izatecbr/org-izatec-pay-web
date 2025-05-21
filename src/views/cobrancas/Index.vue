<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import CadastrosBadgeSelecionado from '@/components/common/cadastros/CadastrosBadgeSelecionado.vue';
import CobrancaForm from '@/components/core/cobrancas/CobrancaForm.vue';
import CobrancaList from '@/components/core/cobrancas/CobrancaList.vue';
import CobrancaSheet from '@/components/core/cobrancas/CobrancaSheet.vue';
import CobrancasTable from '@/components/core/cobrancas/CobrancasTable.vue';
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useResponsive } from '@/composables/useResponsive';
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { inject, onMounted, ref, watch } from 'vue';

const { isDesktop } = useResponsive();
const { toast } = useToast()
const { cobrancas, cadastros } = useAPI()


const toggleSheetFilterCadastros: () => void = inject('toggleSheetFilterCadastros') as any
const cadastroSelecionado: any = inject('cadastroSelecionado') as any

const date = ref<any>(new Date())

const sheetOpen = ref(false)
const status = ref(CobrancaStatusVariant.ATIVA.value)
const loading = ref(false)
const loadingForm = ref(false)
const form = ref<any>(null)
const data = ref([])


const fetchCobrancas = async () => {
    loading.value = true
    const params = {
        status: status.value,
        dataInicio: Utils.formatDateISO(date?.value),
        dataFim: Utils.formatDateISO(date?.value),
        sacado: cadastroSelecionado?.value?.id
    }

    const { body } = await cobrancas.listagem(Utils.cleanParams(params))
    data.value = body ?? []
    loading.value = false
}

const clearDataInput = async () => {
    date.value = undefined
    await fetchCobrancas()
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

const changeStatus = (value: any) => {
    status.value = value
    fetchCobrancas()
}


onMounted(async () => {
    await fetchCobrancas()
})

watch(date, async () => {
    await fetchCobrancas()
})

watch(cadastroSelecionado, async () => {
    await fetchCobrancas()
})
</script>

<template>
    <div>


        <page-header class="mb-0" title="Cobranças" />

        <Tabs :default-value="status" class="space-y-2">
            <Row align-items="center" flex-wrap="wrap" gap="5px">
                <CadastrosBadgeSelecionado />
            </Row>
            <Row flex-wrap="wrap" gap="10px" align-items="start" justify-content="space-between"
                class="w-full relative">
                <Row flex-wrap="wrap" gap="10px">
                    <TabsList>
                        <TabsTrigger @click="changeStatus(CobrancaStatusVariant.ATIVA.value)"
                            :value="CobrancaStatusVariant.ATIVA.value">
                            Ativas
                        </TabsTrigger>
                        <TabsTrigger @click="changeStatus(CobrancaStatusVariant.FINALIZADA.value)"
                            :value="CobrancaStatusVariant.FINALIZADA.value">
                            Finalizadas
                        </TabsTrigger>
                        <TabsTrigger @click="changeStatus(CobrancaStatusVariant.QUITADA.value)"
                            :value="CobrancaStatusVariant.QUITADA.value">
                            Quitadas
                        </TabsTrigger>
                        <TabsTrigger @click="changeStatus(CobrancaStatusVariant.CANCELADA.value)"
                            :value="CobrancaStatusVariant.CANCELADA.value">
                            Canceladas
                        </TabsTrigger>
                    </TabsList>
                </Row>

                <Row gap="10px" flex-wrap="wrap">
                    <Row flex-wrap="wrap" gap="10px" justify-content="flex-end" class="w-full mb-4">
                        <Row gap="2px">
                            <DatePicker :loading="loading" v-model="date" />
                            <!-- <Button v-if="date" @click="clearDataInput()" variant="destructive">
                            <Icon class="text-lg" icon="ph:calendar-slash" />
                        </Button>  -->
                        </Row>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button variant="outline" @click="toggleSheetFilterCadastros()">
                                        <Icon class="text-lg" icon="mdi:user-search" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Filtrar coteúdo de acordo com um sacado.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                </Row>
            </Row>

            <div class="w-full">
                <CobrancasTable  :data="data" @fetch-data="fetchCobrancas" v-if="isDesktop" />
                <ScrollArea class="max-h-[84dvh] w-full overflow-y-auto" v-else>
                    <CobrancaList class="w-full" :data="data" />
                </ScrollArea>
            </div>
        </Tabs>


    </div>
</template>