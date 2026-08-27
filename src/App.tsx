import { Chatbot } from './components/Chatbot';
import { Approach } from './sections/Approach';
import { Assessment } from './sections/Assessment';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Industries } from './sections/Industries';
import { Opportunity } from './sections/Opportunity';
import { Services } from './sections/Services';
import { Transformation } from './sections/Transformation';
import { TransformationDemo } from './sections/TransformationDemo';
import { WhyAivanta } from './sections/WhyAivanta';

export default function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <Opportunity />
        <TransformationDemo />
        <Assessment />
        <Services />
        <Approach />
        <Transformation />
        <Industries />
        <WhyAivanta />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
