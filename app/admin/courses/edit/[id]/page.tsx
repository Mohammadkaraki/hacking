'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);

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
    active: true,
    prerequisites: '',
    whatYouLearn: '',
    highlights: '',
    targetAudience: '',
    instructorCredentials: '',
    videoPreviewUrl: '',
    instructorBio: '',
    instructorAvatar: '',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCourse();
    }
  }, [status, courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch course');

      const course = await response.json();

      // Convert arrays to comma-separated strings for form
      setFormData({
        title: course.title || '',
        description: course.description || '',
        thumbnail: course.thumbnail || '',
        difficulty: course.difficulty || 'Beginner',
        duration: course.duration || '',
        lessons: course.lessons || 0,
        price: course.price || 0,
        originalPrice: course.originalPrice || 0,
        category: course.category || 'Web Security',
        instructor: course.instructor || '',
        featured: course.featured || false,
        active: course.active !== false,
        prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(', ') : '',
        whatYouLearn: Array.isArray(course.whatYouLearn) ? course.whatYouLearn.join(', ') : '',
        highlights: Array.isArray(course.highlights) ? course.highlights.join(', ') : '',
        targetAudience: Array.isArray(course.targetAudience) ? course.targetAudience.join(', ') : '',
        instructorCredentials: Array.isArray(course.instructorCredentials) ? course.instructorCredentials.join(', ') : '',
        videoPreviewUrl: course.videoPreviewUrl || '',
        instructorBio: course.instructorBio || '',
        instructorAvatar: course.instructorAvatar || '',
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Failed to load course');
    } finally {
      setFetching(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'featured' || key === 'active') {
          formDataToSend.append(key, value ? 'true' : 'false');
        } else if (['prerequisites', 'whatYouLearn', 'highlights', 'targetAudience', 'instructorCredentials'].includes(key)) {
          const array = value.toString().split(',').map(item => item.trim()).filter(item => item);
          formDataToSend.append(key, JSON.stringify(array));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      if (file) {
        formDataToSend.append('file', file);
      }

      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update course');
      }

      alert('Course updated successfully!');
      router.push('/admin');
    } catch (error: any) {
      console.error('Error updating course:', error);
      alert(error.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || fetching) {
    return <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-green-400">Loading course...</div>
    </div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Edit Course</h1>
          <p className="text-gray-400">Update course information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card-bg border border-green-500/20 rounded-lg p-8 space-y-6">
          {/* Basic Information - Same as create form */}
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

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Lessons *</label>
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

                <div className="flex flex-col gap-2">
                  <label className="text-gray-300">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Featured
                  </label>
                  <label className="text-gray-300">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Active
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
                <label className="block text-gray-300 mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Original Price *</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Instructor</h2>
            <div>
              <label className="block text-gray-300 mb-2">Instructor Name *</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Media */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Media</h2>
            <div>
              <label className="block text-gray-300 mb-2">Thumbnail URL *</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                required
                className="w-full bg-dark border border-green-500/30 rounded px-4 py-2 text-white focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Replace Course File (Optional)</h2>
            <div>
              <label className="block text-gray-300 mb-2">
                Upload New File (leave empty to keep existing)
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

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-dark font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Course'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
