import { Chatbot } from './components/Chatbot';
import { Assessment } from './sections/Assessment';
import { Contact } from './sections/Contact';
import { Engagement } from './sections/Engagement';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Industries } from './sections/Industries';
import { Legal } from './sections/Legal';
import { Proof } from './sections/Proof';
import { Services } from './sections/Services';
import { TransformationDemo } from './sections/TransformationDemo';

export default function App() {
  return <div id="top">
    <Header />
    <main>
      <Hero />
      <Services />
      <TransformationDemo />
      <Engagement />
      <Proof />
      <Industries />
      <Assessment />
      <Contact />
      <Legal />
    </main>
    <Footer />
    <Chatbot />
  </div>;
}
