const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const getmac = require('getmac');
const { desktopCapturer } = require('electron')

let mainWindow = null;
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

// ipcMain.on("getMacAddress", (event) => {
//   return event.reply("sendMacAddress", getmac.default());
// });

function createWindow() {
  // ipcMain.on('runCommand', async (event) => {
  //   event.returnValue = getmac.default();
  // });
  //localStorage.setItem("UUID","asdasdasd");
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: __dirname + '/preload.js'
    },
    title: "Skoda",
    icon: path.join(__dirname, '../build/stellar-skoda-icon.png'),
  });
  console.log("Dev : ",`${path.join(__dirname, '../build/stellar-skoda-icon.png')}`);
  console.log("Dev MAC : ",getmac.default());

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('setMacAddress', {UUID: getmac.default()});
  })
  
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  //mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  });

  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    for (const source of sources) {
      if (source.name === 'Electron') {
        mainWindow.webContents.send('SET_SOURCE', source.id)
        return
      }
    }
  })
}