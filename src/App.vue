<template>
    <div class="app h-max w-max flex gap-4">
        <div class="flex flex-column w-30rem gap-2">
            <span class="flex flex-column w-full justify-content-start text-left text-xs">
                <span>Примеры:</span>
                <span class="pl-4"><span class="example-item">num,*</span>  -  Строка начинается на число и заканчивается любым символом</span>
                <span class="pl-4"><span class="example-item">*,?</span>  -  Строка начинается c любого символа и оканчивается на "?"</span>
                <span class="pl-4"><span class="example-item">no-,*</span>  -  Строка начинается на "no-" и заканчивается любым символом</span>
                <span class="pl-4"><span class="example-item">num,*</span>  -  Строка начинается на число и заканчивается любым символом</span>
            </span>
            <InputText 
            type="text" 
            v-model="patternSplit" 
            placeholder="Split pattern" 
            @update:model-value="updatePattern"
            />
            <uploadFile @file="handleSendFile" @remove="resultFile = []"/>
            <div class="flex gap-3">
                <InputNumber v-model="cntRandom" :min="0" :max="resultFile.length" size="small"/>
                <Button @click="handleRandomRows" icon="pi pi-sync" size="small" icon-pos="right" severity="warn"label="random" :loading="isLoadingRandom"/>
                <Button @click="resetRandom" icon="pi pi-sync" size="small" icon-pos="right" outlined severity="help"label="reset" :loading="isLoadingRandom"/>
            </div>
            <div class="not-accross-items">
                Элементов не попавших в рандом: <span class="cnt">{{ diffAccrossItems }}</span>
            </div>
        </div>
        <resultFileC :result="readyRows"/>
    </div>
</template>

<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';
import uploadFile from './components/uploadFile.vue';
import resultFileC from './components/resultFile.vue';

const patternSplit = ref('');
const resultFile: Ref<any[]> = ref([]);
const fileData: Ref<null | string> = ref(null);
const randomIdxs = ref<any[]>([]);
const accrossItems = ref<any[]>([]);
const cntRandom: Ref<number> = ref(5);
const isLoadingRandom = ref(false);

async function getFileData(file: any, separator: string) {
    const res: any[] = await window.electron.sendFile(file, separator);
    return res;
}

async function handleSendFile(file: any) {
    fileData.value = file;
    resultFile.value = await getFileData(file, patternSplit.value)
}

async function updatePattern(separator: string) {
    resultFile.value = await getFileData(fileData.value, separator)
}
function getRandomNumbers(start: number, end: number, K: number): Promise<number[]> {
    return new Promise((res, rej) => {
        const randomNumbers = new Set(); // Используем Set для уникальности чисел
        if(end <= 0) return [];
        while (randomNumbers.size < Math.min(K, diffAccrossItems.value)) {
            // Генерируем случайное число в диапазоне от start до end
            const randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;
            if(!randomNumbers.has(randomNumber)) {
                if(accrossItems.value.includes(randomNumber)) {
                    continue;
                }
                randomNumbers.add(randomNumber); // Добавляем его в Set
            }
        }
        res(Array.from(randomNumbers) as number[]); // Преобразуем Set обратно в массив
    })
}

const readyRows = computed(() => {
    const res = randomRows.value.filter((item) => !!item.trim() && item.length > 0);
    return res 
});

const randomRows = computed(() => {
    if(randomIdxs.value.length) {
        const updated = resultFile.value.filter((_, idx) => {
            return randomIdxs.value.includes(idx);
        });
        return updated;
    }
    return resultFile.value;
});

const diffAccrossItems = computed(() => {
    return Math.max((resultFile.value.length - accrossItems.value.length), 0);
})

async function handleRandomRows() {
    try {
        if(diffAccrossItems.value <= 0) return;
        isLoadingRandom.value = true;
        const prevDiff = diffAccrossItems.value;
        randomIdxs.value = await getRandomNumbers(0, resultFile.value.length, cntRandom.value);
        const updatedAccross = [...randomIdxs.value, ...accrossItems.value];
        accrossItems.value = [...new Set(updatedAccross)];
        if((prevDiff - diffAccrossItems.value) <= 0) return void await handleRandomRows();
    } finally {
        isLoadingRandom.value = false;
    }
}

function resetRandom() {
    randomIdxs.value.length = 0;
    accrossItems.value.length = 0;
    cntRandom.value = 5;
}


</script>
<style scoped>
.cnt {
    background-color: rgba(255, 68, 0, 0.374);
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    font-weight: bolder;
}
.example-item {
    background-color: rgba(0,0,0,.3);
    font-weight: bolder;
    font-family: monospace;
    letter-spacing: 0.08rem;
    padding: 0 0.2rem;
    border-radius: 3px;
}
</style>