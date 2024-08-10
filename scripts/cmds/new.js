const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'new',
    version: '1.0.1',
    author: 'Bruno',
    role: 0,
    category: 'ai',
    longDescription: {
      en: 'This is a large Ai language model trained by OpenAi, it is designed to assist with a wide range of tasks.',
    },
    guide: {
      en: '\nAi < questions >\n\n🔎 𝗚𝘂𝗶𝗱𝗲\nAi what is capital of France?',
    },
  },

  langs: {
    en: {
      final: "",
      header: "🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━",
      footer: "━━━━━━━━━━━━━━━━",
    }
  },

  onStart: async function({ api, event, args }) {
    const prompt = args.join(' ');

    const title = '🎁❤️Bruno AI 👈🙏\n';

    if (!prompt) {
      return api.sendMessage(title + 'Hello 👋 How can I help you today?', event.threadID, event.messageID);
    }

    // Cas 1 : Si l'utilisateur a répondu à un message avec une image
    if (event.type === 'message_reply' && event.messageReply.attachments) {
      const attachment = event.messageReply.attachments[0];
      if (attachment.type === 'photo') {
        const image_url = attachment.url;

        try {
          // Télécharger l'image depuis l'URL
          const response = await axios.get(image_url, { responseType: 'stream' });

          // Créer FormData et ajouter l'image et le prompt
          const form = new FormData();
          form.append('prompt', prompt);
          form.append('image', response.data, { filename: 'image.jpg' });

          // Faire la requête POST vers votre API
          const apiResponse = await axios.post('https://api-milay-gemini.vercel.app/api/process', form, {
            headers: {
              ...form.getHeaders(),
            },
          });

          const data = apiResponse.data;
          const output = data.response;
          api.sendMessage(title + output, event.threadID, event.messageID);
        } catch (error) {
          console.error('Erreur lors du traitement de l\'image:', error);
          api.sendMessage(title + '⚠️ Une erreur est survenue lors du traitement de l\'image!', event.threadID, event.messageID);
        }
        return;
      }
    }

    // Cas 2 : Si seulement un prompt est fourni (sans image)
    try {
      // Faire la requête GET vers votre API
      const apiResponse = await axios.get('https://api-milay-gemini.vercel.app/api/query', {
        params: {
          prompt: prompt,
        },
      });

      const data = apiResponse.data;
      const output = data.response;
      api.sendMessage(title + output, event.threadID, event.messageID);
    } catch (error) {
      console.error('Erreur lors du traitement du prompt:', error);
      api.sendMessage(title + '⚠️ Une erreur est survenue lors du traitement du prompt!', event.threadID, event.messageID);
    }
  }
};
