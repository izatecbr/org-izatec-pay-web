<script lang="ts" setup>
import { useAPI } from '@/api/http-client';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import Column from '../Column.vue';
import CobrancaPagamentosList from './CobrancaPagamentosList.vue';
import CobrancasPagamentosSheet from './CobrancasPagamentosSheet.vue';

const { data } = defineProps(['data']);

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
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Sacado</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>R$ Cobrança</TableHead>
                <TableHead>R$ Cobrado</TableHead>
                <TableHead>Prox. Vencto.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detalhe</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data.length > 0">
            <TableRow v-for="(row, index) in data" :key="row.id">
                <TableCell class="text-nowrap">{{ ((row.sacado?.nomeCompleto || '-') + ' - ' +
                    (row.sacado?.documento || '-')) }}</TableCell>
                <TableCell>{{ Utils.truncate(row.titulo, 18) }}</TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valorCobranca) }}</TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valorCobrado) }}</TableCell>
                <TableCell>
                    <p>{{ Utils.formatDateToBR(row.negociacao?.proximoVencimento) || '-' }}</p>
                </TableCell>
                <TableCell>
                    <Badge :variant="CobrancaStatusVariant[row.status].value" class="mr-2">{{ row.status }}</Badge>
                </TableCell>
                <TableCell class="flex nowrap gap-1">
                    <Popover>
                        <PopoverTrigger>
                            <Button variant="outline" size="sm">
                                <Icon icon="ph:user" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2" v-if="row.sacado">
                                <Column>
                                    <strong>Nome</strong>
                                    <p>{{ row.sacado.nomeCompleto || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Documento</strong>
                                    <p>{{ row.sacado.documento || '-' }}</p>
                                </Column>
                            </div>
                            <template v-else>
                                <p>Não informado</p>
                            </template>
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger>
                            <Button variant="outline" size="sm">
                                <Icon icon="lucide:banknote" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                                <Column>
                                    <strong>Dia Vencto.</strong>
                                    <p>{{ row.negociacao?.diaVencimento || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Prox. Vencto.</strong>
                                    <p>{{ Utils.formatDateToBR(row.negociacao?.proximoVencimento) || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Qtd. Parcel.</strong>
                                    <p>{{ row.quantidadeParcelas || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Prox. Parcel.</strong>
                                    <p>{{ row.negociacao?.proximaParcela || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Modelo</strong>
                                    <p>{{ row.negociacao?.modelo || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Recorrencia</strong>
                                    <p>{{ row.negociacao?.recorrencia || '-' }}</p>
                                </Column>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Popover v-if="row?.endereco" >
                        <PopoverTrigger>
                            <Button variant="outline" size="sm">
                                <Icon icon="ph:house" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs">
                                <p>{{ row?.endereco || 'Não informado' }}</p>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <CobrancasPagamentosSheet v-model="sheetOpen" :titulo="tituloCobranca">
                        <Button @click="listarPagamentos(row.id, row.titulo)" :loading="loading[row.id]"
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
                </TableCell>

            </TableRow>
        </TableBody>
        <TableBody v-else>
            <TableRow>
                <TableCell colspan="8" class="text-center pt-8 text-muted-foreground">
                    Nenhum registro encontrado
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
