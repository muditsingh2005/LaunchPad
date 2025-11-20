import React from "react";
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const features = [
    {
      icon: "🎯",
      title: "Real-World Experience",
      description:
        "Work on actual startup projects and build a professional portfolio that stands out to future employers.",
    },
    {
      icon: "💰",
      title: "Earn While Learning",
      description:
        "Get paid for your skills while still in college. Turn your knowledge into income and gain financial independence.",
    },
    {
      icon: "🚀",
      title: "Network & Grow",
      description:
        "Connect with innovative campus startups and like-minded students. Build relationships that last beyond college.",
    },
    {
      icon: "⚡",
      title: "Flexible Projects",
      description:
        "Choose projects that match your schedule and interests. Work on your own terms without compromising your studies.",
    },
  ];

  return (
    <section className="why-choose-us" id="why-choose-us">
      <div className="why-container">
        <div className="section-header">
          <h2 className="section-title">
            Why Choose{" "}
            <span className="gradient-text">Campus Freelance Hub</span>
          </h2>
          <p className="section-subtitle">
            The ultimate platform that bridges the gap between talented students
            and ambitious startups
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon-wrapper">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
