<script setup lang="ts">
import Column from '@/components/core/Column.vue';
import Row from '@/components/core/Row.vue';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button/Button.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { inject } from 'vue';

const cadastroSelecionado: any = inject('cadastroSelecionado')
const setCadastroSelecionado: (value: any) => void = inject('setCadastroSelecionado') as any
</script>

<template>
    <Row v-if="cadastroSelecionado" gap="2px" class="h-full">
        <Badge  variant="outline">
            <Column>
                <p class=" font-extralight text-muted-foreground">Sacado</p>
                <span class="font-semibold">
                    {{ cadastroSelecionado?.nomeCompleto ?? '' }} {{ cadastroSelecionado?.documento ? '-' :
                        ''
                    }} {{ cadastroSelecionado?.documento ?? '' }}
                </span>
            </Column>
        </Badge>
        <Button  variant="ghost" @click="setCadastroSelecionado(null)">
            <Icon icon="ph:x" />
        </Button>
    </Row>
</template>