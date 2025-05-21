<script setup lang="ts">
import { useAPI } from "@/api/http-client";
import CadastrosBadgeSelecionado from "@/components/common/cadastros/CadastrosBadgeSelecionado.vue";
import CobrancaList from "@/components/core/cobrancas/CobrancaList.vue";
import Column from "@/components/core/Column.vue";
import PagamentosList from '@/components/core/pagamentos/PagamentosList.vue';
import RecebivelCobrancaTable from "@/components/core/recebiveis/RecebivelCobrancaTable.vue";
import RecebivelPagamentoTable from "@/components/core/recebiveis/RecebivelPagamentoTable.vue";
import Row from '@/components/core/Row.vue';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import DateRangePicker from "@/components/ui/daterange-picker/DateRangePicker.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useResponsive } from "@/composables/useResponsive";
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { addDays } from "date-fns";
import { computed, inject, onMounted, ref, watch } from "vue";


const { toast } = useToast()
const { pagamentos, cobrancas } = useAPI()
const { isDesktop } = useResponsive();

const toggleSheetFilterCadastros: () => void = inject('toggleSheetFilterCadastros') as any
const cadastroSelecionado: any = inject('cadastroSelecionado') as any

const date = ref<any>({
  start: new Date(),
  end: addDays(new Date(), 30)
})
const pagamentosData = ref([])
const cobrancasData = ref([])
const loading = ref<{ [key: string]: boolean }>({})

const params = computed(() => {
  return {
    dataInicio: Utils.formatDateISO(date.value?.start),
    dataFim: Utils.formatDateISO(date.value?.end),
    sacado: cadastroSelecionado?.value?.id
  }
})

const fetchCobrancas = async () => {
  loading.value['cobrancas'] = true
  const { body } = await cobrancas.listagem(Utils.cleanParams(params.value))
  cobrancasData.value = body ?? []
  loading.value['cobrancas'] = false
}

const fetchPagamentos = async () => {
  loading.value['pagamentos'] = true
  const { body } = await pagamentos.listagem(Utils.cleanParams(params.value))
  pagamentosData.value = body ?? []
  loading.value['pagamentos'] = false
}

const fetchAll = async () => {
  await Promise.all([fetchPagamentos(), fetchCobrancas()])
}


onMounted(async () => {
  await fetchAll()
})


watch(date, async () => {
  await fetchAll()
})

const totalPagamentos = computed<any>(() => {
  const { totalPago, totalRestante, totalGeral } = pagamentosData.value.reduce(
    (acc, item: any) => {
      acc.totalPago += item.valor?.pago || 0;
      acc.totalRestante += item.valor?.original - (item.valor?.pago || 0);
      acc.totalGeral += item.valor?.original || 0;
      return acc;
    },
    { totalPago: 0, totalRestante: 0, totalGeral: 0 }
  );
  return { totalPago, totalRestante, totalGeral };
});


const totalCobrancas = computed<any>(() => {
  const { totalPago, totalRestante, totalGeral } = cobrancasData.value.reduce(
    (acc, item: any) => {
      acc.totalPago += item.valorCobranca || 0;
      acc.totalRestante += item.valorCobranca - (item.valorCobrado || 0);
      acc.totalGeral += item.valorCobranca || 0;
      return acc;
    },
    { totalPago: 0, totalRestante: 0, totalGeral: 0 }
  );
  return { totalPago, totalRestante, totalGeral };
});
</script>

<template>
  <div>
    <page-header title="Recebíveis" />
    <Row align-items="center" justify-content="space-between" flex-wrap="wrap" gap="5px" class="w-full">
      <span>
        <CadastrosBadgeSelecionado />
      </span>

      <Row gap="10px" flex-wrap="wrap" justify-content="flex-end" align-items="center" class="self-end">
        <DateRangePicker :loading="loading['cobrancas'] || loading['pagamentos']" v-model="date" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" @click="toggleSheetFilterCadastros()">
                <Icon class="text-lg" icon="mdi:user-search" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filtrar conteúdo de acordo com um sacado.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Row>
    </Row>


    <div class="w-full">
      <Row gap="10px" class="mt-3" v-if="isDesktop">
        <Column class="flex-1">
          <Row class="w-full" align-items="center" justify-content="space-between">
            <label class="text-muted-foreground">Pagamentos</label>
            <Row gap="5px">
              <Badge variant="outline">Total: {{ Utils.formatToBRL(totalPagamentos.totalGeral) }}</Badge>
              <!-- <Badge variant="success">Pago: {{ Utils.formatToBRL(totalDespesas.totalPago) }}</Badge>
              <Badge variant="soft" >Restante: {{ Utils.formatToBRL(totalDespesas.totalRestante) }}</Badge> -->
            </Row>
          </Row>

          <RecebivelPagamentoTable @fetch-data="fetchPagamentos" class="w-full" :data="pagamentosData" />
        </Column>
        <Column class="flex-1">
          <Row class="w-full" align-items="center" justify-content="space-between">
            <label class="text-muted-foreground">Cobranças</label>
            <Row gap="5px">
              <Badge variant="outline">Total: {{ Utils.formatToBRL(totalCobrancas.totalGeral) }}</Badge>
              <!-- <Badge variant="success">Pago: {{ Utils.formatToBRL(totalDespesas.totalPago) }}</Badge>
              <Badge variant="soft" >Restante: {{ Utils.formatToBRL(totalDespesas.totalRestante) }}</Badge> -->
            </Row>
          </Row>

          <RecebivelCobrancaTable @fetch-data="fetchCobrancas" class="w-full" :data="cobrancasData" />
        </Column>
      </Row>
      <Row v-else>
        <Tabs class="w-full mt-2" default-value="pagamentos">
          <TabsList class="w-full">
            <TabsTrigger value="pagamentos" class="w-full">Pagamentos</TabsTrigger>
            <TabsTrigger value="cobrancas" class="w-full">Cobranças</TabsTrigger>
          </TabsList>
          <TabsContent value="pagamentos" class="w-full">
            <ScrollArea class="max-h-[70vh] w-full overflow-y-auto">
              <PagamentosList class="w-full" :data="pagamentosData" />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="cobrancas" class="w-full">
            <ScrollArea class="max-h-[70vh] w-full overflow-y-auto">
              <CobrancaList class="w-full" :data="cobrancasData" />
            </ScrollArea>
          </TabsContent>
        </Tabs>

      </Row>

    </div>
  </div>
</template>
