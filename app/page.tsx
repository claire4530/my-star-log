'use client';

import React, { useState, useRef } from 'react';
import { Heart, Calendar, Settings, Image as ImageIcon, Upload, Camera } from 'lucide-react';

// --- 設定主題色系配置 ---
// 這裡定義了不同主題對應的 Tailwind class
const THEMES = {
  pink: {
    name: '甜美粉',
    bg: 'bg-pink-50',
    primary: 'bg-pink-500',
    text: 'text-pink-600',
    light: 'bg-pink-100',
    border: 'border-pink-200',
    gradient: 'from-pink-400 to-rose-400',
  },
  blue: {
    name: '寧靜藍',
    bg: 'bg-sky-50',
    primary: 'bg-sky-500',
    text: 'text-sky-600',
    light: 'bg-sky-100',
    border: 'border-sky-200',
    gradient: 'from-sky-400 to-blue-500',
  },
  purple: {
    name: '夢幻紫',
    bg: 'bg-purple-50',
    primary: 'bg-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-100',
    border: 'border-purple-200',
    gradient: 'from-purple-400 to-indigo-500',
  },
  black: {
    name: '酷帥黑',
    bg: 'bg-zinc-100', // 為了閱讀性，背景用淺灰，其他用黑
    primary: 'bg-zinc-900',
    text: 'text-zinc-800',
    light: 'bg-zinc-200',
    border: 'border-zinc-300',
    gradient: 'from-zinc-700 to-black',
  },
};

export default function StarLogApp() {
  // --- 狀態管理 (State) ---
  const [currentTheme, setCurrentTheme] = useState<keyof typeof THEMES>('pink');
  const [activeTab, setActiveTab] = useState<'timeline' | 'wallet'>('timeline');
  const [showSettings, setShowSettings] = useState(false);
  
  // 預設封面圖與頭像 (可以使用預設圖或空字串)
  const [coverImage, setCoverImage] = useState<string>('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop');
  
  // 隱藏的檔案輸入框 Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 取得當前主題樣式
  const t = THEMES[currentTheme];

  // --- 處理圖片上傳 ---
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 建立一個暫時的 URL 來預覽圖片
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  return (
    <div className={`min-h-screen ${t.bg} flex justify-center items-start pt-0 md:pt-10 transition-colors duration-500`}>
      
      {/* 手機容器 */}
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[850px] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* --- 頂部 Header 區域 (可換圖) --- */}
        <div className="relative h-64 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {/* 封面圖 */}
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          
          {/* 遮罩與更換提示 */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
             <div className="opacity-0 group-hover:opacity-100 text-white flex flex-col items-center gap-2 transition-opacity">
               <Camera size={32} />
               <span className="text-sm font-bold">更換封面</span>
             </div>
          </div>
          
          {/* 隱藏的 input 用於上傳 */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* 設定按鈕 */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* --- 個性化設定面板 (條件渲染) --- */}
        {showSettings && (
          <div className="bg-white border-b border-gray-100 p-4 animate-in slide-in-from-top-4">
            <h3 className="text-sm font-bold text-gray-500 mb-3">選擇主題風格</h3>
            <div className="flex gap-3">
              {Object.entries(THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key as any)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform active:scale-95 ${
                    currentTheme === key ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: key === 'black' ? '#333' : key === 'pink' ? '#ec4899' : key === 'blue' ? '#0ea5e9' : '#a855f7' }}
                  title={theme.name}
                >
                  {currentTheme === key && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- 內容資訊區 --- */}
        <div className="flex-1 bg-white relative -mt-6 rounded-t-[2rem] px-6 pt-8 pb-20">
          
          {/* 標題與入坑天數 */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">My StarLog</h1>
              <p className="text-slate-400 text-sm mt-1">追星紀錄本</p>
            </div>
            <div className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${t.gradient} text-white text-center shadow-lg shadow-gray-200`}>
              <p className="text-xs opacity-90">已入坑</p>
              <p className="text-2xl font-black font-mono">1,024 <span className="text-xs font-normal">天</span></p>
            </div>
          </div>

          {/* 切換分頁按鈕 */}
          <div className="flex p-1 bg-gray-100/80 rounded-2xl mb-6">
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'timeline' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Calendar size={16} /> 回憶
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'wallet' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Heart size={16} /> 票夾
            </button>
          </div>

          {/* --- 分頁內容：回憶時間軸 --- */}
          {activeTab === 'timeline' && (
            <div className="space-y-5 animate-in fade-in duration-500">
              {[1, 2].map((item) => (
                <div key={item} className={`group bg-white p-4 rounded-2xl border ${t.border} shadow-sm hover:shadow-md transition`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${t.light} ${t.text}`}>CONCERT</span>
                      <span className="text-slate-300 text-xs">2024.04.06</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">H.E.R. World Tour 台北站</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">
                    真的不敢相信能親眼見到！開場音樂一下全身雞皮疙瘩...
                  </p>
                  <div className="h-32 bg-slate-100 rounded-xl w-full flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-200">
                    <ImageIcon size={20} />
                    <span className="text-xs">點擊上傳照片 (Demo)</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- 分頁內容：票根夾 --- */}
          {activeTab === 'wallet' && (
            <div className="space-y-4 animate-in fade-in duration-500">
               <div className="relative bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex">
                  {/* 左側票根 */}
                  <div className="flex-1 p-5 border-r-2 border-dashed border-slate-200 relative">
                    {/* 裝飾圓點 */}
                    <div className="absolute -right-[7px] -top-[7px] w-3 h-3 bg-white border border-slate-100 rounded-full z-10"></div>
                    <div className="absolute -right-[7px] -bottom-[7px] w-3 h-3 bg-white border border-slate-100 rounded-full z-10"></div>
                    
                    <h3 className="font-bold text-slate-800 text-lg">WORLD TOUR</h3>
                    <p className={`${t.text} font-bold text-xs uppercase tracking-wider mb-2`}>Taipei Arena</p>
                    <p className="text-slate-400 text-xs mt-3">2024.04.06 • 19:30</p>
                  </div>
                  
                  {/* 右側座位 */}
                  <div className={`${t.light} w-24 p-2 flex flex-col justify-center items-center text-center`}>
                    <span className="text-[10px] text-slate-400 uppercase">ZONE</span>
                    <span className="font-bold text-slate-700">A1</span>
                    <div className="h-[1px] w-8 bg-slate-300 my-2"></div>
                    <span className="text-xl font-black text-slate-800">18</span>
                  </div>
              </div>
              
              <button className={`w-full py-4 rounded-xl border-2 border-dashed ${t.border} ${t.text} text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition`}>
                <Upload size={16} /> 新增票根
              </button>
            </div>
          )}
        </div>

        {/* 底部 FAB 按鈕 */}
        <button className={`absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg ${t.primary} shadow-gray-400/50 flex items-center justify-center text-white transition hover:scale-110 active:scale-95`}>
          <Calendar size={24} />
        </button>

      </div>
    </div>
  );
}