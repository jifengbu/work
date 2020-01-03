const Excel = require('exceljs');
const path = require('path');
const fs = require('fs-extra');
const header = require('./js/header.js');
const MAX_COL = 16;
const buildings = {};
const holders = {};
const assists = {}; // 排除表的房号
const cells = {}; // 网格管理
const dist = 'dist';
let test = 0;

function n2c(num) {
    const arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
    const arr2 = new Array('', '十', '百');//可继续追加更高位转换值
    if(!num || isNaN(num)){
        return "零";
    }
    const english = num.toString().split("");
    let result = "";
    for (let i = 0; i < english.length; i++) {
        const des_i = english.length - 1 - i;//倒序排列设值
        result = arr2[i] + result;
        const arr1_index = english[des_i];
        result = arr1[arr1_index] + result;
    }
    return result.replace(/零+$/, '').replace(/^一十/g, '十');
}

function createBuildingExcelFile(index) {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet(`导入模板`);
    ws.addRow(['V1.0.0']);
    ws.addRow(header.map(o=>o.name));
    ws.columns = header;
    return { wb, ws };
}
async function saveAllBuildingExcelFile() {
    for (let i in buildings) {
        const building = buildings[i];
        await building.wb.xlsx.writeFile(`${dist}/${building.index}栋.xlsx`)
    }
}
function getSex(id) {
    return id[16]%2 ? '男' : '女';
}
function error(line, ...msg) {
    console.log("错误信息导致退出：", line, ...msg);
    process.exit(0);
}
function warn(line, ...msg) {
    console.log("警告：", line, ...msg);
}
function _T(row, ...index) {
    if (index.length === 1) {
        const value = row.getCell(index).value;
        return !value || value.error ? null : value;
    }
    return index.map(i=>_T(row, i)).join('');
}
function getHouseNo(row, i, value) {
    if (value) {
        const matches = value.replace(/\s/g, '').match(/(\d+)-(\d+)-(\d+)/);
        if (!matches) {
            error(i, '房号错误', value);
        }
        return matches[0];
    } else {
        return assists[_T(row, 14)];
    }
}
async function parseCellFile(filename) {
    const wb = new Excel.Workbook();
    await wb.xlsx.readFile(filename);
    // 获取排查表的关系
    const ws = wb.getWorksheet(1);
    for (let i = 3; i <= 25; i++) {
        const row = ws.getRow(i);
        const name = _T(row, 2); //姓名
        const value = _T(row, 3); // 管理楼栋
        const phone = _T(row, 4); // 管理楼栋
        const list = value.split('、');
        let head = '';
        for (const i in list) {
            const item = list[i];
            if (!/^\d/.test(item)) { // 如果不是数字开头，就算成其他小区
                const matches = item.match(/([^\d]*)(\d+.*)/);
                head = matches[1];
                building = matches[2];
            } else {
                building = item;
            }
            cells[`${head}${building}`] = { name, phone };
        }
    }
}
async function parseSourceFile(filename) {
    const wb = new Excel.Workbook();
    await wb.xlsx.readFile(filename);
    // 获取排查表的关系
    const pws = wb.getWorksheet(2);
    for (let i = 3; i <= pws.actualRowCount-test; i++) {
        const row = pws.getRow(i);
        let value = _T(row, 6); //身份证号
        assists[value] = _T(row, 14); // 房号
    }
    const ws = wb.getWorksheet(1);
    const rowCount = ws.actualRowCount-test;
    // 保留户主姓名
    for (let i = 6; i <= rowCount; i++) {
        const row = ws.getRow(i);
        let value = _T(row, 24); //房号
        if (_T(row, 8) === '户主') {
            const houseNo = getHouseNo(row, i, value);
            houseNo && (holders[houseNo] = _T(row, 7));
        }
    }
    for (let i = 6; i <= rowCount; i++) {
        const row = ws.getRow(i);
        let value = _T(row, 24); //房号
        const houseNo = getHouseNo(row, i, value);
        if (!houseNo) {
            warn(i, `房号错误，${_T(row, 7)}没有录入`, );
            continue;
        }
        const list = houseNo.split('-');
        const buildIndex = list[0];
        if (!buildings[buildIndex]) {
            buildings[buildIndex] = { index: buildIndex, ...createBuildingExcelFile(buildIndex) };
        }
        const dws = buildings[buildIndex].ws;
        if (!holders[houseNo]) {
            warn(i, '没有房主', houseNo);
        }
        dws.addRow({
            1: `樟江苑小区${n2c(buildIndex)}网格`, // 所属辖区(*)
            2: _T(row, 7), // 姓名(*)
            3: getSex(_T(row, 14)), // 性别(*)
            4: _T(row, 14), // 身份证号(*)
            5: '户籍人口', // 管理类型(*)
            6: holders[houseNo], // 户主姓名
            7: houseNo, // 户编号
            8: _T(row, 8), // 与户主的关系
            9: _T(row, 13), // 文华程度
            11: _T(row, 10), // 民族
            12: _T(row, 26), // 联系电话
            15: _T(row, 2, 3, 4, 5, 6), // 户籍地详址
            20: _T(row, 15) == 1 ? '是' : '否', // 是否有劳动能力
            25: `${buildIndex}栋`, // 楼栋名称
            26: '钢筋混泥土', // 建筑物类型
            27: '保障房', // 建筑物性质
            40: (cells[`${buildIndex}栋`]||{}).name, // 负责人
            41: (cells[`${buildIndex}栋`]||{}).phone, // 负责人电话
            42: `${list[1]}单元`, // 单元名称
            43: list[2], // 房间名称
            44: '自主房', // 房间性质
            46: list[2] && `${list[2].substr(0, list[2].length-2)}层`, // 所在楼层
            51: _T(row, 25), // 年人均收入
        });
    }

}

async function main(cellfile, sourcefile) {
    sourcefile == 'res/test.xlsx' && (test = 1);
    fs.emptyDirSync(dist);
    await parseCellFile(cellfile);
    await parseSourceFile(sourcefile);
    await saveAllBuildingExcelFile();
}

main('res/cell.xlsx', 'res/test.xlsx');
