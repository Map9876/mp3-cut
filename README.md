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
