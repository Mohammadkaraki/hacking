# CyberAcademy Usage Guide

## Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Customization Guide

### 1. Updating Course Content

Edit `data/courses.ts` to add, remove, or modify courses:

\`\`\`typescript
export const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Your Course Title',
    description: 'Course description here',
    difficulty: 'Beginner', // or 'Intermediate', 'Advanced', 'Expert'
    duration: '40 hours',
    lessons: 280,
    students: 15420,
    price: 49.99,
    originalPrice: 199.99,
    category: 'Ethical Hacking',
    instructor: 'Instructor Name',
    rating: 4.8,
  },
];
\`\`\`

### 2. Modifying Colors

Update the color scheme in `tailwind.config.ts`:

\`\`\`typescript
colors: {
  accent: {
    cyan: '#00ff9f',    // Change primary accent color
    blue: '#00d4ff',    // Change secondary accent
    green: '#39ff14',   // Change tertiary accent
    red: '#ff3366',     // Change warning color
  },
}
\`\`\`

### 3. Changing Animations

#### Disable specific effects:

In `app/page.tsx`, comment out any effects you don't want:

\`\`\`typescript
export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* <MatrixRain /> */}  // Disable Matrix effect
      <GridPattern />
      {/* <ParticleField /> */}  // Disable particles
      {/* <CursorTrail /> */}  // Disable cursor trail

      {/* Rest of components... */}
    </main>
  );
}
\`\`\`

#### Adjust animation speed:

Edit animation durations in component files or `globals.css`:

\`\`\`css
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  /* Change 4s to your preferred duration */
}
\`\`\`

### 4. Adding New Sections

Create a new component in `components/sections/`:

\`\`\`typescript
// components/sections/NewSection.tsx
'use client';

import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';

export default function NewSection() {
  return (
    <SectionContainer>
      <SectionHeading
        preheading="YOUR PREHEADING"
        heading="Your Section Title"
        subheading="Your subtitle here"
      />
      {/* Your content */}
    </SectionContainer>
  );
}
\`\`\`

Then add it to `app/page.tsx`:

\`\`\`typescript
import NewSection from '@/components/sections/NewSection';

export default function Home() {
  return (
    <main>
      {/* Other sections... */}
      <NewSection />
      {/* Rest of sections... */}
    </main>
  );
}
\`\`\`

### 5. Updating Testimonials

Edit `data/testimonials.ts`:

\`\`\`typescript
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Student Name',
    role: 'Current Position',
    achievement: 'What they achieved',
    quote: 'Their testimonial quote',
    avatar: 'URL to avatar image',
    beforeRole: 'Previous Role',
    afterRole: 'New Role',
  },
];
\`\`\`

### 6. Modifying Navigation Links

Edit the `navLinks` array in `components/sections/Navbar.tsx`:

\`\`\`typescript
const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'Courses', href: '#courses' },
  { name: 'Your Link', href: '#your-section' },
  // Add more links...
];
\`\`\`

### 7. Changing Fonts

Fonts are configured in `app/layout.tsx`. To use different Google Fonts:

\`\`\`typescript
import { YourFont } from 'next/font/google';

const yourFont = YourFont({
  subsets: ['latin'],
  variable: '--font-your-font',
});
\`\`\`

Then update `tailwind.config.ts`:

\`\`\`typescript
fontFamily: {
  heading: ['var(--font-your-font)', 'sans-serif'],
}
\`\`\`

### 8. Adding Images

Place images in the `public/images/` directory:

\`\`\`
public/
  images/
    courses/
      course-1.jpg
      course-2.jpg
    blog/
      post-1.jpg
\`\`\`

Reference them in your code:

\`\`\`typescript
import Image from 'next/image';

<Image
  src="/images/courses/course-1.jpg"
  alt="Course thumbnail"
  width={400}
  height={300}
/>
\`\`\`

## Component Reference

### Reusable UI Components

#### GlowButton
\`\`\`typescript
<GlowButton
  variant="primary"  // or 'secondary', 'outline'
  size="md"          // or 'sm', 'lg'
  fullWidth={false}
>
  Button Text
</GlowButton>
\`\`\`

#### NeonCard
\`\`\`typescript
<NeonCard
  hoverEffect={true}
  cornerAccent={false}
>
  {/* Card content */}
</NeonCard>
\`\`\`

#### Badge
\`\`\`typescript
<Badge variant="beginner">  {/* or 'intermediate', 'advanced', 'expert' */}
  Badge Text
</Badge>
\`\`\`

#### SectionContainer
\`\`\`typescript
<SectionContainer id="section-id" className="custom-class">
  {/* Section content */}
</SectionContainer>
\`\`\`

#### SectionHeading
\`\`\`typescript
<SectionHeading
  preheading="OPTIONAL PREHEADING"
  heading="Main Heading"
  subheading="Optional subtitle"
  centered={true}
/>
\`\`\`

## Styling Guide

### Custom CSS Classes

Available utility classes in `globals.css`:

- `.scanline-effect` - Adds retro scanline overlay
- `.neon-border` - Glowing neon border on hover
- `.glow-button` - Glowing button effect
- `.card-lift` - Lift effect on hover
- `.grid-pattern` - Cyberpunk grid background
- `.blur-backdrop` - Blur backdrop effect
- `.text-glow` - Text glow in cyan
- `.gradient-text` - Gradient text effect

### Using Tailwind Classes

Common patterns used in the project:

\`\`\`typescript
// Neon glow effect
className="shadow-neon-cyan hover:shadow-neon-blue"

// Gradient background
className="bg-gradient-to-br from-accent-cyan/10 to-accent-blue/10"

// Smooth transitions
className="transition-all duration-300"

// Responsive design
className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
\`\`\`

## Performance Optimization

### Image Optimization

Always use Next.js Image component:

\`\`\`typescript
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}  // Set true for above-fold images
/>
\`\`\`

### Lazy Loading

Components automatically lazy load when they enter viewport using Framer Motion's `whileInView`.

### Reducing Bundle Size

If you need to reduce bundle size:

1. Remove unused effects from `app/page.tsx`
2. Disable animations you don't need
3. Use dynamic imports for heavy components:

\`\`\`typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
\`\`\`

## Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Test Production Build Locally

\`\`\`bash
npm start
\`\`\`

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically

### Environment Variables

Create `.env.local` for any API keys or secrets:

\`\`\`
NEXT_PUBLIC_API_URL=your_api_url
\`\`\`

## Troubleshooting

### Common Issues

**Problem**: Animations not working
- **Solution**: Ensure Framer Motion is installed: `npm install framer-motion`

**Problem**: Styles not applying
- **Solution**: Restart dev server: `Ctrl+C` then `npm run dev`

**Problem**: Images not loading
- **Solution**: Check file paths and ensure images are in `public/` directory

**Problem**: Build errors
- **Solution**: Run `npm run build` to see specific TypeScript errors

### Browser Console Errors

If you see hydration errors:
1. Ensure all client components use `'use client'` directive
2. Check for mismatched HTML between server and client
3. Remove any direct DOM manipulation in useEffect

## Support

For issues or questions:
- Check the README.md for basic setup
- Review component files for implementation details
- Inspect browser console for runtime errors
- Use TypeScript IntelliSense for component props

## Best Practices

1. **Always use TypeScript types** - Type safety prevents bugs
2. **Follow the component structure** - Keep sections in `sections/`, reusable UI in `ui/`
3. **Use semantic HTML** - Improves accessibility and SEO
4. **Optimize images** - Always use Next.js Image component
5. **Test responsively** - Check mobile, tablet, and desktop views
6. **Keep animations subtle** - Too much motion can be overwhelming
7. **Maintain accessibility** - Ensure keyboard navigation works
8. **Use motion.div sparingly** - Only animate when it adds value

Enjoy building your cybersecurity platform! 🚀🔐
