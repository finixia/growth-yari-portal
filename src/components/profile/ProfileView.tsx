import React, { useState, useEffect } from 'react';
import { Camera, Edit, MapPin, Link, Star, Calendar, Award, Save, X, Clock, Upload, Loader } from 'lucide-react';
import { User } from '../../types';
import { apiClient } from '../../config/api';
import { AvailabilityManager } from './AvailabilityManager';

interface ProfileViewProps {
  user: User;
  onUserUpdate?: (user: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user: initialUser, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [editedUser, setEditedUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  // Load user profile data and stats
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load user stats
        const statsResult = await apiClient.getDashboardStats();
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data.stats);
        }

        // Load recent activity
        const activityResult = await apiClient.getRecentActivity();
        if (activityResult.success && activityResult.data) {
          setRecentActivity(activityResult.data.activities);
        }

        // Refresh current user data
        const userResult = await apiClient.getCurrentUser();
        if (userResult.success && userResult.data) {
          setUser(userResult.data.user);
          setEditedUser(userResult.data.user);
          setCoverPhoto(userResult.data.user.cover_photo || null);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const updateData = {
        name: editedUser.name,
        profession: editedUser.profession,
        bio: editedUser.bio,
        expertise: editedUser.expertise,
        social_links: editedUser.socialLinks,
        cover_photo: coverPhoto
      };

      const result = await apiClient.updateProfile(updateData);
      if (result.success && result.data) {
        setUser(result.data.user);
        setEditedUser(result.data.user);
        // Update the user in the parent component (App.tsx)
        if (onUserUpdate) {
          onUserUpdate(result.data.user);
        }
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setError(null);
  };

  const handleExpertiseChange = (expertiseString: string) => {
    const expertise = expertiseString.split(',').map(skill => skill.trim()).filter(Boolean);
    setEditedUser(prev => ({ ...prev, expertise }));
  };

  const handleSocialLinksChange = (platform: string, url: string) => {
    setEditedUser(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url
      }
    }));
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true);
      setError(null);
      
      console.log('Uploading avatar:', file.name);
      const result = await apiClient.uploadFile(file);
      
      if (result.success && result.data) {
        // Update user avatar
        const updateResult = await apiClient.updateProfile({ avatar: result.data.url });
        if (updateResult.success && updateResult.data) {
          setUser(updateResult.data.user);
          setEditedUser(updateResult.data.user);
          if (onUserUpdate) {
            onUserUpdate(updateResult.data.user);
          }
          console.log('Avatar updated successfully');
        } else {
          setError('Failed to update avatar');
        }
      } else {
        setError(result.error || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      setUploadingCover(true);
      setError(null);
      
      console.log('Uploading cover photo:', file.name);
      const result = await apiClient.uploadFile(file);
      
      if (result.success && result.data) {
        // Update user cover photo (you might need to add this field to your user model)
        console.log('Cover photo uploaded:', result.data.url);
        setCoverPhoto(result.data.url);
        
        // Update user profile with new cover photo
        const updateResult = await apiClient.updateProfile({ cover_photo: result.data.url });
        if (updateResult.success && updateResult.data) {
          setUser(updateResult.data.user);
          setEditedUser(updateResult.data.user);
          if (onUserUpdate) {
            onUserUpdate(updateResult.data.user);
          }
          console.log('Cover photo updated successfully');
        } else {
          setError('Failed to update cover photo');
        }
      } else {
        setError(result.error || 'Failed to upload cover photo');
      }
    } catch (error) {
      console.error('Cover upload error:', error);
      setError('Failed to upload cover photo');
    } finally {
      setUploadingCover(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      {/* Error Message */}
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
        {/* Cover Photo */}
        <div className="h-32 sm:h-48 relative overflow-hidden">
          {coverPhoto || user.cover_photo ? (
            <img
              src={coverPhoto || user.cover_photo}
              alt="Cover photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-brand-primary to-brand-secondary" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          
          {/* Cover Photo Upload */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
              className="hidden"
              id="cover-upload"
            />
            <label
              htmlFor="cover-upload"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black bg-opacity-40 backdrop-blur-sm rounded-full hover:bg-opacity-60 transition-all cursor-pointer shadow-lg border-2 border-white border-opacity-30"
              title="Change cover photo"
            >
              {uploadingCover ? (
                <Loader className="h-5 sm:h-6 w-5 sm:w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
              )}
            </label>
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-12 sm:-mt-16">
            {/* Profile Picture */}
            <div className="relative mx-auto sm:mx-0 mb-4 sm:mb-0 flex-shrink-0">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2d5016&color=fff&size=128`}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white shadow-xl"
              />
              
              {/* Avatar Upload */}
              <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary text-white rounded-full hover:bg-brand-secondary transition-all cursor-pointer shadow-lg border-2 border-white"
                  title="Change profile picture"
                >
                  {uploadingAvatar ? (
                    <Loader className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                  ) : (
                    <Camera className="h-4 sm:h-5 w-4 sm:w-5" />
                  )}
                </label>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left pt-4 sm:pt-8 lg:pt-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-3 lg:space-y-0">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{user.profession || 'Professional'}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center space-x-2 px-4 sm:px-5 py-2 sm:py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors text-sm sm:text-base font-medium shadow-lg hover:shadow-xl"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setShowAvailability(true)}
                    className="flex items-center justify-center space-x-2 px-4 sm:px-5 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium shadow-lg hover:shadow-xl"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Manage Availability</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 text-sm sm:text-base lg:text-lg">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Star className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
                  <span className="font-medium">{user.rating || 0}</span>
                  <span className="text-gray-500">({user.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
                  <span className="text-gray-600">{stats?.sessions || 0} sessions completed</span>
                </div>
                {user.isVerified && (
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Award className="h-4 sm:h-5 w-4 sm:w-5 text-green-500" />
                    <span className="text-green-600">Verified Expert</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4 text-sm sm:text-base lg:text-lg text-center sm:text-left leading-relaxed">
                {user.bio || 'No bio available yet.'}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start mb-4">
                {user.expertise && user.expertise.length > 0 ? (
                  user.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-brand-primary/10 text-brand-primary rounded-full text-xs sm:text-sm lg:text-base font-medium cursor-pointer hover:bg-brand-primary/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No expertise areas added yet.</span>
                )}
              </div>

              {/* Social Links */}
              {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-sm sm:text-base">
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {user.socialLinks.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700 transition-colors flex items-center space-x-1"
                    >
                      <Link className="h-4 w-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-primary/10 rounded-xl">
                <Calendar className="h-6 w-6 text-brand-primary" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-1">{stats.sessions || 0}</h3>
            <p className="text-sm text-gray-600">Total Sessions</p>
            <p className="text-xs text-gray-500 mt-1">Sessions completed</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{stats.connections || 0}</h3>
            <p className="text-sm text-gray-600">Connections</p>
            <p className="text-xs text-gray-500 mt-1">Professional connections</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{stats.postsCount || 0}</h3>
            <p className="text-sm text-gray-600">Posts</p>
            <p className="text-xs text-gray-500 mt-1">Posts shared</p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                  activity.type === 'session' ? 'bg-blue-500' :
                  activity.type === 'review' ? 'bg-yellow-500' :
                  activity.type === 'booking' ? 'bg-green-500' :
                  'bg-purple-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">{activity.message}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-500 text-sm">No recent activity to display.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6 my-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Profession</label>
                <input
                  type="text"
                  value={editedUser.profession || ''}
                  onChange={(e) => setEditedUser({...editedUser, profession: e.target.value})}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  rows={4}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none text-sm sm:text-base"
                  placeholder="Tell others about yourself and your professional background..."
                />
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Expertise (comma-separated)</label>
                <p className="text-xs text-gray-500 mb-2">
                  Add skills like: Business Coach, Tech Developer, UX Design, Marketing Strategy, Data Analysis, etc.
                </p>
                <input
                  type="text"
                  value={editedUser.expertise ? editedUser.expertise.join(', ') : ''}
                  onChange={(e) => handleExpertiseChange(e.target.value)}
                  placeholder="e.g., Business Coach, Leadership Development, Strategic Planning"
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Social Links</label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={editedUser.socialLinks?.linkedin || ''}
                    onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
                    placeholder="LinkedIn profile URL"
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm sm:text-base"
                  />
                  <input
                    type="url"
                    value={editedUser.socialLinks?.twitter || ''}
                    onChange={(e) => handleSocialLinksChange('twitter', e.target.value)}
                    placeholder="Twitter profile URL"
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm sm:text-base"
                  />
                  <input
                    type="url"
                    value={editedUser.socialLinks?.website || ''}
                    onChange={(e) => handleSocialLinksChange('website', e.target.value)}
                    placeholder="Personal website URL"
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Manager */}
      <AvailabilityManager
        userId={user.id}
        isOpen={showAvailability}
        onClose={() => setShowAvailability(false)}
      />
    </div>
  );
};