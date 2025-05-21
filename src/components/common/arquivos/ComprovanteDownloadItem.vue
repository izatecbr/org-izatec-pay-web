<template>
    <Button variant="link" @click="handleDownloadComprovante" class="h-fit text-start p-[0.05rem] w-fit" size="sm">
        {{ Utils.truncate(item.nome, 40) }}
    </Button>
</template>

<script lang="ts" setup>
import { useFilesAPI } from '@/api/file-http-client';
import { Button } from '@/components/ui/button';
import Utils from '@/utils';

const { anexos } = useFilesAPI()

const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
});

const handleDownloadComprovante = async () => {

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

</script>

<style></style>