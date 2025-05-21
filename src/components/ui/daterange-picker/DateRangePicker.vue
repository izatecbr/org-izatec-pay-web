<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useResponsive } from '@/composables/useResponsive'
import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { computed } from 'vue'

const { isDesktop } = useResponsive()

interface DateRange {
  start?: Date
  end?: Date
}

const props = defineProps({
  modelValue: {
    type: Object as () => DateRange,
    required: false,
    default: () => ({
      start: new Date(),
      end: addDays(new Date(), 20),
    }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const dateModel: any = computed<any>({
  get: () => props.modelValue,
  set: (value: DateRange) => {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <div :class="cn('grid gap-2', $attrs.class ?? '')">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          :loading="loading"
          id="date"
          :variant="'outline'"
          :class="
            cn(
              'w-[330px] justify-start text-left font-normal',
              !dateModel?.start && 'text-muted-foreground',
            )
          "
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          <span>
            {{
              dateModel?.start
                ? dateModel?.end
                  ? `${format(dateModel.start, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - ${format(
                      dateModel.end,
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR },
                    )}`
                  : format(dateModel.start, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                : 'Selecionar data'
            }}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" :align="'end'">
        <Calendar
          v-model.range="dateModel"
          :columns="isDesktop ? 2 : 1"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
