import React, { useState, useContext } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaBrain, 
  FaStethoscope, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock, 
  FaPills, 
  FaHome, 
  FaPhone, 
  FaUserMd,
  FaHistory,
  FaArrowLeft,
  FaSpinner
} from "react-icons/fa";

const severityLevels = [
  { value: "mild", label: "Mild", color: "#28a745", bgColor: "#d4edda" },
  { value: "moderate", label: "Moderate", color: "#ffc107", bgColor: "#fff3cd" },
  { value: "severe", label: "Severe", color: "#fd7e14", bgColor: "#ffe5d0" },
  { value: "critical", label: "Critical", color: "#dc3545", bgColor: "#f8d7da" },
];

const triageLevelConfig = {
  emergency: {
    color: "#dc3545",
    bgColor: "#f8d7da",
    icon: FaExclamationTriangle,
    label: "Emergency",
    description: "Seek immediate medical attention",
  },
  "urgent-visit": {
    color: "#fd7e14",
    bgColor: "#ffe5d0",
    icon: FaClock,
    label: "Urgent Visit",
    description: "See a doctor within 24 hours",
  },
  "see-doctor": {
    color: "#ffc107",
    bgColor: "#fff3cd",
    icon: FaUserMd,
    label: "See Doctor",
    description: "Schedule an appointment soon",
  },
  "self-care": {
    color: "#28a745",
    bgColor: "#d4edda",
    icon: FaCheckCircle,
    label: "Self Care",
    description: "Can be managed at home",
  },
};

