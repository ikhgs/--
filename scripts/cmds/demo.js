const axios = require('axios');
const fs = require('fs');
const gtts = require('gtts');

async function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

async function convertImageToText(imageURL) {
  try {
    const response = await axios.get(`https://img2txt-bien.vercel.app/api/recognition?image=${encodeURIComponent(imageURL)}`);
    return response.data.extractedText;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "Demo",
    aliases: [],
    version: "2.1.3",
    author: "Hazeyy",
    role: 0,
    category: "no prefix",
    shortDescription: {
      en: "GPT-4 Voice x Image recognition",
      vi: "GPT-4 Giọng nói x Nhận dạng ảnh"
    },
    longDescription: {
      en: "This command uses GPT-4 to interact with text inputs and image recognition.",
      vi: "Lệnh này sử dụng GPT-4 để tương tác với đầu vào văn bản và nhận dạng ảnh."
    },
    guide: {
      en: "( Model-v3 Demo GPT-4 )",
      vi: "( Model-v3 Demo GPT-4 )"
    }
  },
  onStart: async ({ event, args, message, usersData, api, commandName }) => {
    if (!(event.body.startsWith("demo") || event.body.startsWith("Demo"))) return;

    const { threadID, messageID, type, messageReply, body } = event;

    let question = '';
    let hasImage = false;

    if (type === 'message_reply') {
      if (messageReply?.attachments[0]?.type === 'photo') {
        hasImage = true;
        const attachment = messageReply.attachments[0];
        const imageURL = attachment.url;
        question = await convertImageToText(imageURL);

        if (!question) {
          api.sendMessage('❗ 𝖴𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝖼𝗈𝗇𝗏𝖾𝗋𝗍 𝗍𝗁𝗂𝗌 𝗂𝗆𝖺𝗀𝖾.', threadID, messageID);
          return;
        }
      } else {
        question = messageReply?.body?.trim() || '';
      }
    } else {
      question = body.slice(5).trim();
    }

    if (!question) {
      api.sendMessage("Hello👋, I am Model-v3 Demo GPT-4. How can I assist you today?", event.threadID);
      return;
    }

    try {
      api.sendTypingIndicator(event.threadID);
      api.sendMessage('🗨️ | Demo GPT-4 is thinking...', event.threadID);

      const response = await axios.get(`https://llama3-8b-8192.vercel.app/?ask=${encodeURIComponent(question)}`);
      const reply = response.data.reply;

      if (reply.trim() !== "") {
        const formattedReply = await formatFont(reply);
        const gttsService = new gtts(formattedReply, 'en');
        gttsService.save('gpt4_response.mp3', function () {
          api.sendMessage(`🤖 GPT-4 (Demo)\n\n🗨️: ${formattedReply}\n\nI hope it helps ✨`, event.threadID);
          api.sendMessage({
            attachment: fs.createReadStream('gpt4_response.mp3'),
            body: '🔊 Demo GPT-4 (Voice)',
            mentions: [{ tag: 'GPT-4 Response', id: api.getCurrentUserID() }]
          }, event.threadID);
        });
      } else {
        api.sendMessage("🤖 Demo GPT-4 couldn't provide a response to your query.", event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("🔴 An error occurred. Please try again later.", event.threadID);
    }
  },
  onReply: async ({ api, event, message, args, commandName, usersData, Reply }) => {
    // Additional code if needed for replies
  },
  onChat: async ({ api, event, message, args, commandName, usersData }) => {
    // Additional code if needed for general chat interactions
  }
};
