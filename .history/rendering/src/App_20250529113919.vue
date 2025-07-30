<template>
  <div>
    <h1 style="text-align: center;">杭州二手房数据可视化</h1>

    <!-- 模式切换 UI -->


    <!-- 2D 图表区域 -->
    <HouseCharts v-if="currentMode === '2D'" :house-data="houseData" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 导入新组件
import HouseCharts from './components/HouseCharts.vue';

// 导入数据解析器
import { ParsedHouse, parseHouseData } from '../util/dataParser';

// Define a ref to store the parsed data
const houseData = ref<ParsedHouse[] | null>(null);

// 定义当前模式状态
const currentMode = ref<'2D'>('2D'); // Only 2D mode is available now

// 定义控制数据分析部分显示的状态变量
const showAnalysis = ref(false);

// 切换数据分析部分显示状态的函数
const toggleAnalysis = () => {
  showAnalysis.value = !showAnalysis.value;
};

// 数据加载逻辑 (修改：先加载经纬度，再加载房源数据)
onMounted(async () => {
  try {
    const response = await fetch('/house_data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawHouseData = await response.json();
    // 解析房源数据时传入经纬度 Map
    houseData.value = parseHouseData(rawHouseData);

    console.log('解析后的数据并存储:', houseData.value);

  } catch (error) {
    console.error('Error loading or processing data:', error);
  }
});

// 显式导出响应式变量 (可能有助于类型检查)
// export { houseData, currentMode };

</script>

<style scoped>
/* Add any specific styles for the 3D visualization container if needed */
/* Only retain App.vue's own styles */
/* HouseCharts.vue */
.chart-display-area>div[ref] {
  width: 100%;
  height: 600px;
  /* Fixed height for the chart */
}

/* HouseCharts.vue */
.chart-display-area {
  /* ... existing styles ... */
  min-height: 850px;
  /* Ensure a minimum height for the box, adjust based on chart height */
}

.chart-display-area>div[ref] {
  width: 100%;
  height: 800px;
  /* Adjusted height */
}

div {
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
}

/* Add styles for the data analysis container */
.data-analysis-container {
  border: 1px solid #ccc;
  /* Add a border */
  padding: 20px;
  /* Add padding inside the box */
  margin-top: 20px;
  /* Add some space above the box */
  background-color: #f9f9f9;
  /* Add a light background color */
  border-radius: 8px;
  /* Rounded corners */
}

.data-analysis-container h2,
.data-analysis-container h3 {
  text-align: center;
  /* Center the titles within the box */
  color: #333;
  /* Darker color for titles */
  margin-bottom: 15px;
  /* Add space below titles */
}

.data-analysis-container h4 {
  margin-top: 15px;
  /* Space above h4 */
  margin-bottom: 10px;
  /* Space below h4 */
  color: #555;
  /* Slightly lighter color for h4 */
}

.data-analysis-container p {
  line-height: 1.6;
  /* Improve readability with more line spacing */
  color: #555;
  /* Slightly lighter color for text */
  margin-bottom: 10px;
  /* Adjust space between paragraphs */
}

.data-analysis-container ul {
  margin-bottom: 15px;
  /* Space below lists */
  padding-left: 20px;
  /* Indent list items */
}

.data-analysis-container ul li {
  margin-bottom: 5px;
  /* Space between list items */
  line-height: 1.5;
  /* Line spacing for list items */
  color: #555;
}


.data-analysis-container p strong {
  color: #000;
  /* Make strong text black */
}

/* Remove styles migrated to TwoDCharts.vue */
/* Keep only App.vue specific styles */

/* Example styles for layout if needed, adjust based on your structure */
/*
.container {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;
}
*/

/* Add styles for the analysis button */
.analysis-button {
  position: fixed;
  /* Fixed position relative to the viewport */
  bottom: 20px;
  /* 20px from the bottom */
  right: 20px;
  /* 20px from the right */
  z-index: 1000;
  /* Ensure it's above other content */
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.analysis-button:hover {
  background-color: #0056b3;
}
</style>