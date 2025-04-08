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
import Utils from '@/utils/index'
import { Icon } from '@iconify/vue'

const props = defineProps(['item'])

</script>

<template>
    <Card :class="cn('p-1.5', $attrs.class ?? '')">
        <CardHeader :class="'p-1'">
            <Column>
                <Row justify-content="space-between">
                    <h5 class="text-md font-semibold">{{ item?.nomeCompleto ?? '-' }}</h5>
                    <Row gap="10px">
                        <Badge v-if="item.notificacao?.whatsapp" variant='success'>
                            <Icon icon="ic:baseline-whatsapp" />
                        </Badge>
                        <Badge v-if="item.notificacao?.email" variant='secondary'>
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
                    <p id="valor" class="font-bold">{{ item?.email ?? '-' }}</p>
                </Column>
                <Column lign-items="flex-end">
                    <label class="text-xs text-end" for="valor">Aniversário</label>
                    <p id="valor" class="font-bold text-end">{{ Utils.formatDateToBR(item.dataNascimento) || '-' }}
                    </p>
                </Column>
            </Row>
            <Row justify-content="space-between">
                <Column>
                    <label class="text-xs" for="data-vencimento">CEP</label>
                    <p id="data-vencimento" class="font-bold">{{ item?.endereco?.cep ?? '-' }}</p>
                </Column>
                <Column align-items="flex-end">
                    <label class="text-xs" for="data-geracao">Logradouro</label>
                    <p id="data-geracao" class="font-bold">{{ Utils.truncate(item?.endereco?.logradouro, 20) + ' ' + (item?.endereco?.numero ? `Nº
                        ${item?.endereco?.numero}` : '-') }}</p>
                </Column>
            </Row>
        </CardContent>
        <CardFooter :class="'p-0'"></CardFooter>
    </Card>
</template>