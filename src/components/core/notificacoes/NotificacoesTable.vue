<script lang="ts" setup>
import { useAPI } from '@/api/http-client';
import Row from '@/components/core/Row.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TipoNotificacao } from '@/constants/app/tipo-notificacao.interface';
import { BadgeVariant } from '@/constants/ui/badge-variants.interface';
import Utils from '@/utils/index';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const { data } = defineProps(['data']);

const { toast } = useToast()
const { notificacoes } = useAPI();

const loading = ref<{ [key: string]: boolean }>({});
const imageURL = ref<string | null>(null);

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
                        <TooltipProvider v-if="row?.sacado?.nomeCompleto">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button :loading="loading[`${row.id}${TipoNotificacao.WHATSAPP.value}`]" size="sm"
                                        @click="notificar(row.id, TipoNotificacao.WHATSAPP.value)" variant="outline">
                                        <Icon class="text-sm" icon="ic:baseline-whatsapp" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Notificar via Whatsapp</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider v-if="row?.sacado?.nomeCompleto">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button :loading="loading[`${row.id}${TipoNotificacao.EMAIL.value}`]" size="sm"
                                        @click="notificar(row.id, TipoNotificacao.EMAIL.value)" variant="outline">
                                        <Icon class="text-sm" icon="lucide:mail" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Notificar via Email</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
