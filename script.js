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
 MediaInfoOutput = [];
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
    .then((result) => {
      MediaInfoOutput = JSON.parse(result);
      // delete MediaInfoOutput['creatingLibrary'];
      // extra-codec
      if (MediaInfoOutput['media']['track'][1] != undefined) {

        // SUPPORT AAC
        if ((MediaInfoOutput['media']['track'][1]['@type'] === 'Audio' && MediaInfoOutput['media']['track'][1]['Format'] === 'AAC')){
          let audioElement = document.createElement('audio');
          audioElement.src = URL.createObjectURL(file);
          audioElement.onloadedmetadata = function() {
            MediaInfoOutput['Duration'] = String(audioElement.duration);
          };
          audioElement.remove();
        }
        // SUPPORT AAC
      
      }

        // DETERMINING VIDEO DURATION
        if(MediaInfoOutput['media']['track'][1] != undefined){

          if ((MediaInfoOutput['media']['track'][1]['@type'] === 'Video' &&  MediaInfoOutput['media']['track'][2]['@type'] === 'Audio')){
            
            let Media1Duration = MediaInfoOutput['media']['track'][1]['Duration'],
                Media2Duration = MediaInfoOutput['media']['track'][2]['Duration'];
            if(Media1Duration > Media2Duration){
              MediaInfoOutput.Duration = Media1Duration;
            } else {
              MediaInfoOutput.Duration = Media2Duration;
            }
          }

        }
        // DETERMINING VIDEO DURATION

        // EXTRA INFO
        MediaInfoOutput.filename = file.name;
        MediaInfoOutput.mime_type = (file.type == undefined) ? 'undefined' : file.type;

        // EXTRA INFO

      return MediaInfoOutput;
      // extra-codec
    })
    .catch((error) => {
      console.log('An error occured:\n'+error.stack);
    })
}

async function onChangeFile(fileinput, mediainfo) {
  let file;
  let originalStyle = fileinput.style;
  result = [];
  numb = 4000;
  let intervalId =  setInterval(() => {
    fileinput.style.borderBottom = '8px solid';
    fileinput.style.borderImage = 'linear-gradient(' + numb * 10 + 'deg, turquoise, greenyellow) 1';
    numb = numb-200;
  }, 170);

  if (fileinput.files.length > 1) {
    for (let i = 0; i < fileinput.files.length; i++) {
      file = fileinput.files[i];
      if (file) {
        result[i] = await get_file_info(mediainfo, file, i)
        
        if (i + 1 == fileinput.files.length) {
          fileinput.style = originalStyle;
          clearInterval(intervalId);
          // return
        }
      }
    }
    
  } else {
    file = fileinput.files[0];
    if (file) {
      result[0] = await get_file_info(mediainfo, file);
    }
    fileinput.style = originalStyle;
    clearInterval(intervalId);
  }
 return result;
}

function media_analyzer(inputElement, callback) {
  
  let fileinput = document.querySelector(inputElement);
  MediaInfo({ format: 'JSON' }, (mediainfo) => {
    fileinput.addEventListener('change', async function(e) {
      response = await onChangeFile(fileinput, mediainfo);
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