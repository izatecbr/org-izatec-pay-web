<script setup lang="ts">
import { useAPI } from "@/api/http-client";
import NotificacoesItemList from "@/components/core/notificacoes/NotificacoesItemList.vue";
import NotificacoesTable from "@/components/core/notificacoes/NotificacoesTable.vue";
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs } from '@/components/ui/tabs';
import { useResponsive } from "@/composables/useResponsive";
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { onMounted, ref,watch } from "vue";


const { pagamentos } = useAPI()
const { isDesktop } = useResponsive();

const status = ref(BadgeVariant.GERADO.value)
const date = ref<any>(new Date())

const pagamentosData = ref([])
const loading = ref(false)

const fetchPagamentos = async () => {
  loading.value = true

  const params = {
    dataInicio: Utils.formatDateISO(date?.value),
    dataFim: Utils.formatDateISO(date?.value),
    status: status.value
  }
  const { body } = await pagamentos.listagem(params)
  pagamentosData.value = body ?? []
  loading.value = false
}

const clearDataInput = async () => {
    date.value = undefined
    await fetchPagamentos()
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
    <page-header title="Notificações" />

    <Tabs :default-value="status" class="space-y-4">
      <Row flex-wrap="wrap" gap="10px" justify-content="flex-end" class="w-full relative">
        <Row gap="10px" flex-wrap="wrap">
          <Row gap="2px">
                <DatePicker :loading="loading" v-model="date" />
                <!-- <Button v-if="date" @click="clearDataInput()" variant="destructive">
                    <Icon class="text-lg" icon="ph:calendar-slash" />
                </Button> -->
            </Row>
          <!--<Button :loading="loading" @click="fetchPagamentos()" variant="outline">
            <Icon class="mr-2" icon="lucide:funnel" />
            Buscar
          </Button> -->
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
