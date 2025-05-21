<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import ComprovanteDownloadItem from './ComprovanteDownloadItem.vue';

const props = defineProps(['data', 'origem', 'titulo'])

</script>

<template>
    <div v-if="data.length > 0">
        <span class=" text-xs text-muted-foreground py-2">{{ titulo ?? 'Comprovantes de pagamentos' }}</span>
        <ScrollArea class=" max-h-[10rem] overflow-y-auto">
            <div class="grid grid-cols-1 gap-2 w-full">
                <ComprovanteDownloadItem v-for="item in data" :key="item.id" :item="item" />
            </div>
        </ScrollArea>
    </div>
    <!-- <Column align-items="center" justify-content="center" gap="2px" v-else>
        <Icon icon="lucide:inbox" class="text-center text-sm text-muted-foreground mt-4 " />
        <p class="text-center text-sm text-muted-foreground">Nenhum comprovante disponível</p>
    </Column> -->
</template>