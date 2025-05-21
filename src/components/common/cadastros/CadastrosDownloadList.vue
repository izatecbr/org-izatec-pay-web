<script setup lang="ts">
import Row from '@/components/core/Row.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@iconify/vue/dist/iconify.js';
import CadastrosDownloadItem from './CadastrosDownloadItem.vue';

const props = defineProps(['data', 'origem', 'titulo', 'textoVazio'])
const emits = defineEmits(['fetch-data'])

</script>

<template>
    <div v-if="data.length > 0">
        <span class=" text-xs text-muted-foreground py-2">{{ titulo ?? 'Documentos anexados' }}</span>
        <ScrollArea class=" max-h-[10rem] overflow-y-auto">
            <div class="grid grid-cols-1 gap-2 w-full">
                <CadastrosDownloadItem @fetch-data="emits('fetch-data')" v-for="item in data"
                    :key="item.id" :item="item" />
            </div>
        </ScrollArea>
    </div>
    <Row align-items="center" justify-content="center" gap="5px" v-else>
        <Icon icon="lucide:inbox" class="text-center  text-muted-foreground " />
        <p class="text-center text-sm text-muted-foreground">{{ textoVazio ?? 'Nenhum documento anexado' }}</p>
    </Row>
</template>