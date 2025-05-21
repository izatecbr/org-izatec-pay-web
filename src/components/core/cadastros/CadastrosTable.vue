<script setup lang="ts">
import { useFilesAPI } from '@/api/file-http-client';
import CadastrosDownloadList from '@/components/common/cadastros/CadastrosDownloadList.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnexoOrigemLocal } from '@/constants/app/anexo-origem-local';
import DialogUploadArquivo from '@/components/common/dialogs/DialogUploadArquivo.vue';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import Column from '../Column.vue';
import Row from '../Row.vue';

const props = defineProps<{ data: Array<any> }>();
const emit = defineEmits(['onEdit']);

const { anexos } = useFilesAPI();
const itemSelecionado = ref<any>(null)
const dialogUploadOpen = ref(false)
const listAnexos = ref([])

const handleListAnexos = async (item: any) => {
    const { data } = await anexos.list(item.id, AnexoOrigemLocal.CADASTRO.value)
    listAnexos.value = data.body || []
}

const handlOpenDialogUpload = (item: any) => {
    itemSelecionado.value = item
    dialogUploadOpen.value = true
}


</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Avalista</TableHead>
                <TableHead>Dt. Nascimento</TableHead>
                <TableHead class=" flex items-center justify-end">Acões</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data.length > 0">
            <TableRow v-for="row in data" :key="row.id">
                <TableCell>{{ row?.id }}</TableCell>
                <TableCell>{{ row?.nomeCompleto || 'Não informado' }}</TableCell>
                <TableCell>{{ row?.documento || '-' }}</TableCell>
                <TableCell>
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline" size="sm">
                                <Icon class="text-lg" icon="ph:address-book" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="text-muted-foreground text-xs gap-2">
                                <Column>
                                    <strong>Email</strong>
                                    <Row justify-content="space-between" align-items="center" gap="5px">
                                        <p>{{ row?.email || 'Não informado' }}</p>
                                        <Badge :variant="row.notificacao?.email ? 'default' : 'outline'">
                                            {{ row.notificacao?.email ? 'Ativo' : 'Inativo' }}
                                        </Badge>
                                    </Row>
                                </Column>
                                <Column>
                                    <strong>Número</strong>
                                    <Row justify-content="space-between" align-items="center" gap="5px">
                                        <p>{{ row?.whatsapp || 'Não informado' }}</p>
                                        <Badge :variant="row.notificacao?.whatsapp ? 'default' : 'outline'">
                                            {{ row.notificacao?.whatsapp ? 'Ativo' : 'Inativo' }}
                                        </Badge>
                                    </Row>

                                </Column>
                            </div>
                        </PopoverContent>
                    </Popover>
                </TableCell>
                <TableCell>
                    {{ row?.avalista || '-' }}
                </TableCell>
                <TableCell>
                    {{ Utils.formatDateToBR(row?.dataNascimento) || '-' }}
                </TableCell>
                <TableCell>
                    <Row gap="10px" align-items="center" justify-content="flex-end">
                        <Popover v-if="row?.endereco">
                            <PopoverTrigger as-child>
                                <Button variant="outline" size="sm">
                                    <Icon icon="ph:map-pin-line" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                                    <Column>
                                        <strong>CEP</strong>
                                        <p>{{ row?.endereco?.cep || 'Não informado' }}</p>
                                    </Column>
                                    <Column>
                                        <strong>Número</strong>
                                        <p>{{ row?.endereco?.numero || 'Não informado' }}</p>
                                    </Column>
                                    <Column>
                                        <strong>Logradouro</strong>
                                        <p>{{ row?.endereco?.logradouro || '-' }}</p>
                                    </Column>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger>
                                <Button @click="handleListAnexos(row)" variant="outline" size="sm">
                                    <Icon icon="ph:identification-badge" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Badge variant="success" class=" w-full mb-4 ">
                                    <div class="text-foreground text-xs w-full ">
                                        <Row align-items="center" justify-content="space-between" gap="0.5rem"
                                            class="w-full flex items-center ">
                                            <h3 class="font-bold w-full text-balance text-secondary-foreground">
                                                Upload de Documento
                                            </h3>
                                            <Button class="p-1 h-fit" @click="handlOpenDialogUpload(row)"
                                                variant="outline" size="sm">
                                                <Icon icon="lucide:upload" />
                                            </Button>
                                        </Row>
                                    </div>
                                </Badge>

                                <CadastrosDownloadList v-if="listAnexos.length > 0" @fetch-data="handleListAnexos(row)" :data="listAnexos" />
                            </PopoverContent>
                        </Popover>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button @click="$emit('onEdit', row)" size="sm" variant="outline">
                                        <Icon class="text-sm" icon="lucide:pen" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Editar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <DialogUploadArquivo v-if="dialogUploadOpen" :item="itemSelecionado"
                            :anexo-origem="AnexoOrigemLocal.CADASTRO.value" @fetch-data="handleListAnexos(row)"
                            v-model="dialogUploadOpen" titulo="Upload de documento" />
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
