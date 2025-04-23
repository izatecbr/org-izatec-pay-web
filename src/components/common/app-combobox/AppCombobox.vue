<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { ref } from 'vue'

interface Options {
    value: any,
    label: string
}

const props = defineProps({
    options: {
        type: Array<Options>,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    input: {
        default: null
    },
    placeholder: {
        type: String,
        default: 'Selecionar item...'
    },
    placeholderInput: {
        type: String,
        default: 'Selecionar item...'
    },
    buttonClass: {
        type: String,
        default: 'w-[240px]'
    },
    popoverClass: {
        type: String,
        default: 'w-[240px]'
    }
})

const emit = defineEmits(['update:input', 'on-select'])

const inputValue = ref('');

function onInput(value: string) {
    inputValue.value = value;
    emit('update:input', value);
}

const value = defineModel({
    default: ''
})

const open = ref(false);

function selectItem(itemValue: any) {
    value.value = itemValue;
    inputValue.value = '';
    open.value = false;
}
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button :loading="loading" variant="outline" role="combobox" :aria-expanded="open" :class="cn('justify-between', buttonClass)">
                {{value ? options.find((framework) => framework.value === value)?.label : placeholder}}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent :class="cn('p-0', popoverClass)">
            <Command>
                <CommandInput v-model="inputValue" :placeholder="placeholderInput" @input="onInput" />

                <CommandEmpty>Nehuma opção disponível.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                        <CommandItem v-for="item in options" :key="item.value" :value="item.value"
                            @select="selectItem(item.value)">
                            <Check :class="cn(
                                'mr-2 h-4 w-4',
                                value === item.value ? 'opacity-100' : 'opacity-0',
                            )" />
                            {{ item.label }}
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
