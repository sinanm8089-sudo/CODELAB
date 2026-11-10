/**
 * CODELAB IDE — Desktop Preload Bridge
 * Architected by Sinan Mohammed
 * Version: 2.0
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("codelabDesktop", {
  isDesktop: true,
  developer: "Sinan Mohammed",
  version: "2.0.0",

  getSystemInfo: () => ipcRenderer.invoke("desktop:get-system-info"),
  detectToolchains: () => ipcRenderer.invoke("desktop:detect-toolchains"),
  openDirectoryDialog: () => ipcRenderer.invoke("desktop:open-dir-dialog"),
  readProjectFolder: (dirPath) => ipcRenderer.invoke("desktop:read-project-folder", dirPath),
  saveProjectFile: (filePath, content) => ipcRenderer.invoke("desktop:save-file", { filePath, content }),
  runLocalCommand: (cmd, args) => ipcRenderer.invoke("desktop:run-command", { cmd, args }),
});

