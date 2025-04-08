<template>
    <div class="flex flex-row" :style="{
        gap: gap,
        justifyContent: justifyContent,
        alignItems: alignItems,
        flexWrap: flexWrap,
        padding: padding,
        margin: margin,
    } as any">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps({
    gap: {
        type: String,
        default: '0px',
    },
    justifyContent: {
        type: String,
        default: 'flex-start',
    },
    alignItems: {
        type: String,
        default: 'stretch',
    },
    flexWrap: {
        type: String,
        default: 'nowrap',
    },
    padding: {
        type: String,
        default: '',
    },
    margin: {
        type: String,
        default: '',
    },
});
</script>