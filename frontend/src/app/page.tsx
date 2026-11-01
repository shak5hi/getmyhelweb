import World from "@/components/home/story/World";
import Hero from "@/components/home/Hero";
import EverydayProblems from "@/components/home/EverydayProblems";
import SocietyFirst from "@/components/home/SocietyFirst";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesPlans from "@/components/home/ServicesPlans";
import LeaveCover from "@/components/home/LeaveCover";
import Benefits from "@/components/home/Benefits";
import TrustRespect from "@/components/home/TrustRespect";
import Faq from "@/components/home/Faq";
import ResidentWaitlist from "@/components/home/ResidentWaitlist";
import FinalCta from "@/components/home/FinalCta";
import StructuredData from "@/components/site/StructuredData";

export default function Home() {
  return (
    // One story: the world sits behind the page, and every chapter returns to it
    <main className="isolate">
      <StructuredData />
      <World />
      <Hero />
      <EverydayProblems />
      <SocietyFirst />
      <HowItWorks />
      <ServicesPlans />
      <LeaveCover />
      <Benefits />
      <TrustRespect />
      <Faq />
      <ResidentWaitlist />
      <FinalCta />
    </main>
  );
}
