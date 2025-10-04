# ConformityXAI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:5173**

The backend API will be available at **http://localhost:5000**

### 3. Build for Production

```bash
# Build both frontend and backend
npm run build
node build.ts

# Start production server
npm start
```

## 📋 What's Included

### ✅ 7 Compliance Frameworks Ready to Use

1. **NIST AI-RMF** - 8 questions across Govern, Map, Measure, Manage
2. **EU AI Act** - 8 questions covering Articles 4-15
3. **GDPR** - 6 questions on Privacy, Data Rights, DPIA
4. **Export Control ⭐** - 20 questions (BIS, EU, OFAC, Geopolitical)
5. **SOC 2** - 6 questions on Trust Services Criteria
6. **ISO/IEC 42001** - 8 questions on Plan-Do-Check-Act
7. **Singapore Model AI Governance** - 5 questions on governance

### 🎯 Key Features Available

- ✅ **Dashboard** with consolidated metrics
- ✅ **Interactive Assessments** with 4-point response scale
- ✅ **Real-time Scoring** using proprietary algorithms
- ✅ **Radar Chart Visualizations** for multi-dimensional analysis
- ✅ **AI Export Passport** PDF generation
- ✅ **Action Items Tracking**
- ✅ **Progress Monitoring** across all frameworks

### 🔥 Flagship Feature: Export Control Assessment

The Export Control module includes:

- **24 comprehensive questions** across 4 regulatory categories
- **Automated Export Liability Index™** - Proprietary scoring algorithm
- **Statutory Civic Penalty Exposure™** - Up to $969M+ liability calculation
- **Criminal Liability Probability** - Risk assessment for prosecution
- **AI Export Passport** - Instant PDF report generation

## 📖 Usage Guide

### Step 1: Navigate to Dashboard

Open the app and you'll see the dashboard with:
- Overall compliance score
- Framework completion status
- Action items summary
- Recent activity

### Step 2: Start an Assessment

Click on any framework from the top navigation:
- **NIST AI-RMF** for AI governance
- **EU AI Act** for European compliance
- **Export Control ⭐** for export regulations
- etc.

### Step 3: Answer Questions

For each question:
1. Read the question and regulatory reference
2. Select response: **Compliant**, **Partial**, **Non-Compliant**, or **Not Assessed**
3. View real-time score updates
4. See risk level indicators

### Step 4: View Results

- **Compliance Score** updates automatically
- **Radar Chart** shows category breakdown
- **Progress Bar** tracks completion

### Step 5: Export Report (Export Control)

For Export Control assessments:
1. Complete questions
2. Click "Export Passport PDF"
3. Download comprehensive compliance report

## 🎨 UI Components

### Dashboard Metrics
- **Overall Compliance** - Aggregate score
- **Completed** - Finished assessments
- **Critical Actions** - High-priority items
- **Open Tasks** - Pending items

### Assessment Cards
- Question text with legal references
- Risk level badges (Critical/High/Medium/Low)
- Penalty information (where applicable)
- Response buttons

### Visualizations
- **Compliance Radar Chart** - Multi-dimensional view
- **Progress Bars** - Framework completion
- **Score Cards** - Key metrics

## 🔐 Data Storage

Currently uses **in-memory storage** (MemStorage).

Your assessments are saved automatically but will reset on server restart.

To enable persistent storage:
1. Set up PostgreSQL database
2. Update `DATABASE_URL` in `.env`
3. Run migrations: `npm run db:push`

## 🛠️ Development

### File Structure

```
conformityxai/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── lib/         # Utilities & API
│   │   ├── App.tsx      # Main application
│   │   └── main.tsx     # Entry point
│   └── index.html
├── server/              # Express backend
│   ├── routes/          # API endpoints
│   ├── storage/         # Data layer
│   ├── algorithms/      # Proprietary scoring
│   ├── data/            # Framework definitions
│   └── index.ts         # Server entry
├── db/                  # Database schema
│   └── schema.ts
└── package.json
```

### API Endpoints

- `GET /api/frameworks` - Get all frameworks
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment
- `GET /api/action-items` - Get action items

## 🎯 Next Steps

1. **Complete an Assessment** - Try the Export Control module
2. **Generate PDF Report** - Export your AI Export Passport
3. **Track Progress** - Monitor compliance across frameworks
4. **Review Action Items** - Address critical compliance gaps

## 💡 Tips

- Start with **NIST AI-RMF** for foundational governance
- Use **Export Control** for international deployments
- **EU AI Act** is essential for European markets
- Complete multiple frameworks for comprehensive coverage

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3000
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### API Not Responding
```bash
# Check backend is running
curl http://localhost:5000/api/health
```

## 📚 Documentation

See the full [README.md](./README.md) for:
- Complete feature list
- Technical architecture
- Deployment guide
- API documentation
- Business impact metrics

## 🎓 Learn More

### Proprietary Algorithms

1. **Export Liability Index™**
   - Weighted compliance scoring
   - Risk vectorization
   - Penalty integration
   - Bonus for excellence (≥90% + no critical risks)

2. **Penalty Exposure™**
   - Multi-jurisdictional fines
   - BIS: $1M, EU: €35M, OFAC: $968M
   - Category breakdown

3. **Criminal Liability**
   - Critical violation tracking
   - Prosecution probability
   - Risk factor analysis

---

**Ready to assess your AI compliance?** 🚀

Start with `npm run dev` and navigate to http://localhost:5173
