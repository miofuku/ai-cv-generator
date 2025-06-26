const express = require('express');
const { User, CVProfile, Skill, WorkExperience, Education, ChatSession } = require('../models');
const pdfService = require('../services/pdfService');
const geminiService = require('../services/geminiService');

const router = express.Router();

// Generate CV PDF
router.post('/generate/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find user and their data
    const user = await User.findOne({ 
      where: { sessionId },
      include: [
        {
          model: CVProfile,
          as: 'cvProfiles',
          include: [
            { model: Skill, as: 'skills' },
            { model: WorkExperience, as: 'workExperiences' },
            { model: Education, as: 'educations' }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the latest chat session to extract data
    const chatSession = await ChatSession.findOne({
      where: { userId: user.id, sessionId },
      order: [['createdAt', 'DESC']]
    });

    if (!chatSession || !chatSession.extractedData) {
      return res.status(400).json({ error: 'No CV data found. Please complete the chat first.' });
    }

    // Prepare CV data
    let cvProfile = user.cvProfiles && user.cvProfiles[0];
    if (!cvProfile) {
      // Create CV profile from extracted data
      cvProfile = await createCVProfileFromExtractedData(user.id, chatSession.extractedData);
    }

    // Generate enhanced summary if not exists
    if (!cvProfile.summary && chatSession.extractedData) {
      try {
        const enhancedSummary = await geminiService.generateCVSummary(chatSession.extractedData);
        await cvProfile.update({ summary: enhancedSummary });
        cvProfile.summary = enhancedSummary;
      } catch (error) {
        console.error('Error generating summary:', error);
      }
    }

    // Prepare data for PDF generation
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      nationality: user.nationality,
      dateOfBirth: user.dateOfBirth
    };

    const cvData = {
      summary: cvProfile.summary,
      targetPosition: cvProfile.targetPosition,
      yearsOfExperience: cvProfile.yearsOfExperience,
      drivingLicense: cvProfile.drivingLicense,
      willingToRelocate: cvProfile.willingToRelocate,
      workPermitStatus: cvProfile.workPermitStatus,
      availabilityDate: cvProfile.availabilityDate,
      salaryExpectation: cvProfile.salaryExpectation,
      languages: cvProfile.languages || chatSession.extractedData.languages || [],
      certifications: cvProfile.certifications || chatSession.extractedData.certifications || [],
      skills: cvProfile.skills || [],
      workExperiences: cvProfile.workExperiences || [],
      educations: cvProfile.educations || []
    };

    // Add extracted data if database records are empty
    if (cvData.skills.length === 0 && chatSession.extractedData.skills) {
      cvData.skills = chatSession.extractedData.skills;
    }
    if (cvData.workExperiences.length === 0 && chatSession.extractedData.workExperience) {
      cvData.workExperiences = chatSession.extractedData.workExperience;
    }
    if (cvData.educations.length === 0 && chatSession.extractedData.education) {
      cvData.educations = chatSession.extractedData.education;
    }

    // Generate PDF
    const pdfBuffer = await pdfService.generateCV(userData, cvData);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CV_${user.firstName}_${user.lastName}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating CV:', error);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
});

// Get CV data for preview
router.get('/preview/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const user = await User.findOne({ 
      where: { sessionId },
      include: [
        {
          model: CVProfile,
          as: 'cvProfiles',
          include: [
            { model: Skill, as: 'skills' },
            { model: WorkExperience, as: 'workExperiences' },
            { model: Education, as: 'educations' }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const chatSession = await ChatSession.findOne({
      where: { userId: user.id, sessionId },
      order: [['createdAt', 'DESC']]
    });

    const cvProfile = user.cvProfiles && user.cvProfiles[0];
    
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      nationality: user.nationality
    };

    const cvData = {
      summary: cvProfile?.summary,
      targetPosition: cvProfile?.targetPosition,
      yearsOfExperience: cvProfile?.yearsOfExperience,
      skills: cvProfile?.skills || chatSession?.extractedData?.skills || [],
      workExperiences: cvProfile?.workExperiences || chatSession?.extractedData?.workExperience || [],
      educations: cvProfile?.educations || chatSession?.extractedData?.education || [],
      languages: cvProfile?.languages || chatSession?.extractedData?.languages || [],
      certifications: cvProfile?.certifications || chatSession?.extractedData?.certifications || [],
      drivingLicense: cvProfile?.drivingLicense,
      willingToRelocate: cvProfile?.willingToRelocate,
      workPermitStatus: cvProfile?.workPermitStatus,
      availabilityDate: cvProfile?.availabilityDate
    };

    res.json({
      userData,
      cvData,
      extractedData: chatSession?.extractedData || {}
    });

  } catch (error) {
    console.error('Error fetching CV preview:', error);
    res.status(500).json({ error: 'Failed to fetch CV preview' });
  }
});

// Helper function to create CV profile from extracted data
async function createCVProfileFromExtractedData(userId, extractedData) {
  try {
    // Create CV profile
    const cvProfile = await CVProfile.create({
      userId,
      targetPosition: extractedData.workInfo?.targetPosition,
      yearsOfExperience: extractedData.workInfo?.yearsOfExperience,
      availabilityDate: extractedData.workInfo?.availabilityDate,
      salaryExpectation: extractedData.workInfo?.salaryExpectation,
      workPermitStatus: extractedData.workInfo?.workPermitStatus,
      drivingLicense: extractedData.workInfo?.drivingLicense || false,
      willingToRelocate: extractedData.workInfo?.willingToRelocate || false,
      languages: extractedData.languages || [],
      certifications: extractedData.certifications || [],
      completionStatus: 'completed'
    });

    // Create skills
    if (extractedData.skills && extractedData.skills.length > 0) {
      const skillsData = extractedData.skills.map(skill => ({
        cvProfileId: cvProfile.id,
        name: skill.name,
        category: skill.category || 'technical',
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience
      }));
      await Skill.bulkCreate(skillsData);
    }

    // Create work experiences
    if (extractedData.workExperience && extractedData.workExperience.length > 0) {
      const workExpData = extractedData.workExperience.map(exp => ({
        cvProfileId: cvProfile.id,
        jobTitle: exp.jobTitle,
        companyName: exp.companyName,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrentJob: exp.isCurrentJob || false,
        description: exp.description,
        responsibilities: exp.responsibilities || [],
        industry: exp.industry,
        employmentType: exp.employmentType || 'full_time'
      }));
      await WorkExperience.bulkCreate(workExpData);
    }

    // Create education records
    if (extractedData.education && extractedData.education.length > 0) {
      const educationData = extractedData.education.map(edu => ({
        cvProfileId: cvProfile.id,
        institutionName: edu.institutionName,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        isCompleted: edu.isCompleted !== false,
        description: edu.description,
        educationType: edu.educationType || 'formal'
      }));
      await Education.bulkCreate(educationData);
    }

    return cvProfile;
  } catch (error) {
    console.error('Error creating CV profile from extracted data:', error);
    throw error;
  }
}

module.exports = router;
