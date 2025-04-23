<script setup lang="ts">
import Column from '@/components/core/Column.vue';
import { Icon } from '@iconify/vue';
import CadastrosFiltroListItem from './CadastrosFiltroListItem.vue';

const props = defineProps(['data'])
</script>

<template>
    <div v-if="data.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
        <CadastrosFiltroListItem v-for="item in data" :key="item.id"  :item="item" />
    </div>
    <Column align-items="center" justify-content="center" gap="10px" v-else>
        <Icon icon="lucide:inbox" class="text-center text-5xl text-muted-foreground mt-[10rem] " />
        <p class="text-center text-lg  text-muted-foreground">Nenhum cadastro encontrado</p>
    </Column>
</template>