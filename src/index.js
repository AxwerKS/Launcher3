const { autoUpdater } = require('electron-updater');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path')
var pjson = require('../package.json');
const openAboutWindow = require('about-window').default;

if (require('electron-squirrel-startup')) {app.quit();}




// const PEPPERFLASH_PLUGIN = __dirname.indexOf("asar") >=0 ? 'resources/resources/pepperflashplugin.dll' : 'resources/resources/pepperflashplugin.dll'
let pluginName
// pluginName = PEPPERFLASH_PLUGIN
pluginName = '../../resources/pepperflashplugin.dll'
astecagay = path.join(__dirname, pluginName)
app.commandLine.appendSwitch('ppapi-flash-path', astecagay)
let flashPath = path.join(__dirname, pluginName);
// app.commandLine.appendSwitch('ppapi-flash-path', 'C:/Users/Caique/Desktop/AZAR/dist/win-unpacked/resources/resources/pepperflashplugin.dll');
// app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName))
app.commandLine.appendSwitch('ppapi-flash-path', astecagay)
app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.344');
















let mainWindow;
// let menuTemplate = [{
    // label: pjson.productName,
    // submenu: [{
        // label: configFile,
        // click: () =>
            // openAboutWindow({
                // icon_path: path.join(__dirname, 'icon.png'),
                // copyright: configFile,
                // win_title: 'About ' + pjson.productName,
                // use_version_info: false,
                // description: 'Desktop client for ' + pjson.settings.hotelName + ' Hotel'
            // }),
    // }, ]
// }];


const createWindow = () => {
    mainWindow = new BrowserWindow({
        title: astecagay,
        webPreferences: {
            plugins: true,
            nodeIntegration: false
        },
        show: false,
        frame: pjson.settings.useFrame,
        backgroundColor: pjson.settings.backgroundColor,
    });
    // mainWindow.loadURL(pjson.settings.url)
	mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.maximize()
    mainWindow.show();
    // if(pjson.settings.hideMenu == false) {
      // let menu = Menu.buildFromTemplate(menuTemplate);
      // Menu.setApplicationMenu(menu);
    // }
    // else{mainWindow.setMenu(null)}
	mainWindow.once('ready-to-show', () => {
	  autoUpdater.checkForUpdatesAndNotify();
	});
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {if (process.platform !== 'darwin') {app.quit();}});
app.on('activate', () => {if (mainWindow === null) {createWindow();}});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

function closeNotification() {
  notification.classList.add('hidden');
}

function restartApp() {
  ipcRenderer.send('restart_app');
}

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});