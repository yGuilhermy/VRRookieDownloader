import axios from 'axios';

export async function translateText(text: string, targetLang = 'pt'): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url);
    if (response.data && response.data[0]) {
      return response.data[0].map((item: any) => item[0]).join('');
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
