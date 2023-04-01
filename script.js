/**
 *
 * @package    media-analyzer
 * @version    Release: 1.0.0
 * @license    GPL3
 * @author     Ali YILMAZ <aliyilmaz.work@gmail.com>
 * @category   Media, Analyzer, Javascript
 * @link       https://github.com/aliyilmaz/media-analyzer
 *
 */

async function getAudioDuration(audio)
{
  let audioTag = document.createElement('audio');
  audioTag.src = URL.createObjectURL(audio);


  await getPromiseFromEvent(audioTag, 'loadedmetadata')
  
  return audioTag.duration
}

function getPromiseFromEvent(item, event) {
  return new Promise((resolve) => {
      const listener = () => {
          item.removeEventListener(event, listener)
          // console.log(item.duration);
          resolve()
      }
      item.addEventListener(event, listener)
  })
}

function get_file_info(mediainfo, file) {
  let getSize = () => file.size
  let readChunk = (chunkSize, offset) =>
    new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = (event) => {
        if (event.target.error) {
          reject(event.target.error)
        }
        resolve(new Uint8Array(event.target.result))
      }
      reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
    })

  return mediainfo
    .analyzeData(getSize, readChunk)
    .then( async (result) => {
      MediaInfoOutput = JSON.parse(result);
      
      delete MediaInfoOutput['creatingLibrary']; // Thanks to mediainfo.js Library contributors https://mediaarea.net/en/MediaInfo

      // extra-codec
      if (MediaInfoOutput['media']['track'][1] != undefined) {

        // SUPPORT AAC
        if ((MediaInfoOutput['media']['track'][1]['@type'] === 'Audio' && MediaInfoOutput['media']['track'][1]['Format'] === 'AAC')){
          MediaInfoOutput.duration = await getAudioDuration(file); // Thanks https://stackoverflow.com/a/71216199/10515363
        }
        // SUPPORT AAC

        // OTHER AUDIO
        if ((MediaInfoOutput['media']['track'][1]['@type'] === 'Audio' && MediaInfoOutput['media']['track'][1]['Format'] !== 'AAC')){
          MediaInfoOutput.duration = MediaInfoOutput['media']['track'][1]['Duration'];
        }
        // OTHER AUDIO
      
      }

      // DETERMINING VIDEO DURATION
      if(MediaInfoOutput['media']['track'][1] != undefined){

        if ((MediaInfoOutput['media']['track'][1]['@type'] === 'Video' &&  MediaInfoOutput['media']['track'][2]['@type'] === 'Audio')){
          
          let Media1Duration = MediaInfoOutput['media']['track'][1]['Duration'],
              Media2Duration = MediaInfoOutput['media']['track'][2]['Duration'];
          if(Media1Duration > Media2Duration){
            MediaInfoOutput.duration = Media1Duration;
          } else {
            MediaInfoOutput.duration = Media2Duration;
          }
        }
      }
      // DETERMINING VIDEO DURATION

      // EXTRA INFO
      MediaInfoOutput.filename = file.name;
      MediaInfoOutput.mime_type = (file.type == undefined) ? undefined : file.type;
      // EXTRA INFO

      // Fix for audio file mime type issue in mobile versions of browsers
      
      // mp3
      if(MediaInfoOutput.mime_type == undefined || MediaInfoOutput.mime_type == ''){
        MediaInfoOutput.mime_type = (MediaInfoOutput['media']['track'][0]['Format'] == 'MPEG Audio' && MediaInfoOutput['media']['track'][1]['Format'] == 'MPEG Audio') ? 'audio/mpeg' : undefined;
        MediaInfoOutput.filename = file.name+'.mp3';
      }
      
      // aac
      if(MediaInfoOutput.mime_type == undefined || MediaInfoOutput.mime_type == ''){       
        MediaInfoOutput.mime_type = (MediaInfoOutput['media']['track'][0]['Format'] == 'ADTS' && MediaInfoOutput['media']['track'][1]['Format'] == 'AAC') ? 'audio/aac' : undefined;
        MediaInfoOutput.filename = file.name+'.aac';
      }
      
      // wav
      if(MediaInfoOutput.mime_type == undefined || MediaInfoOutput.mime_type == ''){       
        MediaInfoOutput.mime_type = (MediaInfoOutput['media']['track'][0]['Format'] == 'Wave' && MediaInfoOutput['media']['track'][1]['Format'] == 'PCM') ? 'audio/wav' : undefined;
        MediaInfoOutput.filename = file.name+'.wav';
      }
      
      // flac
      if(MediaInfoOutput.mime_type == undefined || MediaInfoOutput.mime_type == ''){       
        MediaInfoOutput.mime_type = (MediaInfoOutput['media']['track'][0]['Format'] == 'FLAC' && MediaInfoOutput['media']['track'][1]['Format'] == 'FLAC') ? 'audio/flac' : undefined;
        MediaInfoOutput.filename = file.name+'.flac';
      }
      
      // m4a
      if(MediaInfoOutput.mime_type == undefined || MediaInfoOutput.mime_type == ''){       
        MediaInfoOutput.mime_type = (MediaInfoOutput['media']['track'][0]['Format'] == 'MPEG-4' && MediaInfoOutput['media']['track'][1]['Format'] == 'AAC') ? 'audio/x-m4a' : undefined;
        MediaInfoOutput.filename = file.name+'.m4a';
      }

    return MediaInfoOutput;
    // extra-codec
  })
  .catch((error) => {
    console.log('An error occured:\n'+error.stack);
  })
}

async function onChangeFile(e, mediainfo) {
  let file,
      result = [],
      numb = 4000,
      originalStyle = e.target.style;

  let intervalId =  setInterval(() => {
    e.target.style.borderBottom = '8px solid';
    e.target.style.borderImage = 'linear-gradient(' + numb * 10 + 'deg, turquoise, greenyellow) 1';
    numb = numb-200;
  }, 170);

  if (e.target.files.length > 1) {
    for (let i = 0; i < e.target.files.length; i++) {
      file = e.target.files[i];
      if (file) {
        result[i] = await get_file_info(mediainfo, file);
        
        if (i + 1 == e.target.files.length) {
          e.target.style = originalStyle;
          clearInterval(intervalId);
          
        }
      }
    }
    
  } else {
    file = e.target.files[0];
    if (file) {
      result[0] = await get_file_info(mediainfo, file);
    }
    e.target.style = originalStyle;
    clearInterval(intervalId);
  }

 return result;
}

function media_analyzer(inputElement, callback) {
  
  let fileinput = document.querySelector(inputElement);
  MediaInfo({ format: 'JSON' }, (mediainfo) => {
    fileinput.addEventListener('change', async function(e) {
      response = await onChangeFile(e, mediainfo);
      if (callback) callback(e, response);
    });
  });
  
}

function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
};

function basename(prevname) {
  return prevname.replace(/^(.*[/\\])?/, '').replace(/(\.[^.]*)$/, '');
}

var stringToHTML = function (str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};