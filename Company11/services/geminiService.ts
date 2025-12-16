import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Using the provided specific API key
const ai = new GoogleGenAI({ apiKey: '' });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are OmniBot, an advanced AI assistant for the OmniScale Enterprise platform. 
      Your role is to help business owners manage their multi-location stores, analyze data, and automate customer responses. 
      You are professional, concise, and helpful. You have access to mock data about sales and inventory.`,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your request. Please try again.";
  }
};