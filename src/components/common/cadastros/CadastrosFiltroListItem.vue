<script lang="ts" setup>
import Column from '@/components/core/Column.vue'
import Row from '@/components/core/Row.vue'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Utils from '@/utils'
import { Icon } from '@iconify/vue'
import { computed, inject } from 'vue'

const { item } = defineProps(['item'])

const setCadastroSelecionado: (value: any) => void = inject('setCadastroSelecionado') as any
const cadastroSelecionado: any = inject('cadastroSelecionado')
const toggleSheetFilterCadastros: () => void = inject('toggleSheetFilterCadastros') as any

const handleSelectCadastro = () => {
    if (cadastroSelecionado?.value?.id === item.id) {
        setCadastroSelecionado(null)
    } else {
        setCadastroSelecionado(item)
    }
    toggleSheetFilterCadastros()
}
const isChecked = computed(() => cadastroSelecionado?.value?.id === item.id)

</script>

<template>
    <Card @click="handleSelectCadastro()"
        :class="cn(`p-1.5 ${isChecked ? 'border-s-primary border-s-4 transition-all' : ' transition-all ease-in-out'}`, $attrs.class ?? '')"
        class="flex hover:bg-slate-500/10 px-1 hover:cursor-pointer  flex-col justify-between">
        <CardHeader :class="'p-0'">
            <Column>
                <Row justify-content="space-between">
                    <Row align-items="center" gap="4px">
                        <h5 class="text-md font-semibold mr-2">{{ Utils.truncate(item?.nomeCompleto, 23) ?? '-' }}</h5>
                    </Row>
                    <Row gap="5px">
                        <Badge class="h-fit" v-if="item.notificacao?.whatsapp" variant='success'>
                            <Icon icon="ic:baseline-whatsapp" />
                        </Badge>
                        <Badge class="h-fit" v-if="item.notificacao?.email" variant='secondary'>
                            <Icon icon="ph:envelope" />
                        </Badge>
                    </Row>
                </Row>
            </Column>
        </CardHeader>
        <CardContent :class="'p-1.5 grid gap-1.5'">
            <Row justify-content="space-between">
                <Column>
                    <label class="text-xs" for="valor">Email</label>
                    <p id="valor" class="font-bold text-xs">{{ item?.email ?? '-' }}</p>
                </Column>
                <Column align-items="flex-end">
                    <label class="text-xs" for="data-geracao">Documento</label>
                    <p id="data-geracao" class="font-bold text-xs">{{ item?.documento ?? '-' }}</p>
                </Column>
            </Row>
        </CardContent>
        <CardFooter :class="'p-0'">

        </CardFooter>
    </Card>
</template>