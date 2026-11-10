/**
 * CODELAB IDE — Desktop Native Host
 * Architected by Sinan Mohammed
 * Version: 2.0 Universal
 */

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { execSync, spawn } = require("child_process");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#07090E",
    title: "CODELAB IDE — Sinan Mohammed",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const appUrl = process.env.CODELAB_APP_URL || "http://localhost:3000";
  mainWindow.loadURL(appUrl).catch(() => {
    // Fallback if dev server is not ready yet
    mainWindow.loadFile(path.join(__dirname, "fallback.html")).catch(() => {});
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function setupIpcHandlers() {
  ipcMain.handle("desktop:get-system-info", () => {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron,
      developer: "Sinan Mohammed",
      product: "CODELAB IDE",
      version: "2.0.0",
    };
  });

  ipcMain.handle("desktop:detect-toolchains", () => {
    const isWin = process.platform === "win32";
    const checkCommand = (cmd) => {
      try {
        const lookup = isWin ? `where ${cmd}` : `which ${cmd}`;
        execSync(lookup, { stdio: "ignore" });
        return true;
      } catch {
        return false;
      }
    };

    return {
      python: checkCommand("python") || checkCommand("python3"),
      node: checkCommand("node"),
      npm: checkCommand("npm"),
      git: checkCommand("git"),
      gcc: checkCommand("gcc"),
      gpp: checkCommand("g++"),
      java: checkCommand("java"),
      javac: checkCommand("javac"),
      docker: checkCommand("docker"),
    };
  });

  ipcMain.handle("desktop:open-dir-dialog", async () => {
    if (!mainWindow) return null;
    const res = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
      title: "Open Project Folder in CODELAB IDE",
    });
    if (res.canceled || res.filePaths.length === 0) return null;
    return res.filePaths[0];
  });

  ipcMain.handle("desktop:read-project-folder", async (_, dirPath) => {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      return items
        .filter((i) => !i.name.startsWith(".") && i.name !== "node_modules")
        .map((i) => ({
          name: i.name,
          isDirectory: i.isDirectory(),
          path: path.join(dirPath, i.name),
        }));
    } catch {
      return [];
    }
  });

  ipcMain.handle("desktop:save-file", async (_, { filePath, content }) => {
    try {
      fs.writeFileSync(filePath, content, "utf-8");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("desktop:run-command", async (_, { cmd, args }) => {
    return new Promise((resolve) => {
      try {
        const proc = spawn(cmd, args || [], { shell: true });
        let stdout = "";
        let stderr = "";

        proc.stdout.on("data", (d) => (stdout += d.toString()));
        proc.stderr.on("data", (d) => (stderr += d.toString()));

        proc.on("close", (code) => {
          resolve({ exitCode: code, stdout, stderr });
        });

        proc.on("error", (err) => {
          resolve({ exitCode: -1, stdout: "", stderr: err.message });
        });
      } catch (err) {
        resolve({ exitCode: -1, stdout: "", stderr: err.message });
      }
    });
  });
}

