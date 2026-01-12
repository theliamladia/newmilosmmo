import React, { useState, useEffect } from 'react';
import { User, Package, DollarSign, Users, Lock, Eye, EyeOff, Camera, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GameSystem() {
  const [currentView, setCurrentView] = useState('login');
  const [currentTab, setCurrentTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Game stats
  const [gameStats, setGameStats] = useState({
    money: 0,
    level: 1,
    experience: 0,
    workCooldown: 10,
    crimeCooldown: 10,
    crimeFailRate: 80,
  });
  
  // Cooldown timers
  const [cooldowns, setCooldowns] = useState({
    work: null,
    crime: null,
    slut: null,
  });
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [floatingMessages, setFloatingMessages] = useState([]);
  
  // Login form state
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // Registration form state
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    height: '',
    weight: '',
    profilePhoto: null
  });
  
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Cooldown countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const newCooldowns = { ...prev };
        Object.keys(newCooldowns).forEach(key => {
          if (newCooldowns[key] > 0) {
            newCooldowns[key]--;
          }
        });
        return newCooldowns;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
        await loadUserProfile(session.user.id);
        await loadGameStats(session.user.id);
        setCurrentView('main');
      }
    } catch (err) {
      console.error('Session check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setUserProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const loadGameStats = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // Create default stats if they don't exist
        const { data: newStats, error: createError } = await supabase
          .from('game_stats')
          .insert([{
            user_id: userId,
            money: 0,
            level: 1,
            experience: 0,
            work_cooldown: 10,
            crime_cooldown: 10,
            crime_fail_rate: 80
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        setGameStats({
          money: newStats.money,
          level: newStats.level,
          experience: newStats.experience,
          workCooldown: newStats.work_cooldown,
          crimeCooldown: newStats.crime_cooldown,
          crimeFailRate: newStats.crime_fail_rate,
        });
      } else {
        setGameStats({
          money: data.money,
          level: data.level,
          experience: data.experience,
          workCooldown: data.work_cooldown,
          crimeCooldown: data.crime_cooldown,
          crimeFailRate: data.crime_fail_rate,
        });
      }
    } catch (err) {
      console.error('Error loading game stats:', err);
    }
  };

  const updateGameStats = async (updates) => {
    try {
      const { error } = await supabase
        .from('game_stats')
        .update({
          money: updates.money,
          level: updates.level,
          experience: updates.experience,
          work_cooldown: updates.workCooldown,
          crime_cooldown: updates.crimeCooldown,
          crime_fail_rate: updates.crimeFailRate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      setGameStats(updates);
    } catch (err) {
      console.error('Error updating stats:', err);
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const addFloatingMessage = (message, x, y) => {
    const id = Date.now();
    setFloatingMessages(prev => [...prev, { id, message, x, y }]);
    setTimeout(() => {
      setFloatingMessages(prev => prev.filter(m => m.id !== id));
    }, 2000);
  };

  const handleBumWork = () => {
    if (cooldowns.work > 0) {
      addNotification(`Wait ${cooldowns.work}s before working again`, 'warning');
      return;
    }
    
    const payout = Math.floor(Math.random() * 10) + 1; // $1 to $10
    const newMoney = gameStats.money + payout;
    
    updateGameStats({
      ...gameStats,
      money: newMoney,
    });
    
    setCooldowns(prev => ({ ...prev, work: gameStats.workCooldown }));
    addNotification(`Earned $${payout} from work!`, 'success');
  };

  const handleCrime = () => {
    if (cooldowns.crime > 0) {
      addNotification(`Wait ${cooldowns.crime}s before committing crime again`, 'warning');
      return;
    }
    
    const success = Math.random() * 100 > gameStats.crimeFailRate;
    
    if (success) {
      const payout = Math.floor(Math.random() * 11) + 10; // $10 to $20
      const newMoney = gameStats.money + payout;
      
      updateGameStats({
        ...gameStats,
        money: newMoney,
      });
      
      addNotification(`Crime successful! Earned $${payout}`, 'success');
    } else {
      const loss = Math.floor(Math.random() * 11) + 10; // $10 to $20
      const newMoney = Math.max(0, gameStats.money - loss);
      
      updateGameStats({
        ...gameStats,
        money: newMoney,
      });
      
      addNotification(`Crime failed! Lost $${loss}`, 'error');
    }
    
    setCooldowns(prev => ({ ...prev, crime: gameStats.crimeCooldown }));
  };

  const handleSlut = (e) => {
    if (cooldowns.slut > 0) {
      addNotification(`Wait ${cooldowns.slut}s before doing this again`, 'warning');
      return;
    }
    
    // Add "AYO!" floating message at click position
    const rect = e.target.getBoundingClientRect();
    addFloatingMessage('AYO!', rect.left + rect.width / 2, rect.top);
    
    const payout = Math.floor(Math.random() * 51) + 50; // $50 to $100
    const newMoney = gameStats.money + payout;
    
    updateGameStats({
      ...gameStats,
      money: newMoney,
    });
    
    setCooldowns(prev => ({ ...prev, slut: 60 }));
    addNotification(`Earned $${payout}!`, 'success');
  };

  const upgradeWorkCooldown = () => {
    if (gameStats.money < 500) {
      addNotification('Need $500 to upgrade!', 'error');
      return;
    }
    
    if (gameStats.workCooldown <= 5) {
      addNotification('Work cooldown is already at maximum!', 'warning');
      return;
    }
    
    const newCooldown = Math.max(5, gameStats.workCooldown - 0.1);
    
    updateGameStats({
      ...gameStats,
      money: gameStats.money - 500,
      workCooldown: newCooldown,
    });
    
    addNotification(`Work cooldown reduced to ${newCooldown.toFixed(1)}s!`, 'success');
  };

  const upgradeCrimeFailRate = () => {
    if (gameStats.money < 500) {
      addNotification('Need $500 to upgrade!', 'error');
      return;
    }
    
    if (gameStats.crimeFailRate <= 40) {
      addNotification('Crime fail rate is already at minimum!', 'warning');
      return;
    }
    
    const newFailRate = Math.max(40, gameStats.crimeFailRate - 10);
    
    updateGameStats({
      ...gameStats,
      money: gameStats.money - 500,
      crimeFailRate: newFailRate,
    });
    
    addNotification(`Crime fail rate reduced to ${newFailRate}%!`, 'success');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const email = loginData.username.includes('@') ? loginData.username : `${loginData.username}@meetfighters.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: loginData.password,
      });
      
      if (error) throw error;
      
      setCurrentUser(data.user);
      await loadUserProfile(data.user.id);
      await loadGameStats(data.user.id);
      setCurrentView('main');
      setLoginData({ username: '', password: '' });
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!regData.firstName || !regData.lastName || !regData.username || !regData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    
    try {
      const email = regData.username.includes('@') ? regData.username : `${regData.username}@meetfighters.local`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: regData.password,
        options: {
          data: {
            username: regData.username,
            first_name: regData.firstName,
            last_name: regData.lastName,
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username: regData.username,
              first_name: regData.firstName,
              last_name: regData.lastName,
              height: regData.height,
              weight: regData.weight,
              profile_photo: photoPreview,
              created_at: new Date().toISOString()
            }
          ]);
        
        if (profileError) throw profileError;
        
        setCurrentUser(data.user);
        await loadUserProfile(data.user.id);
        await loadGameStats(data.user.id);
        setCurrentView('main');
        setRegData({ firstName: '', lastName: '', username: '', password: '', email: '', height: '', weight: '', profilePhoto: null });
        setPhotoPreview(null);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      setCurrentView('login');
      setCurrentTab('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

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
                <label className="block text-slate-300 text-sm font-medium mb-2">Username or Email</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                  placeholder="Enter username or email"
                  disabled={isLoading}
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
                    disabled={isLoading}
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentView('register')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                  disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                    placeholder="Create a password (min 6 characters)"
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                  disabled={isLoading}
                  className="flex-1 bg-slate-800 text-slate-300 font-semibold py-3 rounded-lg hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
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
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border flex items-center gap-2 animate-slideIn ${
              notif.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
              notif.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
              notif.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
              'bg-blue-500/20 border-blue-500/50 text-blue-400'
            }`}
          >
            {notif.type === 'success' && <CheckCircle size={20} />}
            {notif.type === 'error' && <XCircle size={20} />}
            {notif.type === 'warning' && <AlertCircle size={20} />}
            <span>{notif.message}</span>
          </div>
        ))}
      </div>

      {/* Floating Messages */}
      {floatingMessages.map(msg => (
        <div
          key={msg.id}
          className="fixed text-4xl font-bold text-yellow-400 animate-floatUp pointer-events-none z-50"
          style={{
            left: msg.x,
            top: msg.y,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            fontFamily: 'Orbitron, monospace'
          }}
        >
          {msg.message}
        </div>
      ))}
      
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, monospace' }}>
            MEETFIGHTERSmmo
          </h1>
          
          <div className="flex items-center gap-6">
            {/* Money Display */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
              <div className="text-green-400 text-sm">Money</div>
              <div className="text-white text-xl font-bold">${gameStats.money.toFixed(2)}</div>
            </div>
            
            <div className="flex items-center gap-3">
              {userProfile?.profile_photo && (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500">
                  <img src={userProfile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-right">
                <div className="text-white font-semibold">{userProfile?.first_name} {userProfile?.last_name}</div>
                <div className="text-slate-400 text-xs">@{userProfile?.username}</div>
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
              <h2 className="text-2xl font-bold text-white mb-4">Welcome Back, {userProfile?.first_name}!</h2>
              <div className="grid grid-cols-2 gap-4">
                {userProfile?.height && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Height</div>
                    <div className="text-white text-lg font-semibold">{userProfile.height}</div>
                  </div>
                )}
                {userProfile?.weight && (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Weight</div>
                    <div className="text-white text-lg font-semibold">{userProfile.weight}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="text-yellow-400 text-sm">Level</div>
                  <div className="text-white text-2xl font-bold">{gameStats.level}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-400 text-sm">Money</div>
                  <div className="text-white text-2xl font-bold">${gameStats.money.toFixed(2)}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-purple-400 text-sm">Experience</div>
                  <div className="text-white text-2xl font-bold">{gameStats.experience}</div>
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
              
              <div className="grid gap-6">
                {/* Bum Work */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-400 mb-2">Bum Work</h3>
                      <p className="text-slate-400 mb-3">Work without any training or job experience</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">💰 Payout: $1 - $10</p>
                        <p className="text-slate-300">⏱️ Cooldown: {gameStats.workCooldown.toFixed(1)}s {gameStats.workCooldown > 5 && '(upgradable to 5.0s)'}</p>
                      </div>
                    </div>
                    <DollarSign size={48} className="text-green-400" />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleBumWork}
                      disabled={cooldowns.work > 0}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                      {cooldowns.work > 0 ? `Wait ${cooldowns.work}s` : 'WORK'}
                    </button>
                    
                    {gameStats.workCooldown > 5 && (
                      <button
                        onClick={upgradeWorkCooldown}
                        disabled={gameStats.money < 500}
                        className="px-6 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <TrendingUp size={20} />
                        Upgrade ($500)
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Crime */}
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-red-400 mb-2">Crime</h3>
                      <p className="text-slate-400 mb-3">Lie, Cheat, and Steal</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">💰 Payout: $10 - $20 (on success)</p>
                        <p className="text-slate-300">💸 Loss: $10 - $20 (on fail)</p>
                        <p className="text-slate-300">🎲 Success Rate: {100 - gameStats.crimeFailRate}% {gameStats.crimeFailRate > 40 && '(upgradable to 60%)'}</p>
                        <p className="text-slate-300">⏱️ Cooldown: {gameStats.crimeCooldown}s</p>
                      </div>
                    </div>
                    <Users size={48} className="text-red-400" />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleCrime}
                      disabled={cooldowns.crime > 0}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                      {cooldowns.crime > 0 ? `Wait ${cooldowns.crime}s` : 'COMMIT CRIME'}
                    </button>
                    
                    {gameStats.crimeFailRate > 40 && (
                      <button
                        onClick={upgradeCrimeFailRate}
                        disabled={gameStats.money < 500}
                        className="px-6 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <TrendingUp size={20} />
                        Upgrade ($500)
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Slut */}
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-pink-400 mb-2">Slut</h3>
                      <p className="text-slate-400 mb-3">Be "various" and "fun"</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">💰 Payout: $50 - $100</p>
                        <p className="text-slate-300">⏱️ Cooldown: 60s</p>
                        <p className="text-slate-300">🚫 No upgrades available</p>
                      </div>
                    </div>
                    <User size={48} className="text-pink-400" />
                  </div>
                  
                  <button
                    onClick={handleSlut}
                    disabled={cooldowns.slut > 0}
                    className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
                  >
                    {cooldowns.slut > 0 ? `Wait ${cooldowns.slut}s` : 'DO THE THING'}
                  </button>
                </div>
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
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes floatUp {
          from { 
            opacity: 1; 
            transform: translate(-50%, -50%);
          }
          to { 
            opacity: 0; 
            transform: translate(-50%, -200px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-floatUp {
          animation: floatUp 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}