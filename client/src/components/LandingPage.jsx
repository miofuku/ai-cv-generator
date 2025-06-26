import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText, Zap, Users, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Simple Conversation',
      description: 'Just chat with our AI assistant about your work experience and skills. No complex forms to fill out.'
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Our advanced AI understands your responses and automatically structures your information professionally.'
    },
    {
      icon: FileText,
      title: 'Professional CV',
      description: 'Get a beautifully formatted PDF CV that highlights your skills and experience effectively.'
    },
    {
      icon: Users,
      title: 'Blue-Collar Focused',
      description: 'Designed specifically for skilled trades, manual work, and blue-collar professions in the EU.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Start Chatting',
      description: 'Begin a conversation with our AI assistant about your work background.'
    },
    {
      number: '2',
      title: 'Share Your Experience',
      description: 'Tell us about your skills, work history, and what kind of job you\'re looking for.'
    },
    {
      number: '3',
      title: 'Get Your CV',
      description: 'Download your professional CV as a PDF, ready to send to employers.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Create Your Professional CV
          <span className="block text-primary-600">Through Simple Conversation</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          No more struggling with complex CV templates. Just chat with our AI assistant about your work experience, 
          and we'll create a professional CV for you in minutes.
        </p>
        <Link
          to="/chat"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Start Creating Your CV</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white rounded-2xl shadow-sm mb-16">
        <div className="px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our AI CV Generator?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full text-xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-100 rounded-2xl">
        <div className="px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perfect for Blue-Collar Workers
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">No Technical Skills Required</h4>
                  <p className="text-gray-600">Just speak naturally about your work experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Industry-Specific</h4>
                  <p className="text-gray-600">Understands blue-collar work and skills</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">EU Work Permits</h4>
                  <p className="text-gray-600">Handles EU work authorization status</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Multiple Languages</h4>
                  <p className="text-gray-600">Supports various European languages</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Professional Format</h4>
                  <p className="text-gray-600">Creates employer-ready PDF documents</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Free to Use</h4>
                  <p className="text-gray-600">No hidden costs or subscription fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Create Your Professional CV?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of workers who have successfully created their CVs with our AI assistant.
        </p>
        <Link
          to="/chat"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Get Started Now</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
