<script setup lang="ts">
import { ref, reactive } from 'vue'
import { dayjs } from 'element-plus'
import type { EChartsOption } from 'echarts'
import Chart from 'components/Chart.vue'
import { lineOptions } from 'src/mocks/echarts-data'

const value = ref(new Date())
// 获取指数
let lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption
</script>

<template>
  <ElSpace direction="vertical" fill size="large">
    <ElCard shadow="never">
      <Chart :options="lineOptionsData" :height="400" />
    </ElCard>
    <ElCard shadow="never">
      <ElCalendar v-model="value">
        <template #date-cell="{ data }">
          <span>{{ dayjs(data.day).date() }}</span>
        </template>
      </ElCalendar>
    </ElCard>
  </ElSpace>
</template>
