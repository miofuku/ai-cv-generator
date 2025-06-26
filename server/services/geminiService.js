const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    // Check if we have a valid API key or use mock mode
    this.useMockMode = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo_key_for_testing';

    if (!this.useMockMode) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  async extractPersonalInfo(userMessage) {
    if (this.useMockMode) {
      return this.mockExtractPersonalInfo(userMessage);
    }

    const prompt = `
You are an AI assistant helping blue-collar workers create their CV. Extract structured information from the user's message.

User message: "${userMessage}"

Extract the following information if available and return as JSON:
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "dateOfBirth": "",
    "nationality": "",
    "address": "",
    "city": "",
    "country": "",
    "postalCode": ""
  },
  "workInfo": {
    "targetPosition": "",
    "yearsOfExperience": 0,
    "currentJob": "",
    "industry": "",
    "availabilityDate": "",
    "salaryExpectation": "",
    "workPermitStatus": "",
    "drivingLicense": false,
    "willingToRelocate": false
  },
  "skills": [
    {
      "name": "",
      "category": "technical|soft|language|certification|equipment|safety",
      "level": "beginner|intermediate|advanced|expert",
      "yearsOfExperience": 0
    }
  ],
  "workExperience": [
    {
      "jobTitle": "",
      "companyName": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "isCurrentJob": false,
      "description": "",
      "responsibilities": [],
      "industry": "",
      "employmentType": "full_time|part_time|contract|temporary|seasonal"
    }
  ],
  "education": [
    {
      "institutionName": "",
      "degree": "",
      "fieldOfStudy": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "isCompleted": true,
      "educationType": "formal|vocational|certification|apprenticeship|online"
    }
  ],
  "languages": [
    {
      "language": "",
      "level": "basic|intermediate|advanced|native"
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "dateObtained": "",
      "expiryDate": ""
    }
  ]
}

Only include fields that have actual information from the user's message. Return empty strings for missing information, not null.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {};
    } catch (error) {
      console.error('Error extracting personal info:', error);
      throw new Error('Failed to extract information from message');
    }
  }

  // Mock implementation for testing
  mockExtractPersonalInfo(userMessage) {
    const message = userMessage.toLowerCase();
    const extracted = {};

    // Simple pattern matching for demo purposes
    if (message.includes('john smith')) {
      extracted.personalInfo = {
        firstName: 'John',
        lastName: 'Smith'
      };
    }

    if (message.includes('construction')) {
      extracted.workInfo = {
        targetPosition: 'Construction Worker',
        industry: 'Construction'
      };

      if (message.includes('5 years')) {
        extracted.workInfo.yearsOfExperience = 5;
      }

      extracted.skills = [
        {
          name: 'Construction',
          category: 'technical',
          level: 'intermediate',
          yearsOfExperience: 5
        }
      ];

      extracted.workExperience = [
        {
          jobTitle: 'Construction Worker',
          companyName: 'Construction Company',
          startDate: '2019-01-01',
          endDate: '2024-01-01',
          isCurrentJob: false,
          description: 'Experienced construction worker with 5 years in the field',
          responsibilities: ['Building construction', 'Site preparation', 'Safety compliance'],
          industry: 'Construction',
          employmentType: 'full_time'
        }
      ];
    }

    return extracted;
  }

  async generateFollowUpQuestions(extractedData, currentStep) {
    if (this.useMockMode) {
      return this.mockGenerateFollowUpQuestions(extractedData, currentStep);
    }

    const prompt = `
You are an AI assistant helping a blue-collar worker complete their CV. Based on the current information and step, generate 1-3 relevant follow-up questions to gather missing information.

Current extracted data: ${JSON.stringify(extractedData, null, 2)}
Current step: ${currentStep}

Generate questions that are:
1. Specific and relevant to blue-collar work
2. Easy to understand
3. Help complete missing CV information
4. Culturally appropriate for EU workers

Return response as JSON:
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ],
  "nextStep": "personal_info|work_experience|skills|education|review",
  "isComplete": false
}

Focus on the most important missing information first.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        questions: ["Could you tell me more about your work experience?"],
        nextStep: "work_experience",
        isComplete: false
      };
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      throw new Error('Failed to generate follow-up questions');
    }
  }

  mockGenerateFollowUpQuestions(extractedData, currentStep) {
    // Simple mock logic for testing
    if (!extractedData.personalInfo || !extractedData.personalInfo.firstName) {
      return {
        questions: ["What is your full name?"],
        nextStep: "personal_info",
        isComplete: false
      };
    }

    if (!extractedData.workExperience || extractedData.workExperience.length === 0) {
      return {
        questions: ["Could you tell me about your work experience? What jobs have you had?"],
        nextStep: "work_experience",
        isComplete: false
      };
    }

    if (!extractedData.skills || extractedData.skills.length === 0) {
      return {
        questions: ["What skills do you have? Any certifications or special training?"],
        nextStep: "skills",
        isComplete: false
      };
    }

    return {
      questions: ["Great! I have enough information to create your CV. Would you like me to generate it now?"],
      nextStep: "review",
      isComplete: true
    };
  }

  async generateCVSummary(profileData) {
    const prompt = `
Create a professional CV summary for a blue-collar worker based on their profile data.

Profile data: ${JSON.stringify(profileData, null, 2)}

Generate a compelling 2-3 sentence professional summary that:
1. Highlights key skills and experience
2. Mentions years of experience if available
3. Shows value proposition to employers
4. Is appropriate for blue-collar/manual work positions
5. Uses professional but accessible language

Return only the summary text, no additional formatting.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating CV summary:', error);
      throw new Error('Failed to generate CV summary');
    }
  }

  async enhanceWorkExperience(workExperience) {
    const prompt = `
Enhance the work experience description for a blue-collar worker's CV.

Original work experience: ${JSON.stringify(workExperience, null, 2)}

Improve the description and responsibilities to:
1. Use action verbs and quantifiable achievements where possible
2. Highlight relevant skills and competencies
3. Make it more professional while keeping it authentic
4. Focus on accomplishments and impact
5. Use industry-appropriate terminology

Return as JSON:
{
  "enhancedDescription": "",
  "responsibilities": [
    "Enhanced responsibility 1",
    "Enhanced responsibility 2"
  ],
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        enhancedDescription: workExperience.description || "",
        responsibilities: workExperience.responsibilities || [],
        achievements: []
      };
    } catch (error) {
      console.error('Error enhancing work experience:', error);
      throw new Error('Failed to enhance work experience');
    }
  }
}

module.exports = new GeminiService();
