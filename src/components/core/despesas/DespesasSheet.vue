<script setup lang="ts">
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import { Icon } from '@iconify/vue';

const isSheetOpen = defineModel({
    default: false
});

const props = defineProps(['titulo'])

</script>

<template>
    <div>
        <slot></slot>
    </div>
    <Sheet v-model:open="isSheetOpen">
        <SheetContent class="w-full sm:max-w-[40dvw] sm:w-[50dvw] p-3">
            <SheetHeader class="mb-4">
                <Row justify-content="space-between" class="h-fit" align-items="center">
                    <SheetTitle>{{ titulo || 'Nova Despesa' }}</SheetTitle>
                    <Button size="icon" variant="outline" @click="isSheetOpen = false">
                        <Icon icon="lucide:x" class="text-center w-5 h-5 text-muted-foreground" />
                    </Button>
                </Row>
            </SheetHeader>
            <slot name="form" />
        </SheetContent>
    </Sheet>
</template>
