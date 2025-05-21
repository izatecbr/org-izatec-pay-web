<template>
    <Row class=" w-full" align-items="center" justify-content="space-between">
        <Button variant="link" @click="handleDownloadDocumento" class="h-fit text-start p-[0.05rem] w-fit" size="sm">
            {{ Utils.truncate(item.nome, 40) }}
        </Button>
        <Popover v-model:open="popover">
            <PopoverTrigger as-child>
                <Button variant="destructive" class="p-1 h-fit">
                    <Icon icon="heroicons:trash" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Column>
                    <span class=" text-xs pb-1"><strong>Atenção.</strong> Tem certeza que deseja excluir esse documento?
                        <strong>Isso não pode ser revertido</strong></span>
                    <Row class="w-full" gap="2px">
                        <Button @click="popover = false" variant="outline" size="sm" class="flex-1">Não</Button>
                        <Button :loading="loading" @click="handleDeleteAnexo" variant="destructive" size="sm"
                            class="flex-1">Sim</Button>
                    </Row>
                </Column>
            </PopoverContent>
        </Popover>
    </Row>
</template>

<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client';
import Column from '@/components/core/Column.vue';
import Row from '@/components/core/Row.vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/toast';
import Utils from '@/utils';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
});

const emits = defineEmits(['fetch-data'])

const { anexos } = useFilesAPI()
const { toast } = useToast()
const popover = ref(false)
const loading = ref(false)

const handleDownloadDocumento = async () => {
    const response = await anexos.download(props.item.id);
    const fileName = props.item.nome || 'download.jpg';

    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const handleDeleteAnexo = async () => {
    loading.value = true
    const response = await anexos.excluir(props.item.id)

    const { status, body } = response.data

    toast({
        title: body,
        description: status?.suggestion || '',
        duration: 1300,
    });

    if (body) {
        popover.value = false
        emits('fetch-data')
    }

    loading.value = false
}

</script>

<style></style>