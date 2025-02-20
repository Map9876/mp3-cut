# mp3-cut
## 一长部视频mp3分割成多个mp3后，快速筛选多个mp3

gpt-sovits 中自带一个mp3分割成多个mp3的功能，

具体见https://www.tonyisstark.com/2864.html

搜 开启语音切割 关键词 ，找到代码里
open_slicer_button=gr.Button(i18n("开启语音切割"), variant="primary",visible=True)

找到上面这行，然后去搜它的命名open_slicer_button，同文件下面有

`           open_slicer_button.click(open_slice, [slice_inp_path,slice_opt_root,threshold,min_length,min_interval,hop_size,max_sil_kept,_max,alpha,n_process], [slicer_info,open_slicer_button,close_slicer_button,asr_inp_dir,denoise_input_dir,inp_wav_dir])
`

然后搜open_slice，找到以后是对应这个函数：

`def open_slice(inp,opt_root,threshold,min_length,min_interval,hop_size,max_sil_kept,_max,alpha,n_parts):`

该函数里，主要是下面这一行：

`cmd = '"%s" tools/slice_audio.py "%s" "%s" %s %s %s %s %s %s %s %s %s''' % (python_exec,inp, opt_root, threshold, min_length, min_interval, hop_size, max_sil_kept, _max, alpha, i_part, n_parts)`

slice_audio.py 就是用的 https://github.com/openvpi/audio-slicer这个项目，


## 自动切割音频，要么用字幕的时间轴去切割成多个mp3，

先需要下载日语的字幕

https://github.com/Ajatt-Tools/kitsunekko-mirror/tree/main/subtitles

，然后刚好每个mp3，能对应好它们的日语文本
。按理说应该从nyaa.si 下载 bs11 tbs at-x 这些电视台的视频，里面有字幕文件，上面这个项目的所有日语字幕来源都是nyaa.si里，搜了一下Netflix也有日语字幕

问题是多个mp3，不方便听哪个删除哪个，音乐播放器打开，再删，没办法一次

node是生成html用的

app.js /folder
生成一个显示folder 下文件的所有mp3的一个

html，包括音频播放条，给我app.js代码以及html模板
好的，我可以帮助你生成一个 app.js 文件，以及一个用于显示 folder 目录下所有 MP3 文件的 HTML 模板。我们将使用 Node.js 和 Express 来创建服务器，并使用 EJS 模板引擎来生成 HTML。

首先，安装必要的 npm 包：

```
npm init -y
npm install express ejs
```

app.js :

```javascript
//   app.js 文件

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
```


创建 views 文件夹，里面放index.ejs文件，把下面粘贴到里面 ：

```
//  views/index.ejs 文件


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MP3 Files</title>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // 加载本地存储的选中文件
            const selectedFiles = JSON.parse(localStorage.getItem('selectedFiles') || '[]');
            selectedFiles.forEach(file => {
                const checkbox = document.querySelector(`input[data-file="${file}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });

            // 处理复选框点击事件
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    const file = this.dataset.file;
                    if (this.checked) {
                        selectFile(file);
                    } else {
                        deselectFile(file);
                    }
                });
            });

            // 处理删除按钮点击事件
            document.getElementById('deleteBtn').addEventListener('click', function () {
                deleteUnselectedFiles();
            });

            // 处理清空按钮点击事件
            document.getElementById('clearBtn').addEventListener('click', function () {
                clearSelectedFiles();
            });

            function selectFile(file) {
                fetch('/select', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ file })
                }).then(() => {
                    const selectedFiles = JSON.parse(localStorage.getItem('selectedFiles') || '[]');
                    if (!selectedFiles.includes(file)) {
                        selectedFiles.push(file);
                        localStorage.setItem('selectedFiles', JSON.stringify(selectedFiles));
                    }
                });
            }

            function deselectFile(file) {
                fetch('/deselect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ file })
                }).then(() => {
                    let selectedFiles = JSON.parse(localStorage.getItem('selectedFiles') || '[]');
                    selectedFiles = selectedFiles.filter(f => f !== file);
                    localStorage.setItem('selectedFiles', JSON.stringify(selectedFiles));
                });
            }

            function deleteUnselectedFiles() {
                const unselectedFiles = Array.from(document.querySelectorAll('input[type="checkbox"]'))
                    .filter(checkbox => !checkbox.checked)
                    .map(checkbox => checkbox.dataset.file)
                    .join(' ');

                fetch('/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ filesToDelete: unselectedFiles })
                }).then(() => {
                    location.reload();
                });
            }

            function clearSelectedFiles() {
                fetch('/clear', {
                    method: 'POST'
                }).then(() => {
                    localStorage.removeItem('selectedFiles');
                    location.reload();
                });
            }
        });
    </script>
</head>
<body>
    <h1>MP3 Files</h1>
    <ul>
        <% files.forEach(file => { %>
            <li>
                <p><%= file %></p>
                <audio controls>
                    <source src="/folder/<%= file %>" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <input type="checkbox" data-file="<%= file %>"> Select
            </li>
        <% }) %>
    </ul>
    <h2>Selected Files</h2>
    <ul>
        <% selectedFiles.forEach(file => { %>
            <li><%= file %></li>
        <% }) %>
    </ul>
    <button id="deleteBtn">Delete Unselected Files</button>
    <button id="clearBtn">Clear Selected Files</button>
</body>
</html>
```

创建folder文件夹 ，这个文件夹没啥用是空的就行，但是网页里面链接会用到，地址都是 /folder/1.mp3 这种，

因为设置了 app.use('/folder', express.static(folderPath));  会用到

运行 ：
node app.py mp3文件路径

浏览器打开：
http://127.0.0.1:3000

npm init -y #这个命令会在当前目录，创建一个 package.json 文件，类似于requirements.txt，之后别人使用 npm install ，其实就是从这个文件里面下载我npm install express 的这些安装过的内容。创建项目时候最初运行一次，后面运行应该会把node_modules文件夹里已安装的写入到这个package.json 中

npm install express ejs 这个会当前目录创建node_modules文件夹，然后下面创建express文件夹和ejs文件夹，存放下载的东西，也就是说如果改了目录，还得install，


实现一个网页，实现一个网页，可以播放本地视频，以及读取里面的ass或者srt字幕的时间，以及一个按钮，当前播放时候，按按钮在哪个字幕时间段，就记录下来这个时间段。。这个字幕在视频mkv里面，可以用ffmpeg读取，我是说可以脚本提取ass然后渲染html即可，注意读取ass和srt，只需要在后端调用命令行里的ffmpeg即可，在网页中，如果我在视频播放的某个时间段内点击了记录按钮，那就把这个时间所位于的字幕的时间轴记录作为json，我已经完成了项目的基础架构 

https://github.com/Map9876/mp3-cuthttps://github.com/copilot/c/776570c9-f0b3-4d18-97b8-43c1566cf337
