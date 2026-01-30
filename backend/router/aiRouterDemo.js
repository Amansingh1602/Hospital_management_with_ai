import express from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const router = express.Router();

// Get API key dynamically
const getGrokApiKey = () => process.env.GROK_API_KEY;

// Build prompt for AI analysis
function buildPrompt(symptoms) {
  return `You are a medical triage assistant for an educational demonstration tool. Analyze the following symptoms and provide structured health guidance.

SYMPTOM INFORMATION:
- Primary Symptoms: ${symptoms.symptomsText}
- Severity Level: ${symptoms.severity}
- Patient Age: ${symptoms.age}
- Gender: ${symptoms.gender || 'Not specified'}
${symptoms.onset ? `- Symptom Onset: ${symptoms.onset}` : ""}
${symptoms.duration ? `- Duration: ${symptoms.duration}` : ""}
${symptoms.existingConditions ? `- Existing Conditions: ${symptoms.existingConditions}` : ""}
${symptoms.currentMedications ? `- Current Medications: ${symptoms.currentMedications}` : ""}
${symptoms.allergies ? `- Allergies: ${symptoms.allergies}` : ""}
${symptoms.isPregnant ? "- Patient is pregnant or might be pregnant" : ""}

CRITICAL SAFETY GUIDELINES:
1. If patient mentions chest pain, severe difficulty breathing, uncontrolled bleeding, sudden numbness, confusion, or loss of consciousness - return EMERGENCY triage only.
2. For ages < 2 or > 65, be conservative and escalate triage level.
3. For pregnant patients, automatically escalate at least one level and avoid medications contraindicated in pregnancy.
4. ONLY suggest OTC medications - never prescribe medications.
5. If unsure about anything, escalate the triage level.

REQUIRED JSON RESPONSE FORMAT (RESPOND ONLY WITH VALID JSON, NO MARKDOWN, NO CODE BLOCKS):
{
  "triageLevel": "emergency" | "urgent-visit" | "see-doctor" | "self-care",
  "triageReason": "Brief explanation of the triage decision",
  "possibleConditions": ["condition 1", "condition 2", "condition 3"],
  "recommendations": {
    "medicines": [
      {
        "name": "OTC medication name",
        "dose": "dose and frequency",
        "notes": "why this medication and precautions",
        "evidenceLevel": "Strong/Moderate/Supportive"
      }
    ],
    "homeRemedies": ["remedy 1", "remedy 2", "remedy 3"],
    "whatToDo": ["action 1", "action 2", "action 3"],
    "whatNotToDo": ["avoid 1", "avoid 2"],
    "dietaryAdvice": ["diet tip 1", "diet tip 2"],
    "doctorSpecialization": "Type of doctor to consult if needed",
    "emergencyContacts": [
      {
        "service": "Emergency Services",
        "number": "112",
        "description": "India emergency number"
      }
    ]
  },
  "followUpAdvice": "When to seek further medical attention",
  "confidenceScore": 0.0 to 1.0,
  "disclaimer": "This is an educational tool only and not medical advice. Always consult healthcare professionals for proper diagnosis and treatment."
}

Provide detailed, helpful, and accurate medical guidance based on the symptoms. Be thorough in your analysis.`;
}

