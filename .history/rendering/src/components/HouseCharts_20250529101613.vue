<template>
    <div class="charts-container">

        <!-- Chart Carousel -->
        <div class="chart-carousel">
            <button @click="prevChart" :disabled="currentIndex === 0" class="nav-button left-arrow">
                <svg t="1748415020699" class="icon" viewBox="0 0 1127 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="1480" width="50" height="50">
                    <path
                        d="M512.7 34.8c64.5 0 127.1 12.6 186.10000001 37.6 56.9 24.1 108 58.5 151.89999999 102.4 43.9 43.9 78.4 95 102.40000001 151.9 24.9 59 37.6 121.6 37.59999999 186.1s-12.6 127.1-37.59999999 186.1c-24.1 56.9-58.5 108-102.40000001 151.9-43.9 43.9-95 78.4-151.89999999 102.4-58.9 24.9-121.6 37.6-186.10000001 37.6s-127.1-12.6-186.1-37.6c-56.9-24.1-108-58.5-151.9-102.4-43.9-43.9-78.4-95-102.4-151.9-24.9-58.9-37.6-121.6-37.60000001-186.1s12.6-127.1 37.60000001-186.1c24.1-56.9 58.5-108 102.4-151.9s95-78.4 151.9-102.4c58.9-25 121.6-37.6 186.1-37.6z m0 896c56.4 0 111.2-11 162.7-32.8 49.8-21.1 94.5-51.2 132.9-89.6s68.5-83.1 89.6-132.90000001C919.6 624 930.7 569.2 930.7 512.8s-11-111.2-32.8-162.69999999c-21.1-49.8-51.2-94.5-89.6-132.90000001-38.4-38.4-83.1-68.5-132.9-89.6-51.5-21.8-106.3-32.8-162.7-32.8s-111.2 11-162.7 32.8c-49.8 21.1-94.5 51.2-132.9 89.6-38.4 38.4-68.5 83.1-89.6 132.9-21.8 51.5-32.8 106.3-32.79999999 162.7s11 111.2 32.79999999 162.7c21.1 49.8 51.2 94.5 89.6 132.9 38.4 38.4 83.1 68.5 132.9 89.6 51.5 21.7 106.2 32.8 162.7 32.8z"
                        fill="#1296db" p-id="1481"></path>
                    <path
                        d="M531.9 308.8c6.5 0 13.09999999 2.1 18.60000001 6.5 13 10.3 15.2 29.1 4.89999999 42.1l-132.2 167.4 131.9 161c10.5 12.8 8.6 31.7-4.2 42.2-12.8 10.5-31.7 8.6-42.2-4.2l-147.19999999-179.6c-8.9-10.9-9.1-26.5-0.30000001-37.6L508.3 320.2c5.9-7.5 14.7-11.4 23.6-11.4z"
                        fill="#1296db" p-id="1482"></path>
                </svg>
            </button>
            <div class="chart-item-single">
                <h3>{{ currentChart.title }}</h3>
                <div :ref="currentChart.ref" style="width: 100%; height: 600px;"></div>
            </div>
            <button @click="nextChart" :disabled="currentIndex === charts.length - 1" class="nav-button right-arrow">
                <svg t="1748415075828" class="icon" viewBox="0 0 1127 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="1973" width="50" height="50">
                    <path
                        d="M511.3 989.2c-64.5 0-127.1-12.6-186.1-37.6-56.9-24.1-108-58.5-151.9-102.4-43.9-43.9-78.4-95-102.4-151.9-24.9-59-37.6-121.6-37.6-186.1s12.6-127.1 37.6-186.1c24.1-56.9 58.5-108 102.4-151.9 43.9 43.9 78.4 95 102.4 151.9 24.9 58.9 37.6 121.6 37.6 186.1s-12.6 127.1-37.6 186.1c-24.1 56.9-58.5 108-102.4 151.9s-95 78.4-151.9 102.4c-58.9 25-121.6 37.6-186.1 37.6z m0-896c-56.4 0-111.2 11-162.7 32.8-49.8 21.1-94.5 51.2-132.9 89.6s-68.5 83.1-89.6 132.9C104.4 400 93.3 454.8 93.3 511.2s11 111.2 32.8 162.7c21.1 49.8 51.2 94.5 89.6 132.9 38.4 38.4 83.1 68.5 132.9 89.6 51.5 21.8 106.3 32.8 162.7 32.8s111.2-11 162.7-32.8c49.8-21.1 94.5-51.2 132.9-89.6 38.4-38.4 68.5-83.1 89.6-132.9 21.8-51.5 32.8-106.3 32.8-162.7s-11-111.2-32.8-162.7c-21.1-49.8-51.2-94.5-89.6-132.9-38.4-38.4-83.1-68.5-132.9-89.6-51.5-21.7-106.2-32.8-162.7-32.8z"
                        fill="#4A90E2" p-id="1974"></path>
                    <path
                        d="M492.1 715.2c-6.5 0-13.1-2.1-18.6-6.5-13-10.3-15.2-29.1-4.9-42.1l132.2-167.4-131.9-161c-10.5-12.8-8.6-31.7 4.2-42.2 12.8-10.5 31.7-8.6 42.2 4.2l147.2 179.6c8.9 10.9 9.1 26.5 0.3 37.6L515.7 703.8c-5.9 7.5-14.7 11.4-23.6 11.4z"
                        fill="#4A90E2" p-id="1975"></path>
                </svg>
            </button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import * as echarts from 'echarts/core';
