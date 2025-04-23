<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';

const store = useAppStore();

const imgUrl = computed(() => store.isDark ? "../../../assets/images/logo-dark.png" : "../../../assets/images/logo-light.png");
</script>

<template>
    <div class="overflow-hidden w-[22dvw] h-[26dvw]">
        <img 
            class="w-full h-full object-cover object-center" 
            alt="Iza pay logo" 
            :src="imgUrl" 
        />
    </div>
</template>
