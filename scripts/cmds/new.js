const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    name: 'new',
    version: '1.0.3',
    hasPermission: 0,
    credits: 'Yan Maglinte',
    description: 'Free AI Chatbot!',
    usePrefix: false,
    commandCategory: 'chatbots',
    usages: 'Ai prompt!',
    cooldowns: 0,
  },

  onStart: async function({ api, event, args }) {
    const prompt = args.join(' ');
    const credits = this.config.credits;

    if (!prompt) {
      return api.sendMessage('Hello 👋 How can I help you today?', event.threadID, event.messageID);
    }

    if (event.type === 'message_reply' && event.messageReply.attachments) {
      const attachment = event.messageReply.attachments[0];
      if (attachment.type === 'photo') {
        const image_url = attachment.url;
        // Download the image from URL
        const response = await axios.get(image_url, { responseType: 'stream' });

        const form = new FormData();
        form.append('prompt', prompt);
        form.append('image', response.data, { filename: 'image.jpg' });

        try {
          const apiResponse = await axios.post('https://gemininewapi.onrender.com/api/process', form, {
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

    // Handle case where no image is provided
    try {
      const form = new FormData();
      form.append('prompt', prompt);

      const apiResponse = await axios.post('https://gemininewapi.onrender.com/api/process', form, {
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
