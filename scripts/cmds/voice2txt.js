const axios = require('axios');

module.exports = {
  config: {
    name: "voice2txt",
    author: "cliff",
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

    // Debug: Log the event and prompt for troubleshooting
    console.log("Arguments:", prompt);
    console.log("Event:", event);

    if (event.type === 'message_reply' && event.messageReply.attachments.length > 0) {
      const attachment = event.messageReply.attachments[0];
      
      console.log("Attachment type:", attachment.type);

      if (attachment.type === 'video') {
        const url = attachment.url;

        try {
          const apiResponse = await axios.get(`https://voice2texte.vercel.app/voice2txt?url=${encodeURIComponent(url)}`, {
            timeout: 120000  // 2 minutes timeout
          });
          
          const data = apiResponse.data;
          const output = data.transcript || 'No transcript available.';
          api.sendMessage(output, event.threadID, event.messageID);
        } catch (error) {
          console.error('Error during processing:', error);
          api.sendMessage(`⚠️ An error occurred: ${error.message}`, event.threadID, event.messageID);
        }
        return;
      } else {
        api.sendMessage('Please reply to a video to use the voice-to-text feature.', event.threadID, event.messageID);
      }
    } else {
      api.sendMessage('Please reply to a message with a video.', event.threadID, event.messageID);
    }
  }
};
