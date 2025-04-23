<script setup lang="ts">
import { cn } from '@/lib/utils';
import { useVModel } from '@vueuse/core';
import { ref, useAttrs, type HTMLAttributes } from 'vue';

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  prependIcon?: string;
  placeholder?: string;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
  (e: 'focus', payload: FocusEvent & { isFocused: boolean }): void;
  (e: 'blur', payload: FocusEvent & { isFocused: boolean }): void;
  (e: 'keydown', payload: KeyboardEvent): void;
}>();

const attrs = useAttrs();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
const isFocused = ref<boolean>(false);

const onFocus = (e: FocusEvent) => {
  isFocused.value = true;
  emits('focus', { ...e, isFocused: isFocused.value });
};

const onBlur = (e: FocusEvent) => {
  isFocused.value = false;
  emits('blur', { ...e, isFocused: isFocused.value });
};

const onKeydown = (e: KeyboardEvent) => {
  emits('keydown', e);
};
</script>

<template>
  <div class="relative">
    <Icon v-if="prependIcon" :name="prependIcon" class="text-slate-500 absolute h-4 top-1/2 -translate-y-1/2 left-4" />
    <input v-bind="attrs" :class="[cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
      'dark:[color-scheme:dark]'
    ), prependIcon ? 'pl-12 left-placeholder' : '']" v-model="modelValue" :placeholder="placeholder" @focus="onFocus"
      @blur="onBlur" @keydown="onKeydown" />

  </div>
</template>

<style lang="css" scoped>

</style>