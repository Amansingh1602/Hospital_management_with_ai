import React, { useContext } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import AIAnalysis from "../components/AIAnalysis";

const AIDemo = () => {
  const { isAuthenticated } = useContext(Context);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <div className="container" style={{ padding: "20px 0" }}>
        <div style={{ 
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <AIAnalysis />
        </div>
      </div>
    </section>
  );
};

export default AIDemo;