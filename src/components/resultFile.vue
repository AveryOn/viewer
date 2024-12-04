<template>
    <div class="result-file flex align-items-center justify-content-center">
        <h1 class="result-header w-max m-auto px-2" v-if="!props.result.length">RESULT</h1>
        <span class="w-full" v-else>
            <h4 class="w-full sticky top-0 result-header" v-memo="[props.result]">Length List: {{ props.result.length }}</h4>
            <ul class="w-10">
                <li class="item w-full" v-for="item in props.result" :key="item">
                    {{ item }}
                </li>
            </ul>
        </span>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    result: {
        type: Array,
        default: () => [],
        required: false,
    }
});
</script>

<style scoped>
.result-file {
    max-height: 600px;
    height: 600px;
    width: 600px;
    border: 2px dashed gray;
    border-radius: 4px;
    overflow: auto;
}
.result-header {
    background-color: rgba(0,0,0,1);
    backdrop-filter: blur(4px);
}
.result-file span {
    overflow: auto;
    width: max-content;
    height: max-content;
    height: 100%;
}
.item {
    text-align: left;
    background-color: rgba(104, 255, 247, 0.186) !important;
    border-radius: 4px;
    padding: .2rem 0.5rem;
}
.item + .item {
    margin-top: 6px;
}
</style>