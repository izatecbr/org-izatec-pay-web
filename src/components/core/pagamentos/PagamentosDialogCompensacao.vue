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
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import Utils from '@/utils';
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
import Column from '../Column.vue';
import Row from '../Row.vue';

const { pagamentos } = useAPI();
const { toast } = useToast();

const props = defineProps(['item']);
const emits = defineEmits(['submit']);

const isOpen = defineModel({
    default: false
});

const loading = ref(false);
const showPopover = ref(false);
const form = ref({
    valorPago: 'R$ 0,00',
    observacao: '',
    codigoExterno : '',
    data: {
        dia: format(new Date(), 'yyyy-MM-dd'),
        hora: format(new Date(), 'HH:mm'),
    }
});

const confirmacaoValorDiferente = ref(false);

const validateAndSubmitForm = async () => {
    showPopover.value = false;
    const valorPagoNumerico = Utils.moneyMaskToNumber(form.value.valorPago);

    loading.value = true;
    form.value.valorPago = valorPagoNumerico as any;

    const { success, status } = await pagamentos.compensacaoManual(Utils.clone(form.value), props.item.id);

    toast({
        title: status.message,
        description: '',
        duration: 2000,
    });

    isOpen.value = false;
    emits('submit');

    loading.value = false;
};

const handleConfirmSubmit = async () => {
    const valorPagoNumerico = Utils.moneyMaskToNumber(form.value.valorPago);

    if (valorPagoNumerico !== props.item.valor.restante) {
        confirmacaoValorDiferente.value = true;
        return;
    }
    await validateAndSubmitForm();
};

onMounted(() => {
    form.value.valorPago = Utils.numberToInputMask(props?.item?.valor?.restante || 0)
    form.value.observacao = props?.item?.compensacao?.observacao || '';
    //todo: refatorar label das props de codigoExteno para codigoExterno
    form.value.codigoExterno = props?.item?.codigoExteno || '';
})

</script>

<template>
    <AlertDialog v-model:open="isOpen">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle class="text-start font-semibold">
                    <Badge variant="outline" class="text-sm">
                        Compensação Manual<span class="mx-1.5">|</span><strong>{{ item?.mensagem }}</strong>
                    </Badge>

                </AlertDialogTitle>
                <AlertDialogDescription>
                    <Row align-item="center" justify-content="space-between" gap="0.5rem" class="py-2">
                        <Badge variant="outline" class="flex-1">
                            <Column>
                                <strong>Vencimento</strong>
                                <p>{{ Utils.formatDateToBR(item?.dataVencimento?.dataHora) || '-' }}</p>
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
                </AlertDialogDescription>
            </AlertDialogHeader>
            <form class="grid grid-cols-12 gap-3">
                <div class="col-span-6">
                    <InputMoney v-model="form.valorPago" label="Valor Pago" placeholder="Valor Pago" />
                </div>
                <div class="col-span-6">
                    <Input :maxlength="10" v-model="form.codigoExterno" label="Nr Documento / Fatura" placeholder="Nr Documento / Fatura" />
                </div>
                <div class="col-span-12">
                    <Textarea rows="2"  v-model="form.observacao" label="Observação" placeholder="Observação" />
                </div>
            </form>
            <AlertDialogFooter>
                <Column class="w-full">
                    <Card class="p-1 bg-orange-200/20 border-orange-300" v-if="confirmacaoValorDiferente">
                        <p class=" text-muted-foreground mb-2">
                            O valor pago é diferente do valor restante. Deseja continuar?
                        </p>
                        <div class="flex items-end justify-end gap-2">
                            <Button class="flex-1" variant="outline" @click="confirmacaoValorDiferente = false">
                                Não
                            </Button>
                            <Button class="flex-1" variant="orange" @click="validateAndSubmitForm">
                                Sim
                            </Button>
                        </div>
                    </Card>

                    <Row v-else>
                        <AlertDialogCancel class="flex-1">Cancelar</AlertDialogCancel>

                        <Button class="flex-1" type="button" :loading="loading" @click="handleConfirmSubmit"
                            :disabled="confirmacaoValorDiferente">
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
