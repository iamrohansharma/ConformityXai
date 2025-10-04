# ConformityXAI - AI Compliance Assessment Platform

A comprehensive full-stack compliance assessment platform that helps organizations evaluate and maintain their AI systems' compliance across multiple regulatory frameworks.

## 🎯 Product Overview

ConformityXAI is an enterprise-grade platform supporting **12+ compliance frameworks** including:

- **NIST AI Risk Management Framework (AI-RMF)**
- **EU Artificial Intelligence Act**
- **GDPR** (General Data Protection Regulation)
- **ISO/IEC 42001** AI Management System
- **NYC Local Law 144** (Automated Employment Decision Tools)
- **Colorado SB 21-169** (AI Discrimination in Insurance)
- **SOC 2 Type II** Compliance
- **Singapore Model AI Governance Framework**
- **US BIS Export Controls** (EAR ECCN 4E091)
- **EU Dual-Use Export Controls** (Regulation 2021/821)
- **OFAC Sanctions** Compliance
- **Geopolitical Alignment** Assessments

## ⭐ Flagship Features

### Proprietary Algorithms by Rohan Sharma, ZenoLabs.AI

1. **Automated Export Liability Index™**
   - Weighted compliance assessment across regulatory frameworks
   - Dynamic risk vectorization
   - Response-based penalty integration
   - Normalized scoring (0-100%) with bonus for excellence

2. **Statutory Civic Penalty Exposure™**
   - Estimated penalty range calculation (up to $969M+)
   - Multi-jurisdictional fine assessment
   - Category-level exposure breakdown

3. **Criminal Liability Probability**
   - Criminal prosecution risk analysis
   - Critical violation tracking
   - EAR, FDPR, and SDN screening assessment

### AI Export Passport

Automated PDF generation with:
- Comprehensive compliance scores
- Detailed Q&A assessment
- Legal references (15 CFR, 31 CFR, EU Regulations)
- Regulatory penalties per violation
- Visual radar chart analysis

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Wouter** - Lightweight routing
- **shadcn/ui** - Premium UI components
- **Tailwind CSS** - Utility-first styling
- **TanStack Query v5** - Server state management
- **Recharts** - Data visualization
- **jsPDF + html2canvas** - PDF generation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Zod** - Schema validation
- **RESTful API** architecture
- **Session-based** authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (optional - uses in-memory storage by default)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
# Build frontend and backend
npm run build

# Start production server
npm start
```

## 📊 Core Features

### Multi-Framework Assessment
- 70+ compliance questions across all frameworks
- Interactive questionnaires with 4-point response scale
- Real-time scoring and progress tracking
- Category-level filtering and organization

### Dashboard & Analytics
- Consolidated metrics dashboard
- Framework progress tracking
- Risk level indicators
- Action items counter
- Trend analysis over time

### Visualization
- **Compliance Radar Charts** - 7-axis multi-dimensional display
- **Maturity Heatmaps** - Gradient risk visualization
- **Export Control Radar** - 6-axis specialized analysis
- Interactive tooltips and benchmark comparison

### Reporting & Documentation
- AI Export Passport PDF generation
- Technical documentation (Annex IV compliant)
- Market surveillance reports (ENISA XML)
- Audit trail documentation
- Action item reports with priorities

### Cross-Jurisdictional Analysis
- Regional deployment assessment (US, EU, UK, Singapore, China)
- Deployment viability scoring
- Regulatory conflict detection
- Harmonization opportunities

## 🗄️ Database Schema

```sql
users {
  id: serial (PK)
  username: text (unique)
  password: text
  createdAt: timestamp
}

assessments {
  id: serial (PK)
  userId: integer (FK)
  organizationName: text
  frameworkType: text
  overallScore: integer
  assessmentData: jsonb
  status: 'in_progress' | 'completed'
  createdAt: timestamp
  updatedAt: timestamp
}

complianceFrameworks {
  id: serial (PK)
  name: text (unique)
  description: text
  version: text
  requirements: jsonb
  createdAt: timestamp
}

actionItems {
  id: serial (PK)
  assessmentId: integer (FK)
  title: text
  description: text
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'completed'
  dueDate: timestamp
  frameworkType: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🔌 API Endpoints

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get specific assessment
- `GET /api/assessments/framework/:frameworkType` - Get assessments by framework
- `POST /api/assessments` - Create new assessment
- `PUT /api/assessments/:id` - Update assessment

### Frameworks
- `GET /api/frameworks` - Get all frameworks
- `GET /api/frameworks/:name` - Get specific framework

### Action Items
- `GET /api/action-items` - Get all action items
- `GET /api/action-items/assessment/:assessmentId` - Get items by assessment
- `GET /api/action-items/framework/:frameworkType` - Get items by framework
- `POST /api/action-items` - Create action item
- `PUT /api/action-items/:id` - Update action item

## 🎨 Design System

### WEF-Inspired Theme
- Primary Blue: `hsl(220, 100%, 40%)`
- Clean, professional, data-dense layout
- Elite premium cards with gradients
- Semantic color coding for compliance status
- Inter font family with optimized features

## 📈 Business Impact

### Risk Mitigation
- **Penalty Avoidance**: Up to $969M+ (OFAC + BIS + EU combined)
- **Criminal Liability Reduction**: Probability tracking and prevention
- **Audit Readiness**: Automated documentation

### Operational Efficiency
- **Time Savings**: Automated vs manual assessment
- **Resource Optimization**: Priority-based action items
- **Knowledge Centralization**: Single platform for all frameworks

### Market Access
- **Export Readiness**: Automated export passport
- **Regional Deployment**: Cross-jurisdictional viability
- **Competitive Advantage**: Compliance differentiation

## 🔐 Security & Compliance

- PostgreSQL encrypted storage
- Session-based authentication
- Secure API endpoints with Zod validation
- GDPR-compliant data handling
- Audit trail logging

## 🌐 Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/conformityxai
PORT=5000
NODE_ENV=production
SESSION_SECRET=your-secret-key
```

### Cloud Run Compatibility
- Listens on `PORT` environment variable
- Standard Express server configuration
- Graceful shutdown handling
- Static file serving in production

## 🗺️ Future Roadmap

- Real-time collaboration (multi-user assessments)
- AI-powered recommendation engine
- Automated compliance monitoring
- CI/CD pipeline integration
- Mobile responsive enhancements
- Advanced analytics dashboard
- Custom framework builder
- White-label deployment option

## 📄 License & Intellectual Property

### Proprietary Algorithms
- **Automated Export Liability Index™** - © Rohan Sharma, ZenoLabs.AI
- **Statutory Civic Penalty Exposure™** - © Rohan Sharma, ZenoLabs.AI
- **Criminal Liability Probability** - © Rohan Sharma, ZenoLabs.AI

## 📞 Support

For enterprise support and licensing inquiries, please contact ZenoLabs.AI.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Platform**: Full-Stack Web Application (React + Express + PostgreSQL)
