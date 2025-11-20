import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import WhyChooseUs from "./WhyChooseUs";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
