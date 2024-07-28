const axios = require('axios');

module.exports = {
  config: {
    name: "mistral",
    author: "❤️Bruno❤️",//api by bruno
    version: "1.0.0",
    countDown: 5,
    role: 0,
    category: "Ai",
    shortDescription: {
      en: "{p}mistral"
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      if (!args[0]) {
        return api.sendMessage("Please provide a prompt for Llama.", event.threadID);
      }

      const prompt = encodeURIComponent(args.join(" "));
      const apiUrl = `https://api-mistral.vercel.app/?ask=${prompt}`;

      const response = await axios.get(apiUrl);

      if (response.data && response.data.response) {
        api.sendMessage(response.data.response, event.threadID);
      } else {
        api.sendMessage("Unable to get a response from Mistral.", event.threadID);
      }
    } catch (error) {
      console.error('Error making Llama API request:', error.message);
      api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
  }
};

