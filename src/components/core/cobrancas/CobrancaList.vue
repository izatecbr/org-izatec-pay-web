<script setup lang="ts" >
import Column from '@/components/core/Column.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@iconify/vue';
import CobrancasListItem from './CobrancaListItem.vue';

const props = defineProps(['data'])
</script>

<template>
    <ScrollArea v-if="data.length > 0" class="max-h-[70vh] w-full overflow-y-auto">
        <Column gap="10px">
            <CobrancasListItem v-for="item in data" :key="item.id" :item="item" />
        </Column>
    </ScrollArea>
    <Column align-items="center" justify-content="center" gap="10px" v-else>
        <Icon icon="lucide:inbox" class="text-center text-5xl text-muted-foreground mt-[10rem] " />
        <p class="text-center text-lg  text-muted-foreground">Nenhum pagamento encontrado</p>
    </Column>
</template>