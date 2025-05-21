<script setup lang="ts" >
import Column from '@/components/core/Column.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@iconify/vue';
import CobrancaPagamentosListItem from './CobrancaPagamentosListItem.vue';

const props = defineProps(['data'])
</script>

<template>
  <ScrollArea v-if="data.length > 0" class="max-h-[84dvh] w-full overflow-y-auto">
    <Column gap="10px" >
      <CobrancaPagamentosListItem v-for="item in data" :key="item.id" :item="item" />
    </Column>
  </ScrollArea>
  <Column align-items="center" justify-content="center" gap="10px" v-else>
    <Icon icon="lucide:inbox" class="text-center text-5xl text-muted-foreground mt-[10rem] " />
    <p class="text-center text-lg  text-muted-foreground">Nenhum pagamento encontrado</p>
  </Column>
</template>