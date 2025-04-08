<script setup lang="ts">
import Column from '@/components/core/Column.vue';
import { Icon } from '@iconify/vue';
import CadastrosListItem from './CadastrosListItem.vue';

const props = defineProps(['data'])
</script>

<template>
    <div v-if="data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <CadastrosListItem v-for="item in data" :key="item.id" :item="item" />
    </div>
    <Column align-items="center" justify-content="center" gap="10px" v-else>
        <Icon icon="lucide:inbox" class="text-center text-5xl text-muted-foreground mt-[10rem] " />
        <p class="text-center text-lg  text-muted-foreground">Nenhum pagamento encontrado</p>
    </Column>
</template>