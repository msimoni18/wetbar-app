# WETbar

> Work Enchancing Toolbar

## 🛠️ Setup
Ensure you have `Node` and `Python` installed, then clone this repository. After it's cloned, navigate to the project's root directory on your computer and run the following commands in a terminal application *(e.g., Git Bash)*:

**Install Python dependencies:**
```bash
python3 -m venv venv
```

``bash
# Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

```bash
pip3 install -r requirements.txt
```

**Install Node dependencies:**
```bash
npm install
```

<br>

## ⚙️ Config

**Electron:** Electron's `main.js`, `preload.js`, and `renderer.js` files can be found in the project's root directory.

**React:** React files can be found in the `./src/` folder, the custom toolbar is in `./src/components/toolbar`.

**Python:** Python scripts can be created in the `./app.py` file and used on events via `REST` calls. Supporting modules can be found in
`./api/`.

<br>

## 📜 Scripts

Below are the scripts you'll need to run and package your application, as well as build out JSDoc documentation, if you choose to do so. An exhaustive list of scripts that are available can be found in the `package.json` file of the project's root directory, in the `scripts` section.

| ⚠️ &nbsp;When packaging, you must install [PyInstaller](https://pypi.org/project/pyinstaller) and add its path in your environment variables.<br />The name of your package in [package.js](https://github.com/iPzard/electron-react-python-template/blob/master/scripts/package.js) must also match the name field in [package.json](https://github.com/iPzard/electron-react-python-template/blob/master/package.json). |
| --- |

**Start Developer Mode:**
```bash
npm run start
```

**Package Windows: <sup>*1*</sup>**
```bash
npm run build:package:windows
```

**Package macOS:**
```bash
npm run build:package:mac
```

**Package Linux:**
```bash
npm run build:package:linux
```

**Build Documentation:**
```bash
npm run build:docs
```

*<sup>1</sup>Windows uses [electron-wix-msi](https://github.com/felixrieseberg/electron-wix-msi), you must install and add its path to your environment variables.*
<br><br>

## 🐱‍👓 Docs
TODO
<br><br>

## 🦟 Bugs
TODO
<br><br>
