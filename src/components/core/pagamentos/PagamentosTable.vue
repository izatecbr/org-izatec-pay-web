<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client';
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
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import Column from '../Column.vue';

const { data } = defineProps(['data']);

const { toast } = useToast()
const { publicPagamentos } = useFilesAPI();

const loading = ref<{ [key: string]: boolean }>({});
const imageURL = ref<string | null>(null);

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
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Nome do Sacado</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Dt. Geração</TableHead>
        <TableHead>Dt. Venc</TableHead>
        <TableHead>Status</TableHead>
        <!--<TableHead>Código Ext.</TableHead> -->
        <TableHead>Valor</TableHead>
        <TableHead>Parcela</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody v-if="data.length > 0">
      <TableRow v-for="row in data" :key="row.id">
        <TableCell>{{ row?.id }}</TableCell>
        <TableCell>{{ row.sacado?.nomeCompleto || 'Não informado' }}</TableCell>
        <TableCell>{{ row?.mensagem || 'Não informado' }}</TableCell>
        <TableCell>{{ Utils.formatDateToBR(row.dataGeracao?.dia) }}</TableCell>
        <TableCell>{{ Utils.formatDateToBR(row.dataVencimento?.dataHora) }}</TableCell>
        <TableCell>
          <Badge :variant="BadgeVariant[row.status?.id]?.value || 'default'" class="mr-2">
            {{ row.status?.id || '-' }}
          </Badge>
        </TableCell>
        <!--<TableCell>{{ row.codigoExteno || '-' }}</TableCell> -->
        <TableCell>{{ Utils.formatToBRL(row.valor.original) || '-' }}</TableCell>
        <TableCell>{{ row.parcela || '-' }}</TableCell>
        <TableCell>
          <Row gap="10px" align-items="flex-end" justify-content="flex-end">
            <Popover v-if="row.sacado">
              <PopoverTrigger>
                <Button variant="outline" size="sm">
                  <Icon icon="ph:user" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                  <Column>
                    <strong>Nome</strong>
                    <p>{{ row.sacado.nomeCompleto || '-' }}</p>
                  </Column>
                  <Column>
                    <strong>Documento</strong>
                    <p>{{ row.sacado.documento || '-' }}</p>
                  </Column>
                </div>
              </PopoverContent>
            </Popover>
            <Popover v-if="row.integracao.conteudo">
              <PopoverTrigger as-child>
                <Button v-if="row?.codigoIdentificacao" size="sm" @click="exibirQrCode(row.id)"
                  :loading="loading[row.id]" variant="outline">
                  <Icon icon="lucide:qr-code" />
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
            <TooltipProvider v-if="row.integracao?.conteudo">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button size="sm" @click="copy(row.integracao?.conteudo)" variant="outline">
                    <Icon class="text-sm" icon="lucide:copy" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar Código</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider v-if="row.integracao?.link">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button size="sm" @click="copy(row.integracao?.link)" variant="outline">
                    <Icon class="text-sm" icon="lucide:link-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar Link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Popover>
              <PopoverTrigger as-child>
                <Button size="sm" variant="outline">
                  <Icon icon="ph:dots-three" class="text-sm" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Column class="text-muted-foreground text-xs" >
                  <strong>Observação</strong>
                  <p >{{ row?.observacao || '-' }}</p>
                </Column>
              </PopoverContent>
            </Popover>
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
