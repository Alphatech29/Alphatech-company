import React from "react";
import Hero from "../componenets/hero";
import ServiceSection from "../componenets/serviceSection";
import AboutSection from "../componenets/aboutSection";
import TechSection from "../componenets/tackSection";
import WhySection from "../componenets/whySection";
import TestimonialSection from "../componenets/testimonialsSection";
import FeatureSection from "../componenets/featureSection";
import Action from "../componenets/action";
import Technologies from "../componenets/technologies";

function Index() {
  return (
<>
<Hero/>
<ServiceSection/>
<AboutSection/>
<TechSection/>
<FeatureSection/>
<TestimonialSection/>
<WhySection/>
<Technologies/>
<Action/>
</>
  );
}

export default Index;
