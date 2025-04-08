<script setup lang="ts">
import { useAPI } from "@/api/http-client";
import NotificacoesItemList from "@/components/core/notificacoes/NotificacoesItemList.vue";
import NotificacoesTable from "@/components/core/notificacoes/NotificacoesTable.vue";
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/daterange-picker';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/toast";
import { useResponsive } from "@/composables/useResponsive";
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from "vue";


const { toast } = useToast()
const { pagamentos } = useAPI()
const { isDesktop } = useResponsive();

const status = ref(BadgeVariant.GERADO.value)
const date = ref({
  start: new Date(),
  end: new Date()
})
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
    dataInicio: Utils.formatDateISO(date.value.start),
    dataFim: Utils.formatDateISO(date.value.end),
    status: status.value
  }
  const { body } = await pagamentos.listagem(params)
  pagamentosData.value = body ?? []
  loading.value = false
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
</script>

<template>
  <div>
    <page-header title="Notificações" />

    <Tabs :default-value="status" class="space-y-4">
      <Row flex-wrap="wrap" gap="10px" justify-content="space-between" class="w-full relative">
        <Row gap="10px" flex-wrap="wrap">
          <DateRangePicker :loading="loading" v-model="date" />
          <Button :loading="loading" @click="fetchPagamentos()" variant="outline">
            <Icon class="mr-2" icon="lucide:funnel" />
            Buscar
          </Button>
        </Row>
      </Row>

      <div class="w-full">
        <NotificacoesTable class="w-full" :data="pagamentosData" v-if="isDesktop" />
        <ScrollArea class="max-h-[70vh] w-full overflow-y-auto" v-else>
          <NotificacoesItemList class="w-full" :data="pagamentosData" />
        </ScrollArea>
      </div>
    </Tabs>
  </div>
</template>
