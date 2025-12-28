import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Chat Service
 * Handles communication with the FastAPI backend chatbot endpoint
 */
export const chatService = {
  /**
   * Send a message to the chatbot
   * @param {string} message - User's message
   * @param {string|null} coinId - Optional coin ID to focus on
   * @param {Array} conversationHistory - Optional conversation history
   * @returns {Promise<Object>} Chat response with AI message and coin data
   */
  sendMessage: async (message, coinId = null, conversationHistory = []) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message,
        coin_id: coinId,
        conversation_history: conversationHistory,
      });
      return response.data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error(
        error.response?.data?.detail || 'Failed to get response from chatbot'
      );
    }
  },
};
