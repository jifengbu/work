const Excel = require('exceljs');

async function main() {
    const wb = await new Excel.Workbook();
    await wb.xlsx.readFile('./score.xlsx');
    wb.eachSheet(ws => {
        console.log(`name: ${ws.name}`);
        ws.eachRow((row, rowNumber)=>{
            console.log(`   ${rowNumber}:`);
            row.eachCell((cell, colNumber)=>{
                console.log(cell.value.result === undefined ? cell.value : cell.value.result);
            });
        });
    });
}

main();
