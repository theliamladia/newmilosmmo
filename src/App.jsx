import React, { useState, useEffect } from 'react';
import { User, Package, DollarSign, Users, Lock, Eye, EyeOff, Camera } from 'lucide-react';

export default function GameSystem() {
  const [currentView, setCurrentView] = useState('login');
  const [currentTab, setCurrentTab] = useState('home');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // Registration form state
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    height: '',
    weight: '',
    profilePhoto: null
  });
  
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load users from storage on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const stored = localStorage.getItem('game-users');
      if (stored) {
        setUsers(JSON.parse(stored));
      }
    } catch (err) {
      console.log('No users found yet');
    }
  };

  const saveUsers = (userList) => {
    try {
      localStorage.setItem('game-users', JSON.stringify(userList));
    } catch (err) {
      console.error('Failed to save users:', err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const user = users.find(u => u.username === loginData.username && u.password === loginData.password);
    
    if (user) {
      setCurrentUser(user);
      setCurrentView('main');
      setLoginData({ username: '', password: '' });
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!regData.firstName || !regData.lastName || !regData.username || !regData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (users.some(u => u.username === regData.username)) {
      setError('Username already exists');
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      firstName: regData.firstName,
      lastName: regData.lastName,
      username: regData.username,
      password: regData.password,
      height: regData.height,
      weight: regData.weight,
      profilePhoto: photoPreview,
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    setCurrentUser(newUser);
    setCurrentView('main');
    setRegData({ firstName: '', lastName: '', username: '', password: '', height: '', weight: '', profilePhoto: null });
    setPhotoPreview(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setCurrentTab('home');
  };

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, monospace' }}>
              MEETFIGHTERSmmo
            </h1>
            <p className="text-slate-400 text-sm tracking-widest">GAMING STRATEGIES</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-slideUp">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20"
              >
                LOGIN
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentView('register')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                >
                  Don't have an account? <span className="font-semibold">Create one</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          
          .animate-slideUp {
            animation: slideUp 0.6s ease-out 0.2s both;
          }
        `}</style>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, monospace' }}>
              CREATE ACCOUNT
            </h1>
            <p className="text-slate-400 text-sm tracking-widest">JOIN MEETFIGHTERSmmo</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-slideUp">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={regData.firstName}
                    onChange={(e) => setRegData({...regData, firstName: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="John"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={regData.lastName}
                    onChange={(e) => setRegData({...regData, lastName: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Username *</label>
                <input
                  type="text"
                  value={regData.username}
                  onChange={(e) => setRegData({...regData, username: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  placeholder="Choose a username"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regData.password}
                    onChange={(e) => setRegData({...regData, password: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Height</label>
                  <input
                    type="text"
                    value={regData.height}
                    onChange={(e) => setRegData({...regData, height: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="5'10&quot;"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Weight</label>
                  <input
                    type="text"
                    value={regData.weight}
                    onChange={(e) => setRegData({...regData, weight: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    placeholder="160 lbs"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-500">
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 hover:border-yellow-500 transition-all flex items-center gap-2">
                      <Camera size={20} />
                      <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('login');
                    setError('');
                  }}
                  className="flex-1 bg-slate-800 text-slate-300 font-semibold py-3 rounded-lg hover:bg-slate-700 transition-all duration-200"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20"
                >
                  CREATE ACCOUNT
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          
          .animate-slideUp {
            animation: slideUp 0.6s ease-out 0.2s both;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, monospace' }}>
            MEETFIGHTERSmmo
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {currentUser.profilePhoto && (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500">
                  <img src={currentUser.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-right">
                <div className="text-white font-semibold">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-slate-400 text-xs">@{currentUser.username}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <Lock size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 ${
                currentTab === 'home'
                  ? 'bg-yellow-500/10 text-yellow-400 border-b-2 border-yellow-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <User size={20} />
              Home
            </button>
            
            <button
              onClick={() => setCurrentTab('inventory')}
              className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 ${
                currentTab === 'inventory'
                  ? 'bg-yellow-500/10 text-yellow-400 border-b-2 border-yellow-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Package size={20} />
              Inventory
            </button>
            
            <button
              onClick={() => setCurrentTab('activities')}
              className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 ${
                currentTab === 'activities'
                  ? 'bg-yellow-500/10 text-yellow-400 border-b-2 border-yellow-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <DollarSign size={20} />
              Activities
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome Back, {currentUser.firstName}!</h2>
              <div className="grid grid-cols-2 gap-4">
                {currentUser.height && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Height</div>
                    <div className="text-white text-lg font-semibold">{currentUser.height}</div>
                  </div>
                )}
                {currentUser.weight && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Weight</div>
                    <div className="text-white text-lg font-semibold">{currentUser.weight}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="text-yellow-400 text-sm">Level</div>
                  <div className="text-white text-2xl font-bold">1</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-400 text-sm">Money</div>
                  <div className="text-white text-2xl font-bold">$0</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-purple-400 text-sm">Items</div>
                  <div className="text-white text-2xl font-bold">0</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentTab === 'inventory' && (
          <div className="animate-fadeIn">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Inventory</h2>
              <div className="text-center py-12">
                <Package size={64} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">Your inventory is empty</p>
                <p className="text-slate-500 text-sm mt-2">Complete activities to earn items</p>
              </div>
            </div>
          </div>
        )}
        
        {currentTab === 'activities' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Activities</h2>
              
              <div className="grid gap-4">
                <button className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500 rounded-xl p-6 text-left transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-2">Work</h3>
                      <p className="text-slate-400">Earn money through legitimate means</p>
                    </div>
                    <DollarSign size={32} className="text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                </button>
                
                <button className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 hover:border-red-500 rounded-xl p-6 text-left transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-red-400 mb-2">Crime</h3>
                      <p className="text-slate-400">High risk, high reward activities</p>
                    </div>
                    <Users size={32} className="text-red-400 group-hover:scale-110 transition-transform" />
                  </div>
                </button>
                
                <button className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 hover:border-pink-500 rounded-xl p-6 text-left transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-pink-400 mb-2">Slut</h3>
                      <p className="text-slate-400">Adult entertainment activities</p>
                    </div>
                    <User size={32} className="text-pink-400 group-hover:scale-110 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
