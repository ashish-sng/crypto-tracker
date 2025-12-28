import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../../services/chatService';
import './Chatbot.css';

/**
 * Chatbot Component
 * Provides an AI-powered chatbot interface for discussing cryptocurrencies
 */
const Chatbot = ({ selectedCoin = null }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your crypto assistant. Ask me anything about cryptocurrencies, specific coins, market trends, or blockchain technology!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle sending a message to the chatbot
   */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to chat
    const newUserMessage = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      // Build conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to backend
      const response = await chatService.sendMessage(
        userMessage,
        selectedCoin?.id || null,
        conversationHistory
      );

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.response },
      ]);
    } catch (error) {
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // If closed, show only the toggle button
  if (!isOpen) {
    return (
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
        title="Open Crypto Assistant"
      >
        💬
      </button>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <h3>💬 Crypto Assistant</h3>
          {selectedCoin && (
            <span className="selected-coin-badge">
              Discussing: {selectedCoin.name}
            </span>
          )}
        </div>
        <button
          className="chatbot-close-button"
          onClick={() => setIsOpen(false)}
          aria-label="Close chatbot"
          title="Close"
        >
          ×
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-content">
              <span className="typing-indicator">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chatbot-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about cryptocurrencies..."
          className="chatbot-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chatbot-send-button"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
