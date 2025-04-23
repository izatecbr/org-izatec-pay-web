<script setup lang="ts">
import { useAPI } from "@/api/http-client";
import PagamentosForm from '@/components/core/pagamentos/PagamentosForm.vue';
import PagamentosList from '@/components/core/pagamentos/PagamentosList.vue';
import PagamentosSheet from '@/components/core/pagamentos/PagamentosSheet.vue';
import PagamentosTable from '@/components/core/pagamentos/PagamentosTable.vue';
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { DatePicker } from "@/components/ui/date-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/toast";
import { useResponsive } from "@/composables/useResponsive";
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { onMounted, ref,watch } from "vue";


const { toast } = useToast()
const { pagamentos } = useAPI()
const { isDesktop } = useResponsive();

const status = ref(BadgeVariant.GERADO.value)
const date = ref<any>(new Date())
const sheetOpen = ref(false)
const pagamentosData = ref([])
const loading = ref(false)
const loadingForm = ref(false)
const form = ref<any>(null)

const changeStatus = (value: any) => {
  status.value = value
  fetchPagamentos()
}

const fetchPagamentos = async () => {
  loading.value = true

  const params = {
    dataInicio: Utils.formatDateISO(date.value),
    dataFim: Utils.formatDateISO(date.value),
    status: status.value
  }
  const { body } = await pagamentos.listagem(Utils.cleanParams(params))
  pagamentosData.value = body ?? []
  loading.value = false
}

const clearDataInput = async () => {
    date.value = undefined
    await fetchPagamentos()
}


const submit = async (payload: any) => {
  loadingForm.value = true
  const { status, success } = await pagamentos.inserir(payload)

  toast({
    title: status.message,
    description: status?.suggestion || '',
    variant: success ? 'default' : 'destructive',
    duration: 1300,
  });

  if (success) {
    sheetOpen.value = false
    form.value = null
    fetchPagamentos()
  }
  loadingForm.value = false
}

onMounted(async () => {
  await fetchPagamentos()
})


watch(date, async ()=>{
  await fetchPagamentos()
})
</script>

<template>
  <div>
    <page-header title="Pagamentos" />

    <Tabs :default-value="status" class="space-y-4">
      <Row flex-wrap="wrap" gap="10px" justify-content="space-between" class="w-full relative">
        <TabsList>
          <TabsTrigger @click="changeStatus(BadgeVariant.GERADO.value)" :value="BadgeVariant.GERADO.value">
            Gerado
          </TabsTrigger>
          <TabsTrigger @click="changeStatus(BadgeVariant.COMPENSADO.value)" :value="BadgeVariant.COMPENSADO.value">
            Compensado
          </TabsTrigger>
          <!-- <TabsTrigger @click="changeStatus(BadgeVariant.EXPIRADO.value)" :value="BadgeVariant.EXPIRADO.value">
            Expirado
          </TabsTrigger>
          <TabsTrigger @click="changeStatus(BadgeVariant.PENDENTE.value)" :value="BadgeVariant.PENDENTE.value">
            Pendente
          </TabsTrigger> -->
        </TabsList>
        <Row gap="10px" flex-wrap="wrap">
          <Row gap="2px">
                <DatePicker :loading="loading" v-model="date" />
                <!-- <Button v-if="date" @click="clearDataInput()" variant="destructive">
                    <Icon class="text-lg" icon="ph:calendar-slash" />
                </Button> -->
            </Row>
          <PagamentosSheet titulo="Novo Pagamento" v-model="sheetOpen">
            <Button @click="sheetOpen = true" variant="outline">
              Novo
              <Icon class="ml-2 text-lg" icon="lucide:plus" />
            </Button>
            <template #form>
              <PagamentosForm v-model="form" :loading="loadingForm" @on-submit="(payload: any) => submit(payload)" />
            </template>
          </PagamentosSheet>
        </Row>
      </Row>

      <div class="w-full">
        <PagamentosTable class="w-full" :data="pagamentosData" v-if="isDesktop" />
        <ScrollArea class="max-h-[70vh] w-full overflow-y-auto" v-else>
          <PagamentosList class="w-full" :data="pagamentosData" />
        </ScrollArea>
      </div>
    </Tabs>
  </div>
</template>
