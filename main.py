from fastapi import FastAPI, Body
from deep_translator import GoogleTranslator
from textblob import TextBlob
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "null",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/translate")
async def translate_and_analyze(data:dict = Body(...)):
  """
  Translate text to the specified language and perform sentiment analysis.

  Args:
      text: The text to translate and analyze.
      target_lang: The target language for translation (default: English).

  Returns:
      A dictionary containing the translated text and sentiment analysis.
  """
  text = data.get("text")
  target_lang = data.get("target_lang")
    
  translated_text = GoogleTranslator(target=target_lang).translate(text)

  return {
      "translated_text": translated_text
  }


if __name__ == "__main__":
    uvicorn.run("main:app",port=8000,reload=True)