<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { useAppStore } from '@/stores/app';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';

onMounted(() => {
  useAppStore().initTheme();
});
</script>

<template>
  <ScrollArea class="h-screen">
    <Toaster/>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <ScrollBar class="z-50" />
  </ScrollArea>
</template>
