<template>
    <div class=" flex gap-2 flex-wrap">
        <div v-for="tab in tabsAdicionadas" :key="tab.path" class="flex">
            <Button variant="outline" @click="trocarTab(tab)" class="text-xs rounded-r-none px-1 py-[2px] h-fit">
                {{ tab.label }}
            </Button>
            <Button @click="removerTab(tab)" variant="outline" class="text-xs px-1 rounded-l-none py-[2px] h-full">
                <Icon icon="ph:x" />
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { NAV_ADDED_TABS_PROVIDER_KEY, NAV_CHANGE_TAB_PROVIDER_KEY, NAV_REMOVE_TAB_PROVIDER_KEY } from '@/constants/app/tab-inject-values';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { inject } from 'vue';


const { trocarTab } = inject(NAV_CHANGE_TAB_PROVIDER_KEY) as any
const { tabsAdicionadas } = inject(NAV_ADDED_TABS_PROVIDER_KEY) as any
const { removerTab } = inject(NAV_REMOVE_TAB_PROVIDER_KEY) as any


</script>

<style></style>