<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import Column from '../Column.vue';

const props = defineProps(['data'])
</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Dt. Geração</TableHead>
                <TableHead>Dt. Venc</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Favorecido</TableHead>
                <TableHead>R$ Despesa</TableHead>
                <TableHead>R$ Pago</TableHead>
                <TableHead>Qtd PCL.</TableHead>
                <TableHead>Detalhe</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data.length > 0">
            <TableRow v-for="row in data" :key="row.id">
                <TableCell>{{ row?.titulo || '' }}</TableCell>
                <TableCell>{{ Utils.formatDateToBR(row.dataGeracao?.dia) }}</TableCell>
                <TableCell>{{ Utils.formatDateToBR(row.negociacao?.proximoVencimento) }}</TableCell>
                <TableCell>
                    <Badge :variant="CobrancaStatusVariant[row.status]?.value || 'outline'" class="mr-2">
                        {{ row.status || '-' }}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline" size="sm">
                                <Icon icon="ph:user" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2" v-if="row?.favorecido">
                                <Column>
                                    <strong>Nome</strong>
                                    <p>{{ row.favorecido.nomeCompleto || 'Não informado' }}</p>
                                </Column>
                                <Column>
                                    <strong>Documento</strong>
                                    <p>{{ row.favorecido?.documento || 'Não informado' }}</p>
                                </Column>
                            </div>
                            <template v-else>
                                <p>Não informado</p>
                            </template>
                        </PopoverContent>
                    </Popover>
                </TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valorDespesa) || '-' }}</TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valorPago) || '-' }}</TableCell>
                <TableCell>{{ row?.quantidadeParcelas || '-' }}</TableCell>
                <TableCell>
                    <TableCell>
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
                    </TableCell>

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