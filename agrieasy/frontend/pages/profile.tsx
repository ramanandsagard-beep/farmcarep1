import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, token, setToken, setUser } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [token, router]);

  useEffect(() => {
    loadProfile();
  }, [user]);

  // Debug: Log current user data
  useEffect(() => {
    if (user) {
      console.log('🎯 Profile: Current user data from AuthContext:', {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: token ? 'present' : 'missing'
      });
    }
  }, [user, token]);

  const loadProfile = async () => {
    try {
      console.log('📋 Profile: Loading profile, user:', user);
      console.log('📋 Profile: Current token:', token ? 'present' : 'missing');

      if (user) {
        // Use data from AuthContext if available
        const profileData = {
          id: user.id || '',
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || '',
          createdAt: user.createdAt || new Date().toISOString()
        };

        console.log('📋 Profile: Setting profile data:', profileData);
        setProfile(profileData);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
        console.log('📋 Profile: Set profile from user:', user);
      } else {
        console.log('📋 Profile: No user available');
      }
    } catch (error) {
      console.error('📋 Profile: Failed to load profile:', error);
    }
    setLoading(false);
  };

  const validateForm = () => {
    const errors = { name: '', email: '', phone: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!formData.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (formData.phone.trim().length < 10) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUpdating(true);
    setMessage(null);

    try {
      // Update profile via API
      const response = await api('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      }, token || undefined);

      if (response.success) {
        // Update the user in AuthContext
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        } as any);

        // Update local profile state
        setProfile({
          ...profile,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        } as UserProfile);

        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
      }

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to update profile'
      });
    }

    setUpdating(false);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.clear();
    sessionStorage.clear();

    // Clear the AuthContext state
    setToken(null);
    setUser(null);

    // Force redirect to login page
    window.location.href = '/auth/signin';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <button
            onClick={() => router.push('/login')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-green-100">Manage your account information</p>
              </div>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  (() => {
                    const isDemoData =
                      profile?.name?.toLowerCase().includes('demo') ||
                      profile?.name?.toLowerCase().includes('test') ||
                      profile?.name?.toLowerCase().includes('user') ||
                      profile?.name?.toLowerCase().includes('sample') ||
                      profile?.email?.toLowerCase().includes('demo') ||
                      profile?.email?.toLowerCase().includes('example') ||
                      profile?.email?.toLowerCase().includes('test') ||
                      profile?.email?.toLowerCase().includes('sample') ||
                      profile?.phone?.includes('9876543210') ||
                      profile?.phone?.includes('1234567890') ||
                      profile?.phone?.includes('0000000000') ||
                      (profile?.email?.includes('agrihub.com') && profile?.name?.includes('System')) ||
                      profile?.name === 'Demo User' ||
                      profile?.email === 'demo@example.com' ||
                      profile?.phone === '+91 9876543210';
                    return isDemoData;
                  })()
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {(() => {
                  const isDemoData =
                    profile?.name?.toLowerCase().includes('demo') ||
                    profile?.name?.toLowerCase().includes('test') ||
                    profile?.name?.toLowerCase().includes('user') ||
                    profile?.name?.toLowerCase().includes('sample') ||
                    profile?.email?.toLowerCase().includes('demo') ||
                    profile?.email?.toLowerCase().includes('example') ||
                    profile?.email?.toLowerCase().includes('test') ||
                    profile?.email?.toLowerCase().includes('sample') ||
                    profile?.phone?.includes('9876543210') ||
                    profile?.phone?.includes('1234567890') ||
                    profile?.phone?.includes('0000000000') ||
                    (profile?.email?.includes('agrihub.com') && profile?.name?.includes('System')) ||
                    profile?.name === 'Demo User' ||
                    profile?.email === 'demo@example.com' ||
                    profile?.phone === '+91 9876543210';
                  return isDemoData;
                })()
                  ? '🚨 Fix Demo Data - Logout'
                  : 'Logout'
                }
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdate} className="p-6">
            {/* Success/Error Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Debug Information */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Debug Information (Click to expand)</summary>
                <div className="mt-2 space-y-1">
                  <p><strong>User ID:</strong> {profile?.id || 'Not available'}</p>
                  <p><strong>Token Status:</strong> {token ? 'Valid' : 'Missing'}</p>
                  <p><strong>Data Source:</strong> {user ? 'JWT Token' : 'API Call'}</p>
                  <p><strong>Raw Data:</strong></p>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify({ id: profile?.id, name: profile?.name, email: profile?.email, phone: profile?.phone, role: profile?.role }, null, 2)}
                  </pre>
                </div>
              </details>
            </div>

            {/* Demo Data Warning */}
            {(() => {
              const isDemoData =
                profile?.name?.toLowerCase().includes('demo') ||
                profile?.name?.toLowerCase().includes('test') ||
                profile?.name?.toLowerCase().includes('user') ||
                profile?.name?.toLowerCase().includes('sample') ||
                profile?.email?.toLowerCase().includes('demo') ||
                profile?.email?.toLowerCase().includes('example') ||
                profile?.email?.toLowerCase().includes('test') ||
                profile?.email?.toLowerCase().includes('sample') ||
                profile?.phone?.includes('9876543210') ||
                profile?.phone?.includes('1234567890') ||
                profile?.phone?.includes('0000000000') ||
                (profile?.email?.includes('agrihub.com') && profile?.name?.includes('System')) ||
                profile?.name === 'Demo User' ||
                profile?.email === 'demo@example.com' ||
                profile?.phone === '+91 9876543210';

              console.log('🚨 Profile: Demo data detection result:', {
                profileData: {
                  name: profile?.name,
                  email: profile?.email,
                  phone: profile?.phone,
                  role: profile?.role
                },
                detectionPatterns: {
                  nameDemo: profile?.name?.toLowerCase().includes('demo'),
                  nameTest: profile?.name?.toLowerCase().includes('test'),
                  nameUser: profile?.name?.toLowerCase().includes('user'),
                  emailDemo: profile?.email?.toLowerCase().includes('demo'),
                  emailExample: profile?.email?.toLowerCase().includes('example'),
                  phone987: profile?.phone?.includes('9876543210'),
                  phone123: profile?.phone?.includes('1234567890'),
                  exactName: profile?.name === 'Demo User',
                  exactEmail: profile?.email === 'demo@example.com',
                  exactPhone: profile?.phone === '+91 9876543210',
                  agrihubSystem: profile?.email?.includes('agrihub.com') && profile?.name?.includes('System')
                },
                isDemoData
              });

              return isDemoData ? (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="font-medium">🚨 Demo Data Detected!</p>
                      <p className="text-sm">You are logged in with demo/test data. Your profile shows: <strong>{profile?.name}</strong> ({profile?.email})</p>
                      <p className="text-sm">Click below to logout and login with your real account.</p>
                      <button
                        onClick={handleLogout}
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                      >
                        🚪 Logout & Login with Real Account
                      </button>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Profile Info Display */}
            {profile && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Current Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{profile.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile.email || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profile.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">
                        {profile.role.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">{profile.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Update Form */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Update Information</h3>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
