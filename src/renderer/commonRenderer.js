
function loadNewData(view) {
    // alert('ok')
    ipcRenderer.send('loadNewView', view)


}