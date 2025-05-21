<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client';
import ComprovanteDownloadList from '@/components/common/arquivos/ComprovanteDownloadList.vue';
import DialogUploadArquivo from '@/components/common/dialogs/DialogUploadArquivo.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnexoOrigemLocal } from '@/constants/app/anexo-origem-local';
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import Column from '../Column.vue';
import PrevisoesDialogCompensacao from '../previsoes/PrevisoesDialogCompensacao.vue';
import PrevisoesDialogQuitacao from '../previsoes/PrevisoesDialogQuitacao.vue';
import Row from '../Row.vue';

const emtis = defineEmits(['fetchData'])
const props = defineProps(['data'])

const { anexos } = useFilesAPI();

const dialogOpen = ref(false)
const dialogQuitacaoOpen = ref(false)
const itemSelecionado = ref(null)
const dialogUploadOpen = ref(false)


const listAnexos = ref([])

const handleOpenDialogCompensacao = (item: any) => {
    itemSelecionado.value = item
    dialogOpen.value = true
}


const handlOpenDialogUpload = (item: any) => {
    itemSelecionado.value = item
    dialogUploadOpen.value = true
}

const handleOpenDialogQuitacao = (item: any) => {
    itemSelecionado.value = item
    dialogQuitacaoOpen.value = true
}

const handleListAnexos = async (item: any) => {
    const { data } = await anexos.list(item.id, AnexoOrigemLocal.DESPESA.value)
    listAnexos.value = data.body || []
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
                                <Icon icon="ph:list-bullets" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                                <Column>
                                    <strong>Dt. Geração</strong>
                                    <p>{{ Utils.formatDateToBR(row.dataGeracao?.dataHora) || '-' }}</p>
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

                    <Popover v-if="row?.compensacao">
                        <PopoverTrigger>
                            <Button @click="handleListAnexos(row)" variant="outline" size="sm">
                                <Icon icon="lucide:receipt" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Badge variant="success" class="col-span-2 w-full px-0 pt-0">
                                <div class=" text-foreground text-xs grid grid-cols-2 w-full gap-2">
                                    <Row align-items="center" justify-content="space-between" gap="0.5rem"
                                        class="col-span-2 w-full py-1 px-2 bg-green-500/50">
                                        <h3 class="font-bold text-balance text-secondary-foreground">
                                            PAGAMENTO
                                        </h3>
                                        <TooltipProvider v-if="row?.compensacao">
                                            <Tooltip>
                                                <TooltipTrigger as-child>
                                                    <Button class="p-1 h-fit" @click="handlOpenDialogUpload(row)"
                                                        variant="outline" size="sm">
                                                        <Icon icon="lucide:upload" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Upload de Comprovante</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Row>
                                    <Column class=" px-2">
                                        <strong>Data</strong>
                                        <p>{{ Utils.formatDateToBR(row.compensacao.data?.dataHora) || '' }}</p>
                                    </Column>
                                    <Column class=" px-2">
                                        <strong>Comprovante</strong>
                                        <p>{{ row?.compensacao.comprovante || '' }}</p>
                                    </Column>
                                    <Column class=" px-2">
                                        <strong>R$ Pago</strong>
                                        <p>{{ Utils.formatToBRL(row?.valor.pago) || '' }}</p>
                                    </Column>
                                    <Column class=" px-2">
                                        <strong>Observação</strong>
                                        <p>{{ row?.compensacao.observacao || '' }}</p>
                                    </Column>
                                </div>
                            </Badge>
                            <div class="mt-2">
                                <ComprovanteDownloadList :data="listAnexos" />
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Popover v-if="row?.endereco">
                        <PopoverTrigger>
                            <Button variant="outline" size="sm">
                                <Icon icon="ph:map-pin-line" />
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


                    <TooltipProvider v-if="row?.valor?.amortizado && row.status.id === BadgeVariant.GERADO.value">
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button @click="handleOpenDialogQuitacao(row)" variant="outline" size="sm">
                                    <Icon icon="ph:checks" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Quitar pagamento manualmente.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <DialogUploadArquivo v-if="dialogUploadOpen" :item="itemSelecionado"
                        :anexo-origem="AnexoOrigemLocal.DESPESA.value" @fetch-data="handleListAnexos(row)"
                        v-model="dialogUploadOpen" />


                    <PrevisoesDialogQuitacao v-if="dialogQuitacaoOpen" @submit="emtis('fetchData')"
                        :item="itemSelecionado" v-model="dialogQuitacaoOpen" />


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
