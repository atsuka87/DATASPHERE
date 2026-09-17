import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventSummary from "@/components/EventSummary";
import CategoryCards from "@/components/CategoryCards";
import TimelinePreview from "@/components/TimelinePreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <EventSummary />
        <CategoryCards />
        <TimelinePreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
