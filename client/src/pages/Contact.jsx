import { motion } from 'framer-motion';
import FadeInSection from '../components/FadeInSection.jsx';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto max-w-6xl px-6 pt-16 sm:pt-24 pb-16"
    >
      <FadeInSection>
        <h1 className="text-3xl font-bold">Contact</h1>
      </FadeInSection>
    </motion.div>
  );
}