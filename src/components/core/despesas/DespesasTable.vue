<script lang="ts" setup>
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import Column from '../Column.vue';
import PrevisoesDialogCompensacao from '../previsoes/PrevisoesDialogCompensacao.vue';

const emtis = defineEmits(['fetchData'])
const props = defineProps(['data'])

const dialogOpen = ref(false)
const itemSelecionado = ref(null)

const handleOpenDialogCompensacao = (item: any) => {
    itemSelecionado.value = item
    dialogOpen.value = true
}


</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Favorecido</TableHead>
                <TableHead>R$ Original</TableHead>
                <TableHead>R$ Pago</TableHead>
                <TableHead>Prox. Vencto.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detalhe</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data.length > 0">
            <TableRow v-for="(row, index) in data" :key="row.id">
                <TableCell>{{ row.mensagem }}</TableCell>
                <TableCell class="text-nowrap">{{ ((row.favorecido?.nomeCompleto || '-') + ' - ' +
                    (row.favorecido?.documento || '-')) }}</TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valor.original) }}</TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valor.pago) }}</TableCell>
                <TableCell>
                    <p>{{ Utils.formatDateToBR(row.dataVencimento.dataHora) || '-' }}</p>
                </TableCell>
                <TableCell>
                    <Badge :variant="BadgeVariant[row.status.id].value" class="mr-2">{{ row.status.nome }}</Badge>
                </TableCell>
                <TableCell class="flex nowrap gap-1">
                    <Popover v-if="row?.sacado">
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
                                <Icon icon="ph:dots-three" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                                <Column>
                                    <strong>Dt. Gerção</strong>
                                    <p>{{ Utils.formatDateToBR(row.dataGeracao?.dataHora) || '-'}}</p>
                                </Column>
                                <Column>
                                    <strong>Prox. Vencto.</strong>
                                    <p>{{ Utils.formatDateToBR(row.dataVencimento?.dataHora) || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Parcela Atual</strong>
                                    <p>{{ row?.parcela || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Cod. Externo</strong>
                                    <p>{{ row?.codigoExterno || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Grupo</strong>
                                    <p>{{ row.aplicacao?.grupo || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Categoria</strong>
                                    <p>{{ row.aplicacao?.categoria || '-' }}</p>
                                </Column>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Popover v-if="row?.endereco">
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

                    <TooltipProvider v-if="row.status.id === BadgeVariant.GERADO.value">
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button @click="handleOpenDialogCompensacao(row)" variant="outline" size="sm">
                                    <Icon icon="ph:money" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Compensação manual.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <PrevisoesDialogCompensacao v-if="dialogOpen" @submit="emtis('fetchData')" :item="itemSelecionado"
                        v-model="dialogOpen" />

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
