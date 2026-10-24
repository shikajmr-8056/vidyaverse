import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/vv/public-chrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy · VidyaVerse" }, { name: "description", content: "Draft privacy policy for the VidyaVerse learning prototype." }, { property: "og:title", content: "Privacy Policy · VidyaVerse" }, { property: "og:description", content: "Draft privacy policy for the VidyaVerse learning prototype." }] }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      updated="Draft version, last edited October 2026. Operated by [Organisation name to be confirmed]."
      sections={[
        { h: "Information collected", body: <><p>The current prototype stores demo progress, language and accessibility preferences only in your browser's local storage. Nothing is sent to a server.</p><p>A future version may collect: [student name, class, school, learning progress, quiz answers; to be confirmed].</p></> },
        { h: "How information is used", body: <p>To show learning progress, recommend lessons, and let teachers and guardians follow progress. [Final list of purposes to be confirmed.]</p> },
        { h: "Data storage and sharing", body: <p>[Storage location and provider to be confirmed.] Information would be shared only with the student's school and guardians. We do not sell personal information.</p> },
        { h: "Third-party services", body: <p>[List of third-party services such as hosting, analytics or AI providers to be added before launch.] The prototype loads fonts from Google Fonts.</p> },
        { h: "Children's privacy and school or guardian involvement", body: <p>VidyaVerse is intended for school students. Accounts for children would be created through a school or with guardian consent. [Consent process to be defined and reviewed.]</p> },
        { h: "Security measures", body: <p>[Security practices to be documented.] No compliance certification is claimed.</p> },
        { h: "Retention and deletion", body: <p>You can clear all prototype data from Settings using "Reset demo progress". [Retention period for a launched service to be defined.]</p> },
        { h: "User rights and contact information", body: <p>Students, guardians and schools may request access, correction or deletion. Contact: [contact email and postal address to be added].</p> },
      ]}
    />
  ),
});
