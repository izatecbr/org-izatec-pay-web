<script setup lang="ts">
import { useAPI } from '@/api/http-client';
import { InputMoney } from '@/components/common/input-money';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import Utils from '@/utils';
import { format } from "date-fns";
import debounce from 'lodash-es/debounce';
import { ref, watch } from 'vue';
import Column from '../Column.vue';
import Row from '../Row.vue';

const { despesas } = useAPI();
const { toast } = useToast();

const props = defineProps(['item']);
const emits = defineEmits(['submit']);

const isOpen = defineModel({
    default: false
});

const loading = ref(false);
const form = ref({
    valorPago: 'R$ 0,00',
    observacao: '',
    data: {
        dia: format(new Date(), 'yyyy-MM-dd'),
        hora: format(new Date(), 'HH:mm'),
    }
});

const STATES = {
    DEFAULT: 'default',
    BLOCK: 'block',
    DONE: 'done',
    CLEAR: 'clear',
};

const currentState = ref(STATES.DEFAULT);

const valorOriginal = Utils.moneyMaskToNumber(props.item?.valor.original);

const updateState = () => {
    const valorPagoNumerico = Utils.moneyMaskToNumber(form.value.valorPago);

    if (currentState.value === STATES.DONE) return;

    if (valorPagoNumerico === valorOriginal) {
        currentState.value = STATES.CLEAR;
    } else if (valorPagoNumerico !== valorOriginal) {
        currentState.value = STATES.BLOCK;
    }
};

const confirmValueDifference = () => {
    if (currentState.value === STATES.BLOCK) {
        currentState.value = STATES.DONE;
    }
};

const validateValorPago = debounce(updateState, 300);

watch(() => form.value.valorPago, () => {
    validateValorPago();
});

const submitForm = async () => {
    if (![STATES.DONE, STATES.CLEAR].includes(currentState.value)) return;

    loading.value = true;
    form.value.valorPago = Utils.moneyMaskToNumber(form.value.valorPago) as any;
    const { success, status } = await despesas.compensacaoManual(Utils.clone(form.value), props.item.id);
    toast({
        title: status.message,
        description: '',
        duration: 2000,
    });
    if (success) {
        isOpen.value = false;
        emits('submit');
        currentState.value = STATES.DEFAULT;
    }
    loading.value = false;
};
</script>

<template>
    <AlertDialog v-model:open="isOpen">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Compensação manual - <strong>{{ item?.mensagem }}</strong>
                </AlertDialogTitle>
                <AlertDialogDescription>
                    <Row align-item="center" justify-content="flex-start" gap="1rem" class="py-2">
                        <Column>
                            <strong>Próximo Vencimento</strong>
                            <p>{{ Utils.formatDateToBR(item?.dataVencimento?.dataHora) || '-' }}</p>
                        </Column>
                        <Column>
                            <strong>R$ Original</strong>
                            <p>{{ Utils.formatToBRL(item?.valor.original) || '-' }}</p>
                        </Column>
                        <Column>
                            <strong>R$ Pago</strong>
                            <p>{{ Utils.formatToBRL(item?.valor.pago) || '-' }}</p>
                        </Column>
                    </Row>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <form class="grid grid-cols-12 gap-3">
                <div class="col-span-6">
                    <InputMoney v-model="form.valorPago" label="Valor Pago" placeholder="Valor Pago" />
                </div>
                <div class="col-span-6">
                    <Input class="col-span-6" v-model="form.observacao" label="Observação" placeholder="Observação" />
                </div>
                <Row class="col-span-12">
                    <Badge v-if="currentState === STATES.BLOCK" variant="outline">
                        Atenção. Valor pago diferente do valor original. Confirme para continuar.
                    </Badge>
                    <Badge v-if="currentState === STATES.CLEAR" variant="success">
                        Valor validado. Pronto para enviar.
                    </Badge>
                </Row>
                <Row class="col-span-12 justify-end gap-2">
                    <Button size="sm" variant="outline" @click="confirmValueDifference" v-if="currentState === STATES.BLOCK">
                        Confirmar Valor Diferente
                    </Button>
                </Row>
            </form>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button type="submit" @click="submitForm" :loading="loading" :disabled="currentState !== STATES.DONE && currentState !== STATES.CLEAR">
                    Confirmar
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
