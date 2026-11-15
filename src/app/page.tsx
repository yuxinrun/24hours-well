import { Hero } from '@/components/home/Hero';
import { TimeRingSection } from '@/components/home/TimeRingSection';
import { DailyAction } from '@/components/home/DailyAction';
import {
  InspirationSection,
  MethodsSection,
  FeaturedArticlesSection,
  DayJourneySection,
  BooksSection,
  WebsitesSection,
  LabSection,
} from '@/components/home/HomeSections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TimeRingSection />
      <InspirationSection />
      <DayJourneySection />
      <MethodsSection />
      <FeaturedArticlesSection />
      <BooksSection />
      <WebsitesSection />
      <LabSection />
      <DailyAction />
    </>
  );
}
