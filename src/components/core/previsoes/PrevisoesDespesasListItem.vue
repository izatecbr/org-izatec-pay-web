<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client'
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
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Popover from '@/components/ui/popover/Popover.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { BadgeVariant } from '@/constants/ui/badge-variants.interface'
import { cn } from '@/lib/utils'
import Utils from '@/utils/index'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const props = defineProps(['item'])

const loading = ref<{ [key: string]: boolean }>({});
const imageURL = ref<string | null>(null);

const { toast } = useToast()
const { publicPagamentos } = useFilesAPI();

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
    <Card :class="cn('p-1.5', $attrs.class ?? '')">
        <CardHeader :class="'p-1'">
            <Column>
                <Row justify-content="space-between">
                    <h5 class="font-semibold">{{ item.mensagem }}</h5>
                    <Row gap="10px" align-items="center">
                        <div>
                            <Badge class="h-fit" :variant="BadgeVariant[item.status.id].value">
                                {{ BadgeVariant[item.status.id].label }}
                            </Badge>
                        </div>
                        <Popover v-if="item.integracao?.conteudo">
                            <PopoverTrigger as-child>
                                <Button v-if="item?.codigoIdentificacao" size="sm" @click="exibirQrCode(item.id)"
                                    :loading="loading[item.id]" variant="outline">
                                    <Icon icon="lucide:qr-code" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Skeleton v-if="loading[item.id]" class="h-[250px] w-[250px] rounded-xl" />
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
                        <TooltipProvider v-if="item.integracao?.conteudo">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button size="sm" @click="copy(item.integracao?.conteudo)" variant="outline">
                                        <Icon class="text-sm" icon="lucide:copy" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copiar Código</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider v-if="item.integracao?.link">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button size="sm" @click="copy(item.integracao?.link)" variant="outline">
                                        <Icon class="text-sm" icon="lucide:link-2" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copiar Link</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Row>
                </Row>
            </Column>
        </CardHeader>
        <CardContent :class="'p-1.5 grid gap-1.5'">
            <Row justify-content="space-between">
                <Column>
                    <label class="text-xs" for="data-vencimento">Prox. Vencto.</label>
                    <p id="data-vencimento" class="font-bold">{{ Utils.formatDateToBR(item.dataVencimento.dataHora) }}
                    </p>
                </Column>
                <Column align-items="flex-end">
                    <label class="text-xs" for="data-geracao">Geração</label>
                    <p id="data-geracao" class="font-bold">{{ Utils.formatDateToBR(item.dataGeracao.dia) }}</p>
                </Column>
            </Row>
            <Row justify-content="space-between">
                <Column>
                    <label class="text-xs" for="valor">Valor</label>
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