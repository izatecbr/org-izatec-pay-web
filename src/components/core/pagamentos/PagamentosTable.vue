<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client';
import ComprovanteDownloadList from '@/components/common/arquivos/ComprovanteDownloadList.vue';
import DialogUploadArquivo from '@/components/common/dialogs/DialogUploadArquivo.vue';
import Row from '@/components/core/Row.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AnexoOrigemLocal } from '@/constants/app/anexo-origem-local';
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import Column from '../Column.vue';
import PagamentosDialogCompensacao from './PagamentosDialogCompensacao.vue';
import PagamentosDialogQuitacao from './PagamentosDialogQuitacao.vue';
import PagementosTableDialogIntegracao from './PagementosTableDialogIntegracao.vue';

const { data } = defineProps(['data']);
const emits = defineEmits(['fetchData'])

const { toast } = useToast()
const { publicPagamentos, anexos } = useFilesAPI();

const loading = ref<{ [key: string]: boolean }>({});
const loadingPdf = ref<{ [key: string]: boolean }>({});
const imageURL = ref<string | null>(null);

const dialogOpen = ref(false)
const dialogQuitacaoOpen = ref(false)
const dialogUploadOpen = ref(false)
const dialogGeracaoIntegracao = ref(false)

const listAnexos = ref([])
const itemSelecionado = ref<any>(null)

const handlOpenDialogUpload = (item: any) => {
  itemSelecionado.value = item
  dialogUploadOpen.value = true
}

const handleOpenDialogCompensacao = async (item: any) => {
  itemSelecionado.value = item
  dialogOpen.value = true
}

const handleOpenDialogIntegracao = (item: any) => {
  itemSelecionado.value = item
  dialogGeracaoIntegracao.value = true
}

const handleOpenDialogQuitacao = (item: any) => {
  itemSelecionado.value = item
  dialogQuitacaoOpen.value = true
}

const handleListAnexos = async (item: any) => {
  const { data } = await anexos.list(item.id, AnexoOrigemLocal.PAGAMENTO.value)
  listAnexos.value = data.body || []
}

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

const showButtonDetails = (row: any) => {
  return row?.integracao?.conteudo || row?.integracao?.link
}

