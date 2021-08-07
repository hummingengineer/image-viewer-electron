import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import getImgPaths from './utils/getImgPaths';
import getImgItems from './utils/getImgItems';
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false,
    show: false,
    center: true,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      devTools: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Minimize app
  ipcMain.on('minimize-app', () => mainWindow.minimize());

  // Maximize or unmaximize app
  ipcMain.on('maximize-unmaximize-app', () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });

  mainWindow.on('maximize', () => mainWindow.webContents.send('app-maximized'));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('app-unmaximized'));

  // Close app
  ipcMain.on('close-app', () => mainWindow.close());

  // Select a folder and then get the list of all image files in directory tree at given path
  let imgPaths: Array<string> = [];

  ipcMain.on('open-folder', async (event: Electron.IpcMainEvent) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });

    if (canceled) return;

    const folderPath = filePaths[0];

    imgPaths = await getImgPaths(folderPath);

    event.reply('total-page-count', Math.ceil(imgPaths.length / 10));
  });

  // Change the page and then get image items of the page
  ipcMain.on('page-changed', async (event: Electron.IpcMainEvent, page: number) => {
    const imgItems = await getImgItems(imgPaths, page);

    event.reply('image-items', imgItems);
  });

  // Show the item in the folder
  ipcMain.on('show-item-in-folder', (event: Electron.IpcMainEvent, path: string) => {
    shell.showItemInFolder(path);
  });

  // Open the item with the default photo viewer of OS
  ipcMain.on('open-in-new', async (event: Electron.IpcMainEvent, path: string) => {
    await shell.openPath(path);
  });

  // Show the image dialog
  ipcMain.on('show-image-dialog', (event: Electron.IpcMainEvent, base64: string) => {
    event.reply('dialog-image', base64);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
