<script setup lang="ts">
import { useFilesAPI } from '@/api/file-http-client';
import { useAPI } from '@/api/http-client';
import ComprovanteDownloadList from '@/components/common/arquivos/ComprovanteDownloadList.vue';
import DialogConfirmacaoAcao from '@/components/common/dialogs/DialogConfirmacaoAcao.vue';
import DialogUploadArquivo from '@/components/common/dialogs/DialogUploadArquivo.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnexoOrigemLocal } from '@/constants/app/anexo-origem-local';
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import Column from '../Column.vue';
import Row from '../Row.vue';
import PrevisoesDespesasList from './PrevisoesDespesasList.vue';
import PrevisoesDespesasSheet from './PrevisoesDespesasSheet.vue';

const props = defineProps(['data'])
const emits = defineEmits(['fetch-data']);

const { previsoes } = useAPI()
const { anexos } = useFilesAPI();
const { toast } = useToast()

const dialogConfirmacaoDespesaManual = ref(false)
const dialogConfirmacaoCancelamentoPrevisao = ref(false)
const sheetOpen = ref(false)

const loading = ref<{ [key: number]: any }>({})
const despesas = ref(null)

const motivoCancelamento = ref('')
const loadingCancelamento = ref<{ [key: number]: any }>({})
const tituloCobranca = ref('')
const loadingDespesaManual = ref<{ [key: number]: any }>({})
const itemSelecionado = ref<any>(null)
const dialogUploadOpen = ref(false)

const listAnexos = ref([])

const handlOpenDialogUpload = (item: any) => {
    itemSelecionado.value = item
    dialogUploadOpen.value = true
}

const handleListAnexos = async (item: any) => {
    const { data } = await anexos.list(item.id, AnexoOrigemLocal.PREVISAO.value);
    listAnexos.value = data.body || [];
};

