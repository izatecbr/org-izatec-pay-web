<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import CadastrosBadgeSelecionado from '@/components/common/cadastros/CadastrosBadgeSelecionado.vue';
import PrevisoesForm from '@/components/core/previsoes/PrevisoesForm.vue';
import PrevisoesList from '@/components/core/previsoes/PrevisoesList.vue';
import PrevisoesSheet from '@/components/core/previsoes/PrevisoesSheet.vue';
import PrevisoesTable from '@/components/core/previsoes/PrevisoesTable.vue';
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
const { previsoes } = useAPI()

const date = ref<any>(new Date())
const sheetOpen = ref(false)

const status = ref(CobrancaStatusVariant.ATIVA.value)
const loading = ref(false)
const loadingForm = ref(false)
const form = ref<any>(null)
const data = ref([])

const toggleSheetFilterCadastros: () => void = inject('toggleSheetFilterCadastros') as any
const cadastroSelecionado: any = inject('cadastroSelecionado') as any

const fetchPrevisoes = async () => {
    loading.value = true
    const params = {
        status: status.value,
        dataInicio: Utils.formatDateISO(date?.value),
        dataFim: Utils.formatDateISO(date?.value),
        sacado: cadastroSelecionado?.value?.id
    }
    try {
        const { body } = await previsoes.listagem(Utils.cleanParams(params))
        data.value = body ?? []
    } catch (e) {
        console.log('erro ao buscar despesas')
    } finally {
        loading.value = false
    }
}

const clearDataInput = async () => {
    date.value = undefined
    await fetchPrevisoes()
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
        fetchPrevisoes()
    }
    loadingForm.value = false
}

onMounted(async () => {
    await fetchPrevisoes()
})

watch(date, async () => {
    await fetchPrevisoes()
})

const changeStatus = (value: any) => {
    status.value = value
    fetchPrevisoes()
}
</script>

<template>
    <div>
        <page-header title="Previsões" />

        <Tabs :default-value="status" class="space-y-4">
            <Row align-items="center" flex-wrap="wrap" gap="5px">
                <CadastrosBadgeSelecionado />
            </Row>
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
                    <TabsTrigger @click="changeStatus(CobrancaStatusVariant.CANCELADA.value)"
                        :value="CobrancaStatusVariant.CANCELADA.value">
                        Canceladas
                    </TabsTrigger>

                </TabsList>

                <Row gap="10px" flex-wrap="wrap">
                    <Row flex-wrap="wrap" gap="10px" justify-content="space-between" class="w-full mb-4">


                        <Row gap="10px">
                            <Row gap="2px">
                                <DatePicker :loading="loading" v-model="date" />
                                <!-- <Button v-if="date" @click="clearDataInput()" variant="destructive">
                            <Icon class="text-lg" icon="ph:calendar-slash" />
                        </Button> -->
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

            </Row>
        </Tabs>




        <div class="w-full">
            <PrevisoesTable @fetch-data="fetchPrevisoes()" class="w-full" :data="data" v-if="isDesktop" />
            <ScrollArea class="max-h-[70vh] w-full overflow-y-auto" v-else>
                <PrevisoesList class="w-full" :data="data" />
            </ScrollArea>
        </div>
        <!--</Tabs> -->
    </div>
</template>