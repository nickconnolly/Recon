const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process"); // Include the child_process module

const { app: e, shell: r, Menu: a } = require("electron");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Listen for the IPC event
  ipcMain.on("send-password", (event, password) => {
    const command = "sudo";
    const args = ["-S", "jamf", "recon"];

    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdin.write(password + "\n");
    child.stdin.end();

    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      event.sender.send("command-output", data.toString());
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      event.sender.send("command-output", data.toString());
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      event.sender.send("command-output", `Process exited with code ${code}`);
    });
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

e.on("ready", () => {
  createWindow();
  let n = "darwin" === process.platform,
    i = [
      ...(n
        ? [
            {
              label: e.name,
              submenu: [
                { role: "about" },
                { type: "separator" },
                { type: "separator" },
                { role: "services" },
                { type: "separator" },
                { role: "hide" },
                { role: "hideOthers" },
                { role: "unhide" },
                { type: "separator" },
                { role: "quit" },
              ],
            },
          ]
        : []),
      { label: "File", submenu: [n ? { role: "close" } : { role: "quit" }] },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          ...(n
            ? [
                { role: "pasteAndMatchStyle" },
                { role: "delete" },
                { role: "selectAll" },
                { type: "separator" },
                {
                  label: "Speech",
                  submenu: [
                    { role: "startSpeaking" },
                    { role: "stopSpeaking" },
                  ],
                },
              ]
            : [
                { role: "delete" },
                { type: "separator" },
                { role: "selectAll" },
              ]),
        ],
      },
      {
        label: "View",
        submenu: [
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { type: "separator" },
          { role: "togglefullscreen" },
          { type: "separator" },
          { role: "reload" },
        ],
      },
      {
        label: "Window",
        submenu: [
          { role: "minimize" },
          { role: "zoom" },
          ...(n
            ? [
                { type: "separator" },
                { role: "front" },
                { type: "separator" },
                { role: "window" },
              ]
            : [{ role: "close" }]),
        ],
      },
    ],
    p = a.buildFromTemplate(i);
  a.setApplicationMenu(p);
}),
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
