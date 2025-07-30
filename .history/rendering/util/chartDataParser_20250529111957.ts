import { ParsedHouse } from './dataParser';

// 1. 各区域房源单价分布对比箱线图数据解析
export function getAreaPriceBoxPlotData(data: ParsedHouse[]): { area: string; prices: number[] }[] {
    console.log(`getAreaPriceBoxPlotData received ${data.length} items.`);
    const areaPrices: { [key: string]: number[] } = {};

    data.forEach(house => {
        if (house.所在区域 && house.单价 !== null) {
            console.log(`Adding data point: Area=${house.所在区域}, Price=${house.单价}`);
            if (!areaPrices[house.所在区域]) {
                areaPrices[house.所在区域] = [];
            }
            areaPrices[house.所在区域].push(house.单价);
        }
    });

    console.log(`getAreaPriceBoxPlotData processed into ${Object.keys(areaPrices).length} areas.`);
    return Object.keys(areaPrices).map(area => ({
        area: area,
        prices: areaPrices[area].sort((a, b) => a - b) // Sort for box plot calculation if needed by charting library
    }));
}

// 2. 关注度前十房源的关注人数柱状图数据解析
export function getTop10FollowedHousesData(data: ParsedHouse[]): { title: string; followers: number }[] {
    console.log(`getTop10FollowedHousesData received ${data.length} items.`);
    // Filter out items with null followers and sort by followers descending
    const sortedData = data
        .filter(house => house.关注人数 !== null)
        .sort((a, b) => (b.关注人数 || 0) - (a.关注人数 || 0));

    // Take the top 10
    const top10 = sortedData.slice(0, 10);

    console.log(`getTop10FollowedHousesData processed into ${top10.length} top items.`);
    return top10.map(house => ({
        title: house.房源标题 || '未知房源',
        followers: house.关注人数 || 0
    }));
}

// 3. 不同装修类型房源单价散点图数据解析
export function getRenovationPriceScatterData(data: ParsedHouse[]): { renovation: string; price: number }[] {
    console.log(`getRenovationPriceScatterData received ${data.length} items.`);
    return data
        .filter(house => {
            console.log(`Checking for scatter plot: Renovation=${house.装修}, Price=${house.单价 !== null}`);
            return house.装修 && house.单价 !== null;
        })
        .map(house => ({
            renovation: house.装修 || '未知装修',
            price: house.单价 || 0
        }));
}

// 4. 各区域房源数量占比饼图数据解析
export function getAreaHouseCountPieData(data: ParsedHouse[]): { area: string; count: number }[] {
    console.log(`getAreaHouseCountPieData received ${data.length} items.`);
    const areaCounts: { [key: string]: number } = {};

    data.forEach(house => {
        console.log(`Checking for pie chart: Area=${house.所在区域}`);
        if (house.所在区域) {
            areaCounts[house.所在区域] = (areaCounts[house.所在区域] || 0) + 1;
        }
    });

    const result = Object.keys(areaCounts).map(area => ({
        area: area,
        count: areaCounts[area]
    })).filter(item => item.count > 0);

    console.log(`getAreaHouseCountPieData processed into ${result.length} areas with data.`);

    return result;
}

// 5. 房源发布时间与关注人数变化趋势折线图数据解析
// Note: This requires parsing the "发布时间" string and grouping by time period (e.g., month or year)
// Assuming "发布时间" is like "X个月以前发布" or "X天以前发布" or a specific date string if available
// For simplicity, this function will group by the raw string for now. 
// A more robust implementation would parse and group by month/year.
export function getPublishTimeFollowersTrendData(data: ParsedHouse[]): { time: string; totalFollowers: number }[] {
    const timeFollowers: { [key: string]: number } = {};

    console.log(`getPublishTimeFollowersTrendData received ${data.length} items.`);
    data.forEach(house => {
        console.log(`Checking for line chart: PublishTime=${house.发布时间}, Followers=${house.关注人数 !== null}`);
        if (house.发布时间 && house.关注人数 !== null) {
            const timeKey = house.发布时间;
            timeFollowers[timeKey] = (timeFollowers[timeKey] || 0) + house.关注人数;
        }
    });

    // Convert to array and sort by time key (simple string sort)
    // For proper time sorting, a date parsing and sorting logic is needed
    const result = Object.keys(timeFollowers).map(time => ({
        time: time,
        totalFollowers: timeFollowers[time]
    })).filter(item => item.totalFollowers > 0)
        .sort((a, b) => a.time.localeCompare(b.time));

    console.log(`getPublishTimeFollowersTrendData processed into ${result.length} time points with data.`);

    return result;
} 