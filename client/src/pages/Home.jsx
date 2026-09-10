import { motion } from 'framer-motion';
import Hero from '../components/Hero.jsx';
import ResultsHighlight from '../components/ResultsHighlight.jsx';
import StudyGroupsHighlight from '../components/StudyGroupsHighlight.jsx';
import FadeInSection from '../components/FadeInSection.jsx';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <FadeInSection>
        <Hero />
      </FadeInSection>
      <ResultsHighlight />
      <FadeInSection>
        <StudyGroupsHighlight />
      </FadeInSection>
    </motion.div>
  );
}