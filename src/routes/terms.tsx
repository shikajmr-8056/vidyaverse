import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/vv/public-chrome";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms and Conditions · VidyaVerse" }, { name: "description", content: "Draft terms and conditions for the VidyaVerse learning prototype." }, { property: "og:title", content: "Terms and Conditions · VidyaVerse" }, { property: "og:description", content: "Draft terms and conditions for the VidyaVerse learning prototype." }] }),
  component: () => (
    <LegalPage
      title="Terms and Conditions"
      updated="Draft version, last edited October 2026. Pending legal review. The product has not launched."
      sections={[
        { h: "Acceptance and eligibility", body: <p>By using VidyaVerse you agree to these terms. Students under [age to be confirmed] need a school or guardian to set up access.</p> },
        { h: "Accounts and responsibilities", body: <p>Keep your login details private. The prototype has no accounts; a demo profile is used.</p> },
        { h: "Permitted use", body: <p>Use VidyaVerse for learning. Do not try to disrupt the service, copy content in bulk or access other students' information.</p> },
        { h: "Educational content and intellectual property", body: <p>Lessons, illustrations and games belong to [Organisation name] or their licensors. [Licensing terms for schools to be defined.]</p> },
        { h: "AI-generated or automated assistance limitations", body: <p>Tutor answers and Concept Detective suggestions can be wrong. Check important answers with your teacher or textbook. The prototype uses prepared responses, not a live AI model.</p> },
        { h: "Classroom participation and acceptable conduct", body: <p>Be respectful in team challenges and classroom spaces. Teachers may remove students from a classroom.</p> },
        { h: "Rewards and redemption conditions", body: <p>XP and badges have no cash value. Rewards in the catalogue unlock in-app items or teacher-approved recognition only. [Any physical rewards would need separate terms.]</p> },
        { h: "Availability and service limitations", body: <p>The service may be unavailable at times. Offline content works only after it has been downloaded.</p> },
        { h: "Changes to terms", body: <p>We will post updated terms on this page and tell schools about important changes.</p> },
        { h: "Contact information", body: <p>[Contact email and address to be added.]</p> },
      ]}
    />
  ),
});
