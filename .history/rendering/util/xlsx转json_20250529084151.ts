import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const excelFilePath = 'C:\\Users\\34451\\Desktop\\杭州二手房数据可视化\\rendering\\public\\house_data.xlsx'; // 替换为你的 Excel 文件实际路径
const jsonOutputFilePath = path.join('C:\Users\34451\Desktop\杭州二手房数据可视化\rendering\public\\', 'house_data.json'); // 输出 JSON 文件到当前脚本所在目录

try {
    // 读取 Excel 文件
    const workbook = XLSX.readFile(excelFilePath);

    // 获取第一个工作表的名称
    const sheetName = workbook.SheetNames[0];

    // 获取工作表
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表数据转换为 JSON 数组
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 将 JSON 数据写入文件
    fs.writeFileSync(jsonOutputFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');

    console.log(`成功将数据从 ${excelFilePath} 转换为 JSON，并保存到 ${jsonOutputFilePath}`);
} catch (error) {
    console.error(`转换过程中发生错误: ${error}`);
}
