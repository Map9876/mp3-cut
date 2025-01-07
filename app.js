//app.js


const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 获取命令行参数中的文件夹路径
const folderPath = process.argv[2] || path.join(__dirname, './folder'); // 默认路径为当前目录下的 folder
const selectedFilesPath = path.join(__dirname, 'selectedFiles.json'); // 存储选中的文件列表

if (!fs.existsSync(folderPath)) {
    console.error(`The folder path "${folderPath}" does not exist.`);
    process.exit(1);
}

// 读取或初始化选中的文件列表
let selectedFiles = [];
if (fs.existsSync(selectedFilesPath)) {
    selectedFiles = JSON.parse(fs.readFileSync(selectedFilesPath, 'utf-8'));
}

// 设置 EJS 作为模板引擎
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由处理器，显示文件夹下的 mp3 文件
app.get('/', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }

        // 过滤出 mp3 文件
        const mp3Files = files.filter(file => path.extname(file) === '.mp3');

        // 渲染模板并传递 mp3 文件列表和选中的文件列表
        res.render('index', { files: mp3Files, selectedFiles });
    });
});

// 路由处理器，处理文件选择
app.post('/select', (req, res) => {
    const selectedFile = req.body.file;
    if (!selectedFiles.includes(selectedFile)) {
        selectedFiles.push(selectedFile);
        fs.writeFileSync(selectedFilesPath, JSON.stringify(selectedFiles));
    }
    res.sendStatus(200);
});

// 路由处理器，处理文件取消选择
app.post('/deselect', (req, res) => {
    const deselectedFile = req.body.file;
    selectedFiles = selectedFiles.filter(file => file !== deselectedFile);
    fs.writeFileSync(selectedFilesPath, JSON.stringify(selectedFiles));
    res.sendStatus(200);
});

// 路由处理器，删除未选中的文件
app.post('/delete', (req, res) => {
    const filesToDelete = req.body.filesToDelete.split(' ');
    filesToDelete.forEach(file => {
        const filePath = path.join(folderPath, file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
    res.sendStatus(200);
});

// 路由处理器，清空选中的文件列表
app.post('/clear', (req, res) => {
    selectedFiles = [];
    fs.writeFileSync(selectedFilesPath, JSON.stringify(selectedFiles));
    res.sendStatus(200);
});

// 静态文件中间件，用于提供音频文件
app.use('/folder', express.static(folderPath));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
