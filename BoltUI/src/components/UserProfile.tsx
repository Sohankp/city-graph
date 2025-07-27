import React, { useState } from 'react';
import { User, Edit3, Camera, MapPin, Calendar, Award, Settings, Bell, Shield, LogOut } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  avatar: string;
  location: string;
  joinDate: string;
  eventsUploaded: number;
  reputation: number;
  badges: string[];
}

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    location: 'Koramangala, Bangalore',
    joinDate: 'January 2024',
    eventsUploaded: 23,
    reputation: 4.8,
    badges: ['Verified Reporter', 'Community Helper', 'Early Adopter']
  });

  const [editForm, setEditForm] = useState(userData);

  const handleSave = () => {
    setUserData(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-gradient-to-r from-blue-200 to-indigo-200 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
              <Camera size={12} />
            </button>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="text-xl font-bold bg-transparent border-b-2 border-blue-300 focus:border-blue-600 outline-none"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="text-slate-600 bg-transparent border-b border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {userData.name}
                </h3>
                <p className="text-slate-600">{userData.email}</p>
              </div>
            )}
            <div className="flex items-center text-sm text-slate-500 mt-2">
              <MapPin size={14} className="mr-1" />
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="bg-transparent border-b border-slate-300 focus:border-blue-600 outline-none"
                />
              ) : (
                userData.location
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 text-sm shadow-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gradient-to-r from-slate-400 to-slate-500 text-white rounded-xl hover:from-slate-500 hover:to-slate-600 transition-all duration-200 text-sm shadow-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center text-sm shadow-lg"
              >
                <Edit3 size={14} className="mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              {userData.eventsUploaded}
            </div>
            <div className="text-sm text-blue-600">Events Uploaded</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              {userData.reputation}
            </div>
            <div className="text-sm text-emerald-600">Reputation</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
              {userData.badges.length}
            </div>
            <div className="text-sm text-amber-600">Badges</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
          <Award className="mr-2 text-amber-600" size={18} />
          Achievements
        </h4>
        <div className="flex flex-wrap gap-2">
          {userData.badges.map((badge, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200 shadow-sm"
            >
              🏆 {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
          <Settings className="mr-2 text-slate-600" size={18} />
          Settings
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
            <div className="flex items-center">
              <Bell className="mr-3 text-blue-600" size={16} />
              <span className="text-sm font-medium">Push Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
            <div className="flex items-center">
              <Shield className="mr-3 text-emerald-600" size={16} />
              <span className="text-sm font-medium">Privacy Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-200 shadow-sm hover:shadow-md">
            <Calendar className="mr-2" size={16} />
            View Activity History
          </button>
          <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            <LogOut className="mr-2" size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;