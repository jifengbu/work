const Excel = require('exceljs');

async function main() {
    const wb = await new Excel.Workbook();
    const ws = wb.addWorksheet('三(一)班');

    ws.columns = [
        { header: '姓名', key: 'name', width: 10 },
        { header: '语文', key: 'chinese', width: 10 },
        { header: '数学', key: 'math', width: 10 },
        { header: '英语', key: 'english', width: 10 },
        { header: '总分', key: 'sum', width: 10 },
        { header: '平均分', key: 'average', width: 10, style: { numFmt: '0.00' } },
    ];
    for (let i = 0; i < ws.columns.length; i++) {
        ws.getCell(`${String.fromCharCode(65+i)}1`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb:'FFFFFF00' },
        };
    }


    ws.addRow({ name: '张三', chinese: 89, math: 93, english: 90 });
    ws.addRow({ name: '李四', chinese: 73, math: 99, english: 92 });
    ws.addRow([ '王五', 70, 82, 94 ]);
    ws.addRows([
        { name: '赵六', chinese: 83, math: 79, english: 52 },
        [ '刘七', 90, 62, 34 ],
    ]);

    let count = ws.lastRow.number;
    for (let i = 2; i <= count; i++) {
        ws.getCell(`E${i}`).value = { formula: `B${i}+C${i}+D${i}` };
        ws.getCell(`F${i}`).value = { formula: `AVERAGE(B${i}, C${i}, D${i})` };
    }

    // 计算科目平均分
    ws.addRow([]);
    ws.addRow([
        '总分',
        { formula: `SUM(B2:B${count})` },
        { formula: `SUM(C2:C${count})` },
        { formula: `SUM(D2:D${count})` },
        { formula: `SUM(E2:E${count})` },
        { formula: `SUM(F2:F${count})` },
    ]);
    ws.lastRow.eachCell(o => o.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'FFCCFFCC' },
    });
    ws.addRow([
        '平均分',
        { formula: `AVERAGE(B2:B${count})` },
        { formula: `AVERAGE(C2:C${count})` },
        { formula: `AVERAGE(D2:D${count})` },
        { formula: `AVERAGE(E2:E${count})` },
        { formula: `AVERAGE(F2:F${count})` },
    ]);
    ws.lastRow.eachCell(o => o.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'FFCCFFCC' },
    });
    ws.addRow([]);
    ws.addRow([]);
    // 添加盖章
    count = ws.lastRow.number;
    ws.addRow(['考试时间：', new Date(), '', '学校：', '鸭绒民族小学']);
    let row = ws.lastRow;
    row.height = 50;
    ws.mergeCells(`E${count+1}:F${count+1}`);
    row.eachCell(o=>o.alignment = { vertical: 'middle' });
    row.getCell(2).numFmt = 'yyyy-dd-mm';
    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };

    const zhang = wb.addImage({
        filename: './zhang.png',
        extension: 'png',
    });
    ws.addImage(zhang, {
        tl: { col: 4.2, row: count },
        br: { col: 5.2, row: count+1 }
    });

    await wb.xlsx.writeFile('./score.xlsx')
}

main();
