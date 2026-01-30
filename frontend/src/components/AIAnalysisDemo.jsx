import React, { useState } from "react";
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

const AIAnalysisDemo = () => {
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
    age: "",
    gender: "",
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
        "http://localhost:4000/api/v1/ai-demo/analyze-demo",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAnalysisResult(data.analysisResult);
      
      // Add to local history
      const newHistoryItem = {
        ...data.session,
        timestamp: new Date().toISOString(),
      };
      setAnalysisHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      
      toast.success("Analysis completed successfully!");
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("analysis-results");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      
    } catch (error) {
      console.error("Error during analysis:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to analyze symptoms. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/ai-demo/history-demo",
        {
          params: { page: 1, limit: 10 },
        }
      );
      setAnalysisHistory(data.sessions || []);
      setShowHistory(true);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Failed to load history");
    }
  };

  const resetForm = () => {
    setFormData({
      symptomsText: "",
      severity: "",
      onset: "",
      duration: "",
      existingConditions: "",
      currentMedications: "",
      allergies: "",
      age: "",
      gender: "",
      isPregnant: false,
    });
    setAnalysisResult(null);
  };

  if (showHistory) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
          <button
            onClick={() => setShowHistory(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <FaArrowLeft /> Back to Analysis
          </button>
          <h2 style={{ marginLeft: "20px", margin: 0 }}>
            <FaHistory style={{ marginRight: "10px" }} />
            Analysis History
          </h2>
        </div>

        {analysisHistory.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: "18px" }}>
            No analysis history available
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {analysisHistory.map((session, index) => (
              <div
                key={session._id}
                style={{
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px", color: "#666" }}>
                    {new Date(session.createdAt).toLocaleString()}
                  </span>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: triageLevelConfig[session.analysisResult.triageLevel].bgColor,
                      color: triageLevelConfig[session.analysisResult.triageLevel].color,
                      fontWeight: "bold",
                    }}
                  >
                    {triageLevelConfig[session.analysisResult.triageLevel].label}
                  </span>
                </div>
                <p style={{ marginBottom: "10px", fontWeight: "500" }}>
                  {session.symptomsText.substring(0, 100)}...
                </p>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  {session.analysisResult.triageReason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: "15px",
          fontSize: "36px", 
          marginBottom: "10px",
          color: "#333"
        }}>
          <FaBrain style={{ color: "#007bff" }} /> 
          AI Medical Analysis Demo
        </h1>
        <p style={{ fontSize: "18px", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
          Get instant medical guidance powered by advanced AI. Enter your symptoms below for personalized triage and recommendations.
        </p>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "15px", 
          marginTop: "20px" 
        }}>
          <button
            onClick={loadHistory}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
          >
            <FaHistory /> View History
          </button>
          
          <button
            onClick={resetForm}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: analysisResult ? "1fr 1fr" : "1fr",
          gap: "30px"
        }}>
          {/* Input Section */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e9ecef"
          }}>
            <h2 style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              marginBottom: "25px",
              color: "#333",
              fontSize: "24px"
            }}>
              <FaStethoscope style={{ color: "#007bff" }} /> 
              Symptom Information
            </h2>

            {/* Symptom Description */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                color: "#333"
              }}>
                Describe Your Symptoms *
              </label>
              <textarea
                value={formData.symptomsText}
                onChange={(e) => handleInputChange("symptomsText", e.target.value)}
                placeholder="Please describe your symptoms in detail (minimum 10 characters)"
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
                required
              />
            </div>

            {/* Severity Level */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                color: "#333"
              }}>
                Severity Level *
              </label>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "10px"
              }}>
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleInputChange("severity", level.value)}
                    style={{
                      padding: "12px",
                      border: `2px solid ${level.color}`,
                      backgroundColor: formData.severity === level.value ? level.bgColor : "white",
                      color: level.color,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "all 0.3s",
                      fontSize: "13px"
                    }}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age and Gender */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px"
            }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  min="1"
                  max="120"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px"
            }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  When did symptoms start?
                </label>
                <input
                  type="text"
                  value={formData.onset}
                  onChange={(e) => handleInputChange("onset", e.target.value)}
                  placeholder="e.g., 2 days ago, this morning"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="e.g., ongoing, 30 minutes"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            {/* Medical History */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                color: "#333"
              }}>
                Existing Medical Conditions
              </label>
              <textarea
                value={formData.existingConditions}
                onChange={(e) => handleInputChange("existingConditions", e.target.value)}
                placeholder="e.g., diabetes, hypertension, asthma"
                style={{
                  width: "100%",
                  minHeight: "60px",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                color: "#333"
              }}>
                Current Medications
              </label>
              <textarea
                value={formData.currentMedications}
                onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                placeholder="List any medications you're currently taking"
                style={{
                  width: "100%",
                  minHeight: "60px",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                color: "#333"
              }}>
                Known Allergies
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="List any known allergies (medications, food, environmental)"
                style={{
                  width: "100%",
                  minHeight: "60px",
                  padding: "12px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Pregnancy Checkbox */}
            {formData.gender === "Female" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={formData.isPregnant}
                    onChange={(e) => handleInputChange("isPregnant", e.target.checked)}
                    style={{ transform: "scale(1.2)" }}
                  />
                  <span style={{ fontWeight: "600", color: "#333" }}>
                    Currently pregnant or might be pregnant
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: loading ? "#6c757d" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "background-color 0.3s"
              }}
            >
              {loading ? (
                <>
                  <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <FaBrain />
                  Analyze Symptoms
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {analysisResult && (
            <div id="analysis-results" style={{
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              border: "1px solid #e9ecef"
            }}>
              {/* Triage Level Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "20px",
                backgroundColor: triageLevelConfig[analysisResult.triageLevel].bgColor,
                borderRadius: "10px",
                marginBottom: "25px",
                border: `2px solid ${triageLevelConfig[analysisResult.triageLevel].color}`
              }}>
                {React.createElement(triageLevelConfig[analysisResult.triageLevel].icon, {
                  size: 24,
                  color: triageLevelConfig[analysisResult.triageLevel].color
                })}
                <div>
                  <h3 style={{
                    margin: 0,
                    color: triageLevelConfig[analysisResult.triageLevel].color,
                    fontSize: "20px"
                  }}>
                    {triageLevelConfig[analysisResult.triageLevel].label}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: triageLevelConfig[analysisResult.triageLevel].color,
                    fontSize: "14px"
                  }}>
                    {triageLevelConfig[analysisResult.triageLevel].description}
                  </p>
                </div>
              </div>

              {/* Triage Reason */}
              <div style={{ marginBottom: "25px" }}>
                <h4 style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  marginBottom: "10px",
                  color: "#333"
                }}>
                  <FaStethoscope style={{ color: "#007bff" }} />
                  Assessment
                </h4>
                <p style={{ 
                  backgroundColor: "#f8f9fa", 
                  padding: "15px", 
                  borderRadius: "8px",
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.6"
                }}>
                  {analysisResult.triageReason}
                </p>
              </div>

              {/* Possible Conditions */}
              {analysisResult.possibleConditions && analysisResult.possibleConditions.length > 0 && (
                <div style={{ marginBottom: "25px" }}>
                  <h4 style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "15px",
                    color: "#333"
                  }}>
                    Possible Conditions
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {analysisResult.possibleConditions.map((condition, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#e9ecef",
                          color: "#495057",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          border: "1px solid #dee2e6"
                        }}
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysisResult.recommendations && (
                <div style={{ marginBottom: "25px" }}>
                  <h4 style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "20px",
                    color: "#333"
                  }}>
                    <FaPills style={{ color: "#007bff" }} />
                    Recommendations
                  </h4>

                  {/* Medicines */}
                  {analysisResult.recommendations.medicines && analysisResult.recommendations.medicines.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ 
                        color: "#495057", 
                        marginBottom: "10px",
                        fontSize: "16px"
                      }}>
                        💊 Medications
                      </h5>
                      {analysisResult.recommendations.medicines.map((medicine, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "10px",
                            border: "1px solid #e9ecef"
                          }}
                        >
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            marginBottom: "5px"
                          }}>
                            <strong style={{ color: "#333" }}>{medicine.name}</strong>
                            <span style={{
                              backgroundColor: "#007bff",
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "11px"
                            }}>
                              {medicine.evidenceLevel || 'Moderate'}
                            </span>
                          </div>
                          <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                            <strong>Dosage:</strong> {medicine.dose}
                          </p>
                          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                            {medicine.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Home Remedies */}
                  {analysisResult.recommendations.homeRemedies && analysisResult.recommendations.homeRemedies.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ 
                        color: "#495057", 
                        marginBottom: "10px",
                        fontSize: "16px"
                      }}>
                        🏠 Home Remedies
                      </h5>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: "20px",
                        backgroundColor: "#f8f9fa",
                        padding: "15px",
                        borderRadius: "8px"
                      }}>
                        {analysisResult.recommendations.homeRemedies.map((remedy, index) => (
                          <li key={index} style={{ 
                            marginBottom: "8px",
                            fontSize: "14px",
                            lineHeight: "1.5"
                          }}>
                            {remedy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What to Do */}
                  {analysisResult.recommendations.whatToDo && analysisResult.recommendations.whatToDo.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ 
                        color: "#495057", 
                        marginBottom: "10px",
                        fontSize: "16px"
                      }}>
                        ✅ What To Do
                      </h5>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: "20px",
                        backgroundColor: "#d4edda",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #c3e6cb"
                      }}>
                        {analysisResult.recommendations.whatToDo.map((action, index) => (
                          <li key={index} style={{ 
                            marginBottom: "8px",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            color: "#155724"
                          }}>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What NOT to Do */}
                  {analysisResult.recommendations.whatNotToDo && analysisResult.recommendations.whatNotToDo.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ 
                        color: "#495057", 
                        marginBottom: "10px",
                        fontSize: "16px"
                      }}>
                        ❌ What NOT To Do
                      </h5>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: "20px",
                        backgroundColor: "#f8d7da",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #f5c6cb"
                      }}>
                        {analysisResult.recommendations.whatNotToDo.map((avoid, index) => (
                          <li key={index} style={{ 
                            marginBottom: "8px",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            color: "#721c24"
                          }}>
                            {avoid}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dietary Advice */}
                  {analysisResult.recommendations.dietaryAdvice && analysisResult.recommendations.dietaryAdvice.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ 
                        color: "#495057", 
                        marginBottom: "10px",
                        fontSize: "16px"
                      }}>
                        🥗 Dietary Advice
                      </h5>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: "20px",
                        backgroundColor: "#fff3cd",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ffeaa7"
                      }}>
                        {analysisResult.recommendations.dietaryAdvice.map((advice, index) => (
                          <li key={index} style={{ 
                            marginBottom: "8px",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            color: "#856404"
                          }}>
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Doctor Specialization */}
                  {analysisResult.recommendations.doctorSpecialization && (
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px",
                        color: "#495057", 
                        marginBottom: "10px",
                        fontSize: "16px"
                      }}>
                        <FaUserMd style={{ color: "#007bff" }} />
                        Recommended Doctor
                      </h5>
                      <div style={{
                        backgroundColor: "#e3f2fd",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #bbdefb"
                      }}>
                        <p style={{ 
                          margin: 0, 
                          fontSize: "14px",
                          color: "#1565c0",
                          fontWeight: "500"
                        }}>
                          {analysisResult.recommendations.doctorSpecialization}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Emergency Contacts */}
                  {analysisResult.recommendations.emergencyContacts && analysisResult.recommendations.emergencyContacts.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <h5 style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px",
                        color: "#495057", 
                        marginBottom: "10px",
                        fontSize: "16px"
                      }}>
                        <FaPhone style={{ color: "#dc3545" }} />
                        Emergency Contacts
                      </h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {analysisResult.recommendations.emergencyContacts.map((contact, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "#f8d7da",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #f5c6cb"
                            }}
                          >
                            <div>
                              <strong style={{ color: "#721c24" }}>{contact.service}</strong>
                              <p style={{ margin: 0, fontSize: "12px", color: "#721c24" }}>
                                {contact.description}
                              </p>
                            </div>
                            <a
                              href={`tel:${contact.number}`}
                              style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontWeight: "600",
                                fontSize: "14px"
                              }}
                            >
                              {contact.number}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Follow-up Advice */}
              {analysisResult.followUpAdvice && (
                <div style={{ marginBottom: "25px" }}>
                  <h4 style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "10px",
                    color: "#333"
                  }}>
                    <FaClock style={{ color: "#007bff" }} />
                    Follow-up Advice
                  </h4>
                  <div style={{
                    backgroundColor: "#e7f3ff",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #b3d9ff"
                  }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "14px",
                      color: "#0056b3",
                      lineHeight: "1.6"
                    }}>
                      {analysisResult.followUpAdvice}
                    </p>
                  </div>
                </div>
              )}

              {/* Confidence Score */}
              {analysisResult.confidenceScore && (
                <div style={{ marginBottom: "25px" }}>
                  <h4 style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "10px",
                    color: "#333"
                  }}>
                    Confidence Score
                  </h4>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px"
                    }}>
                      <div style={{
                        width: "100px",
                        height: "8px",
                        backgroundColor: "#e9ecef",
                        borderRadius: "4px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          width: `${analysisResult.confidenceScore * 100}%`,
                          height: "100%",
                          backgroundColor: analysisResult.confidenceScore > 0.7 ? "#28a745" : 
                                         analysisResult.confidenceScore > 0.4 ? "#ffc107" : "#dc3545",
                          transition: "width 0.3s ease"
                        }}></div>
                      </div>
                      <span style={{
                        fontWeight: "600",
                        color: "#333",
                        fontSize: "14px"
                      }}>
                        {Math.round(analysisResult.confidenceScore * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div style={{
                backgroundColor: "#fff3cd",
                border: "1px solid #ffeaa7",
                borderRadius: "8px",
                padding: "15px"
              }}>
                <p style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#856404",
                  lineHeight: "1.5",
                  textAlign: "center",
                  fontStyle: "italic"
                }}>
                  ⚠️ {analysisResult.disclaimer}
                </p>
              </div>
            </div>
          )}
        </div>
      </form>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AIAnalysisDemo;