const handleListarDespesas = async (id: number, titulo: string) => {
    loading.value[id] = true
    const { status, success, body } = await previsoes.listarDespesas(id)
    if (success) {
        despesas.value = body
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

const gerarDespesaManualmente = async (id: number) => {
    loadingDespesaManual.value[id] = true
    const { success, status, body } = await previsoes.gerarDespesaManual(id)
    toast({
        title: status.message,
        description: status?.suggestion || '',
        variant: success ? 'default' : 'destructive',
        duration: 1300,
    });

    if (success) {
        dialogConfirmacaoDespesaManual.value = false
        emits('fetch-data')
    }
    loadingDespesaManual.value[id] = false
}

const cancelarCobranca = async (id: number) => {
    loadingCancelamento.value[id] = true
    const { success, status, body } = await previsoes.cancelamento(id, motivoCancelamento.value)

    toast({
        title: status.message,
        description: status?.suggestion || '',
        variant: success ? 'default' : 'destructive',
        duration: 1300,
    });

    if (success) {
        dialogConfirmacaoCancelamentoPrevisao.value = false
        emits('fetch-data')
    }
    motivoCancelamento.value = ''

    loadingCancelamento.value[id] = false
}



const handleOpenDialog = (row: any, updateDialog: (value: boolean) => void) => {
    itemSelecionado.value = row;
    updateDialog(true);
};
const descricaoDefault = "Gerando o pagamento manual de"
const descricaoCancelamentoDefault = "Cancelando a previsão de"
const getDescricao = (message: string = descricaoDefault) => {
    return itemSelecionado.value?.titulo ? `${message}: ${itemSelecionado.value?.titulo}. Parcela: ${itemSelecionado.value?.negociacao?.proximaParcela} ${Utils.formatDateToBR(itemSelecionado.value?.negociacao?.proximoVencimento)}.` : ''
}


</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Dt. Geração</TableHead>
                <TableHead>Prox. Vencto.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Favorecido</TableHead>
                <TableHead>R$ Despesa</TableHead>
                <TableHead>R$ Pago</TableHead>

                <TableHead>Detalhe</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data.length > 0">
            <TableRow v-for="row in data" :key="row.id">
                <TableCell>{{ row?.titulo || '' }}</TableCell>
                <TableCell>{{ Utils.formatDateToBR(row.dataGeracao?.dia) }}</TableCell>
                <TableCell>{{ Utils.formatDateToBR(row.negociacao?.proximoVencimento) }}</TableCell>
                <TableCell>
                    <Badge :variant="CobrancaStatusVariant[row.status.id]?.value || 'outline'" class="mr-2">
                        {{ row.status.nome || '-' }}
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

                <TableCell class=" flex gap-1">
                    <Popover>
                        <PopoverTrigger>
                            <Button @click="handleListAnexos(row)" variant="outline" size="sm">
                                <Icon icon="lucide:paperclip" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Badge variant="success" class=" w-full ">
                                <div class="text-foreground text-xs w-full ">
                                    <Row align-items="center" justify-content="space-between" gap="0.5rem"
                                        class="w-full flex items-center ">
                                        <h3 class="font-bold w-full text-balance text-secondary-foreground">
                                            Upload de Comprovante
                                        </h3>
                                        <Button class="p-1 h-fit" @click="handlOpenDialogUpload(row)" variant="outline"
                                            size="sm">
                                            <Icon icon="lucide:upload" />
                                        </Button>
                                    </Row>
                                </div>
                            </Badge>

                            <div class="mt-2">
                                <ComprovanteDownloadList :data="listAnexos" />
                            </div>
                        </PopoverContent>
                    </Popover>

                    <DialogUploadArquivo v-if="dialogUploadOpen" :item="itemSelecionado"
                        :anexo-origem="AnexoOrigemLocal.PREVISAO.value" @fetch-data="handleListAnexos(row)"
                        v-model="dialogUploadOpen" />

                    <Popover>
                        <PopoverTrigger>
                            <Button variant="outline" size="sm">
                                <Icon icon="ph:list-bullets" />
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
                                    <p>{{ row.negociacao?.modelo?.nome || '-' }}</p>
                                </Column>
                                <Column>
                                    <strong>Recorrencia</strong>
                                    <p>{{ row.negociacao?.recorrencia?.descricao || '-' }}</p>
                                </Column>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <PrevisoesDespesasSheet v-model="sheetOpen" :titulo="tituloCobranca">
                        <template #data>
                            <div v-if="despesas" class="w-full">
                                <PrevisoesDespesasList :data="despesas" />
                            </div>
                            <p v-else class="text-muted-foreground text-xs">Nenhuma despesa encontrada</p>
                        </template>
                    </PrevisoesDespesasSheet>

                    <Popover>
                        <PopoverTrigger as-child>
                            <Button size="sm" variant="outline">
                                <Icon icon="ic:round-edit" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-[180px] p-1.5">
                            <Column gap=".45rem">
                                <Button v-if="row.status.id == CobrancaStatusVariant.ATIVA.value"
                                    @click="handleOpenDialog(row, (value) => dialogConfirmacaoDespesaManual = value)"
                                    variant="outline" size="sm">
                                    <Row class=" w-full" align-items="center" justify-content="space-between">
                                        <p>Gerar despesa</p>
                                        <Icon icon="lucide:calendar-plus" />
                                    </Row>
                                </Button>

                                <Button v-if="row.status.id == CobrancaStatusVariant.ATIVA.value"
                                    @click="handleOpenDialog(row, (value) => dialogConfirmacaoCancelamentoPrevisao = value)"
                                    variant="outline" size="sm">
                                    <Row class=" w-full" align-items="center" justify-content="space-between">
                                        <p>Cancelar Previsão</p>
                                        <Icon icon="lucide:banknote-x" />
                                    </Row>
                                </Button>
                            </Column>
                        </PopoverContent>
                    </Popover>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button @click="handleListarDespesas(row.id, row.titulo)" :loading="loading[row.id]"
                                    variant="outline" size="sm">
                                    <Icon icon="lucide:calendar-days" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent class="text-xs">
                                <p>Listar Despesas</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <DialogConfirmacaoAcao v-model="dialogConfirmacaoDespesaManual"
                        @submit="gerarDespesaManualmente(row.id)" :loading="loadingDespesaManual[row.id]"
                        titulo="Tem certeza que deseja gerar a despesa manualmente ?">
                        <template #descricao>
                            <div>
                                {{ getDescricao() }}
                            </div>
                        </template>
                    </DialogConfirmacaoAcao>

                    <DialogConfirmacaoAcao v-if="dialogConfirmacaoCancelamentoPrevisao"
                        v-model="dialogConfirmacaoCancelamentoPrevisao" :disabled="motivoCancelamento.length == 0"
                        @submit="cancelarCobranca(row.id)" :loading="loadingCancelamento[row.id]"
                        titulo="Tem certeza que deseja cancelar a previsão ?">
                        <template #descricao>
                            <div class="flex flex-col w-full">
                                <p> {{ getDescricao(descricaoCancelamentoDefault) }}</p>
                                <Input class="mt-2" placeholder="Motivo do cancelamento" v-model="motivoCancelamento" />
                            </div>
                        </template>
                    </DialogConfirmacaoAcao>


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