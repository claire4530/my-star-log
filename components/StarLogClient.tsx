'use client';

import React, { useState } from 'react';
import { Heart, Calendar, Settings, Image as ImageIcon, Upload, Plus } from 'lucide-react';
import { createPost, updateConfig } from '@/app/actions'; // 引入剛剛寫的後端功能

// 這裡接收從 page.tsx 傳來的真實資料
export default function StarLogClient({ posts, config }: { posts: any[], config: any }) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // 簡單的 Loading 狀態

  // 使用資料庫的設定，如果沒有就用預設值
  const themeColor = config?.themeColor || '#ec4899';
  const coverImage = config?.coverImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

  // 處理表單提交的簡單函數
  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    await createPost(formData);
    setIsUploading(false);
    alert('發布成功！');
  }

  async function handleConfigSave(formData: FormData) {
    setIsUploading(true);
    await updateConfig(formData);
    setIsUploading(false);
    setShowSettings(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-0 md:pt-10 transition-colors duration-500"
         style={{ backgroundColor: `${themeColor}15` }}> {/* 背景色是主題色的淺色版 */}
      
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[850px] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* --- Header & Cover --- */}
        <div className="relative h-64">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* --- 設定面板 (可以選任意顏色) --- */}
        {showSettings && (
          <form action={handleConfigSave} className="bg-white p-4 border-b border-gray-100 animate-in slide-in-from-top-4">
            <h3 className="font-bold mb-2">外觀設定</h3>
            
            <label className="block text-sm text-gray-500 mb-1">主題顏色 (自由選)</label>
            <div className="flex gap-2 mb-4">
               <input type="color" name="color" defaultValue={themeColor} className="h-10 w-full cursor-pointer"/>
            </div>

            <label className="block text-sm text-gray-500 mb-1">更換封面圖</label>
            <input type="file" name="coverImage" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 mb-4"/>
            
            <button disabled={isUploading} className="w-full bg-slate-900 text-white py-2 rounded-lg">
              {isUploading ? '儲存中...' : '保存設定'}
            </button>
          </form>
        )}

        {/* --- 內容區 --- */}
        <div className="flex-1 px-6 pt-6 pb-24">
          <div className="flex justify-between items-end mb-6">
            <h1 className="text-2xl font-bold text-slate-800" style={{ color: themeColor }}>My StarLog</h1>
            {/* 分頁切換 */}
            <div className="flex bg-slate-100 rounded-lg p-1">
                <button onClick={() => setActiveTab('timeline')} className={`p-2 rounded-md ${activeTab === 'timeline' ? 'bg-white shadow-sm' : ''}`}><Calendar size={18}/></button>
                <button onClick={() => setActiveTab('wallet')} className={`p-2 rounded-md ${activeTab === 'wallet' ? 'bg-white shadow-sm' : ''}`}><Heart size={18}/></button>
            </div>
          </div>

          {/* --- 新增貼文的簡單輸入框 --- */}
          <form action={handleSubmit} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <input type="hidden" name="type" value={activeTab} />
             <input name="title" placeholder={activeTab === 'timeline' ? "今天發生了什麼事？" : "演唱會名稱"} className="w-full bg-transparent font-bold mb-2 outline-none" required />
             
             {activeTab === 'wallet' && (
               <input name="location" placeholder="座位 ex: Red 2B" className="w-full bg-white px-2 py-1 rounded text-sm mb-2" />
             )}
             
             <textarea name="content" placeholder="寫下心情..." className="w-full bg-transparent text-sm mb-2 outline-none resize-none" rows={2} />
             
             <div className="flex justify-between items-center">
               <input type="file" name="image" className="text-xs w-48"/>
               <button 
                 disabled={isUploading}
                 className="px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-md transition transform active:scale-95"
                 style={{ backgroundColor: themeColor }}
               >
                 {isUploading ? '...' : '發布'}
               </button>
             </div>
          </form>

          {/* --- 列表顯示區 --- */}
          <div className="space-y-4">
            {posts.filter((p: any) => p.type === activeTab).map((post: any) => (
              <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                 {/* 如果是票根模式 */}
                 {post.type === 'wallet' ? (
                    <div className="flex relative overflow-hidden">
                       <div className="flex-1 pr-4 border-r-2 border-dashed border-slate-200">
                          <h3 className="font-bold text-lg">{post.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                          {post.imageUrl && <img src={post.imageUrl} className="mt-2 rounded-md h-24 object-cover w-full" />}
                       </div>
                       <div className="w-20 pl-2 flex flex-col justify-center items-center">
                          <span className="text-[10px] text-slate-400">SEAT</span>
                          <span className="font-bold text-slate-800 text-lg">{post.location || '-'}</span>
                       </div>
                    </div>
                 ) : (
                    // 如果是日記模式
                    <>
                      <h3 className="font-bold text-slate-800 mb-1">{post.title}</h3>
                      <p className="text-slate-600 text-sm mb-3">{post.content}</p>
                      {post.imageUrl && (
                        <img src={post.imageUrl} alt="post" className="rounded-xl w-full object-cover" />
                      )}
                      <p className="text-xs text-slate-300 mt-2 text-right">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </>
                 )}
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center text-slate-300 py-10">
                還沒有內容，快來記錄第一筆吧！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}