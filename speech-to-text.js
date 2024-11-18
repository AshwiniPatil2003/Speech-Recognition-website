const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const output = document.getElementById('output');
const translatBtn = document.getElementById('translateBtn')
const downloadBtn = document.getElementById('downloadBtn');
const languageDropDown = document.getElementById('languageDropDown');

const languageData = {'afrikaans': 'af', 'albanian': 'sq', 'amharic': 'am', 'arabic': 'ar', 'armenian': 'hy', 'assamese': 'as', 'aymara': 'ay', 'azerbaijani': 'az', 'bambara': 'bm', 'basque': 'eu', 'belarusian': 'be', 'bengali': 'bn', 'bhojpuri': 'bho', 'bosnian': 'bs', 'bulgarian': 'bg', 'catalan': 'ca', 'cebuano': 'ceb', 'chichewa': 'ny', 'chinese (simplified)': 'zh-CN', 'chinese (traditional)': 'zh-TW', 'corsican': 'co', 'croatian': 'hr', 'czech': 'cs', 'danish': 'da', 'dhivehi': 'dv', 'dogri': 'doi', 'dutch': 'nl', 'english': 'en', 'esperanto': 'eo', 'estonian': 'et', 'ewe': 'ee', 'filipino': 'tl', 'finnish': 'fi', 'french': 'fr', 'frisian': 'fy', 'galician': 'gl', 'georgian': 'ka', 'german': 'de', 'greek': 'el', 'guarani': 'gn', 'gujarati': 'gu', 'haitian creole': 'ht', 'hausa': 'ha', 'hawaiian': 'haw', 'hebrew': 'iw', 'hindi': 'hi', 'hmong': 'hmn', 'hungarian': 'hu', 'icelandic': 'is', 'igbo': 'ig', 'ilocano': 'ilo', 'indonesian': 'id', 'irish': 'ga', 'italian': 'it', 'japanese': 'ja', 'javanese': 'jw', 'kannada': 'kn', 'kazakh': 'kk', 'khmer': 'km', 'kinyarwanda': 'rw', 'konkani': 'gom', 'korean': 'ko', 'krio': 'kri', 'kurdish (kurmanji)': 'ku', 'kurdish (sorani)': 'ckb', 'kyrgyz': 'ky', 'lao': 'lo', 'latin': 'la', 'latvian': 'lv', 'lingala': 'ln', 'lithuanian': 'lt', 'luganda': 'lg', 'luxembourgish': 'lb', 'macedonian': 'mk', 'maithili': 'mai', 'malagasy': 'mg', 'malay': 'ms', 'malayalam': 'ml', 'maltese': 'mt', 'maori': 'mi', 'marathi': 'mr', 'meiteilon (manipuri)': 'mni-Mtei', 'mizo': 'lus', 'mongolian': 'mn', 'myanmar': 'my', 'nepali': 'ne', 'norwegian': 'no', 'odia (oriya)': 'or', 'oromo': 'om', 'pashto': 'ps', 'persian': 'fa', 'polish': 'pl', 'portuguese': 'pt', 'punjabi': 'pa', 'quechua': 'qu', 'romanian': 'ro', 'russian': 'ru', 'samoan': 'sm', 'sanskrit': 'sa', 'scots gaelic': 'gd', 'sepedi': 'nso', 'serbian': 'sr', 'sesotho': 'st', 'shona': 'sn', 'sindhi': 'sd', 'sinhala': 'si', 'slovak': 'sk', 'slovenian': 'sl', 'somali': 'so', 'spanish': 'es', 'sundanese': 'su', 'swahili': 'sw', 'swedish': 'sv', 'tajik': 'tg', 'tamil': 'ta', 'tatar': 'tt', 'telugu': 'te', 'thai': 'th', 'tigrinya': 'ti', 'tsonga': 'ts', 'turkish': 'tr', 'turkmen': 'tk', 'twi': 'ak', 'ukrainian': 'uk', 'urdu': 'ur', 'uyghur': 'ug', 'uzbek': 'uz', 'vietnamese': 'vi', 'welsh': 'cy', 'xhosa': 'xh', 'yiddish': 'yi', 'yoruba': 'yo', 'zulu': 'zu'}

for (const languageName in languageData) {
    const option = document.createElement('option');
    option.value = languageData[languageName];
    option.text = languageName;
    languageDropDown.appendChild(option);
}

let recognition = new window.webkitSpeechRecognition(); // Speech recognition API

recognition.continuous = true; // Keep listening until stopped
recognition.lang = 'en-US'; // Language setting

let finalTranscript = ''; // Holds the final speech recognition result

recognition.onresult = (event) => {
  let interimTranscript = ''; // Holds interim results

  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interimTranscript += transcript;
    }
  }

  output.value = finalTranscript + interimTranscript; // Update the textarea with recognized text
};

recognition.onstart = () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

recognition.onend = () => {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  downloadBtn.style.display = 'inline';
  translatBtn.style.display = 'inline';
  languageDropDown.style.display = 'inline';
};

startBtn.addEventListener('click', () => {
  finalTranscript = '';
  output.value = '';
  recognition.start(); // Start speech recognition
});

stopBtn.addEventListener('click', () => {
  recognition.stop(); // Stop speech recognition
});

translatBtn.addEventListener('click', async() => {
  const selectedLanguage = languageDropDown.value; // Get the selected language
  const textToTranslate = output.value; // Get the text to translate

  try {
    // Make POST request to translate
    const response = await fetch('http://localhost:8000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToTranslate, target_lang: selectedLanguage })
    });

    const data = await response.json();
    const translatedText = data.translated_text;
    document.getElementById('translatedOutput').value = translatedText;
  } catch (error) {
    console.log(error)
  }
});

downloadBtn.addEventListener('click', () => {
  const textToDownload = document.getElementById('translatedOutput').value;
  const blob = new Blob([textToDownload], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'speech_text.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
 });
 



