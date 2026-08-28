import { useEffect } from 'react';
import { Chatbot } from './components/Chatbot';
import { trackEvent } from './api/client';
import { Approach } from './sections/Approach';
import { Assessment } from './sections/Assessment';
import { Contact } from './sections/Contact';
import { Engagement } from './sections/Engagement';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Industries } from './sections/Industries';
import { Integrations } from './sections/Integrations';
import { Labs } from './sections/Labs';
import { Legal } from './sections/Legal';
import { Opportunity } from './sections/Opportunity';
import { Proof } from './sections/Proof';
import { Services } from './sections/Services';
import { Transformation } from './sections/Transformation';
import { TransformationDemo } from './sections/TransformationDemo';
import { WhyAivanta } from './sections/WhyAivanta';

export default function App() {
  useEffect(() => {
    void trackEvent('page_view');
  }, []);

  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <Opportunity />
        <TransformationDemo />
        <Assessment />
        <Labs />
        <Services />
        <Engagement />
        <Approach />
        <Transformation />
        <Proof />
        <Integrations />
        <Industries />
        <WhyAivanta />
        <Contact />
        <Legal />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
