module.exports = {
  "packagerConfig": {
    "asar": true
  },
  "rebuildConfig": {},
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ],
  "plugins": [
    {
      "name": "@electron-forge/plugin-auto-unpack-natives",
      "config": {}
    },
    {
      "name": "@electron-forge/plugin-webpack",
      "config": {
        "mainConfig": "./webpack.main.config.js",
        "renderer": {
          "config": "./webpack.renderer.config.js",
          "entryPoints": [
            {
              "name": "main_window",
              "html": "./src/index.html",
              "js": "./src/renderer.tsx",
              "preload": {
                "js": "./src/preload.ts"
              },
              outputPaths: ['.webpack/renderer'] 
            }
          ]
        }
      }
    },
    {
      "name": "@electron-forge/plugin-fuses",
      "config": {
        "version": 1,
        "fuses": {
          "runAsNode": false,
          "enableNodeCliInspectArguments": true,
          "enableEmbeddedAsarIntegrityValidation": false,
          "onlyLoadAppFromAsar": false,
          "loadBrowserProcessSpecificV8Snapshot": true,
          "enableCookieEncryption": true
        }
      }
    }
  ]
}