<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CobrancaStatusVariant } from '@/constants/ui/cobranca-status-variant.interface';
import Utils from '@/utils';
import { computed, ref } from 'vue';
import { BadgeVariant } from '@/constants/ui/badge-variants.interface'

const { data } = defineProps(['data']);

const currentPage = ref(1)
const itemsPerPage = 7

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return data.slice(start, end)
})

</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Prox. Vencto.</TableHead>
                <TableHead>R$ Despesa</TableHead>
                <TableHead>R$ Pago</TableHead>
                <TableHead>Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data.length > 0">
            <TableRow v-for="row in paginatedData" :key="row.id">
                <TableCell>{{ row?.titulo || '' }}</TableCell>
                <TableCell>{{ Utils.formatDateToBR(row.negociacao?.proximoVencimento) }}</TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valorDespesa) || '-' }}</TableCell>
                <TableCell>{{ Utils.formatToBRL(row.valorPago) || '-' }}</TableCell>
                <TableCell>
                  <Badge :variant="CobrancaStatusVariant[row.status.id].value" class="mr-2">{{ row.status.nome }}</Badge>
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
    <div v-if="data.length > itemsPerPage" class="flex items-center justify-center mt-4">
        <Pagination v-slot="{ page }" :items-per-page="itemsPerPage" :total="data.length" :sibling-count="1" show-edges
            :default-page="1" @update:page="currentPage = $event">
            <PaginationList v-slot="{ items }" class="flex items-center gap-1 mt-4">
                <PaginationFirst />
                <PaginationPrev />

                <template v-for="(item, index) in items">
                    <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                        <Button class="w-9 h-9 p-0" :variant="item.value === page ? 'default' : 'outline'">
                            {{ item.value }}
                        </Button>
                    </PaginationListItem>
                    <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext />
                <PaginationLast />
            </PaginationList>
        </Pagination>

    </div>
</template>