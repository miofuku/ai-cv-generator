const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User, CVProfile, ChatSession, Skill, WorkExperience, Education } = require('../models');
const geminiService = require('../services/geminiService');

const router = express.Router();

// Start a new chat session
router.post('/start', async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    // Create or find user by session
    let user = await User.findOne({ where: { sessionId } });
    if (!user) {
      user = await User.create({ sessionId });
    }

    // Create new chat session
    const chatSession = await ChatSession.create({
      userId: user.id,
      sessionId,
      messages: [{
        role: 'assistant',
        content: 'Hello! I\'m here to help you create a professional CV. Let\'s start by getting to know you better. Could you tell me your name and what kind of work you do or are looking for?',
        timestamp: new Date()
      }],
      currentStep: 'personal_info'
    });

    res.json({
      sessionId,
      userId: user.id,
      chatSessionId: chatSession.id,
      message: chatSession.messages[0]
    });
  } catch (error) {
    console.error('Error starting chat session:', error);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
});

// Send message and get AI response
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Find user and chat session
    const user = await User.findOne({ where: { sessionId } });
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let chatSession = await ChatSession.findOne({ 
      where: { userId: user.id, sessionId },
      order: [['createdAt', 'DESC']]
    });

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Add user message to session
    const updatedMessages = [...chatSession.messages, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }];

    // Extract information using Gemini
    const extractedInfo = await geminiService.extractPersonalInfo(message);
    
    // Merge with existing extracted data
    const mergedData = mergeExtractedData(chatSession.extractedData, extractedInfo);
    
    // Update user and CV profile with extracted information
    await updateUserProfile(user, mergedData);
    
    // Generate follow-up questions
    const followUp = await geminiService.generateFollowUpQuestions(mergedData, chatSession.currentStep);
    
    // Create AI response
    let aiResponse = '';
    if (followUp.isComplete) {
      aiResponse = 'Great! I have all the information I need. Your CV is ready to be generated. Would you like me to create it now?';
    } else if (followUp.questions && followUp.questions.length > 0) {
      aiResponse = followUp.questions.join(' ');
    } else {
      aiResponse = 'Thank you for that information. Could you tell me more about your work experience?';
    }

    // Add AI response to messages
    updatedMessages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Update chat session
    await chatSession.update({
      messages: updatedMessages,
      extractedData: mergedData,
      currentStep: followUp.nextStep || chatSession.currentStep,
      isCompleted: followUp.isComplete || false
    });

    res.json({
      message: {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      },
      extractedData: mergedData,
      currentStep: followUp.nextStep || chatSession.currentStep,
      isComplete: followUp.isComplete || false
    });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const user = await User.findOne({ where: { sessionId } });
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const chatSession = await ChatSession.findOne({
      where: { userId: user.id, sessionId },
      order: [['createdAt', 'DESC']]
    });

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({
      messages: chatSession.messages,
      extractedData: chatSession.extractedData,
      currentStep: chatSession.currentStep,
      isCompleted: chatSession.isCompleted
    });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Helper function to merge extracted data
function mergeExtractedData(existing, newData) {
  const merged = { ...existing };

  if (newData.personalInfo) {
    merged.personalInfo = { ...merged.personalInfo, ...newData.personalInfo };
  }

  if (newData.workInfo) {
    merged.workInfo = { ...merged.workInfo, ...newData.workInfo };
  }

  if (newData.skills && newData.skills.length > 0) {
    merged.skills = [...(merged.skills || []), ...newData.skills];
  }

  if (newData.workExperience && newData.workExperience.length > 0) {
    merged.workExperience = [...(merged.workExperience || []), ...newData.workExperience];
  }

  if (newData.education && newData.education.length > 0) {
    merged.education = [...(merged.education || []), ...newData.education];
  }

  if (newData.languages && newData.languages.length > 0) {
    merged.languages = [...(merged.languages || []), ...newData.languages];
  }

  if (newData.certifications && newData.certifications.length > 0) {
    merged.certifications = [...(merged.certifications || []), ...newData.certifications];
  }

  return merged;
}

// Helper function to update user profile
async function updateUserProfile(user, extractedData) {
  try {
    // Update user information
    if (extractedData.personalInfo) {
      const updateData = {};
      Object.keys(extractedData.personalInfo).forEach(key => {
        if (extractedData.personalInfo[key] && extractedData.personalInfo[key].trim() !== '') {
          updateData[key] = extractedData.personalInfo[key];
        }
      });
      
      if (Object.keys(updateData).length > 0) {
        await user.update(updateData);
      }
    }

    // Create or update CV profile
    let cvProfile = await CVProfile.findOne({ where: { userId: user.id } });
    if (!cvProfile) {
      cvProfile = await CVProfile.create({ userId: user.id });
    }

    // Update CV profile with work info
    if (extractedData.workInfo) {
      const cvUpdateData = {};
      Object.keys(extractedData.workInfo).forEach(key => {
        if (extractedData.workInfo[key] !== undefined && extractedData.workInfo[key] !== '') {
          cvUpdateData[key] = extractedData.workInfo[key];
        }
      });
      
      if (Object.keys(cvUpdateData).length > 0) {
        await cvProfile.update(cvUpdateData);
      }
    }

  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

module.exports = router;
