const axios = require("axios");

module.exports = {
    config: {
        name: "freegpt",
        info: "Interact with free ChatGPT with various AI models",
        isPrefix: false,
        version: "1.0.0",
        type: "artificial-intelligence",
        usage: "[prompt]",
        credits: "Kenneth Panio"
    },

    onStart: async ({ api, args, event }) => {
        const custom = "Your AI name is freegpt. Always assist users and answer questions; keep your responses concise and conversational.";
        const chat = (txt) => api.sendMessage(txt, event.threadID);
        const unsend = (id) => api.unsendMessage(id);
        const msg = args.join(" ");

        if (!msg) {
            return chat("Please provide a prompt.");
        }

        const answering = await chat("Responding to your message...");

        try {
            const res = await axios.get('https://ai-continues.onrender.com/chatbox', {
                params: {
                    q: msg,
                    uid: event.senderID,
                    model: 'gpt-4',
                    cai: custom
                }
            });
            await chat(res.data.answer);
            unsend(answering.messageID);
        } catch (error) {
            await chat(`Error: ${error.message}`);
            unsend(answering.messageID);
        }
    }
};
