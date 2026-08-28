export function Legal() {
  return (
    <section className="legal-section" aria-label="Privacy and AI use information">
      <div className="container legal-grid">
        <article id="privacy">
          <p className="eyebrow">PRIVACY</p>
          <h2>Privacy at Aivanta</h2>
          <p>Aivanta collects the information you voluntarily submit through consultation and assessment forms so that the business can understand and respond to your enquiry.</p>
          <p>The site also records limited, first-party interaction events such as feature usage and page paths. These events are intended to understand how the site is used and improve the experience. They are not used to request or store confidential business data.</p>
          <p>Do not submit passwords, credentials, trade secrets, regulated personal information, or sensitive production records through the public website or assistant.</p>
        </article>
        <article id="ai-use">
          <p className="eyebrow">AI USE</p>
          <h2>How the Aivanta assistant works</h2>
          <p>The assistant is designed to help visitors explore AI opportunities and understand Aivanta's services. Depending on configuration, messages may be processed by a third-party AI model provider.</p>
          <p>Aivanta's assistant is not presented as a source of legal, financial, regulatory, medical, or other professional advice. It should not be trusted with confidential client information.</p>
          <p>Where the assistant suggests an opportunity, treat it as an initial discovery aid. Human review and a focused assessment remain the appropriate next step for real projects.</p>
        </article>
      </div>
    </section>
  );
}
