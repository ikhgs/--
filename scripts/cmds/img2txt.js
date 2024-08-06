const axios = require('axios');

module.exports = {
  config: {
    name: "img2txt",
    author: "cliff",
    version: "1.0.0",
    countDown: 5,
    role: 0,
    category: "Ai",
    shortDescription: {
      en: "Transcribe an image to text"
    }
  },
  onStart: async function ({ api, event }) {
    try {
      // Vérifier si l'utilisateur a envoyé une image
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("Please reply to an image to transcribe it to text.", event.threadID);
      }

      const attachment = event.messageReply.attachments[0];

      // Vérifier que l'attachement est bien une image
      if (attachment.type !== 'photo') {
        return api.sendMessage("Please reply to a valid image.", event.threadID);
      }

      const imageURL = attachment.url;
      const apiUrl = `https://img2txt-bien.vercel.app/?image=${encodeURIComponent(imageURL)}`;

      const response = await axios.get(apiUrl);

      if (response.data && response.data.text) {
        api.sendMessage(`Here is the transcription of the image:\n\n${response.data.text}`, event.threadID);
      } else {
        api.sendMessage("Unable to transcribe the image to text.", event.threadID);
      }
    } catch (error) {
      console.error('Error making image-to-text API request:', error.message);
      api.sendMessage("An error occurred while processing the image.", event.threadID);
    }
  }
};