// Parse AI response
function parseAIResponse(responseText) {
  try {
    let cleanText = responseText;
    cleanText = cleanText.replace(/```json\s*/gi, '');
    cleanText = cleanText.replace(/```\s*/gi, '');
    cleanText = cleanText.trim();
    
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
}

// Analyze symptoms with Grok/Groq API
async function analyzeWithGrok(symptoms) {
  try {
    console.log('🤖 Calling Grok API for symptom analysis...');
    const prompt = buildPrompt(symptoms);
    const apiKey = getGrokApiKey();
    
    if (!apiKey) {
      console.error('GROK_API_KEY is not set');
      throw new Error('AI service is not configured properly');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a medical triage assistant. Always respond with valid JSON only, no markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Grok API error:', errorData);
      throw new Error('AI service returned an error');
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('Empty response from AI service');
    }

    const parsedResult = parseAIResponse(responseText);
    
    if (!parsedResult) {
      throw new Error('Failed to parse AI response');
    }

    return parsedResult;
  } catch (error) {
    console.error('Error in analyzeWithGrok:', error);
    throw error;
  }
}

// Fallback analysis when API is not available
function getFallbackAnalysis(symptoms) {
  const severityMap = {
    critical: 'emergency',
    severe: 'urgent-visit',
    moderate: 'see-doctor',
    mild: 'self-care',
  };

  return {
    triageLevel: severityMap[symptoms.severity] || 'see-doctor',
    triageReason: `Based on the reported ${symptoms.severity} symptoms, we recommend appropriate medical attention.`,
    possibleConditions: ['Further medical evaluation needed for accurate diagnosis'],
    recommendations: {
      medicines: [],
      homeRemedies: ['Rest adequately', 'Stay hydrated', 'Monitor your symptoms'],
      whatToDo: ['Keep track of your symptoms', 'Note any changes or new symptoms', 'Consult a healthcare provider'],
      whatNotToDo: ['Do not ignore worsening symptoms', 'Avoid self-medicating without professional advice'],
      dietaryAdvice: ['Eat light, nutritious meals', 'Avoid heavy or spicy foods'],
      doctorSpecialization: 'General Physician',
      emergencyContacts: [
        { service: 'Emergency Services', number: '112', description: 'India emergency number' },
        { service: 'Ambulance', number: '102', description: 'Medical emergency' },
      ],
    },
    followUpAdvice: 'If symptoms persist or worsen, please consult a doctor immediately.',
    confidenceScore: 0.5,
    disclaimer: 'This is an educational tool only and not medical advice. Always consult healthcare professionals for proper diagnosis and treatment.',
  };
}

// In-memory storage for symptom sessions (in production, use database)
const symptomSessions = new Map();

// Demo analyze symptoms endpoint (no authentication required)
router.post(
  "/analyze-demo",
  catchAsyncErrors(async (req, res, next) => {
    const {
      symptomsText,
      severity,
      onset,
      duration,
      existingConditions,
      currentMedications,
      allergies,
      age,
      gender,
      isPregnant,
    } = req.body;

    // Validation
    if (!symptomsText || symptomsText.length < 10) {
      return next(new ErrorHandler("Please describe symptoms in at least 10 characters", 400));
    }

    if (!severity || !['mild', 'moderate', 'severe', 'critical'].includes(severity)) {
      return next(new ErrorHandler("Please select a valid severity level", 400));
    }

    if (!age || age < 1 || age > 120) {
      return next(new ErrorHandler("Please enter a valid age", 400));
    }

    const symptoms = {
      symptomsText,
      severity,
      onset,
      duration,
      existingConditions,
      currentMedications,
      allergies,
      age,
      gender,
      isPregnant: isPregnant || false,
    };

    let analysisResult;

    try {
      // Try to use AI service
      analysisResult = await analyzeWithGrok(symptoms);
    } catch (error) {
      console.log('Using fallback analysis due to error:', error.message);
      // Use fallback if AI service fails
      analysisResult = getFallbackAnalysis(symptoms);
    }

    // Store session
    const sessionId = Date.now().toString();
    const session = {
      _id: sessionId,
      userId: "demo_user",
      symptomsText,
      severity,
      onset,
      duration,
      existingConditions,
      currentMedications,
      allergies,
      age,
      gender,
      isPregnant,
      analysisResult,
      createdAt: new Date(),
    };

    // Store in demo sessions
    const demoSessions = symptomSessions.get("demo_user") || [];
    demoSessions.unshift(session);
    symptomSessions.set("demo_user", demoSessions.slice(0, 50)); // Keep last 50 sessions

    res.status(200).json({
      success: true,
      message: "Analysis completed",
      session,
      analysisResult,
    });
  })
);

// Demo history endpoint
router.get(
  "/history-demo",
  catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const demoSessions = symptomSessions.get("demo_user") || [];
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSessions = demoSessions.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      sessions: paginatedSessions,
      pagination: {
        page,
        limit,
        total: demoSessions.length,
        pages: Math.ceil(demoSessions.length / limit),
      },
    });
  })
);

export default router;