const { app, BrowserWindow, Menu, ipcMain, ipcRenderer, dialog } = require('electron');
const ejse = require('ejs-electron')
const path = require('path');
const updater = require('./updater')
require('./app')
// const { substationsData, bayData, scadaData, zoneData, voltageData, gisData, allData } = require('./db')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}
// require('./controllers/table')
require('./controllers/table2')
require('./controllers/viTable')
require('./controllers/viTable2')
require('./controllers/ocTable')
require('./controllers/pmTable')
require('./controllers/cbcmTable')
require('./controllers/addMfTable')
require("./controllers/mfTable")
require("./controllers/globalSearch")
require("./controllers/updateData/addViData")
require("./controllers/updateData/addOcData")
require("./controllers/updateData/addPmData")
require("./controllers/updateData/addCbcmData")
require("./controllers/updateData/addSmhData")
require("./controllers/substationMaintenanceHistory")
let mainWindow
function createWindow(htmlPath) {

    setTimeout(updater, 2000)
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
        icon: path.join(__dirname, './assets/images/logo.png'),
        show: false,
        title: "HITACHI ABB"

    });
    mainWindow.hide()
    mainWindow.maximize()
    // mainWindow.loadFile(path.join(__dirname, './views/table.ejs'));
    mainWindow.loadFile(path.join(__dirname, htmlPath));

    const mainMenu = Menu.buildFromTemplate([
        {
            label: "File",
            submenu: [
                {
                    label: "Quit",
                    accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                    click() {
                        dialog.showMessageBox(mainWindow,
                            {
                                title: "Quit ABB?",
                                message: "Are you sure",
                                buttons: ["No", "Yes"],
                                defaultId: 0, // bound to buttons array
                                cancelId: 1 // bound to buttons array
                            })
                            .then(result => {
                                if (result.response === 0) {
                                    console.log("No clicked");
                                    // bound to buttons array
                                } else if (result.response === 1) {
                                    // bound to buttons array
                                    app.quit()
                                    console.log("yes clicked");
                                }
                            })
                    }
                }
            ]
        },
        {
            label: "GIS Data",
            click() {
                mainWindow.loadFile(path.join(__dirname, './views/table.ejs'));
            }
        },
        {
            label: "Report",
            submenu: [
                {
                    label: "View records",
                    submenu: [
                        {
                            label: "Visual Inspetion",
                            click() {
                                mainWindow.loadFile(path.join(__dirname, './views/viTable2.ejs'));

                            }
                        },
                        {
                            label: "Operational Check",
                            click() {
                                mainWindow.loadFile(path.join(__dirname, './views/ocTable.ejs'));
                            }
                        },
                        {
                            label: "Periodic Maintenance",
                            click() {

                                mainWindow.loadFile(path.join(__dirname, './views/pmTable.ejs'));
                            }
                        },
                        {
                            label: "CBCM",
                            click() {

                                mainWindow.loadFile(path.join(__dirname, './views/cbcmTable.ejs'));
                            }
                        },
                        {
                            label: "Major Findings",
                            submenu: [
                                {
                                    label: "View Major Finding",
                                    click() {
                                        mainWindow.loadFile(path.join(__dirname, './views/mfTable.ejs'));
                                    }
                                },
                                {
                                    label: "Add Major Finding Data",
                                    click() {
                                        mainWindow.loadFile(path.join(__dirname, './views/addMfTable.ejs'));
                                    }
                                }
                            ]
                        },
                        {
                            label: "Substation Maintenance History",
                            click() {
                                mainWindow.loadFile(path.join(__dirname, './views/substationMaintenanceHistory.ejs'));
                            }
                        }
                    ]
                },
                {
                    label: "Add records",
                    submenu: [
                        {
                            label: "Data Update",
                            submenu: [
                                {
                                    label: "Visual Inspection",
                                    click() {
                                        mainWindow.loadFile(path.join(__dirname, './views/updatedata/addViData.ejs'));
                                    }
                                },
                                {
                                    label: "Operational Check",
                                    click() {
                                        mainWindow.loadFile(path.join(__dirname, './views/updatedata/addOcData.ejs'));
                                    }
                                },
                                {
                                    label: "Periodic Maintenance",
                                    click() {
                                        mainWindow.loadFile(path.join(__dirname, './views/updatedata/addPmData.ejs'));
                                    }
                                },
                                {
                                    label: "CBCM",
                                    click() {
                                        mainWindow.loadFile(path.join(__dirname, './views/updatedata/addCbcmData.ejs'));
                                    }
                                },

                                {
                                    label: "Substation Maintenance History",
                                    click() {
                                        mainWindow.loadFile(path.join(__dirname, './views/updatedata/addSmhData.ejs'));
                                    }
                                },
                            ]
                        }
                    ]
                },
                {
                    label: "Find Records",
                    click() {
                        mainWindow.loadFile(path.join(__dirname, './views/globalSearch.ejs'));
                    }
                },
            ]

        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Instructions",
                    click() {
                        mainWindow.loadFile(path.join(__dirname, './views/instructions.ejs'));
                    }
                }
            ]
        },


    ])
    Menu.setApplicationMenu(mainMenu)
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => {
        mainWindow.show() //to prevent the white screen when loading the window, lets show it when it is ready
    })
};

ipcMain.on('loadNewView', (e, arg) => {
    mainWindow.loadFile(path.join(__dirname, './views/' + arg));
})

const createAddDataWindow = () => {
    const addWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { nodeIntegration: true }
    })
    addWindow.maximizable = false
    addWindow.loadFile(path.join(__dirname, './views/addData.ejs'));
    addWindow.webContents.openDevTools();
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow('./views/home.ejs')
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});



app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
