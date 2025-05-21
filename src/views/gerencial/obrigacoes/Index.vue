<script setup lang="ts">
import { useAPI } from "@/api/http-client";
import CadastrosBadgeSelecionado from "@/components/common/cadastros/CadastrosBadgeSelecionado.vue";
import Column from "@/components/core/Column.vue";
import DespesasList from "@/components/core/despesas/DespesasList.vue";
import ObrigacoesDespesaTable from "@/components/core/obrigacoes/ObrigacoesDespesaTable.vue";
import ObrigacoesPrevisaoTable from "@/components/core/obrigacoes/ObrigacoesPrevisaoTable.vue";
import PrevisoesList from "@/components/core/previsoes/PrevisoesList.vue";
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

const { toast } = useToast();
const { previsoes, despesas } = useAPI();
const { isDesktop } = useResponsive();

const toggleSheetFilterCadastros: () => void = inject('toggleSheetFilterCadastros') as any;
const cadastroSelecionado: any = inject('cadastroSelecionado') as any;

const date = ref<any>({
  start: new Date(),
  end: addDays(new Date(), 30)
});

const despesasData = ref([]);
const previsoesData = ref([]);
const loading = ref<{ [key: string]: boolean }>({});

const params = computed(() => ({
  dataInicio: Utils.formatDateISO(date.value?.start),
  dataFim: Utils.formatDateISO(date.value?.end),
  sacado: cadastroSelecionado?.value?.id
}));

const fetchDespesas = async () => {
  loading.value['despesas'] = true;
  const { body } = await despesas.listagem(Utils.cleanParams(params.value));
  despesasData.value = body ?? [];
  loading.value['despesas'] = false;
};

const fetchPrevisoes = async () => {
  loading.value['previsoes'] = true;
  const { body } = await previsoes.listagem(Utils.cleanParams(params.value));
  previsoesData.value = body ?? [];
  loading.value['previsoes'] = false;
};

const fetchAll = async () => {
  await Promise.all([fetchPrevisoes(), fetchDespesas()]);
};

onMounted(async () => {
  await fetchAll();
});

watch(date, async () => {
  await fetchAll();
});

const totalDespesas = computed<any>(() => {
  const { totalPago, totalRestante, totalGeral } = despesasData.value.reduce(
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


const totalPrevisoes = computed<any>(() => {
  const { totalPago, totalRestante, totalGeral } = previsoesData.value.reduce(
    (acc, item: any) => {
      acc.totalPago += item.valorPago || 0;
      acc.totalRestante += item.valorDespesa - (item.valorPago || 0);
      acc.totalGeral += item.valorDespesa || 0;
      return acc;
    },
    { totalPago: 0, totalRestante: 0, totalGeral: 0 }
  );
  return { totalPago, totalRestante, totalGeral };
});
</script>


<template>
  <div>
    <page-header title="Obrigações" />
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


    <div class="w-full mt-3">
      <Row gap="10px" v-if="isDesktop">
        <Column class="flex-1">
          <Row class="w-full" align-items="center" justify-content="space-between">
            <label class="text-muted-foreground">Despesas</label>
            <Row gap="5px">
              <Badge variant="outline">Total: {{ Utils.formatToBRL(totalDespesas.totalGeral) }}</Badge>
            <!-- <Badge variant="success">Pago: {{ Utils.formatToBRL(totalDespesas.totalPago) }}</Badge>
              <Badge variant="soft" >Restante: {{ Utils.formatToBRL(totalDespesas.totalRestante) }}</Badge> -->
            </Row>
          </Row>
          <ObrigacoesDespesaTable class="w-full" :data="despesasData" />
        </Column>
        <Column class="flex-1">
          <Row class="w-full" align-items="center" justify-content="space-between">
            <label class="text-muted-foreground">Previsões</label>
            <Row gap="5px">
              <Badge variant="outline">Total: {{ Utils.formatToBRL(totalPrevisoes.totalGeral) }}</Badge>
             <!-- <Badge variant="success">Pago: {{ Utils.formatToBRL(totalPrevisoes.totalPago) }}</Badge>
              <Badge variant="soft" >Restante: {{ Utils.formatToBRL(totalPrevisoes.totalRestante) }}</Badge> -->

            </Row>
          </Row>
          <ObrigacoesPrevisaoTable class="w-full" :data="previsoesData" />
        </Column>
      </Row>
      <Row v-else>
        <Tabs class="w-full mt-2" default-value="despesas">
          <TabsList class="w-full">
            <TabsTrigger value="despesas" class="w-full">Despesas</TabsTrigger>
            <TabsTrigger value="previsoes" class="w-full">Previsões</TabsTrigger>
          </TabsList>
          <TabsContent value="despesas" class="w-full">
            <ScrollArea class="max-h-[70vh] w-full overflow-y-auto">
              <DespesasList class="w-full" :data="despesasData" />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="previsoes" class="w-full">
            <ScrollArea class="max-h-[70vh] w-full overflow-y-auto">
              <PrevisoesList class="w-full" :data="previsoesData" />
            </ScrollArea>
          </TabsContent>
        </Tabs>

      </Row>
    </div>
  </div>
</template>
