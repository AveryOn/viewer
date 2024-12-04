
<template>
    <div class="relative">
        <span class="dot" v-if="file !== null"></span>
        <Toast />
        <FileUpload 
        name="demo[]" 
        url="/api/upload" 
        :multiple="false" 
        accept=".txt,.csv,text/plain" 
        :maxFileSize="1000000" 
        @select="onSelectedFiles"
        >
            <template #header="{ chooseCallback }">
                <Button size="small" label="Choose File (TXT)" @click="chooseCallback" :outlined="true"></Button>
                <Button size="small" label="Remove" severity="danger" :outlined="true" @click="handleClear()"></Button>
                <span class="ml-auto size-file">
                    {{ sizeFile }}
                </span>
            </template>
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback, messages }">
                <div class="p-0">
                    
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';

const $primevue = usePrimeVue();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const file = ref(null);
const sizeFile = ref('0 bytes');

const emit = defineEmits({
    'file': (file) => true,
    'remove': () => true,
})

const onSelectedFiles = (event) => {
    file.value = event.files[0];
    const reader = new FileReader()
    reader.onload = (ev) => {
        emit('file', ev.target.result)
        sizeFile.value = formatSize(ev.total);
    }
    reader.readAsText(file.value);
};

function handleClear(callback) {
    file.value = null;
    sizeFile.value = '0 bytes'
    emit('remove');
}

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};
</script>

<style scoped>
.dot {
    position: absolute;
    right: .3rem;
    top: .3rem;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background-color: orange;
}
.size-file {
    background-color: rgba(105, 105, 105, 0.3);
    font-weight: bolder;
    font-family: monospace;
    letter-spacing: 0.08rem;
    padding: 0 0.4rem;
    border-radius: 3px;
}
</style>
