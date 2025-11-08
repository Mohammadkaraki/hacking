'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  active: boolean;
  featured: boolean;
  students: number;
  s3FileKey: string | null;
  fileSize: number | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchCourses();
    }
  }, [status, router]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');

      if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Remove from UI
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-green-400 text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link href="/" className="text-green-400 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage courses and content</p>
          </div>
          <Link
            href="/admin/courses/new"
            className="bg-green-500 hover:bg-green-600 text-dark font-bold px-6 py-3 rounded-lg transition-colors"
          >
            + Create New Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-bg border border-green-500/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Total Courses</p>
            <p className="text-3xl font-bold text-green-400">{courses.length}</p>
          </div>
          <div className="bg-card-bg border border-green-500/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Active Courses</p>
            <p className="text-3xl font-bold text-green-400">
              {courses.filter(c => c.active).length}
            </p>
          </div>
          <div className="bg-card-bg border border-green-500/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Featured Courses</p>
            <p className="text-3xl font-bold text-green-400">
              {courses.filter(c => c.featured).length}
            </p>
          </div>
          <div className="bg-card-bg border border-green-500/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Total Students</p>
            <p className="text-3xl font-bold text-green-400">
              {courses.reduce((sum, c) => sum + c.students, 0)}
            </p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-card-bg border border-green-500/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-500/10 border-b border-green-500/20">
                <tr>
                  <th className="text-left px-6 py-4 text-green-400 font-semibold">Title</th>
                  <th className="text-left px-6 py-4 text-green-400 font-semibold">Category</th>
                  <th className="text-left px-6 py-4 text-green-400 font-semibold">Price</th>
                  <th className="text-left px-6 py-4 text-green-400 font-semibold">Students</th>
                  <th className="text-left px-6 py-4 text-green-400 font-semibold">File Size</th>
                  <th className="text-left px-6 py-4 text-green-400 font-semibold">Status</th>
                  <th className="text-left px-6 py-4 text-green-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No courses yet. Create your first course!
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{course.title}</p>
                          {course.featured && (
                            <span className="text-xs text-yellow-400">⭐ Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{course.category}</td>
                      <td className="px-6 py-4 text-gray-300">${course.price}</td>
                      <td className="px-6 py-4 text-gray-300">{course.students}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatFileSize(course.fileSize)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {course.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/courses/edit/${course.id}`}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(course.id, course.title)}
                            className="text-red-400 hover:text-red-300 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
