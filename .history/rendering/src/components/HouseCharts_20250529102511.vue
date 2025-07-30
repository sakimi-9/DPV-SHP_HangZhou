<template>
    <div class="charts-container">
        <!-- Main Title - Centered in App.vue -->

        <!-- Chart Cards List -->
        <div v-if="selectedChartIndex === null" class="charts-grid">
            <div v-for="(chart, index) in charts" :key="index" class="chart-card"
                :style="{ 'border-color': getCardColor(index) }" @click="selectChart(index)">
                <h3>{{ chart.title }}</h3>
            </div>
        </div>

        <!-- Selected Chart View -->
        <div v-else class="selected-chart-view">
            <button @click="resetSelection" class="back-button">返回图表列表</button>
            <h3>{{ currentChart.title }}</h3>
            <div :ref="currentChart.ref" style="width: 100%; height: 600px;"></div>
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
} from '../../util/chartDataParser'; // Corrected path

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
const selectedChartIndex = ref<number | null>(null); // Use null for no selection

// Computed property for the current chart
const currentChart = computed(() => {
    if (selectedChartIndex.value === null) return null;
    return charts[selectedChartIndex.value];
});

// Navigation functions - now selection functions
const selectChart = (index: number) => {
    selectedChartIndex.value = index;
};

const resetSelection = () => {
    selectedChartIndex.value = null;
};

// Function to dispose of a chart instance
const disposeChart = (chartElement: HTMLElement) => {
    const chartInstance = echarts.getInstanceByDom(chartElement);
    if (chartInstance) {
        chartInstance.dispose();
    }
};

// Function to render the current chart
const renderSelectedChart = (data: ParsedHouse[] | null) => {
    if (selectedChartIndex.value === null || !data || data.length === 0) {
        console.warn("No chart selected or no data to render.");
        // Handle case where a chart was selected but data became null/empty
        if (selectedChartIndex.value !== null) {
            const chartElement = charts[selectedChartIndex.value].ref.value;
            if (chartElement) {
                disposeChart(chartElement);
                chartElement.innerHTML = '<p>暂无数据可供可视化</p>';
            }
        }

        return;
    }

    const chartElement = currentChart.value?.ref.value; // Use optional chaining
    if (chartElement && currentChart.value) {
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

// Watch for changes in the houseData prop or selectedChartIndex and redraw the selected chart
watch([() => props.houseData, selectedChartIndex], async ([newData, newIndex]) => {
    // Wait for the DOM to update after selectedChartIndex changes
    await nextTick();
    renderSelectedChart(newData);
}, { immediate: true }); // Use immediate: true to draw charts on initial data load

// Function to get a color for the card based on index
const getCardColor = (index: number) => {
    const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#F8E71C', '#BD10E0']; // Example colors
    return colors[index % colors.length];
};

// --- Chart Render Functions ---

// 1. 各区域房源单价分布对比箱线图
function renderAreaPriceBoxPlot(chartElement: HTMLElement, data: ParsedHouse[]) {
    const chartData = getAreaPriceBoxPlotData(data);

    if (chartData.length === 0) {
        echarts.dispose(chartElement);
        chartElement.innerHTML = '<p>暂无区域单价分布数据</p>';
        return;
    }

    const areas = chartData.map(item => item.area);
    const prices = chartData.map(item => item.prices);

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
                    formatter: function (param: any) { // Keep any type for simplicity
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

    const titles = chartData.map(item => item.title);
    const followers = chartData.map(item => item.followers);

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

    const scatterData = chartData.map((item: { renovation: string, price: number }) => [item.price, item.renovation]); // Explicitly type item

    // Get unique renovation types for y-axis categories
    const renovationTypes = Array.from(new Set(chartData.map((item: { renovation: string, price: number }) => item.renovation))) as string[]; // Explicitly type item and result

    const myChart = echarts.init(chartElement);
    const option = {
        title: {
            text: '不同装修类型房源单价散点图',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params: any) { // Keep any type for simplicity
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
    })); // Explicitly type item

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
            data: chartData.map((item: { area: string, count: number }) => item.area) // Explicitly type item
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

    const times = chartData.map((item: { time: string, totalFollowers: number }) => item.time); // Explicitly type item
    const totalFollowers = chartData.map((item: { time: string, totalFollowers: number }) => item.totalFollowers); // Explicitly type item

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
    gap: 30px;
    /* Increased gap */
    align-items: center;
    margin-top: 5vh;
    padding: 20px;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    /* Responsive grid */
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    /* Limit grid width */
    justify-content: center;
}

.chart-card {
    background-color: #fff;
    border: 2px solid;
    /* Use border-color from style binding */
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chart-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chart-card h3 {
    margin: 0;
    color: #333;
    font-size: 1.2em;
}

.selected-chart-view {
    width: 95%;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.back-button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: #0056b3;
}

/* Removed carousel related styles */
/*
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
*/
</style>