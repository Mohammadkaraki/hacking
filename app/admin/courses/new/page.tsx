'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [instructorAvatarFile, setInstructorAvatarFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Curriculum state
  const [modules, setModules] = useState<Array<{
    title: string;
    description: string;
    duration: string;
    order: number;
    lessons: Array<{
      title: string;
      duration: string;
      order: number;
      isFree: boolean;
    }>;
  }>>([]);

  // FAQ state
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);

  // Seed Reviews state (for testimonials/social proof)
  const [seedReviews, setSeedReviews] = useState<Array<{
    name: string;
    rating: number;
    review: string;
  }>>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    difficulty: 'Beginner',
    duration: '',
    lessons: 0,
    price: 0,
    originalPrice: 0,
    category: 'Web Security',
    instructor: '',
    featured: false,
    prerequisites: '',
    whatYouLearn: '',
    highlights: '',
    targetAudience: '',
    instructorCredentials: '',
    videoPreviewUrl: '',
    instructorBio: '',
    instructorAvatar: '',
    totalVideoHours: 0,
    initialStudents: 0,
    initialRating: 0,
  });

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-green-400">Loading...</div>
    </div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleInstructorAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInstructorAvatarFile(e.target.files[0]);
    }
  };

  // Curriculum handlers
  const addModule = () => {
    setModules([...modules, {
      title: '',
      description: '',
      duration: '',
      order: modules.length + 1,
      lessons: []
    }]);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const updateModule = (index: number, field: string, value: string) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({
      title: '',
      duration: '',
      order: updated[moduleIndex].lessons.length + 1,
      isFree: false
    });
    setModules(updated);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(updated);
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value
    };
    setModules(updated);
  };

  // FAQ handlers
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  // Seed Reviews handlers
  const addSeedReview = () => {
    setSeedReviews([...seedReviews, { name: '', rating: 5, review: '' }]);
  };

  const removeSeedReview = (index: number) => {
    setSeedReviews(seedReviews.filter((_, i) => i !== index));
  };

  const updateSeedReview = (index: number, field: 'name' | 'rating' | 'review', value: string | number) => {
    const updated = [...seedReviews];
    updated[index] = { ...updated[index], [field]: value };
    setSeedReviews(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    setUploadStatus('');

    try {
      const formDataToSend = new FormData();

      // Upload images first if selected
      if (thumbnailFile || instructorAvatarFile || file) {
        setUploadStatus('Uploading images...');

        if (thumbnailFile) formDataToSend.append('thumbnailFile', thumbnailFile);
        if (instructorAvatarFile) formDataToSend.append('instructorAvatarFile', instructorAvatarFile);
        if (file && file.size <= 500 * 1024 * 1024) formDataToSend.append('file', file);
      }

      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'featured') {
          formDataToSend.append(key, value ? 'true' : 'false');
        } else if (['prerequisites', 'whatYouLearn', 'highlights', 'targetAudience', 'instructorCredentials'].includes(key)) {
          const array = value.toString().split(',').map(item => item.trim()).filter(item => item);
          formDataToSend.append(key, JSON.stringify(array));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add curriculum modules, FAQs, and seed reviews
      formDataToSend.append('modules', JSON.stringify(modules));
      formDataToSend.append('faqs', JSON.stringify(faqs));
      formDataToSend.append('seedReviews', JSON.stringify(seedReviews));

      // Handle large file upload separately
      if (file && file.size > 500 * 1024 * 1024) {
        setUploadStatus('Uploading large file directly to S3...');
        const s3FileKey = await uploadDirectToS3(file);
        formDataToSend.append('s3FileKey', s3FileKey);
        formDataToSend.append('fileSize', file.size.toString());
        formDataToSend.append('fileType', file.type || 'application/zip');
      }

      setUploadStatus('Creating course...');
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
      }

      setUploadStatus('Success!');
      alert('Course created successfully!');
      router.push('/admin');
    } catch (error: any) {
      console.error('Error creating course:', error);
      alert(error.message || 'Failed to create course');
      setUploadStatus('Failed');
    } finally {
      setLoading(false);
    }
  };

  // Upload file directly to S3 (for large files)
  const uploadDirectToS3 = async (file: File): Promise<string> => {
    // Step 1: Get presigned URL
    const presignedResponse = await fetch('/api/admin/upload/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || 'application/zip',
        fileSize: file.size,
      }),
    });

    if (!presignedResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, fields, s3Key } = await presignedResponse.json();

    // Step 2: Upload to S3 using presigned POST
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file);

    // Upload with progress tracking
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
          setUploadStatus(`Uploading: ${progress}%`);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 204) {
          setUploadProgress(100);
          resolve(s3Key);
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    });
  };

  // Upload file via server (for smaller files)
  const uploadViaServer = async (file: File): Promise<{ s3FileKey: string }> => {
    const formDataToSend = new FormData();

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'featured') {
        formDataToSend.append(key, value ? 'true' : 'false');
      } else if (['prerequisites', 'whatYouLearn', 'highlights', 'targetAudience', 'instructorCredentials'].includes(key)) {
        const array = value.toString().split(',').map(item => item.trim()).filter(item => item);
        formDataToSend.append(key, JSON.stringify(array));
      } else {
        formDataToSend.append(key, value.toString());
      }
    });

    formDataToSend.append('file', file);

    const response = await fetch('/api/admin/courses', {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload');
    }

    const result = await response.json();
    return { s3FileKey: result.s3FileKey };
  };

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Create New Course</h1>
          <p className="text-gray-400">Fill in the details to create a new course</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card-bg border border-green-500/20 rounded-lg p-8 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="e.g., Advanced Ethical Hacking"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Detailed course description..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="Web Security">Web Security</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Ethical Hacking">Ethical Hacking</option>
                    <option value="Penetration Testing">Penetration Testing</option>
                    <option value="Malware Analysis">Malware Analysis</option>
                    <option value="Cryptography">Cryptography</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="e.g., 20 hours"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Number of Lessons *</label>
                  <input
                    type="number"
                    name="lessons"
                    value={formData.lessons}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Initial Students</label>
                  <input
                    type="number"
                    name="initialStudents"
                    value={formData.initialStudents}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="e.g., 2500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Display before real sales</p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Initial Rating</label>
                  <input
                    type="number"
                    name="initialRating"
                    value={formData.initialRating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="e.g., 4.8"
                  />
                  <p className="text-xs text-gray-500 mt-1">0-5 stars</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Featured Course
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Pricing</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Price (USD) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="99.99"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Original Price (USD) *</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="199.99"
                />
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Course Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">What You'll Learn (comma-separated)</label>
                <textarea
                  name="whatYouLearn"
                  value={formData.whatYouLearn}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Exploit web vulnerabilities, Perform penetration testing, etc."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Prerequisites (comma-separated)</label>
                <textarea
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Basic networking knowledge, Linux experience, etc."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Highlights (comma-separated)</label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Hands-on labs, Real-world scenarios, etc."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Target Audience (comma-separated)</label>
                <textarea
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Security professionals, Penetration testers, etc."
                />
              </div>
            </div>
          </div>

          {/* Instructor Information */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Instructor Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Instructor Name *</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Instructor Bio</label>
                <textarea
                  name="instructorBio"
                  value={formData.instructorBio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Brief biography of the instructor..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Instructor Credentials (comma-separated)</label>
                <input
                  type="text"
                  name="instructorCredentials"
                  value={formData.instructorCredentials}
                  onChange={handleChange}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="CEH, OSCP, CISSP, etc."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Instructor Avatar (Upload Image)</label>
                <input
                  type="file"
                  onChange={handleInstructorAvatarChange}
                  accept="image/*"
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-500 file:text-dark file:cursor-pointer"
                />
                {instructorAvatarFile && (
                  <p className="mt-2 text-green-400 text-sm">Selected: {instructorAvatarFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Media</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Thumbnail Image (Upload) *</label>
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  required={!formData.thumbnail}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-500 file:text-dark file:cursor-pointer"
                />
                {thumbnailFile && (
                  <p className="mt-2 text-green-400 text-sm">Selected: {thumbnailFile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Video Preview URL (optional)</label>
                <input
                  type="text"
                  name="videoPreviewUrl"
                  value={formData.videoPreviewUrl}
                  onChange={handleChange}
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Total Video Hours</label>
                <input
                  type="number"
                  name="totalVideoHours"
                  value={formData.totalVideoHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="20.5"
                />
              </div>
            </div>
          </div>

          {/* FAQs Builder */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">FAQs (Optional)</h2>
            <p className="text-gray-400 mb-4">Add frequently asked questions</p>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-dark border border-green-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-green-400">FAQ {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Question (e.g., What will I learn?)"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      className="w-full bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      rows={2}
                      className="w-full bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addFaq}
                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-semibold py-3 rounded-lg transition-colors"
              >
                + Add FAQ
              </button>
            </div>
          </div>

          {/* Seed Reviews Builder */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Testimonials / Initial Reviews (Optional)</h2>
            <p className="text-gray-400 mb-2 text-sm">⚠️ These are displayed as real reviews. Only use for beta testers or legitimate testimonials.</p>

            <div className="space-y-3">
              {seedReviews.map((review, index) => (
                <div key={index} className="bg-dark border border-green-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-green-400">Review {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeSeedReview(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Reviewer Name (e.g., John D.)"
                      value={review.name}
                      onChange={(e) => updateSeedReview(index, 'name', e.target.value)}
                      className="w-full bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                    />
                    <div className="flex gap-2 items-center">
                      <label className="text-gray-400 text-sm">Rating:</label>
                      <select
                        value={review.rating}
                        onChange={(e) => updateSeedReview(index, 'rating', parseFloat(e.target.value))}
                        className="bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                        <option value="4.5">⭐⭐⭐⭐½ (4.5)</option>
                        <option value="4">⭐⭐⭐⭐ (4)</option>
                        <option value="3.5">⭐⭐⭐½ (3.5)</option>
                        <option value="3">⭐⭐⭐ (3)</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Review text..."
                      value={review.review}
                      onChange={(e) => updateSeedReview(index, 'review', e.target.value)}
                      rows={3}
                      className="w-full bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSeedReview}
                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-semibold py-3 rounded-lg transition-colors"
              >
                + Add Review
              </button>
            </div>
          </div>

          {/* Curriculum Builder */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Course Curriculum</h2>
            <p className="text-gray-400 mb-4">Build your course structure with modules and lessons</p>

            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-dark border border-green-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-green-400">Module {moduleIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove Module
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="Module Title (e.g., Introduction to Hacking)"
                      value={module.title}
                      onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                      className="w-full bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 2 hours)"
                      value={module.duration}
                      onChange={(e) => updateModule(moduleIndex, 'duration', e.target.value)}
                      className="w-full bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                    />
                    <textarea
                      placeholder="Module Description (optional)"
                      value={module.description}
                      onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                      rows={2}
                      className="w-full bg-gray-900 border border-green-500/30 rounded px-3 py-2 text-white"
                    />
                  </div>

                  {/* Lessons */}
                  <div className="ml-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Lessons:</h4>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex gap-2 items-start bg-gray-900/50 p-3 rounded">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Lesson Title (e.g., Setting Up Your Lab)"
                            value={lesson.title}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                            className="w-full bg-gray-800 border border-green-500/20 rounded px-2 py-1 text-sm text-white"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Duration (e.g., 15 min)"
                              value={lesson.duration}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', e.target.value)}
                              className="flex-1 bg-gray-800 border border-green-500/20 rounded px-2 py-1 text-sm text-white"
                            />
                            <label className="flex items-center gap-1 text-xs text-gray-400">
                              <input
                                type="checkbox"
                                checked={lesson.isFree}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'isFree', e.target.checked)}
                              />
                              Free Preview
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="text-sm text-green-400 hover:text-green-300"
                    >
                      + Add Lesson
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addModule}
                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-semibold py-3 rounded-lg transition-colors"
              >
                + Add Module
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Course File (Upload to S3)</h2>
            <div>
              <label className="block text-gray-300 mb-2">
                Course File (ZIP/PDF) - Optional (can be added later)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".zip,.pdf,.rar"
                className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-500 file:text-dark file:cursor-pointer"
              />
              {file && (
                <p className="mt-2 text-green-400 text-sm">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="bg-dark border border-green-500/30 rounded-lg p-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-300">{uploadStatus}</span>
                <span className="text-green-400 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-dark font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (uploadStatus || 'Creating Course...') : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
