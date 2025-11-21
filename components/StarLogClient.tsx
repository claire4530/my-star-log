'use client';

import React, { useState } from 'react';
import { Heart, Calendar, Settings, MapPin, Plus, Trash2, X, Image as ImageIcon, Clock } from 'lucide-react';
import { createPost, updateConfig, deletePost } from '@/app/actions';
import { motion, PanInfo } from 'framer-motion';

export default function StarLogClient({ posts, config }: { posts: any[], config: any }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'wallet'>('timeline');
  const [showSettings, setShowSettings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const themeColor = config?.themeColor || '#ec4899';
  const coverImage = config?.coverImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    await createPost(formData);
    setIsUploading(false);
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
      await deletePost(id);
  }

  const handleDragEnd = (event: any, info: PanInfo, id: string) => {
    // 增加判定距離到 -120 確保用戶是真的想刪除
    if (info.offset.x < -120) {
        handleDelete(id);
    }
  };

  // 格式化日期顯示的輔助函數
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  // 獲取當前時間格式化為 input datetime-local 用的字串 (YYYY-MM-DDTHH:mm)
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-0 md:pt-10 transition-colors duration-500"
         style={{ backgroundColor: `${themeColor}15` }}>
      
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[850px] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* --- Header (無變動) --- */}
        <div className="relative h-64">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* --- 設定面板 (無變動) --- */}
        {showSettings && (
          <form action={updateConfig} className="bg-white p-5 border-b border-gray-100 animate-in slide-in-from-top-2">
            <h3 className="font-bold mb-3 text-slate-700">個性化設定</h3>
            <div className="space-y-3">
               <div>
                 <label className="text-xs text-slate-400">主題顏色</label>
                 <input type="color" name="color" defaultValue={themeColor} className="block w-full h-10 rounded cursor-pointer mt-1"/>
               </div>
               <div>
                 <label className="text-xs text-slate-400">更換封面</label>
                 <input type="file" name="coverImage" className="block w-full text-sm text-slate-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"/>
               </div>
               <button type="submit" onClick={() => setShowSettings(false)} className="w-full py-2 rounded-lg text-white font-bold text-sm mt-2" style={{ backgroundColor: themeColor }}>
                 保存設定
               </button>
            </div>
          </form>
        )}

        {/* --- 內容區 --- */}
        <div className="flex-1 px-6 pt-6 pb-24 bg-slate-50/50 overflow-x-hidden">
          <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800" style={{ color: themeColor }}>My StarLog</h1>
                <p className="text-xs text-slate-400 mt-1">紀錄美好時刻</p>
            </div>
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                <button onClick={() => setActiveTab('timeline')} className={`p-2.5 rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}><Calendar size={18}/></button>
                <button onClick={() => setActiveTab('wallet')} className={`p-2.5 rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}><Heart size={18}/></button>
            </div>
          </div>

          <div className="space-y-5">
            {/* 注意：這裡改用 eventDate 排序 (假設後端已經排好，或者這裡 filter 後 map) */}
            {posts.filter((p: any) => p.type === activeTab).map((post: any) => (
              // --- 修改點：側滑容器 ---
              <div key={post.id} className="relative w-full h-full group">
                 
                 {/* 1. 紅色背景層 (設定為 absolute 且 z-0，讓它預設就在下面) */}
                 <div className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end pr-6 z-0">
                    <div className="text-white flex flex-col items-center">
                        <Trash2 size={24} />
                        <span className="text-[10px] font-bold mt-1">刪除</span>
                    </div>
                 </div>

                 {/* 2. 內容卡片層 (設定為 relative 且 z-10，蓋在紅色上面) */}
                 <motion.div
                    className="bg-white relative z-10 rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                    drag="x"
                    dragConstraints={{ left: -120, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(e, info) => handleDragEnd(e, info, post.id)}
                    whileTap={{ cursor: "grabbing" }}
                    style={{ touchAction: "none" }} // 優化觸控體驗
                 >
                    {activeTab === 'wallet' ? (
                        // 票根樣式
                        <div className="flex bg-white">
                            <div className="flex-1 p-4 pr-6 border-r-2 border-dashed border-slate-100 relative">
                                <div className="absolute -right-[7px] -top-[7px] w-3 h-3 bg-white rounded-full z-10"></div>
                                <div className="absolute -right-[7px] -bottom-[7px] w-3 h-3 bg-white rounded-full z-10"></div>
                                
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white mb-2" style={{ backgroundColor: themeColor }}>TICKET</span>
                                <h3 className="font-bold text-slate-800 leading-tight">{post.title}</h3>
                                
                                {/* 顯示選定的日期 */}
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                   <Clock size={10} />
                                   {formatDate(post.eventDate || post.createdAt)}
                                </p>
                                
                                {post.imageUrl && <div className="mt-3 h-20 w-full bg-slate-100 rounded-lg overflow-hidden"><img src={post.imageUrl} className="w-full h-full object-cover" /></div>}
                            </div>
                            <div className="min-w-[6rem] px-2 flex flex-col justify-center items-center shrink-0"
                                 style={{ backgroundColor: `${themeColor}20` }}> {/* 稍微增加背景透明度 */}
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 opacity-70">SEAT / ZONE</span>
                                {/* 移除 truncate，改用 break-words 和 leading-tight，字體改為 text-xl */}
                                <span className="font-black text-slate-800 text-lg text-center break-words leading-tight">
                                    {post.location || '-'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        // 日記樣式
                        <div className="p-5 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                                {/* 顯示選定的日期 */}
                                <span className="text-xs text-slate-400">
                                    {formatDate(post.eventDate || post.createdAt)}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-2">{post.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>
                            {post.imageUrl && (
                                <img src={post.imageUrl} alt="post" className="rounded-xl w-full h-48 object-cover pointer-events-none" />
                            )}
                        </div>
                    )}
                 </motion.div>
              </div>
            ))}

            {posts.filter((p: any) => p.type === activeTab).length === 0 && (
              <div className="text-center py-12 opacity-50">
                 <p className="text-slate-400 text-sm">還沒有內容，按右下角新增吧！</p>
              </div>
            )}
          </div>
        </div>

        {/* --- FAB --- */}
        <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-8 right-6 h-14 w-14 rounded-full shadow-xl shadow-black/20 flex items-center justify-center text-white transition hover:scale-110 active:scale-95 z-20"
            style={{ backgroundColor: themeColor }}
        >
          <Plus size={28} strokeWidth={3} />
        </button>

        {/* --- Modal 新增視窗 --- */}
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
             
             <div className="bg-white w-full md:w-[90%] rounded-t-3xl md:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-300">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"><X size={20} /></button>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">新增{activeTab === 'timeline' ? '回憶日記' : '演唱會票根'}</h3>
                
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <input type="hidden" name="type" value={activeTab} />
                    
                    {/* 標題 */}
                    <input name="title" required placeholder="標題" className="w-full p-3 bg-slate-50 rounded-xl outline-none font-bold focus:ring-2 focus:ring-slate-100" />
                    
                    {/* 修改點：新增日期選擇器 */}
                    <div className="relative">
                         <div className="absolute left-3 top-3.5 text-slate-400"><Clock size={16}/></div>
                         <input 
                            type="datetime-local" 
                            name="eventDate" 
                            defaultValue={getCurrentDateTimeLocal()}
                            className="w-full p-3 pl-9 bg-slate-50 rounded-xl outline-none text-sm text-slate-600 font-medium focus:ring-2 focus:ring-slate-100"
                         />
                    </div>

                    {/* 座位 (僅票夾模式) */}
                    {activeTab === 'wallet' && (
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
                            <input name="location" placeholder="座位 (ex: Red 2B)" className="w-full p-3 pl-9 bg-slate-50 rounded-xl outline-none text-sm focus:ring-2 focus:ring-slate-100" />
                        </div>
                    )}
                    
                    {/* 內容 */}
                    <textarea name="content" rows={3} placeholder="內容..." className="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm resize-none focus:ring-2 focus:ring-slate-100"></textarea>
                    
                    {/* 圖片 */}
                    <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm cursor-pointer hover:border-slate-300 transition">
                            <ImageIcon size={18} />
                            <span>選擇照片</span>
                            <input type="file" name="image" className="hidden" accept="image/*" />
                        </label>
                    </div>

                    <button disabled={isUploading} className="w-full py-3.5 rounded-xl text-white font-bold shadow-lg active:scale-[0.98] transition-transform" style={{ backgroundColor: themeColor }}>
                        {isUploading ? '處理中...' : '確定發布'}
                    </button>
                </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}