// Import the necessary components and charts
import { BarChart, PieChart, ScatterChart, BoxplotChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Import data parsing functions
import {
    getAreaPriceBoxPlotData,
    getTop10FollowedHousesData,
    getRenovationPriceScatterData,
    getAreaHouseCountPieData,
    getPublishTimeFollowersTrendData
} from '../util/chartDataParser';

echarts.use([
    BarChart,
    PieChart,
    ScatterChart,
    BoxplotChart,
    LineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    CanvasRenderer,
]);

// 定义解析后的房源数据接口 (Copy from dataParser.ts for self-containment)
interface ParsedHouse {
    房源标题: string;
    室: number | null;
    厅: number | null;
    面积: number | null; // 平米
    朝向: string | null;
    装修: string | null;
    楼层信息: string | null; // 例如 "中楼层"
    总楼层: number | null;
    建筑年份: number | null; // 例如 2012
    建筑类型: string | null; // 例如 "板塔结合"
    小区名称: string | null;
    所在区域: string | null; // 例如 "临河里"
    单价: number | null; // 元/平
    关注人数: number | null;
    发布时间: string | null; // 例如 "2个月以前发布"
    标签: string[];
}

// 定义接收的 props
const props = defineProps<{ houseData: ParsedHouse[] | null }>();

// Define chart container refs
const areaPriceBoxPlotContainer = ref<HTMLElement | null>(null);
const top10FollowersBarContainer = ref<HTMLElement | null>(null);
const renovationPriceScatterContainer = ref<HTMLElement | null>(null);
const areaCountPieContainer = ref<HTMLElement | null>(null);
const publishTimeFollowersLineContainer = ref<HTMLElement | null>(null);

// Define the current chart index
const currentIndex = ref(0);

// Computed property for the current chart
const currentChart = computed(() => charts[currentIndex.value]);

// Navigation functions
const nextChart = () => {
    if (currentIndex.value < charts.length - 1) {
        currentIndex.value++;
    }
};

const prevChart = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

// Function to dispose of a chart instance
const disposeChart = (chartElement: HTMLElement) => {
    const chartInstance = echarts.getInstanceByDom(chartElement);
    if (chartInstance) {
        chartInstance.dispose();
    }
};

// Function to render the current chart
const renderCurrentChart = (data: ParsedHouse[] | null) => {
    if (!data || data.length === 0) {
        console.warn("No data to render charts.");
        // Optionally display a message in the chart container
        const chartElement = currentChart.value.ref.value;
        if (chartElement) {
            disposeChart(chartElement);
            chartElement.innerHTML = '<p>暂无数据可供可视化</p>';
        }
        return;
    }

    const chartElement = currentChart.value.ref.value;
    if (chartElement) {
        // Dispose of the previous chart instance before rendering the new one
        disposeChart(chartElement);
        // Render the current chart
        try {
            currentChart.value.render(chartElement, data);
        } catch (error) {
            console.error(`Error rendering chart ${currentChart.value.title}:`, error);
            chartElement.innerHTML = '<p>图表加载失败</p>';
        }
    }
};

// Watch for changes in the houseData prop or currentIndex and redraw the current chart
watch([() => props.houseData, currentIndex], async ([newData, newIndex]) => {
    // Wait for the DOM to update after currentIndex changes
    await nextTick();
    renderCurrentChart(newData);
}, { immediate: true }); // Use immediate: true to draw charts on initial data load

// --- Chart Render Functions ---

// 1. 各区域房源单价分布对比箱线图
function renderAreaPriceBoxPlot(chartElement: HTMLElement, data: ParsedHouse[]) {
    const chartData = getAreaPriceBoxPlotData(data);

    if (chartData.length === 0) {
        echarts.dispose(chartElement);
        chartElement.innerHTML = '<p>暂无区域单价分布数据</p>';
        return;
    }

    const areas = chartData.map((item: { area: string; prices: number[] }) => item.area);
    const prices = chartData.map((item: { area: string; prices: number[] }) => item.prices);

    const myChart = echarts.init(chartElement);
    const option = {
        title: {
            text: '各区域房源单价分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: areas,
            boundaryGap: true,
            nameMap: areas,
            axisLabel: {
                interval: 0,
                rotate: 30,
                overflow: 'breakAll',
                ellipsis: '...'
            }
        },
        yAxis: {
            type: 'value',
            name: '单价 (元/平)'
        },
        series: [
            {
                name: '单价分布',
                type: 'boxplot',
                data: prices,
                tooltip: {
                    formatter: function (param: any) {
                        if (param.data) {
                            return [
                                `区域: ${param.name}<br/>`,
                                `最大值: ${param.data[5].toFixed(2)}<br/>`,
                                `第三四分位数: ${param.data[4].toFixed(2)}<br/>`,
                                `中位数: ${param.data[3].toFixed(2)}<br/>`,
                                `第一四分位数: ${param.data[2].toFixed(2)}<br/>`,
                                `最小值: ${param.data[1].toFixed(2)}`
                            ].join('');
                        }
                        return '';
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}

// 2. 关注度前十房源的关注人数柱状图
function renderTop10FollowersBar(chartElement: HTMLElement, data: ParsedHouse[]) {
    const chartData = getTop10FollowedHousesData(data);

    if (chartData.length === 0) {
        echarts.dispose(chartElement);
        chartElement.innerHTML = '<p>暂无关注度前十房源数据</p>';
        return;
    }

    const titles = chartData.map((item: { title: string, followers: number }) => item.title);
    const followers = chartData.map((item: { title: string, followers: number }) => item.followers);

    const myChart = echarts.init(chartElement);
    const option = {
        title: {
            text: '关注度前十房源的关注人数',
            left: 'center'
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: titles,
            axisLabel: {
                interval: 0,
                rotate: 30,
                overflow: 'breakAll',
                ellipsis: '...'
            }
        },
        yAxis: {
            type: 'value',
            name: '关注人数'
        },
        series: [
            {
                name: '关注人数',
                type: 'bar',
                data: followers
            }
        ]
    };
    myChart.setOption(option);
}

// 3. 不同装修类型房源单价散点图
function renderRenovationPriceScatter(chartElement: HTMLElement, data: ParsedHouse[]) {
    const chartData = getRenovationPriceScatterData(data);

    if (chartData.length === 0) {
        echarts.dispose(chartElement);
        chartElement.innerHTML = '<p>暂无装修类型与单价数据</p>';
        return;
    }

    const scatterData = chartData.map((item: { renovation: string, price: number }) => [item.price, item.renovation]);

    // Get unique renovation types for y-axis categories
    const renovationTypes = Array.from(new Set(chartData.map(item => item.renovation))) as string[];

    const myChart = echarts.init(chartElement);
    const option = {
        title: {
            text: '不同装修类型房源单价散点图',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params: any) {
                const item = params[0];
                return `装修: ${item.value[1]}<br/>单价: ${item.value[0].toFixed(2)} 元/平`;
            }
        },
        xAxis: {
            type: 'value',
            name: '单价 (元/平)'
        },
        yAxis: {
            type: 'category',
            data: renovationTypes,
            name: '装修类型'
        },
        series: [
            {
                name: '房源',
                type: 'scatter',
                data: scatterData
            }
        ]
    };
    myChart.setOption(option);
}

// 4. 各区域房源数量占比饼图
function renderAreaCountPie(chartElement: HTMLElement, data: ParsedHouse[]) {
    const chartData = getAreaHouseCountPieData(data);

    if (chartData.length === 0) {
        echarts.dispose(chartElement);
        chartElement.innerHTML = '<p>暂无区域房源数量数据</p>';
        return;
    }

    const pieData = chartData.map((item: { area: string, count: number }) => ({
        name: item.area,
        value: item.count
    }));

    const myChart = echarts.init(chartElement);
    const option = {
        title: {
            text: '各区域房源数量占比',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: chartData.map(item => item.area)
        },
        series: [
            {
                name: '房源数量',
                type: 'pie',
                radius: '50%',
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}

// 5. 房源发布时间与关注人数变化趋势折线图
function renderPublishTimeFollowersLine(chartElement: HTMLElement, data: ParsedHouse[]) {
    const chartData = getPublishTimeFollowersTrendData(data);

    if (chartData.length === 0) {
        echarts.dispose(chartElement);
        chartElement.innerHTML = '<p>暂无发布时间与关注人数趋势数据</p>';
        return;
    }

    const times = chartData.map((item: { time: string, totalFollowers: number }) => item.time);
    const totalFollowers = chartData.map((item: { time: string, totalFollowers: number }) => item.totalFollowers);

    const myChart = echarts.init(chartElement);
    const option = {
        title: {
            text: '房源发布时间与关注人数变化趋势',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: times,
            axisLabel: {
                interval: 0,
                rotate: 30,
                overflow: 'breakAll',
                ellipsis: '...'
            }
        },
        yAxis: {
            type: 'value',
            name: '总关注人数'
        },
        series: [
            {
                name: '总关注人数',
                type: 'line',
                data: totalFollowers
            }
        ]
    };
    myChart.setOption(option);
}

// Define the list of charts with their refs, titles, and render functions
const charts = [
    { title: '各区域房源单价分布', ref: areaPriceBoxPlotContainer, render: renderAreaPriceBoxPlot },
    { title: '关注度前十房源的关注人数', ref: top10FollowersBarContainer, render: renderTop10FollowersBar },
    { title: '不同装修类型房源单价散点图', ref: renovationPriceScatterContainer, render: renderRenovationPriceScatter },
    { title: '各区域房源数量占比', ref: areaCountPieContainer, render: renderAreaCountPie },
    { title: '房源发布时间与关注人数变化趋势', ref: publishTimeFollowersLineContainer, render: renderPublishTimeFollowersLine },
];
</script>

<style scoped>
.charts-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    margin-top: 5vh;
}

.chart-carousel {
    position: relative;
    width: 95%;
    max-width: 1400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
    height: auto;
    border-radius: 0;
    background-color: transparent;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    padding: 0;
    margin: 0 30px;
}

.nav-button svg {
    width: 50px;
    height: 50px;
}

.left-arrow {
    left: -80px;
}

.right-arrow {
    right: -80px;
}

.nav-button:disabled {}

.nav-button:disabled svg path {
    fill: #ccc;
}

.chart-item-single {
    flex-grow: 1;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
}

.chart-item-single>div {
    width: 100%;
    height: 600px;
}

.chart-row {
    display: none;
}

.chart-item {
    display: none;
}
</style>