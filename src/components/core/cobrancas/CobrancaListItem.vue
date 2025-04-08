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
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface'
import { cn } from '@/lib/utils'
import Utils from '@/utils/index'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import CobrancaPagamentosList from './CobrancaPagamentosList.vue'
import CobrancasPagamentosSheet from './CobrancasPagamentosSheet.vue'

const props = defineProps(['item'])


const { toast } = useToast()
const { cobrancas } = useAPI()

const sheetOpen = ref(false)
const loading = ref<{ [key: number]: any }>({})
const pagamentos = ref(null)
const tituloCobranca = ref('')

const listarPagamentos = async (id: number, titulo: string) => {
    loading.value[id] = true
    const { success, status, body } = await cobrancas.pagamentos(id)

    if (success) {
        pagamentos.value = body
        tituloCobranca.value = `${titulo} - ${id}`
        sheetOpen.value = true
    } else {
        toast({
            title: status.message,
            description: status?.suggestion || '',
            variant: success ? 'default' : 'destructive',
            duration: 1300,
        });
    }
    loading.value[id] = false
}

</script>

<template>
    <Card :class="cn('p-1.5', $attrs.class ?? '')">
        <CardHeader :class="'p-1'">
            <Column>
                <Row justify-content="space-between">
                    <h5 class="font-semibold">{{ item.titulo }}</h5>
                    <Row gap="10px">
                        <Badge :variant="CobrancaStatusVariant[item.status].value" class="mr-2 h-fit">{{ item.status }}</Badge>
                        <CobrancasPagamentosSheet v-model="sheetOpen" :titulo="tituloCobranca">
                            <Button @click="listarPagamentos(item.id, item.titulo)" :loading="loading[item.id]"
                                variant="outline" size="sm">
                                <Icon icon="lucide:calendar-days" />
                            </Button>
                            <template #data>
                                <div v-if="pagamentos" class="w-full">
                                    <CobrancaPagamentosList :data="pagamentos" />
                                </div>
                                <p v-else class="text-muted-foreground text-xs">Nenhum pagamento encontrado</p>
                            </template>
                        </CobrancasPagamentosSheet>
                    </Row>
                </Row>
            </Column>
        </CardHeader>
        <CardContent :class="'p-1.5 grid gap-1.5'">
            <Row justify-content="space-between">
                <Column>
                    <label class="text-xs" for="data-vencimento">Vencimento</label>
                    <p id="data-vencimento" class="font-bold">{{ Utils.formatDateToBR(item.negociacao?.proximoVencimento)
                    }}
                    </p>
                </Column>
                <Row justify-content="space-between" class="w-[63%]">
                    <Column>
                        <label class="text-xs" for="valor-cobranca">Nome</label>
                        <p id="valor-cobranca" class="font-bold">{{ item.sacado.nomeCompleto }}</p>
                    </Column>
                    <Column>
                        <label class="text-xs" for="valor-cobranca">R$ Cobrança</label>
                        <p id="valor-cobranca" class="font-bold">{{ Utils.formatToBRL(item.valorCobranca) }}</p>
                    </Column>
                </Row>
            </Row>

            <Row justify-content="space-between">


                <Column align-items="flex-end">
                    <label class="text-xs" for="data-geracao">Dia</label>
                    <p id="data-geracao" class="font-bold">{{ item.negociacao?.diaVencimento }}</p>
                </Column>
                <Row justify-content="space-between" class="w-[63%]">
                    <Column>
                        <label class="text-xs text-start" for="data-pagamento">Documento</label>
                        <p id="data-pagamento" class="font-bold text-start">{{ item.sacado?.documento || '-' }}
                        </p>
                    </Column>
                    <Column>
                        <label class="text-xs" for="data-pagamento">R$ Cobrado</label>
                        <p id="data-pagamento" class="font-bold">{{ Utils.formatToBRL(item.valorCobrado) }}
                        </p>
                    </Column>
                </Row>
            </Row>

        </CardContent>
        <CardFooter :class="'p-0'"></CardFooter>
    </Card>
</template>