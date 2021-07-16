import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  send: <T>(channel: string, data: T) => {
    ipcRenderer.send(channel, data);
  },
  receive: <T>(
    channel: string,
    func: (event: Electron.IpcRendererEvent, ...args: Array<T>) => void
  ) => {
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
  },
  remove: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
