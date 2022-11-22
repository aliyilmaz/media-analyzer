/**
 *
 * @package    media-analyzer
 * @version    Release: 1.0.0
 * @license    GPL3
 * @author     Ali YILMAZ <aliyilmaz.work@gmail.com>
 * @category   Media, Javascript
 * @link       https://github.com/aliyilmaz/media-analyzer
 *
 */

function get_file_info(mediainfo, file, i=0) {
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
    .then((result) => {
      MediaInfoOutput[i] = JSON.parse(result);
      // delete MediaInfoOutput[i]['creatingLibrary'];
      // extra-codec
      if (MediaInfoOutput[i]['media']['track'][1] != undefined) {

        // SUPPORT AAC
        if ((MediaInfoOutput[i]['media']['track'][1]['@type'] === 'Audio' && MediaInfoOutput[i]['media']['track'][1]['Format'] === 'AAC')){
          let audioElement = document.createElement('audio');
          audioElement.src = URL.createObjectURL(file);
          audioElement.onloadedmetadata = function() {
            MediaInfoOutput[i]['Duration'] = String(audioElement.duration);
          };
          audioElement.remove();
        }
        // SUPPORT AAC
      
      }

        // DETERMINING VIDEO DURATION
        if(MediaInfoOutput[i]['media']['track'][1] != undefined){

          if ((MediaInfoOutput[i]['media']['track'][1]['@type'] === 'Video' &&  MediaInfoOutput[i]['media']['track'][2]['@type'] === 'Audio')){
            
            let Media1Duration = MediaInfoOutput[i]['media']['track'][1]['Duration'],
                Media2Duration = MediaInfoOutput[i]['media']['track'][2]['Duration'];
            if(Media1Duration > Media2Duration){
              MediaInfoOutput[i].Duration = Media1Duration;
            } else {
              MediaInfoOutput[i].Duration = Media2Duration;
            }
          }

        }
        // DETERMINING VIDEO DURATION

        // EXTRA INFO
        MediaInfoOutput[i].filename = file.name;
        MediaInfoOutput[i].mime_type = (file.type == undefined) ? 'undefined' : file.type;

        // EXTRA INFO


      // extra-codec
    })
    .catch((error) => {
      output.value = `${output.value}\n\nAn error occured:\n${error.stack}`
    })
}

async function onChangeFile(mediainfo) {
  let file
  output.value = null
  MediaInfoOutput = []

  originalStyle = fileinput.style;
  numb = 4000;
  let intervalId =  setInterval(() => {
    fileinput.style.borderBottom = '8px solid';
    fileinput.style.borderImage = 'linear-gradient(' + numb * 10 + 'deg, turquoise, greenyellow) 1';
    numb = numb-200;
  }, 170);

  if (fileinput.files.length >= 2) {
    for (let i = 0; i < fileinput.files.length; i++) {
      file = fileinput.files[i]
      if (file) {
        await get_file_info(mediainfo, file, i)
        
        if (i + 1 == fileinput.files.length) {
          fileinput.style = originalStyle;
          clearInterval(intervalId);
          return
        }
      }
    }
    
  } else {
    file = fileinput.files[0]
    if (file) {
      await get_file_info(mediainfo, file)
    }
    fileinput.style = originalStyle;
    clearInterval(intervalId);
  }
 
}

function media_analyzer(inputElement, callback) {
  fileinput = document.querySelector(inputElement);

  MediaInfo({ format: 'JSON' }, (mediainfo) => {
    fileinput.addEventListener('change', async function(e) {
      await onChangeFile(mediainfo);
      if (callback) callback(e, MediaInfoOutput);
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