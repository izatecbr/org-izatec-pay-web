<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Utils from '@/utils';
import { Icon } from '@iconify/vue';
import Column from '../Column.vue';
import Row from '../Row.vue';

const props = defineProps<{ data: Array<any> }>();
const emit = defineEmits(['onEdit']);

</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Notificação Email</TableHead>
                <TableHead>Notificação Whatsapp</TableHead>
                <TableHead>Acões</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data.length > 0">
            <TableRow v-for="row in data" :key="row.id">
                <TableCell>{{ row?.id }}</TableCell>
                <TableCell>{{ row?.nomeCompleto || 'Não informado' }}</TableCell>
                <TableCell>{{ row?.email || '-' }}</TableCell>
                <TableCell>
                    <Badge :variant="row.notificacao?.email ? 'default' : 'outline'">
                        {{ row.notificacao?.email ? 'Ativo' : 'Inativo' }}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Badge :variant="row.notificacao?.whatsapp ? 'default' : 'outline'">
                        {{ row.notificacao?.whatsapp ? 'Ativo' : 'Inativo' }}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Row gap="10px">
                        <Popover>
                            <PopoverTrigger as-child>
                                <Button variant="outline" size="sm">
                                    <Icon icon="ph:user" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div class="text-muted-foreground text-xs grid grid-cols-2 gap-2">
                                    <Column>
                                        <strong>Empresa</strong>
                                        <p>{{ row?.empresa || 'Não informado' }}</p>
                                    </Column>
                                    <Column>
                                        <strong>Avalista</strong>
                                        <p>{{ row?.avalista || 'Não informado' }}</p>
                                    </Column>
                                    <Column>
                                        <strong>Data de Nascimento</strong>
                                        <p>{{ Utils.formatDateToBR(row?.dataNascimento) || '-' }}</p>
                                    </Column>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Popover v-if="row?.endereco">
                            <PopoverTrigger as-child>
                                <Button variant="outline" size="sm">
                                    <Icon icon="ph:house" />
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
