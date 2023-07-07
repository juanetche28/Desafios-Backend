import XLSX from 'xlsx';

const { read, writeXLSX } = XLSX

function readExcel(dir) {
    const workbook = XLSX.readFile(dir);
    const workbookSheets = workbook.SheetNames;
    // console.log("workbookSheets", workbookSheets); // Muestra las hoja del excel -- mostraria  [ 'Hoja1' ]
    const sheet = workbookSheets[0]; // Selecciono la Hoja posicion 0 .. selecciona  [ 'Hoja1' ]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);  // Obtengo la informacion de mi excel en un array de objetos json
    // console.log("dataExcel",dataExcel);
}

readExcel('productsLocal.xlsx');
