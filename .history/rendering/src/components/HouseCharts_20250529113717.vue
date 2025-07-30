<template>
    <div class="charts-container">
        <!-- Main Title - Centered in App.vue -->

        <!-- Chart Cards Grid -->
        <div class="charts-grid">
            <div v-for="(chart, index) in charts" :key="index" class="chart-card"
                :style="{ 'border-color': getCardColor(index) }" @click="selectChart(index)">
                <h3>{{ chart.title }}</h3>
            </div>
        </div>

        <!-- Chart Display Area (Black Box) -->
        <div class="chart-display-area">
            <div v-if="selectedChartIndex !== null && currentChart" class="selected-chart-content">
                <h3>{{ currentChart.title }}</h3>
                <!-- Chart rendering area - always in DOM, content controlled by JS -->
                <div ref="selectedChartDisplayRef" style="width: 100%; height: 600px;"></div>
            </div>
            <div v-else class="placeholder-message">
                <p>请点击上方的卡片查看图表</p>
            </div>
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
} from '../../util/chartDataParser';

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

// Define ref for the selected chart display area
const selectedChartDisplayRef = ref<HTMLElement | null>(null);

// Define the current chart index
const selectedChartIndex = ref<number | null>(null);

// Computed property for the current chart information
const currentChart = computed(() => {
    if (selectedChartIndex.value === null) return null;
    return charts[selectedChartIndex.value];
});

// Function to select a chart
const selectChart = (index: number) => {
    selectedChartIndex.value = index;
    console.log("Selected chart index:", selectedChartIndex.value);
};

// Function to dispose of a chart instance
const disposeChart = (chartElement: HTMLElement) => {
    const chartInstance = echarts.getInstanceByDom(chartElement);
    if (chartInstance) {
        chartInstance.dispose();
    }
};

// Function to render the selected chart
const renderSelectedChart = (
    chartInfo: { title: string, render: (element: HTMLElement, data: ParsedHouse[]) => void } | null,
    data: ParsedHouse[] | null
) => {
    // Dispose of any previously rendered chart in the display area
    if (selectedChartDisplayRef.value) {
        console.log("Disposing previous chart.");

        disposeChart(selectedChartDisplayRef.value);
        selectedChartDisplayRef.value.innerHTML = ''; // Clear previous chart content
    }

    if (!chartInfo || selectedChartIndex.value === null || !data || data.length === 0) {
        console.warn("No chart selected, no data, or chart info not ready.");
        // The placeholder is now controlled by v-else in the template
        console.log("Render conditions not met.", "Index:", selectedChartIndex.value, "Data present:", !!data, "Data length:", data ? data.length : 0);
        return;
    }

    const chartElement = selectedChartDisplayRef.value; // Get the display area element

    if (!chartElement) {
        console.warn("Chart display element is not available.");
        console.log("Render conditions not met.", "Index:", selectedChartIndex.value, "Data present:", !!props.houseData, "Data length:", props.houseData ? props.houseData.length : 0, "Element available:", !!chartElement);

        return; // Exit if the element is null
    }

    // Directly get chart info based on selected index
    if (chartElement && chartInfo) {
        // Render the current chart
        console.log(`Attempting to render chart: ${chartInfo.title}`);
        try {
            chartInfo.render(chartElement, data); // Pass the display area element to the render function
            console.log(`Successfully called render function for: ${chartInfo.title}`);
        } catch (error) {
            console.error(`Error rendering chart ${chartInfo.title}:`, error);
            chartElement.innerHTML = '<p>图表加载失败</p>';
            console.log(`Caught error during render for: ${chartInfo.title}`);
        }
    }
};

// Watch for changes in houseData or selectedChartIndex to determine if a chart *should* be rendered
watch([() => props.houseData, selectedChartIndex], ([newData, newIndex]) => {
    // If conditions are met (data and index valid), render the chart.
    // Note: We don't await nextTick here directly for ref availability.
    // The rendering will happen when selectedChartDisplayRef becomes available.
    if (newIndex !== null && newData && newData.length > 0 && currentChart.value) {
        // We don't call renderSelectedChart here directly, it's triggered by the ref watcher
        // For debugging: Check ref value after a short delay
        console.log("Data and Index valid, waiting for ref..."); // Add this line
        setTimeout(() => {
            console.log("Checking selectedChartDisplayRef after timeout:", !!selectedChartDisplayRef.value); // Add this line
            if (!selectedChartDisplayRef.value) {
                console.warn("selectedChartDisplayRef is still null after timeout."); // Add this line
            }
        }, 100); // Wait 100ms

    } else {
        // If conditions are not met, dispose the current chart
        if (selectedChartDisplayRef.value) {
            console.log("Conditions not met, disposing chart."); // Add this line
            disposeChart(selectedChartDisplayRef.value);
            selectedChartDisplayRef.value.innerHTML = ''; // Clear previous chart content
        } else {
            console.log("Conditions not met, no chart element to dispose."); // Add this line
        }
    }
}, { immediate: true }); // Ensure initial check

