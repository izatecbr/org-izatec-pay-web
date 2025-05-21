<script setup lang="ts">
import Column from '@/components/core/Column.vue';
import { Icon } from '@iconify/vue';
import DespesasListItem from './DespesasListItem.vue';

const props = defineProps(['data'])

</script>

<template>
    <div v-if="data.length > 0" class="grid grid-cols-1 gap-4 w-full">
        <DespesasListItem v-for="item in data" :key="item.id" :item="item" />
    </div>
    <Column align-items="center" justify-content="center" gap="10px" v-else>
        <Icon icon="lucide:inbox" class="text-center text-5xl text-muted-foreground mt-[10rem] " />
        <p class="text-center text-lg  text-muted-foreground">Nenhuma previsão encontrada</p>
    </Column>
</template>