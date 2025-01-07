# mp3-cut
## # mp3-cut
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
