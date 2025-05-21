<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client'
import Column from '@/components/core/Column.vue'
import Row from '@/components/core/Row.vue'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { BadgeVariant } from '@/constants/ui/badge-variants.interface'
import { cn } from '@/lib/utils'
import Utils from '@/utils/index'
import { ref } from 'vue'

const props = defineProps(['item'])

const loading = ref<{ [key: string]: boolean }>({});
const imageURL = ref<string | null>(null);

const { toast } = useToast()
const { publicPagamentos } = useFilesAPI();

const exibirQrCode = async (id: any) => {
  loading.value[id] = true;
  try {
    const response = await publicPagamentos.qrcode(id);
    const blob = new Blob([response.data], { type: 'image/png' });
    imageURL.value = URL.createObjectURL(blob);
  } catch (error) {
    imageURL.value = null;
  } finally {
    loading.value[id] = false;
  }
};

const copy = async (text: string) => {
  if (!text) {
    toast({
      title: "Nenhum código disponível",
      description: '',
      duration: 2000,
    });
    return
  }
  Utils.copyToCliboard(text)
  toast({
    title: "Copiado para a area de transferências",
    description: '',
    duration: 2000,
  });
}
</script>

<template>
  <Card :class="cn('p-1.5', $attrs.class ?? '')">
    <CardHeader :class="'p-1'">
      <Column>
        <Row justify-content="space-between" align-items="center">
          <h5 class="font-semibold">{{ item.mensagem ?? '-' }}</h5>
          <Row gap="10px">
            <Badge :variant="BadgeVariant[item.status.id].value" class="mr-2 h-fit">{{ item.status.nome }}</Badge>
          </Row>
        </Row>
        <p class="text-xs">{{ item.favorecido?.nomeCompleto ?? '-' }}</p>
      </Column>
    </CardHeader>
    <CardContent :class="'p-1.5 grid gap-1.5'">
      <Row justify-content="space-between">
        <Column>
          <label class="text-xs" for="data-vencimento">Prox. Vencto.</label>
          <p id="data-vencimento" class="font-bold">{{ Utils.formatDateToBR(item.dataVencimento?.dataHora) ?? '-'
          }}</p>
        </Column>
        <Column align-items="flex-end">
          <label class="text-xs" for="data-geracao">App</label>
          <p id="data-geracao" class="font-bold">{{ item.aplicacao?.grupo ? (item.aplicacao?.grupo + ' - ')  : '-' }} {{ item.aplicacao?.categoria ?? '-' }}</p>
        </Column>
      </Row>
      <Row justify-content="space-between">
        <Column>
          <label class="text-xs" for="valor">R$ Orign.</label>
          <p id="valor" class="font-bold">{{ Utils.formatToBRL(item.valor.original) ?? '-' }}</p>
        </Column>
        <Column>
          <label class="text-xs text-teal-400" for="valor">R$ Pago</label>
          <p id="valor" class="font-bold text-teal-400">{{ Utils.formatToBRL(item.valor.pago) ?? '-' }}</p>
        </Column>
        <Column align-items="flex-end">
          <label class="text-xs" for="parcela">PCL</label>
          <p id="parcela" class="font-bold">{{ item.parcela ?? '-' }}</p>
        </Column>
      </Row>
    </CardContent>
    <CardFooter :class="'p-0'"></CardFooter>
  </Card>
</template>