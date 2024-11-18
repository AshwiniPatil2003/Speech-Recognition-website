let speech = new SpeechSynthesisUtterance();

let voices = [];

let voiceSelect = document.querySelector("select");
let downloadLink = document.getElementById("download-link");
const selectElement = document.getElementById('select-languages');

const languageData = {'afrikaans': 'af', 'albanian': 'sq', 'amharic': 'am', 'arabic': 'ar', 'armenian': 'hy', 'assamese': 'as', 'aymara': 'ay', 'azerbaijani': 'az', 'bambara': 'bm', 'basque': 'eu', 'belarusian': 'be', 'bengali': 'bn', 'bhojpuri': 'bho', 'bosnian': 'bs', 'bulgarian': 'bg', 'catalan': 'ca', 'cebuano': 'ceb', 'chichewa': 'ny', 'chinese (simplified)': 'zh-CN', 'chinese (traditional)': 'zh-TW', 'corsican': 'co', 'croatian': 'hr', 'czech': 'cs', 'danish': 'da', 'dhivehi': 'dv', 'dogri': 'doi', 'dutch': 'nl', 'english': 'en', 'esperanto': 'eo', 'estonian': 'et', 'ewe': 'ee', 'filipino': 'tl', 'finnish': 'fi', 'french': 'fr', 'frisian': 'fy', 'galician': 'gl', 'georgian': 'ka', 'german': 'de', 'greek': 'el', 'guarani': 'gn', 'gujarati': 'gu', 'haitian creole': 'ht', 'hausa': 'ha', 'hawaiian': 'haw', 'hebrew': 'iw', 'hindi': 'hi', 'hmong': 'hmn', 'hungarian': 'hu', 'icelandic': 'is', 'igbo': 'ig', 'ilocano': 'ilo', 'indonesian': 'id', 'irish': 'ga', 'italian': 'it', 'japanese': 'ja', 'javanese': 'jw', 'kannada': 'kn', 'kazakh': 'kk', 'khmer': 'km', 'kinyarwanda': 'rw', 'konkani': 'gom', 'korean': 'ko', 'krio': 'kri', 'kurdish (kurmanji)': 'ku', 'kurdish (sorani)': 'ckb', 'kyrgyz': 'ky', 'lao': 'lo', 'latin': 'la', 'latvian': 'lv', 'lingala': 'ln', 'lithuanian': 'lt', 'luganda': 'lg', 'luxembourgish': 'lb', 'macedonian': 'mk', 'maithili': 'mai', 'malagasy': 'mg', 'malay': 'ms', 'malayalam': 'ml', 'maltese': 'mt', 'maori': 'mi', 'marathi': 'mr', 'meiteilon (manipuri)': 'mni-Mtei', 'mizo': 'lus', 'mongolian': 'mn', 'myanmar': 'my', 'nepali': 'ne', 'norwegian': 'no', 'odia (oriya)': 'or', 'oromo': 'om', 'pashto': 'ps', 'persian': 'fa', 'polish': 'pl', 'portuguese': 'pt', 'punjabi': 'pa', 'quechua': 'qu', 'romanian': 'ro', 'russian': 'ru', 'samoan': 'sm', 'sanskrit': 'sa', 'scots gaelic': 'gd', 'sepedi': 'nso', 'serbian': 'sr', 'sesotho': 'st', 'shona': 'sn', 'sindhi': 'sd', 'sinhala': 'si', 'slovak': 'sk', 'slovenian': 'sl', 'somali': 'so', 'spanish': 'es', 'sundanese': 'su', 'swahili': 'sw', 'swedish': 'sv', 'tajik': 'tg', 'tamil': 'ta', 'tatar': 'tt', 'telugu': 'te', 'thai': 'th', 'tigrinya': 'ti', 'tsonga': 'ts', 'turkish': 'tr', 'turkmen': 'tk', 'twi': 'ak', 'ukrainian': 'uk', 'urdu': 'ur', 'uyghur': 'ug', 'uzbek': 'uz', 'vietnamese': 'vi', 'welsh': 'cy', 'xhosa': 'xh', 'yiddish': 'yi', 'yoruba': 'yo', 'zulu': 'zu'}

for (const languageName in languageData) {
    const option = document.createElement('option');
    option.value = languageData[languageName];
    option.text = languageName;
    selectElement.appendChild(option);
}

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i]) = new Option(voice.name, i));

};

voiceSelect.addEventListener("change", () =>{
    speech.voice = voices[voiceSelect.value];
});

document.querySelector("button").addEventListener("click", async () => {
    // Get the text to be spoken
    speech.text = document.querySelector("textarea").value;

    // Function to create and download the audio blob
    function downloadSpeech(audioBlob) {
      const url = window.URL.createObjectURL(audioBlob);
      downloadLink.href = url;
      downloadLink.download = "speech.mp3"; // Set a default filename
      downloadLink.click();
      window.URL.revokeObjectURL(url); // Revoke the temporary URL
    }      

    // Speak the text
    window.speechSynthesis.speak(speech);

    // On end event, convert the speech to audio blob and download
    speech.onend = async () => {
      const synth = window.speechSynthesis;
      if (synth.speaking) {
        console.error("Speech is still in progress!");
        return;
      }
      const targetLang = document.getElementById('select-languages').value;
      console.log(speech)
      try {


                // Make POST request to translate
            const response = await fetch('http://localhost:8000/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text:speech.text, target_lang:targetLang })
            });

            const data = await response.json();
            const translatedText = data.translated_text;

            // Convert translated text to speech
            const utterance = new SpeechSynthesisUtterance(translatedText);
            utterance.lang = targetLang;  // Set language for pronunciation
            synth.speak(utterance);

            const audioBlob = new Blob([speech.result], { type: 'audio/mpeg-3' }); // Create audio blob
            downloadSpeech(audioBlob);
      } catch (error) {
        console.log(error)
      }
    };

  });
