const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

class PDFService {
  constructor() {
    this.templatePath = path.join(__dirname, '../templates');
  }

  async generateCV(userData, cvData) {
    try {
      const html = await this.generateHTMLTemplate(userData, cvData);
      const pdf = await this.convertHTMLToPDF(html);
      return pdf;
    } catch (error) {
      console.error('Error generating CV PDF:', error);
      throw new Error('Failed to generate CV PDF');
    }
  }

  async generateHTMLTemplate(userData, cvData) {
    const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${userData.firstName} ${userData.lastName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        
        .name {
            font-size: 32px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 14px;
            color: #666;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
        }
        
        .summary {
            font-size: 16px;
            line-height: 1.7;
            color: #555;
            text-align: justify;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 4px solid #2563eb;
            background: #f8fafc;
        }
        
        .job-title, .degree {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
        }
        
        .company, .institution {
            font-size: 16px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .date-location {
            font-size: 14px;
            color: #888;
            margin-bottom: 10px;
        }
        
        .description {
            margin-bottom: 10px;
            line-height: 1.6;
        }
        
        .responsibilities, .achievements {
            margin-top: 10px;
        }
        
        .responsibilities ul, .achievements ul {
            margin-left: 20px;
        }
        
        .responsibilities li, .achievements li {
            margin-bottom: 5px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .skill-category {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
        }
        
        .skill-category-title {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
            text-transform: capitalize;
        }
        
        .skill-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .skill-level {
            color: #666;
            font-style: italic;
        }
        
        .languages-list, .certifications-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        
        .language-item, .certification-item {
            background: #f1f5f9;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        @media print {
            body {
                font-size: 12px;
            }
            .container {
                padding: 20px;
            }
            .section {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="name">${userData.firstName || ''} ${userData.lastName || ''}</div>
            <div class="contact-info">
                ${userData.email ? `<div class="contact-item">📧 ${userData.email}</div>` : ''}
                ${userData.phone ? `<div class="contact-item">📱 ${userData.phone}</div>` : ''}
                ${userData.address ? `<div class="contact-item">📍 ${userData.address}${userData.city ? ', ' + userData.city : ''}${userData.country ? ', ' + userData.country : ''}</div>` : ''}
                ${userData.nationality ? `<div class="contact-item">🌍 ${userData.nationality}</div>` : ''}
            </div>
        </div>

        <!-- Professional Summary -->
        ${cvData.summary ? `
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${cvData.summary}</div>
        </div>
        ` : ''}

        <!-- Work Experience -->
        ${cvData.workExperiences && cvData.workExperiences.length > 0 ? `
        <div class="section">
            <div class="section-title">Work Experience</div>
            ${cvData.workExperiences.map(exp => `
                <div class="experience-item">
                    <div class="job-title">${exp.jobTitle || ''}</div>
                    <div class="company">${exp.companyName || ''}</div>
                    <div class="date-location">
                        ${exp.startDate || ''} - ${exp.isCurrentJob ? 'Present' : (exp.endDate || '')}
                        ${exp.location ? ` | ${exp.location}` : ''}
                    </div>
                    ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
                    ${exp.responsibilities && exp.responsibilities.length > 0 ? `
                        <div class="responsibilities">
                            <strong>Key Responsibilities:</strong>
                            <ul>
                                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${exp.achievements && exp.achievements.length > 0 ? `
                        <div class="achievements">
                            <strong>Achievements:</strong>
                            <ul>
                                ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Skills -->
        ${cvData.skills && cvData.skills.length > 0 ? `
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-grid">
                ${this.groupSkillsByCategory(cvData.skills).map(category => `
                    <div class="skill-category">
                        <div class="skill-category-title">${category.name}</div>
                        ${category.skills.map(skill => `
                            <div class="skill-item">
                                <span>${skill.name}</span>
                                ${skill.level ? `<span class="skill-level">${skill.level}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Education -->
        ${cvData.educations && cvData.educations.length > 0 ? `
        <div class="section">
            <div class="section-title">Education</div>
            ${cvData.educations.map(edu => `
                <div class="education-item">
                    <div class="degree">${edu.degree || edu.fieldOfStudy || 'Education'}</div>
                    <div class="institution">${edu.institutionName || ''}</div>
                    <div class="date-location">
                        ${edu.startDate || ''} - ${edu.isCompleted ? (edu.endDate || 'Completed') : 'In Progress'}
                        ${edu.location ? ` | ${edu.location}` : ''}
                    </div>
                    ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
                    ${edu.grade ? `<div><strong>Grade:</strong> ${edu.grade}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="two-column">
            <!-- Languages -->
            ${cvData.languages && cvData.languages.length > 0 ? `
            <div class="section">
                <div class="section-title">Languages</div>
                <div class="languages-list">
                    ${cvData.languages.map(lang => `
                        <div class="language-item">
                            <strong>${lang.language || lang.name}</strong><br>
                            <span class="skill-level">${lang.level || 'Conversational'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Certifications -->
            ${cvData.certifications && cvData.certifications.length > 0 ? `
            <div class="section">
                <div class="section-title">Certifications</div>
                <div class="certifications-list">
                    ${cvData.certifications.map(cert => `
                        <div class="certification-item">
                            <strong>${cert.name}</strong><br>
                            ${cert.issuer ? `<span>${cert.issuer}</span><br>` : ''}
                            ${cert.dateObtained ? `<span class="skill-level">${cert.dateObtained}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>

        <!-- Additional Information -->
        ${this.generateAdditionalInfo(userData, cvData)}
    </div>
</body>
</html>`;

    return template;
  }

  groupSkillsByCategory(skills) {
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
  }

  generateAdditionalInfo(userData, cvData) {
    const additionalItems = [];

    if (cvData.drivingLicense) {
      additionalItems.push('Valid Driving License');
    }

    if (cvData.willingToRelocate) {
      additionalItems.push('Willing to Relocate');
    }

    if (cvData.workPermitStatus) {
      const statusMap = {
        'citizen': 'EU Citizen',
        'permanent_resident': 'Permanent Resident',
        'work_permit': 'Work Permit Holder',
        'visa_required': 'Visa Required'
      };
      additionalItems.push(`Work Status: ${statusMap[cvData.workPermitStatus] || cvData.workPermitStatus}`);
    }

    if (cvData.availabilityDate) {
      additionalItems.push(`Available from: ${cvData.availabilityDate}`);
    }

    if (additionalItems.length > 0) {
      return `
        <div class="section">
            <div class="section-title">Additional Information</div>
            <ul>
                ${additionalItems.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
      `;
    }

    return '';
  }

  async convertHTMLToPDF(html) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      return pdf;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new PDFService();
