const fs = require('fs');
const xlsx = require('xlsx');

try {
  const workbook = xlsx.readFile('C:\\Users\\Usuario\\OneDrive\\Documentos\\PROYECTOS\\Clientes News Letter.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  console.log(JSON.stringify(data.slice(0, 3), null, 2));
} catch(e) {
  console.error("Error reading xlsx", e);
}
