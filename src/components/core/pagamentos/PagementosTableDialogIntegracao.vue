<template>
    <DialogConfirmacaoAcao v-if="model" v-model="model" @submit="handleSubmit" :loading="loading"
        titulo="Tem certeza que deseja gerar uma nova integração ?">
        <template #descricao>
            <div class="flex flex-col w-full">
                <Row>
                    <Badge variant="outline" class="flex-1">
                        <p>{{ item.mensagem }}</p>
                    </Badge>
                </Row>

                <Row align-item="center" justify-content="space-between" gap="0.5rem" class="py-2">
                    <Badge variant="outline" class="flex-1">
                        <Column>
                            <strong>Data Prevista</strong>
                            <p>{{ Utils.formatDateToBR(item?.dataPrevista?.dataHora) || '-' }}</p>
                        </Column>
                    </Badge>
                    <Badge variant="success" class="flex-1">
                        <Column>
                            <strong>R$ Pago</strong>
                            <p>{{ Utils.formatToBRL(item?.valor?.pago) || '-' }}</p>
                        </Column>
                    </Badge>
                    <Badge variant="outline" class="flex-1">
                        <Column>
                            <strong>R$ Restante</strong>
                            <p>{{ Utils.formatToBRL(item?.valor?.restante) || '-' }}</p>
                        </Column>
                    </Badge>
                </Row>

                <Row align-items="center" class="w-full" gap="4px">
                    <div class="mt-2 flex-1 w-full">
                        <Input type="date" v-model="dia" />
                    </div>
                    <div class="mt-2 flex-1 w-full">
                        <Input type="time" v-model="hora" />
                    </div>

                </Row>
            </div>
        </template>
    </DialogConfirmacaoAcao>
</template>

<script lang="ts" setup>
import { useAPI } from '@/api/http-client'
import DialogConfirmacaoAcao from '@/components/common/dialogs/DialogConfirmacaoAcao.vue'
import { Badge } from '@/components/ui/badge'
import Input from '@/components/ui/input/Input.vue'
import { useToast } from '@/components/ui/toast'
import Utils from '@/utils'
import { ref } from 'vue'
import Column from '../Column.vue'
import Row from '../Row.vue'


const { pagamentos } = useAPI()
const { toast } = useToast()

const props = defineProps({
    item: {
        type: Object,
        default: {},
        required: false
    },
})

const dia = ref<any>(Utils.formatDateISO(new Date()))
const hora = ref(Utils.formatTimeHHMM(new Date()))
const loading = ref(false)

const emit = defineEmits(['fetch-data'])

const handleSubmit = async () => {

    loading.value = true
    const payload = {
        dia: dia.value,
        hora: hora.value
    }
    const { status } = await pagamentos.gerarIntegracao(payload, props.item.id)
    loading.value = false
    toast({
        title: status.message,
        duration: 1000,
    });

    emit('fetch-data')

}

const model = defineModel({
    default: false
})

</script>

<style></style>