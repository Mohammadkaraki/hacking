'use client';

import Navbar from '@/components/sections/Navbar';
import HeroUltimate from '@/components/sections/HeroUltimate';
import TrustBar from '@/components/sections/TrustBar';
import FeaturedCourses from '@/components/sections/FeaturedCourses';
import CourseCategories from '@/components/sections/CourseCategories';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import Testimonials from '@/components/sections/Testimonials';
import LearningPath from '@/components/sections/LearningPath';
import BlogPreview from '@/components/sections/BlogPreview';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/sections/Footer';
import MatrixRain from '@/components/effects/MatrixRain';
import GridPattern from '@/components/effects/GridPattern';
import ParticleField from '@/components/effects/ParticleField';
import CursorTrail from '@/components/effects/CursorTrail';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background Effects */}
      <MatrixRain />
      <GridPattern />
      <ParticleField />
      <CursorTrail />

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroUltimate />
        <TrustBar />
        <FeaturedCourses />
        <CourseCategories />
        <WhyChooseUs />
        <Testimonials />
        <LearningPath />
        <BlogPreview />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
