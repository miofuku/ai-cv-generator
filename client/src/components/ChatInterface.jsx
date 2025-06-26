import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Download, Eye, Loader2, MessageCircle } from 'lucide-react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [extractedData, setExtractedData] = useState({});
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    startChatSession();
  }, []);

  const startChatSession = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/chat/start');
      setSessionId(response.data.sessionId);
      setMessages([response.data.message]);
    } catch (error) {
      console.error('Error starting chat session:', error);
      setMessages([{
        role: 'assistant',
        content: 'Sorry, I encountered an error starting our conversation. Please refresh the page and try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        sessionId,
        message: inputMessage
      });

      setMessages(prev => [...prev, response.data.message]);
      setExtractedData(response.data.extractedData || {});
      setIsComplete(response.data.isComplete || false);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateCV = async () => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`/api/cv/generate/${sessionId}`, {}, {
        responseType: 'blob'
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Error generating CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const previewCV = () => {
    if (sessionId) {
      navigate(`/preview/${sessionId}`);
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">AI CV Assistant</h1>
              <p className="text-primary-100">Let's create your professional CV together</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`chat-message ${
                  message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'
                }`}
              >
                {formatMessage(message.content)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="chat-message chat-message-assistant">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="input-field resize-none"
                rows="3"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="btn-primary h-fit self-end flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {(isComplete || Object.keys(extractedData).length > 0) && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={previewCV}
                className="btn-secondary flex items-center space-x-2"
                disabled={isLoading}
              >
                <Eye className="h-4 w-4" />
                <span>Preview CV</span>
              </button>
              <button
                onClick={generateCV}
                className="btn-primary flex items-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>Download CV</span>
              </button>
            </div>
            {isComplete && (
              <p className="text-center text-sm text-gray-600 mt-4">
                🎉 Your CV information is complete! You can now preview or download your CV.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {Object.keys(extractedData).length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Collected</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className={`p-3 rounded ${extractedData.personalInfo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              <div className="font-medium">Personal Info</div>
              <div className="text-xs">{extractedData.personalInfo ? '✓ Complete' : 'Pending'}</div>
            </div>
            <div className={`p-3 rounded ${extractedData.workExperience?.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              <div className="font-medium">Work Experience</div>
              <div className="text-xs">{extractedData.workExperience?.length > 0 ? '✓ Complete' : 'Pending'}</div>
            </div>
            <div className={`p-3 rounded ${extractedData.skills?.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              <div className="font-medium">Skills</div>
              <div className="text-xs">{extractedData.skills?.length > 0 ? '✓ Complete' : 'Pending'}</div>
            </div>
            <div className={`p-3 rounded ${extractedData.education?.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              <div className="font-medium">Education</div>
              <div className="text-xs">{extractedData.education?.length > 0 ? '✓ Complete' : 'Pending'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
