<script setup lang="ts">
import Column from '@/components/core/Column.vue';
import Row from '@/components/core/Row.vue';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';


const props = defineProps({
    titulo: {
        type: String,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['submit', 'cancel']);

const isOpen = defineModel({
    default: false
});

</script>

<template>
    <AlertDialog v-model:open="isOpen">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle class="text-start text-sm font-semibold">
                    {{ titulo }}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    <slot name="descricao" />
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div class="flex flex-col gap-4">

            </div>
            <AlertDialogFooter>
                <Column class="w-full">
                    <Row gap="4px">
                        <Button variant="outline" class="flex-1" type="button"
                            @click="$emit('cancel'); isOpen = false">
                            Cancelar
                        </Button>
                        <Button :disabled="disabled"  class="flex-1" type="button" :loading="loading" @click="$emit('submit')">
                            Confirmar
                        </Button>
                    </Row>
                </Column>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<style scoped>
/* Adicione estilos personalizados aqui, se necessário */
</style>
