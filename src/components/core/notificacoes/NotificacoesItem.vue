<script lang="ts" setup>
import { useAPI } from '@/api/http-client'
import Column from '@/components/core/Column.vue'
import Row from '@/components/core/Row.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TipoNotificacao } from '@/constants/app/tipo-notificacao.interface'
import { BadgeVariant } from '@/constants/ui/badge-variants.interface'
import { cn } from '@/lib/utils'
import Utils from '@/utils/index'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const props = defineProps(['item'])

const loading = ref<{ [key: string]: boolean }>({});

const { toast } = useToast()
const { notificacoes } = useAPI();

const notificar = async (id: any, tipo: string) => {
  loading.value[`${id}${tipo}`] = true;
  const { status, success } = (tipo == TipoNotificacao.EMAIL.value)
    ? await notificacoes.notificarEmail(id) :
    await notificacoes.notificarWhatsapp(id)
  toast({
    title: status.message,
    description: status?.suggestion || '',
    variant: success ? 'default' : 'destructive',
    duration: 1300,
  });
  loading.value[`${id}${tipo}`] = false;
};


</script>

<template>
  <Card :class="cn('p-1.5', $attrs.class ?? '')">
    <CardHeader :class="'p-1'">
      <Column>
        <Row justify-content="space-between">
          <h5 class="font-semibold">{{ item.mensagem }}</h5>
          <Row gap="10px">
            <Badge class="h-fit" :variant="BadgeVariant[item.status.id].value">
              {{ BadgeVariant[item.status.id].label }}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button :loading="loading[`${item.id}${TipoNotificacao.WHATSAPP.value}`]" size="sm"
                    @click="notificar(item.id, TipoNotificacao.WHATSAPP.value)" variant="outline">
                    <Icon class="text-sm" icon="ic:baseline-whatsapp" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notificar via Whatsapp</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button :loading="loading[`${item.id}${TipoNotificacao.EMAIL.value}`]" size="sm"
                    @click="notificar(item.id, TipoNotificacao.EMAIL.value)" variant="outline">
                    <Icon class="text-sm" icon="lucide:mail" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notificar via Email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Row>
        </Row>
        <p class="text-xs">{{ item.sacado?.nomeCompleto }}</p>
      </Column>
    </CardHeader>
    <CardContent :class="'p-1.5 grid gap-1.5'">
      <Row justify-content="space-between">
        <Column>
          <label class="text-xs" for="data-vencimento">Vencimento</label>
          <p id="data-vencimento" class="font-bold">{{ Utils.formatDateToBR(item.dataVencimento.dataHora) }}</p>
        </Column>
        <Column align-items="flex-end">
          <label class="text-xs" for="data-geracao">Geração</label>
          <p id="data-geracao" class="font-bold">{{ Utils.formatDateToBR(item.dataGeracao.dia) }}</p>
        </Column>
      </Row>
      <Row justify-content="space-between">
        <Column>
          <label class="text-xs" for="valor">R$ Valor</label>
          <p id="valor" class="font-bold">{{ Utils.formatToBRL(item.valor.original) }}</p>
        </Column>
        <Column>
          <label class="text-xs text-teal-400" for="valor">R$ Pago</label>
          <p id="valor" class="font-bold text-teal-400">{{ Utils.formatToBRL(item.valor.pago) }}</p>
        </Column>
        <Column align-items="flex-end">
          <label class="text-xs" for="parcela">Parcela</label>
          <p id="parcela" class="font-bold">{{ item.parcela }}</p>
        </Column>
      </Row>
    </CardContent>
    <CardFooter :class="'p-0'"></CardFooter>
  </Card>
</template>