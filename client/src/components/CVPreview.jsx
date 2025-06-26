import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import axios from 'axios';

const CVPreview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetchCVPreview();
    }
  }, [sessionId]);

  const fetchCVPreview = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/cv/preview/${sessionId}`);
      setCvData(response.data.cvData);
      setUserData(response.data.userData);
    } catch (error) {
      console.error('Error fetching CV preview:', error);
      setError('Failed to load CV preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCV = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post(`/api/cv/generate/${sessionId}`, {}, {
        responseType: 'blob'
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${userData?.firstName}_${userData?.lastName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Error generating CV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading CV preview...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => navigate('/chat')}
            className="mt-4 btn-primary"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/chat')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chat</span>
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">CV Preview</h1>
        
        <button
          onClick={generateCV}
          disabled={isGenerating}
          className="btn-primary flex items-center space-x-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Download PDF</span>
        </button>
      </div>

      {/* CV Preview */}
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header Section */}
        <div className="text-center border-b-2 border-primary-600 pb-6">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">
            {userData?.firstName} {userData?.lastName}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {userData?.email && (
              <span className="flex items-center">
                📧 {userData.email}
              </span>
            )}
            {userData?.phone && (
              <span className="flex items-center">
                📱 {userData.phone}
              </span>
            )}
            {userData?.address && (
              <span className="flex items-center">
                📍 {userData.address}{userData.city ? `, ${userData.city}` : ''}{userData.country ? `, ${userData.country}` : ''}
              </span>
            )}
            {userData?.nationality && (
              <span className="flex items-center">
                🌍 {userData.nationality}
              </span>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {cvData?.summary && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-primary-800 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {cvData?.workExperiences && cvData.workExperiences.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary-800 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Work Experience
            </h2>
            {cvData.workExperiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-primary-600 pl-4 bg-gray-50 p-4 rounded-r">
                <h3 className="text-lg font-semibold text-primary-800">{exp.jobTitle}</h3>
                <p className="text-gray-600 font-medium">{exp.companyName}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}
                  {exp.location && ` | ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-800">Key Responsibilities:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800">Achievements:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {cvData?.skills && cvData.skills.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary-800 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupSkillsByCategory(cvData.skills).map((category, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary-800 mb-2 capitalize">
                    {category.name.replace('_', ' ')}
                  </h3>
                  <div className="space-y-1">
                    {category.skills.map((skill, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{skill.name}</span>
                        {skill.level && (
                          <span className="text-gray-500 italic">{skill.level}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData?.educations && cvData.educations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary-800 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Education
            </h2>
            {cvData.educations.map((edu, index) => (
              <div key={index} className="border-l-4 border-primary-600 pl-4 bg-gray-50 p-4 rounded-r">
                <h3 className="text-lg font-semibold text-primary-800">
                  {edu.degree || edu.fieldOfStudy || 'Education'}
                </h3>
                <p className="text-gray-600 font-medium">{edu.institutionName}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {edu.startDate} - {edu.isCompleted ? (edu.endDate || 'Completed') : 'In Progress'}
                  {edu.location && ` | ${edu.location}`}
                </p>
                {edu.description && (
                  <p className="text-gray-700">{edu.description}</p>
                )}
                {edu.grade && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Grade:</strong> {edu.grade}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Languages */}
          {cvData?.languages && cvData.languages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-800">Languages</h3>
              <div className="space-y-2">
                {cvData.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                    <span className="font-medium">{lang.language || lang.name}</span>
                    <span className="text-gray-600 italic">{lang.level || 'Conversational'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {cvData?.certifications && cvData.certifications.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-800">Certifications</h3>
              <div className="space-y-2">
                {cvData.certifications.map((cert, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{cert.name}</div>
                    {cert.issuer && <div className="text-sm text-gray-600">{cert.issuer}</div>}
                    {cert.dateObtained && <div className="text-xs text-gray-500">{cert.dateObtained}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {(cvData?.drivingLicense || cvData?.willingToRelocate || cvData?.workPermitStatus || cvData?.availabilityDate) && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary-800">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-1 text-sm">
                {cvData.drivingLicense && <li>✓ Valid Driving License</li>}
                {cvData.willingToRelocate && <li>✓ Willing to Relocate</li>}
                {cvData.workPermitStatus && (
                  <li>✓ Work Status: {getWorkPermitStatusLabel(cvData.workPermitStatus)}</li>
                )}
                {cvData.availabilityDate && <li>✓ Available from: {cvData.availabilityDate}</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const groupSkillsByCategory = (skills) => {
  const categories = {};
  
  skills.forEach(skill => {
    const category = skill.category || 'other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(skill);
  });

  return Object.keys(categories).map(categoryName => ({
    name: categoryName.replace('_', ' ').toUpperCase(),
    skills: categories[categoryName]
  }));
};

const getWorkPermitStatusLabel = (status) => {
  const statusMap = {
    'citizen': 'EU Citizen',
    'permanent_resident': 'Permanent Resident',
    'work_permit': 'Work Permit Holder',
    'visa_required': 'Visa Required'
  };
  return statusMap[status] || status;
};

export default CVPreview;
