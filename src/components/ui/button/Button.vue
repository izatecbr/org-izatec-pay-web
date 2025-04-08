<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type ButtonVariants, buttonVariants } from '.'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-vue-next'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  as?: string
  class?: HTMLAttributes['class'],
  loading?: boolean,
  prependIcon?: string,
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(
      buttonVariants({ variant, size }),
      { 'opacity-50 cursor-not-allowed': loading },
      props.class
    )"
    :disabled="loading"
    class="flex items-center"
  >
    <Icon v-if="prependIcon" :name="prependIcon" class="mr-2 h-6 w-6" />
    <slot />
    <Loader2 v-if="loading" class="w-4 h-4 ml-2 animate-spin" />
  </Primitive>
</template>
