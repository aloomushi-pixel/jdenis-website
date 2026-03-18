const xlsx = require('xlsx');
const fs = require('fs');
try {
  const workbook = xlsx.readFile('C:\\Users\\Usuario\\OneDrive\\Documentos\\PROYECTOS\\Productos.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  fs.writeFileSync('output2.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log("Success! Extracted", data.length, "items.");
} catch (error) {
  console.error("Error reading excel file:", error.message);
}
