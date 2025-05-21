<script setup lang="ts">
import { useFilesAPI } from '@/api/file-http-client';
import Column from '@/components/core/Column.vue';
import Row from '@/components/core/Row.vue';
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
import Input from '@/components/ui/input/Input.vue';
import { useToast } from '@/components/ui/toast';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';

const { anexos } = useFilesAPI();
const { toast } = useToast();

const props = defineProps(['item', 'anexoOrigem', 'titulo']);
const emits = defineEmits(['fetch-data']);

const isOpen = defineModel({
    default: false
});

const loading = ref(false);
const selectedFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0]; // Aqui deve ser um objeto válido do tipo File
    } else {
        selectedFile.value = null;
    }
};


const clearFileSelection = () => {
    selectedFile.value = null;
    fileInputRef.value = null

};

const handleConfirmSubmit = async () => {
    if (!selectedFile.value) {
        toast({
            title: 'Erro',
            description: 'Nenhum arquivo selecionado.',
            variant: 'destructive',
        });
        return;
    }

    loading.value = true;
    try {
        const response = await anexos.upload(selectedFile.value, props.item?.id, props.anexoOrigem);
        toast({
            title: response.data,
        });
        emits('fetch-data')
    } catch (error) {
        toast({
            title: 'Erro',
            description: 'Falha ao enviar o arquivo. Tente novamente.',
            variant: 'destructive',
        });
    } finally {
        loading.value = false;
        isOpen.value = false;
    }
};
</script>

<template>
    <AlertDialog v-model:open="isOpen">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle class="text-start font-semibold">
                    <Badge variant="outline" class="text-sm w-full">
                        {{ titulo ?? 'Upload de Comprovante de Pagamento' }}
                    </Badge>
                </AlertDialogTitle>
                <AlertDialogDescription>
                    <div class="w-full flex items-center justify-center">
                        <Icon class=" text-7xl my-4" icon="lucide:cloud-upload" />
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div class="flex flex-col gap-4">
                <Row class="w-full">
                    <div class="w-full">
                        <Input ref="fileInputRef" :placeholder="selectedFile?.name ?? 'Selecionar Arquivo'" type="file" accept="*/*" @change="handleFileChange" class="w-full" />
                    </div>
                    <Button v-if="selectedFile" variant="outline" @click="clearFileSelection">
                        <Icon icon="lucide:x" class="text-base" />
                    </Button>
                </Row>
                <p v-if="selectedFile" class="text-sm text-gray-500">
                    Arquivo selecionado: {{ selectedFile.name }}
                </p>
            </div>
            <AlertDialogFooter>
                <Column class="w-full">
                    <Row>
                        <AlertDialogCancel class="flex-1">Cancelar</AlertDialogCancel>
                        <Button :disabled="!selectedFile" class="flex-1" type="button" :loading="loading"
                            @click="handleConfirmSubmit">
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
