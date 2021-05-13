const { autoUpdater } = require('electron-updater')
const { dialog } = require('electron')
const log = require('electron-log');

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"

// autoUpdater.autoDownload = false
module.exports = () => {
    autoUpdater.on('error', () => {
        dialog.showMessageBox({
            type: "info",
            title: "Update Available",
            message: "A newer version in available",
            buttons: ['Update', 'Later']
        }).then(result => {
            let buttonIndex = result.response
            if (buttonIndex == 0) {
                // autoUpdater.downloadUpdate()
            }
        })
    })
    // console.log('checking for update');
    // autoUpdater.checkForUpdatesAndNotify()
    // autoUpdater.on("update-available", () => {
    //     dialog.showMessageBox({
    //         type: "info",
    //         title: "Update Available",
    //         message: "A newer version in available",
    //         buttons: ['Update', 'Later']
    //     }).then(result => {
    //         let buttonIndex = result.response
    //         if (buttonIndex == 0) {
    //             autoUpdater.downloadUpdate()
    //         }
    //     })
    // })
    // dialog.showMessageBox({
    //     type: "info",
    //     title: "Update Available",
    //     message: "A newer version in available",
    //     buttons: ['Update', 'Later']
    // }).then(result => {
    //     let buttonIndex = result.response
    //     if (buttonIndex == 0) {
    //         // autoUpdater.downloadUpdate()
    //     }
    // })
}