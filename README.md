# mp3-cut
## # mp3-cut
## 一长部视频mp3分割成多个mp3后，快速筛选多个mp3
gpt-sovits 中自带一个mp3分割成多个mp3的功能，

具体见https://www.tonyisstark.com/2864.html

搜 开启语音切割 关键词 ，找到代码里
open_slicer_button=gr.Button(i18n("开启语音切割"), variant="primary",visible=True)
找到上面这行，然后去搜它的命名open_slicer_button，同文件下面有

            ```python
            open_slicer_button.click(open_slice, [slice_inp_path,slice_opt_root,threshold,min_length,min_interval,hop_size,max_sil_kept,_max,alpha,n_process], [slicer_info,open_slicer_button,close_slicer_button,asr_inp_dir,denoise_input_dir,inp_wav_dir])
            ```
一长部视频mp3分割成多个mp3后，快速筛选多个mp3
gpt-sovits 中自带一个mp3分割成多个mp3的功能，

具体见https://www.tonyisstark.com/2864.html

搜 开启语音切割 关键词 ，找到代码里
open_slicer_button=gr.Button(i18n("开启语音切割"), variant="primary",visible=True)
找到上面这行，然后去搜它的命名open_slicer_button，同文件下面有

            ```python
            open_slicer_button.click(open_slice, [slice_inp_path,slice_opt_root,threshold,min_length,min_interval,hop_size,max_sil_kept,_max,alpha,n_process], [slicer_info,open_slicer_button,close_slicer_button,asr_inp_dir,denoise_input_dir,inp_wav_dir])
            ```