const handleVisualizarImpressao = async (id: number) => {

  loadingPdf.value[id] = true

  try {
    const response = await publicPagamentos.pdf(id);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (e: any) {
    toast({
      title: "Erro ao gerar impressão",
      duration: 1000,
    });
  } finally {
    loadingPdf.value[id] = false
  }
};


const vencimentoIsAtrasado = (vencimento: any) => {
  const vencimentoDate = new Date(vencimento)
  const hoje = new Date()
  return vencimentoDate > hoje
}

</script>


<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome do Sacado</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Geração</TableHead>
        <TableHead>Previsão</TableHead>
        <TableHead>Status</TableHead>
        <!--<TableHead>Código Ext.</TableHead> -->
        <TableHead>R$ Original</TableHead>
        <TableHead>R$ Pago</TableHead>
        <TableHead>Parcela</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody v-if="data.length > 0">
      <TableRow v-for="row in data" :key="row.id">
        <TableCell>{{ row.sacado?.nomeCompleto || 'Não informado' }}</TableCell>
        <TableCell>
          <TooltipProvider v-if="row?.observacao">
            <Tooltip>
              <TooltipTrigger as-child>
                <p class=" cursor-pointer">
                  {{ row?.mensagem || 'Não informado' }}
                </p>
              </TooltipTrigger>
              <TooltipContent>{{ row?.observacao }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p v-else>{{ row?.mensagem || 'Não informado' }}</p>
        </TableCell>
        <TableCell>{{ Utils.formatDateToBR(row.dataGeracao?.dia) }}</TableCell>
        <TableCell>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <p class="cursor-pointer"> {{ Utils.formatDateToBR(row.dataPrevista?.dataHora) }} </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vencimento - {{ Utils.formatDateToBR(row?.dataVencimento?.dataHora) }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


        </TableCell>
        <TableCell>
          <Badge :variant="BadgeVariant[row.status?.id]?.value || 'default'" class="mr-2">
            {{ row.status?.nome || '-' }}
          </Badge>
        </TableCell>
        <!--<TableCell>{{ row.codigoExterno || '-' }}</TableCell> -->
        <TableCell>{{ Utils.formatToBRL(row.valor.original) || '-' }}</TableCell>
        <TableCell>{{ Utils.formatToBRL(row.valor.pago) || '-' }}</TableCell>
        <TableCell>{{ row.parcela || '-' }}</TableCell>
        <TableCell>
          <Row gap="6px" align-items="flex-end" justify-content="flex-end">
            <Popover v-if="row.status.id !== BadgeVariant.COMPENSADO.value">
              <PopoverTrigger as-child>
                <Button size="sm" variant="outline">
                  <Icon icon="lucide:chevron-down" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-[220px] p-1.5">
                <Column gap=".45rem">
                  <Popover v-if="row?.integracao?.conteudo">
                    <PopoverTrigger as-child>
                      <Button size="sm" @click="exibirQrCode(row.id)" :loading="loading[row.id]" variant="outline">
                        <Row class=" w-full" align-items="center" justify-content="space-between">
                          <p>Qr Code</p>
                          <Icon icon="lucide:qr-code" />
                        </Row>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Skeleton v-if="loading[row.id]" class="h-[250px] w-[250px] rounded-xl" />
                      <div v-else>
                        <img :src="imageURL" alt="QrCode" v-if="imageURL" />
                        <div class="flex flex-col items-center justify-center gap-2" v-else>
                          <Icon class="w-12 h-12 text-muted-foreground" icon="lucide:image-off" />
                          <p class="text-center text-muted-foreground">
                            Não há QR Code disponível
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button v-if="row?.integracao?.conteudo" size="sm" @click="copy(row.integracao?.conteudo)"
                    variant="outline">
                    <Row class=" w-full" align-items="center" justify-content="space-between">
                      <p>Copiar código</p>
                      <Icon class="text-sm" icon="lucide:copy" />
                    </Row>
                  </Button>

                  <Button v-if="row?.integracao?.link" size="sm" @click="copy(row.integracao?.link)" variant="outline">
                    <Row class=" w-full" align-items="center" justify-content="space-between">
                      <p>Copiar Link</p>
                      <Icon class="text-sm" icon="lucide:link-2" />
                    </Row>
                  </Button>


                  <Button v-if="vencimentoIsAtrasado(row?.dataVencimento?.dataHora)" :loading="loadingPdf[row.id]"
                    @click="handleVisualizarImpressao(row.id)" variant="outline" size="sm">
                    <Row class=" w-full" align-items="center" justify-content="space-between">
                      <p>Impressão</p>
                      <Icon icon="lucide:printer" />
                    </Row>
                  </Button>

                  <Button v-else @click="handleOpenDialogIntegracao(row)" variant="outline" size="sm">
                    <Row class="w-full" align-items="center" justify-content="space-between">
                      <p>Gerar Nova Integração</p>
                      <Icon class="text-lg" icon="lucide:refresh-ccw" />
                    </Row>
                  </Button>


                </Column>
              </PopoverContent>
            </Popover>

            <!--<Popover v-if="row.sacado">
              <PopoverTrigger>
                <Button variant="outline" size="sm">
                  <Icon icon="ph:user" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                  <Column>
                    <strong>Nome</strong>
                    <p>{{ row.sacado?.nomeCompleto || '-' }}</p>
                  </Column>
                  <Column>
                    <strong>Documento</strong>
                    <p>{{ row.sacado?.documento || '-' }}</p>
                  </Column>
                </div>
              </PopoverContent>
            </Popover>-->

            <Popover v-if="row?.compensacao">
              <PopoverTrigger>
                <Button @click="handleListAnexos(row)" variant="outline" size="sm">
                  <Icon icon="lucide:receipt" />
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <Badge v-if="row?.compensacao" variant="success" class="col-span-2 w-full px-0 pt-0">
                  <div class=" text-foreground text-xs grid grid-cols-2 w-full gap-2">
                    <Row align-items="center" justify-content="space-between" gap="0.5rem"
                      class="col-span-2 w-full py-1 px-2 bg-green-500/50">
                      <h3 class="font-bold text-balance text-secondary-foreground">
                        PAGAMENTO
                      </h3>
                      <TooltipProvider v-if="row?.compensacao">
                        <Tooltip>
                          <TooltipTrigger as-child>
                            <Button class="p-1 h-fit" @click="handlOpenDialogUpload(row)" variant="outline" size="sm">
                              <Icon icon="lucide:upload" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Upload de Comprovante</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Row>
                    <Column class=" px-2">
                      <strong>Data</strong>
                      <p>{{ Utils.formatDateToBR(row.compensacao.data?.dataHora) || '-' }}</p>
                    </Column>
                    <Column class=" px-2">
                      <strong>Comprovante</strong>
                      <p>{{ row?.compensacao?.comprovante || '-' }}</p>
                    </Column>
                    <Column class=" px-2">
                      <strong>R$ Pago</strong>
                      <p>{{ Utils.formatToBRL(row?.valor?.pago) || '-' }}</p>
                    </Column>
                    <Column class=" px-2">
                      <strong>Observação</strong>
                      <p>{{ row?.compensacao?.observacao || '-' }}</p>
                    </Column>
                  </div>
                </Badge>
                <div class="mt-2">
                  <ComprovanteDownloadList :data="listAnexos" />
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger as-child>
                <Button size="sm" variant="outline">
                  <Icon icon="ic:round-edit" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-[220px] p-1.5">
                <Column gap=".45rem">
                  <Button v-if="row.status.id === BadgeVariant.GERADO.value" @click="handleOpenDialogCompensacao(row)"
                    variant="outline" size="sm">
                    <Row class="w-full" align-items="center" justify-content="space-between">
                      <p>Compensação Manual</p>
                      <Icon class="text-lg" icon="ph:money" />
                    </Row>
                  </Button>

                </Column>
              </PopoverContent>
            </Popover>

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




            <!-- Dialogs -->

            <PagamentosDialogCompensacao v-if="dialogOpen" @submit="emits('fetchData')" :item="itemSelecionado"
              v-model="dialogOpen" />

            <DialogUploadArquivo v-if="dialogUploadOpen" :item="itemSelecionado"
              :anexo-origem="AnexoOrigemLocal.PAGAMENTO.value" @fetch-data="handleListAnexos(row)"
              v-model="dialogUploadOpen" />

            <PagamentosDialogQuitacao v-if="dialogQuitacaoOpen" @submit="emits('fetchData')" :item="itemSelecionado"
              v-model="dialogQuitacaoOpen" />

            <PagementosTableDialogIntegracao @fetch-data="dialogGeracaoIntegracao = false; emits('fetchData')"
              :item="itemSelecionado" v-model="dialogGeracaoIntegracao" />

            <!-- Dialogs-End -->
          </Row>
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