const AIAnalysis = () => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    symptomsText: "",
    severity: "",
    onset: "",
    duration: "",
    existingConditions: "",
    currentMedications: "",
    allergies: "",
    age: user?.age || "",
    gender: user?.gender || "",
    isPregnant: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.symptomsText || formData.symptomsText.length < 10) {
      toast.error("Please describe your symptoms in at least 10 characters");
      return;
    }

    if (!formData.severity) {
      toast.error("Please select severity level");
      return;
    }

    if (!formData.age) {
      toast.error("Please enter your age");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/ai/analyze",
        {
          ...formData,
          age: parseInt(formData.age),
        },
        { withCredentials: true }
      );

      setAnalysisResult(data.analysisResult);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error(error.response?.data?.message || "Error analyzing symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setFormData({
      symptomsText: "",
      severity: "",
      onset: "",
      duration: "",
      existingConditions: "",
      currentMedications: "",
      allergies: "",
      age: user?.age || "",
      gender: user?.gender || "",
      isPregnant: false,
    });
  };

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/ai/history",
        { withCredentials: true }
      );
      setAnalysisHistory(data.sessions || []);
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Error fetching analysis history");
    }
  };

  // Render Results Display
  if (analysisResult) {
    const triage = triageLevelConfig[analysisResult.triageLevel] || triageLevelConfig["see-doctor"];
    const TriageIcon = triage.icon;

    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={handleNewAnalysis}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "14px"
          }}
        >
          <FaArrowLeft /> New Analysis
        </button>

        {/* Triage Level Card */}
        <div
          style={{
            backgroundColor: triage.bgColor,
            border: `2px solid ${triage.color}`,
            borderRadius: "10px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                backgroundColor: triage.color,
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TriageIcon style={{ color: "white", fontSize: "28px" }} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: triage.color, fontSize: "28px" }}>
                {triage.label}
              </h2>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                {triage.description}
              </p>
            </div>
          </div>
          <p style={{ marginTop: "15px", fontSize: "16px", color: "#333" }}>
            {analysisResult.triageReason}
          </p>
        </div>

        {/* Possible Conditions */}
        {analysisResult.possibleConditions && analysisResult.possibleConditions.length > 0 && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <FaStethoscope style={{ color: "#007bff" }} />
              Possible Conditions
            </h3>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {analysisResult.possibleConditions.map((condition, index) => (
                <li key={index} style={{ marginBottom: "8px", fontSize: "16px" }}>
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {analysisResult.recommendations && (
          <>
            {/* Medicines */}
            {analysisResult.recommendations.medicines && analysisResult.recommendations.medicines.length > 0 && (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: "25px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <FaPills style={{ color: "#28a745" }} />
                  Suggested OTC Medications
                </h3>
                <div style={{ display: "grid", gap: "15px" }}>
                  {analysisResult.recommendations.medicines.map((med, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      <h4 style={{ margin: "0 0 10px 0", color: "#007bff" }}>{med.name}</h4>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Dosage:</strong> {med.dose}
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>Notes:</strong> {med.notes}
                      </p>
                      {med.evidenceLevel && (
                        <span
                          style={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          Evidence: {med.evidenceLevel}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Home Remedies */}
            {analysisResult.recommendations.homeRemedies && analysisResult.recommendations.homeRemedies.length > 0 && (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: "25px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <FaHome style={{ color: "#17a2b8" }} />
                  Home Remedies
                </h3>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {analysisResult.recommendations.homeRemedies.map((remedy, index) => (
                    <li key={index} style={{ marginBottom: "8px", fontSize: "16px" }}>
                      {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What To Do / Not To Do */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {analysisResult.recommendations.whatToDo && analysisResult.recommendations.whatToDo.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#d4edda",
                    borderRadius: "10px",
                    padding: "20px",
                    border: "1px solid #28a745",
                  }}
                >
                  <h4 style={{ color: "#155724", marginBottom: "10px" }}>✓ What To Do</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {analysisResult.recommendations.whatToDo.map((item, index) => (
                      <li key={index} style={{ marginBottom: "5px", color: "#155724" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysisResult.recommendations.whatNotToDo && analysisResult.recommendations.whatNotToDo.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#f8d7da",
                    borderRadius: "10px",
                    padding: "20px",
                    border: "1px solid #dc3545",
                  }}
                >
                  <h4 style={{ color: "#721c24", marginBottom: "10px" }}>✗ What NOT To Do</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {analysisResult.recommendations.whatNotToDo.map((item, index) => (
                      <li key={index} style={{ marginBottom: "5px", color: "#721c24" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Doctor Specialization */}
            {analysisResult.recommendations.doctorSpecialization && (
              <div
                style={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #2196f3",
                }}
              >
                <h4 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#1565c0" }}>
                  <FaUserMd />
                  Recommended Specialist
                </h4>
                <p style={{ margin: "10px 0 0 0", fontSize: "16px", color: "#1565c0" }}>
                  {analysisResult.recommendations.doctorSpecialization}
                </p>
              </div>
            )}

            {/* Emergency Contacts */}
            {analysisResult.triageLevel === "emergency" && analysisResult.recommendations.emergencyContacts && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "2px solid #dc3545",
                }}
              >
                <h4 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#721c24" }}>
                  <FaPhone />
                  Emergency Contacts
                </h4>
                <div style={{ display: "grid", gap: "10px", marginTop: "15px" }}>
                  {analysisResult.recommendations.emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.5)",
                        padding: "10px 15px",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <FaPhone style={{ color: "#dc3545" }} />
                      <div>
                        <strong>{contact.service}</strong>: {contact.number}
                        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#666" }}>
                          {contact.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Follow Up Advice */}
        {analysisResult.followUpAdvice && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #ffc107",
            }}
          >
            <h4 style={{ color: "#856404", marginBottom: "10px" }}>Follow-Up Advice</h4>
            <p style={{ margin: 0, color: "#856404" }}>{analysisResult.followUpAdvice}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            padding: "20px",
            border: "1px solid #dee2e6",
          }}
        >
          <p style={{ margin: 0, fontSize: "13px", color: "#6c757d", fontStyle: "italic" }}>
            {analysisResult.disclaimer || "This is an educational tool only and not medical advice. Always consult healthcare professionals for proper diagnosis and treatment."}
          </p>
        </div>
      </div>
    );
  }

  // Render History View
  if (showHistory) {
    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => setShowHistory(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "14px"
          }}
        >
          <FaArrowLeft /> Back to Analysis
        </button>

        <h3 style={{ marginBottom: "20px" }}>Analysis History</h3>

        {analysisHistory.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center", padding: "40px" }}>
            No previous analyses found.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {analysisHistory.map((session) => {
              const triage = triageLevelConfig[session.analysisResult?.triageLevel] || triageLevelConfig["see-doctor"];
              return (
                <div
                  key={session._id}
                  style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    border: `2px solid ${triage.color}`,
                  }}
                  onClick={() => {
                    setAnalysisResult(session.analysisResult);
                    setShowHistory(false);
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: "0 0 10px 0" }}>{session.symptomsText.slice(0, 100)}...</h4>
                      <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                        Severity: {session.severity} | {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      style={{
                        backgroundColor: triage.bgColor,
                        color: triage.color,
                        padding: "5px 15px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {triage.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render Form
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
            <FaBrain style={{ color: "#007bff" }} />
            AI Symptom Analysis
          </h2>
          <p style={{ color: "#666", margin: "5px 0 0 0" }}>
            Describe your symptoms for AI-powered health guidance
          </p>
        </div>
        <button
          onClick={fetchHistory}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          <FaHistory /> History
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Symptoms Text */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Describe Your Symptoms <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            placeholder="E.g., I have been experiencing headache for 2 days, along with mild fever and body ache..."
            value={formData.symptomsText}
            onChange={(e) => handleInputChange("symptomsText", e.target.value)}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              resize: "vertical",
            }}
            required
          />
          <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            {formData.symptomsText.length}/10 characters minimum
          </p>
        </div>

        {/* Severity Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Severity Level <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {severityLevels.map(({ value, label, color, bgColor }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange("severity", value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: formData.severity === value ? `2px solid ${color}` : "1px solid #ddd",
                  backgroundColor: formData.severity === value ? bgColor : "#fff",
                  color: formData.severity === value ? color : "#333",
                  fontWeight: formData.severity === value ? "bold" : "normal",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Age and Gender */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Age <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              min="1"
              max="120"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Pregnancy Status (only for females) */}
        {formData.gender === "female" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData.isPregnant}
                onChange={(e) => handleInputChange("isPregnant", e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <span>I am pregnant or might be pregnant</span>
            </label>
          </div>
        )}

        {/* Duration and Onset */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              When did symptoms start?
            </label>
            <input
              type="text"
              placeholder="E.g., 2 days ago, yesterday morning"
              value={formData.onset}
              onChange={(e) => handleInputChange("onset", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Duration
            </label>
            <input
              type="text"
              placeholder="E.g., constant, comes and goes"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {/* Medical History */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Existing Medical Conditions
          </label>
          <input
            type="text"
            placeholder="E.g., Diabetes, Hypertension, Asthma"
            value={formData.existingConditions}
            onChange={(e) => handleInputChange("existingConditions", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Current Medications */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Current Medications
          </label>
          <input
            type="text"
            placeholder="E.g., Metformin, Aspirin"
            value={formData.currentMedications}
            onChange={(e) => handleInputChange("currentMedications", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Allergies */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Known Allergies
          </label>
          <input
            type="text"
            placeholder="E.g., Penicillin, Peanuts"
            value={formData.allergies}
            onChange={(e) => handleInputChange("allergies", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" style={{ animation: "spin 1s linear infinite" }} />
              Analyzing...
            </>
          ) : (
            <>
              <FaBrain />
              Analyze Symptoms
            </>
          )}
        </button>
      </form>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AIAnalysis;