// Watch for the selectedChartDisplayRef to become available and render the chart
watch(selectedChartDisplayRef, async (newChartElement) => {
    await nextTick();
    console.log("selectedChartDisplayRef changed. New element:", !!newChartElement); // Add this line
    console.log("Checking render conditions in ref watcher:", "Element available:", !!newChartElement, "Index:", selectedChartIndex.value, "Data valid:", !!props.houseData && props.houseData.length > 0, "currentChart valid:", !!currentChart.value); // Add this line for debugging conditions
    if (newChartElement && selectedChartIndex.value !== null && props.houseData && props.houseData.length > 0 && currentChart.value) {
        // Now that the element is available and other conditions are met, render the chart
        renderSelectedChart(currentChart.value, props.houseData); // Call render with current chart info and data
    }
});

// Function to get a color for the card based on index
const getCardColor = (index: number) => {
    const colors = ['#4A90E2', '#50E3C2', 'F5A623', '#F8E71C', '#BD10E0']; // Example colors - removed duplicate definition
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
    console.log("ECharts instance initialized for:", "各区域房源单价分布");
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
    console.log("Setting option for:", "各区域房源单价分布", option);
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
    console.log("ECharts instance initialized for:", "关注度前十房源的关注人数");
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
    console.log("Setting option for:", "关注度前十房源的关注人数", option);
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
    console.log("ECharts instance initialized for:", "不同装修类型房源单价散点图");
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
    console.log("Setting option for:", "不同装修类型房源单价散点图", option);
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
    console.log("ECharts instance initialized for:", "各区域房源数量占比");
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
    console.log("Setting option for:", "各区域房源数量占比", option);
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
    console.log("ECharts instance initialized for:", "房源发布时间与关注人数变化趋势");
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
    console.log("Setting option for:", "房源发布时间与关注人数变化趋势", option);
    myChart.setOption(option);
}

// Define the list of charts with their titles and render functions
const charts = [
    { title: '各区域房源单价分布', render: renderAreaPriceBoxPlot },
    { title: '关注度前十房源的关注人数', render: renderTop10FollowersBar },
    { title: '不同装修类型房源单价散点图', render: renderRenovationPriceScatter },
    { title: '各区域房源数量占比', render: renderAreaCountPie },
    { title: '房源发布时间与关注人数变化趋势', render: renderPublishTimeFollowersLine },
];

// Initial render logic (optional, handled by watch with immediate: true)
/*
onMounted(() => {
    renderSelectedChart(props.houseData);
});
*/

</script>

<style scoped>
.charts-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    /* Increased gap */
    align-items: center;
    margin-top: 20px;
    /* Adjusted top margin */
    padding: 20px;
    width: 100%;
    /* Ensure container takes full width */
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    /* Changed to 5 equal columns */
    gap: 10px;
    /* Reduced gap to make cards smaller */
    width: 100%;
    max-width: 1200px;
    /* Keep max width */
    justify-content: center;
}

.chart-card {
    background-color: #fff;
    border: 2px solid;
    /* Use border-color from style binding */
    border-radius: 8px;
    padding: 10px;
    /* Reduced padding */
    text-align: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    font-size: 0.9em;
    /* Slightly reduced font size */
}

.chart-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chart-display-area {
    margin-top: 20px;
    /* Space above the display area */
    border: 2px solid black;
    /* Black border */
    border-radius: 8px;
    padding: 20px;
    width: 120%;
    height: 600px;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 650px;
    /* Ensure a minimum height for the box */
}

.chart-display-area h3 {
    margin-top: 0;
    margin-bottom: 10px;
}

.chart-display-area>div[ref] {
    width: 100%;
    height: 600px;
    /* Fixed height for the chart */
}

.placeholder-message {
    text-align: center;
    color: #777;
    font-size: 1.1em;
    margin-top: 100px;
    /* Center message vertically */
}

/* Removed carousel related styles */
</style>