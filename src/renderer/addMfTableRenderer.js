const electron = require('electron')
const { ipcRenderer } = electron
const fs = require('fs')
const moment = require('moment')
const excelToJson = require('convert-excel-to-json');
document.getElementById("mfForm").addEventListener('submit', (e) => {
    e.preventDefault()
    let file = document.getElementById("mfExcel").files[0]
    let file_name = file.name
    let file_path = file.path
    console.log(file_path)
    let result = excelToJson({
        sourceFile: file_path
    });
    console.log(result)
    let data = {
        data: result,
        month: $("#month").val()
    }
    ipcRenderer.send('loadMfDataFromSheet', data)

})

ipcRenderer.on("completeInsertion", (e, arg) => {
    if (arg.status) {
        ipcRenderer.send('loadNewView', 'mfTable.html')
    } else {
        alert("Alredy have data for this month")
        return false
    }

})