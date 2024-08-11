const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: "nova",
    author: "cliff", // api by hazey
    version: "1.0.0",
    countDown: 5,
    role: 0,
    category: "Ai",
    shortDescription: {
      en: "{p}bruno"
    }
  },

  onStart: async function({ api, event, args }) {
    const prompt = args.join(' ');
    
    if (!prompt) {
      return api.sendMessage('Hello 👋 How can I help you today?', event.threadID, event.messageID);
    }

    if (event.type === 'message_reply' && event.messageReply.attachments) {
      const attachment = event.messageReply.attachments[0];
      if (attachment.type === 'photo') {
        const image_url = attachment.url;

        const form = new FormData();
        form.append('prompt', prompt);
        form.append('image_url', image_url); // Envoyer l'URL de l'image directement

        try {
          const apiResponse = await axios.post('https://claire-2xfu.onrender.com/api/formation', form, {
            headers: {
              ...form.getHeaders(),
            },
          });

          const data = apiResponse.data;
          const output = data.response;
          api.sendMessage(output, event.threadID, event.messageID);
        } catch (error) {
          console.error('Error:', error);
          api.sendMessage('⚠️ An error occurred!', event.threadID, event.messageID);
        }
        return;
      }
    }

    // Gestion du cas où aucune image n'est fournie
    try {
      const form = new FormData();
      form.append('prompt', prompt);

      const apiResponse = await axios.post('https://clar-ap.vercel.app/api/formation', form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const data = apiResponse.data;
      const output = data.response;
      api.sendMessage(output, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage('⚠️ An error occurred!', event.threadID, event.messageID);
    }
  }
};
