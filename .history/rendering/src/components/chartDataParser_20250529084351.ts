import { ParsedHouse, parseHouseData } from '../../util/dataParser';

// Function to prepare data for Chart 1: Box plot of unit price distribution by region
export function prepareBoxPlotData(parsedData: ParsedHouse[]) {
    // Implementation for Chart 1 data preparation
    // Requires grouping data by '所在区域' and collecting '单价' for each region.
    // Echarts boxplot series data format: [[v1, v2, v3, v4, v5], ...]
    // Or using dataset: { source: [[region1, price1], [region1, price2], [region2, price3], ...] }
    const data: { [key: string]: number[] } = {};
    parsedData.forEach(house => {
        if (house.所在区域 && house.单价 !== null) {
            if (!data[house.所在区域]) {
                data[house.所在区域] = [];
            }
            data[house.所在区域].push(house.单价);
        }
    });

    const categories = Object.keys(data);
    const values = Object.values(data);

    // Echarts requires the data in a specific format for boxplot if not using dataset
    // This example returns grouped data, further processing might be needed for Echarts series data array
    return {
        categories: categories,
        values: values
    };
}

// Function to prepare data for Chart 2: Bar chart of attention count for top 10 houses
export function prepareTop10AttentionData(parsedData: ParsedHouse[]) {
    // Implementation for Chart 2 data preparation
    // Requires sorting by '关注人数' and selecting the top 10.
    // Echarts bar chart data format: { xAxis: { data: [...] }, series: [{ data: [...] }] }
    const sortedData = parsedData
        .filter(house => house.关注人数 !== null && house.房源标题)
        .sort((a, b) => (b.关注人数 || 0) - (a.关注人数 || 0))
        .slice(0, 10);

    const titles = sortedData.map(house => house.房源标题);
    const attentionCounts = sortedData.map(house => house.关注人数);

    return {
        titles: titles,
        attentionCounts: attentionCounts
    };
}

// Function to prepare data for Chart 3: Scatter plot of unit price by decoration type
export function prepareDecorationScatterData(parsedData: ParsedHouse[]) {
    // Implementation for Chart 3 data preparation
    // Requires extracting '装修' and '单价'.
    // Echarts scatter plot data format: [[deco1, price1], [deco2, price2], ...]
    // Or using dataset.
    const decorationTypes = ['毛坯', '简装', '精装', '其他']; // Define possible decoration types
    const data: { [key: string]: number[] } = {};

    decorationTypes.forEach(type => data[type] = []);

    parsedData.forEach(house => {
        if (house.装修 && house.单价 !== null) {
            if (decorationTypes.includes(house.装修)) {
                data[house.装修].push(house.单价);
            } else {
                // Handle other or unknown types if necessary
                if (!data['其他']) data['其他'] = [];
                data['其他'].push(house.单价);
            }
        }
        // Also check tags if decoration is not in house.装修
        else if (house.标签 && house.单价 !== null) {
            let foundDeco = false;
            for (const tag of house.标签) {
                if (decorationTypes.includes(tag)) {
                    data[tag].push(house.单价);
                    foundDeco = true;
                    break;
                }
            }
            if (!foundDeco && !data['其他']) data['其他'] = [];
            if (!foundDeco) data['其他'].push(house.单价);
        }
    });

    // Convert to a format suitable for Echarts scatter series or dataset source
    // For scatter, often data is an array of [x, y] pairs or { value: [x, y] }
    // If using dataset, source can be [[deco1, price1], [deco2, price2], ...]
    // Let's prepare data as an array of objects for clarity, can be adapted later
    const scatterData: { value: [string, number] }[] = [];
    for (const decoType in data) {
        data[decoType].forEach(price => {
            scatterData.push({ value: [decoType, price] });
        });
    }

    return scatterData;
}

// Function to prepare data for Chart 4: Pie chart of house count by region
export function prepareRegionPieData(parsedData: ParsedHouse[]) {
    // Implementation for Chart 4 data preparation
    // Requires counting occurrences of each '所在区域'.
    // Echarts pie chart data format: [{ name: 'Region', value: count }, ...]
    const regionCounts: { [key: string]: number } = {};
    parsedData.forEach(house => {
        if (house.所在区域) {
            regionCounts[house.所在区域] = (regionCounts[house.所在区域] || 0) + 1;
        }
    });

    const pieData = Object.keys(regionCounts).map(region => ({
        name: region,
        value: regionCounts[region]
    }));

    return pieData;
}

// Function to prepare data for Chart 5: Line chart of attention count trend over time
export function prepareAttentionTrendData(parsedData: ParsedHouse[]) {
    // Implementation for Chart 5 data preparation
    // Requires grouping by '发布时间' (needs time parsing) and summing '关注人数'.
    // '发布时间' is like "2个月以前发布". Need to parse this into a date/month/year.
    // Echarts line chart data format: { xAxis: { data: [...] }, series: [{ data: [...] }] }

    // This part is more complex as it requires parsing relative time strings.
    // A simplified approach might group by the string itself or convert to a rough date.
    // For now, let's group by the raw string and sum attention.
    const timeAttention: { [key: string]: number } = {};

    parsedData.forEach(house => {
        if (house.发布时间 && house.关注人数 !== null) {
            const timeKey = house.发布时间; // Using raw string as key for simplicity
            timeAttention[timeKey] = (timeAttention[timeKey] || 0) + house.关注人数;
        }
    });

    // Sort by time key if possible (requires better time parsing for meaningful order)
    // For now, just convert to arrays
    const times = Object.keys(timeAttention);
    const totalAttentions = Object.values(timeAttention);

    return {
        times: times,
        totalAttentions: totalAttentions
    };
}

// Note: The time parsing for Chart 5's line chart requires converting strings like "2个月以前发布" into actual dates or a sortable format.
// The current implementation groups by the raw string, which might not give a meaningful time trend.
// Further refinement is needed to correctly parse and group by time (e.g., by month or year). 