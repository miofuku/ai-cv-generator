# AI CV Generator

An AI-powered CV generator platform designed specifically for blue-collar workers in the EU. This application allows users to create professional CVs through simple conversation with an AI assistant, eliminating the need for complex forms or technical skills.

## Features

- **Conversational Interface**: Chat with an AI assistant to provide your work information
- **AI-Powered Extraction**: Automatically extracts and structures information from natural language
- **Professional CV Generation**: Creates beautifully formatted PDF CVs
- **Blue-Collar Focused**: Designed specifically for skilled trades and manual work
- **EU Work Authorization**: Handles EU work permit status and requirements
- **Multi-language Support**: Supports various European languages
- **Real-time Preview**: Preview your CV before downloading

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Sequelize ORM
- **AI Service**: Google Gemini API
- **PDF Generation**: Puppeteer
- **Deployment**: Ready for Vercel/Railway

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-cv-generator
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```bash
   cp server/.env.example server/.env
   ```

   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgresql://username:password@localhost:5432/ai_cv_generator
   NODE_ENV=development
   ```

4. **Set up the database**

   Create a PostgreSQL database named `ai_cv_generator` and update the DATABASE_URL in your `.env` file.

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

1. **Access the application** at `http://localhost:3000`

2. **Start creating your CV**:
   - Click "Create CV" or "Start Creating Your CV"
   - Chat with the AI assistant about your work experience
   - Provide information about your skills, education, and background
   - Preview your CV in real-time
   - Download your professional CV as a PDF

3. **Example conversation**:
   ```
   AI: Hello! I'm here to help you create a professional CV. Let's start by getting to know you better. Could you tell me your name and what kind of work you do or are looking for?

   You: Hi, my name is John Smith. I'm a construction worker with 5 years of experience in building houses and commercial buildings.

   AI: Great to meet you, John! Construction work is valuable and in-demand. Could you tell me more about your specific skills? For example, do you work with specific tools, materials, or have any certifications?
   ```

## API Endpoints

### Chat Endpoints
- `POST /api/chat/start` - Start a new chat session
- `POST /api/chat/message` - Send a message and get AI response
- `GET /api/chat/history/:sessionId` - Get chat history

### CV Endpoints
- `POST /api/cv/generate/:sessionId` - Generate and download CV PDF
- `GET /api/cv/preview/:sessionId` - Get CV data for preview

## Database Schema

The application uses the following main entities:
- **Users**: Personal information and contact details
- **CVProfiles**: CV-specific information and preferences
- **Skills**: User skills with categories and proficiency levels
- **WorkExperience**: Employment history and responsibilities
- **Education**: Educational background and certifications
- **ChatSessions**: Conversation history and extracted data

## Deployment

### Environment Setup
1. Set up a PostgreSQL database
2. Configure environment variables for production
3. Set `NODE_ENV=production`

### Vercel Deployment (Frontend)
1. Connect your repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`

### Railway Deployment (Backend)
1. Connect your repository to Railway
2. Set start command: `cd server && npm start`
3. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository or contact the development team.