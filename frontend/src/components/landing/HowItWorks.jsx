import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: "✨",
      title: "Sign Up",
      description:
        "Create your profile in minutes. Students showcase skills, startups post their needs.",
      color: "#667eea",
    },
    {
      number: "02",
      icon: "🔍",
      title: "Apply or Post Projects",
      description:
        "Students browse and apply for projects. Startups post opportunities and review applications.",
      color: "#764ba2",
    },
    {
      number: "03",
      icon: "⭐",
      title: "Work & Get Reviewed",
      description:
        "Collaborate seamlessly, deliver quality work, and build your reputation with reviews.",
      color: "#f093fb",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-container">
        <div className="section-header">
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            Three simple steps to connect, collaborate, and succeed
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                className="step-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="step-number">{step.number}</div>
                <div
                  className="step-icon-wrapper"
                  style={{
                    background: `linear-gradient(135deg, ${step.color} 0%, ${
                      steps[Math.min(index + 1, steps.length - 1)].color
                    } 100%)`,
                  }}
                >
                  <div className="step-icon">{step.icon}</div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="step-connector">
                  <svg
                    width="100%"
                    height="80"
                    viewBox="0 0 200 80"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 0 40 Q 100 0, 200 40"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8 8"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor={step.color}
                          stopOpacity="0.5"
                        />
                        <stop
                          offset="100%"
                          stopColor={steps[index + 1].color}
                          stopOpacity="0.5"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div
                    className="connector-arrow"
                    style={{ color: steps[index + 1].color }}
                  >
                    →
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="cta-section">
          <button className="cta-button">
            Get Started Now
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
