<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-vue-next'

const { loading } = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const date = defineModel<any>({
  default: undefined, 
})

</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button :loading="loading" variant="outline" :class="cn(
        'justify-start text-left font-normal',
        !date && 'text-muted-foreground',
      )">
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ date ? format(date, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR }) : "Selecionar data" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="date" initial-focus />
    </PopoverContent>
  </Popover>
</template>