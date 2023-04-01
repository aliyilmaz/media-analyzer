# Media Analyzer
Media Analyzer allows you to preflight the file before sending it to the server. It is especially useful for collecting information about Audio, Video, Photo and other file types.

## photo types
.jpeg, .jpg, .png, .webp, .svg, .gif

## video types
.mov, .mp4, .webm, .m4v, .mkv

## sound types
.mp3, .wav, .flac, .aac, .m4a


## Use

Add it to your project.

```html
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Media Analyzer</title>
    <link rel="shortcut icon" href="data:;base64,iVBORw0KGgo=" type="image/x-icon">
    <link rel="stylesheet" href="style.css">
    
  </head>

  <body>
    <div id="wrapper">
      <h3>Media Analyzer * <a href="https://github.com/aliyilmaz/media-analyzer">Github</a></h3>
      <input type="file" id="fileinput" name="fileinput" multiple />
      <input type="file" id="fileinput1" name="fileinput" multiple />
      <input type="file" id="fileinput2" name="fileinput" multiple />
      <br>(<small>also check the console</small>)<br>
      <div id="output"></div>
      <textarea id="output"></textarea>
    </div>
    <script type="text/javascript" src="mediainfo.min.js"></script>
    <script type="text/javascript" src="script.js"></script>

    <script>
      
      let divOutputHtml = '',
          divOutputElement = document.querySelector('div#output');

      media_analyzer('#fileinput', function(e, media){
        
        console.log(media);
        for (let index = 0; index < media.length; index++) {
          mime_type = (media[index]['mime_type'] != undefined) ? media[index]['mime_type'].split('/')[0] : undefined;

          filename = truncate(basename(media[index]['filename']), 60);
                    
          // console.log(media[index]);
          // .jpeg, .jpg, .png, .webp, .svg, .gif
          if(mime_type == 'image'){
            divOutputHtml = '<img src="'+(URL.createObjectURL(e.target.files[index]))+'" title="'+filename+'">';
          }

          // .mov, .mp4, .webm, .m4v, .mkv
          if(mime_type == 'video'){
            divOutputHtml = '<video src="'+(URL.createObjectURL(e.target.files[index]))+'" controls title="'+filename+'"></video>';
          }

          // .mp3, .wav, .flac, .aac, .m4a
          if(mime_type == 'audio'){
            divOutputHtml = '<audio src="'+(URL.createObjectURL(e.target.files[index]))+'" controls title="'+filename+'"></audio>';
          }

          // or...
          divOutputElement.appendChild(stringToHTML(divOutputHtml));
        }
        document.querySelector('textarea#output').value = JSON.stringify(media, null, 2);
     
     });


      media_analyzer('#fileinput1', function(e, media){
          
        console.log(media);
        for (let index = 0; index < media.length; index++) {
          mime_type = (media[index]['mime_type'] != undefined) ? media[index]['mime_type'].split('/')[0] : undefined;

          filename = truncate(basename(media[index]['filename']), 60);
                    
          // console.log(media[index]);
          // .jpeg, .jpg, .png, .webp, .svg, .gif
          if(mime_type == 'image'){
            divOutputHtml = '<img src="'+(URL.createObjectURL(e.target.files[index]))+'" title="'+filename+'">';
          }

          // .mov, .mp4, .webm, .m4v, .mkv
          if(mime_type == 'video'){
            divOutputHtml = '<video src="'+(URL.createObjectURL(e.target.files[index]))+'" controls title="'+filename+'"></video>';
          }

          // .mp3, .wav, .flac, .aac, .m4a
          if(mime_type == 'audio'){
            divOutputHtml = '<audio src="'+(URL.createObjectURL(e.target.files[index]))+'" controls title="'+filename+'"></audio>';
          }

          // or...
          divOutputElement.appendChild(stringToHTML(divOutputHtml));
        }
        document.querySelector('textarea#output').value = JSON.stringify(media, null, 2);
        
      });

      media_analyzer('#fileinput2', function(e, media){
          
        console.log(media);
        for (let index = 0; index < media.length; index++) {
          mime_type = (media[index]['mime_type'] != undefined) ? media[index]['mime_type'].split('/')[0] : undefined;

          filename = truncate(basename(media[index]['filename']), 60);
                    
          // console.log(media[index]);
          // .jpeg, .jpg, .png, .webp, .svg, .gif
          if(mime_type == 'image'){
            divOutputHtml = '<img src="'+(URL.createObjectURL(e.target.files[index]))+'" title="'+filename+'">';
          }

          // .mov, .mp4, .webm, .m4v, .mkv
          if(mime_type == 'video'){
            divOutputHtml = '<video src="'+(URL.createObjectURL(e.target.files[index]))+'" controls title="'+filename+'"></video>';
          }

          // .mp3, .wav, .flac, .aac, .m4a
          if(mime_type == 'audio'){
            divOutputHtml = '<audio src="'+(URL.createObjectURL(e.target.files[index]))+'" controls title="'+filename+'"></audio>';
          }

          // or...
          divOutputElement.appendChild(stringToHTML(divOutputHtml));
        }
        document.querySelector('textarea#output').value = JSON.stringify(media, null, 2);
        
      });      
      
    </script>
  </body>
</html>

```

## License:

`MediaInfoModule.wasm`, `script.js` and `mediainfo.min.js` are Open Source software (BSD-style license). The changes made by Ali Yılmaz are licensed as open source and free under the General Public License version 3 ([GPLv3 license.](https://github.com/aliyilmaz/media-analyzer/blob/master/license.md))