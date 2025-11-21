'use client';

import React, { useState } from 'react';
import { Heart, Calendar, Settings, MapPin, Plus, Trash2, X, Image as ImageIcon, Clock, Palette } from 'lucide-react';
import { createPost, updateConfig, deletePost } from '@/app/actions';
import { motion, PanInfo } from 'framer-motion';

export default function StarLogClient({ posts, config }: { posts: any[], config: any }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'wallet'>('timeline');
  const [showSettings, setShowSettings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 這是 App 的全域主題色 (例如介面背景、按鈕顏色)
  const appThemeColor = config?.themeColor || '#ec4899';
  const coverImage = config?.coverImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

  // 新增票根時的暫存顏色 (預設跟隨 App 主題色)
  const [newTicketColor, setNewTicketColor] = useState(appThemeColor);

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
    if (info.offset.x < -120) {
        handleDelete(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} • ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // 當打開 Modal 時，重置票根顏色為 App 主題色
  const openModal = () => {
    setNewTicketColor(appThemeColor);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-0 md:pt-10 transition-colors duration-500"
         style={{ backgroundColor: `${appThemeColor}15` }}>
      
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[850px] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* --- Header --- */}
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

        {/* --- 設定面板 --- */}
        {showSettings && (
          <form action={updateConfig} className="bg-white p-5 border-b border-gray-100 animate-in slide-in-from-top-2">
            <h3 className="font-bold mb-3 text-slate-700">全域設定</h3>
            <div className="space-y-3">
               <div>
                 <label className="text-xs text-slate-400">App 主題色</label>
                 <input type="color" name="color" defaultValue={appThemeColor} className="block w-full h-10 rounded cursor-pointer mt-1"/>
               </div>
               <div>
                 <label className="text-xs text-slate-400">更換封面</label>
                 <input type="file" name="coverImage" className="block w-full text-sm text-slate-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"/>
               </div>
               <button type="submit" onClick={() => setShowSettings(false)} className="w-full py-2 rounded-lg text-white font-bold text-sm mt-2" style={{ backgroundColor: appThemeColor }}>
                 保存設定
               </button>
            </div>
          </form>
        )}

        {/* --- 內容區 --- */}
        <div className="flex-1 px-6 pt-6 pb-24 bg-slate-50/50 overflow-x-hidden">
          <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800" style={{ color: appThemeColor }}>My StarLog</h1>
                <p className="text-xs text-slate-400 mt-1">紀錄美好時刻</p>
            </div>
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                <button onClick={() => setActiveTab('timeline')} className={`p-2.5 rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}><Calendar size={18}/></button>
                <button onClick={() => setActiveTab('wallet')} className={`p-2.5 rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}><Heart size={18}/></button>
            </div>
          </div>

          <div className="space-y-5">
            {posts.filter((p: any) => p.type === activeTab).map((post: any) => {
                // 決定這張票根要用什麼顏色：如果有自訂顏色就用自訂的，否則用 App 主題色
                const ticketColor = post.color || appThemeColor;

                return (
                <div key={post.id} className="relative w-full h-full group">
                    {/* 紅色背景層 */}
                    <div className="absolute top-0 bottom-0 right-0 w-3/4 bg-red-500 rounded-r-2xl flex items-center justify-end pr-6 z-0">
                        <div className="text-white flex flex-col items-center">
                            <Trash2 size={24} />
                            <span className="text-[10px] font-bold mt-1">刪除</span>
                        </div>
                    </div>

                    {/* 內容卡片層 */}
                    <motion.div
                        className="bg-white relative z-10 rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                        drag="x"
                        dragConstraints={{ left: -120, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(e, info) => handleDragEnd(e, info, post.id)}
                        whileTap={{ cursor: "grabbing" }}
                        style={{ touchAction: "none" }}
                    >
                        {activeTab === 'wallet' ? (
                            // --- 票根樣式 ---
                            <div className="flex bg-white items-stretch">
                                
                                {/* 左側：主要資訊區 */}
                                <div className="flex-1 p-5 pr-6 border-r-2 border-dashed border-slate-100 relative flex flex-col justify-center">
                                    {/* 裝飾圓點 */}
                                    <div className="absolute -right-[7px] -top-[7px] w-3 h-3 bg-white rounded-full z-10 border-l border-b border-slate-100/50"></div>
                                    <div className="absolute -right-[7px] -bottom-[7px] w-3 h-3 bg-white rounded-full z-10 border-l border-t border-slate-100/50"></div>
                                    
                                    <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{post.title}</h3>
                                    
                                    {/* 地點：使用【票根專屬顏色】 */}
                                    <p className="font-bold text-sm tracking-wider uppercase" style={{ color: ticketColor }}>
                                    {post.location ? post.location.split(' ')[0] : 'EVENT'}
                                    </p>
                                    
                                    <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                                    <Clock size={12} />
                                    {formatDate(post.eventDate || post.createdAt)}
                                    </p>

                                    {/* 圖片 */}
                                    {post.imageUrl && (
                                    <div className="mt-3 pt-2 border-t border-slate-50">
                                        <img src={post.imageUrl} className="rounded-lg w-full h-40 object-cover" />
                                    </div>
                                    )}
                                </div>

                                {/* 右側：座位區 (使用【票根專屬顏色】作為背景) */}
                                <div className="min-w-[6rem] px-2 flex flex-col justify-center items-center shrink-0 transition-colors"
                                    style={{ backgroundColor: `${ticketColor}15` }}>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 opacity-70">ZONE</span>
                                    <span className="font-black text-slate-800 text-xl text-center break-words leading-tight">
                                        {post.location ? (post.location.includes(' ') ? post.location.split(' ').slice(1).join(' ') : post.location) : '-'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            // 日記樣式
                            <div className="p-5 bg-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ticketColor }}></span>
                                    <span className="text-xs text-slate-400">
                                        {formatDate(post.eventDate || post.createdAt).split(' • ')[0]}
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
                );
            })}

            {posts.filter((p: any) => p.type === activeTab).length === 0 && (
              <div className="text-center py-12 opacity-50">
                 <p className="text-slate-400 text-sm">還沒有內容，按右下角新增吧！</p>
              </div>
            )}
          </div>
        </div>

        {/* --- FAB --- */}
        <button 
            onClick={openModal}
            className="absolute bottom-8 right-6 h-14 w-14 rounded-full shadow-xl shadow-black/20 flex items-center justify-center text-white transition hover:scale-110 active:scale-95 z-20"
            style={{ backgroundColor: appThemeColor }}
        >
          <Plus size={28} strokeWidth={3} />
        </button>

        {/* --- Modal --- */}
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
             <div className="bg-white w-full md:w-[90%] rounded-t-3xl md:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-300">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"><X size={20} /></button>
                <h3 className="text-lg font-bold text-slate-800 mb-1">新增{activeTab === 'timeline' ? '回憶日記' : '演唱會票根'}</h3>
                
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <input type="hidden" name="type" value={activeTab} />
                    
                    {/* 標題 */}
                    <input name="title" required placeholder="標題 (例如: WORLD TOUR)" className="w-full p-3 bg-slate-50 rounded-xl outline-none font-bold focus:ring-2 focus:ring-slate-100" />
                    
                    {/* 日期與顏色選擇 (排在同一行) */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <div className="absolute left-3 top-3.5 text-slate-400"><Clock size={16}/></div>
                            <input type="datetime-local" name="eventDate" defaultValue={getCurrentDateTimeLocal()} className="w-full p-3 pl-9 bg-slate-50 rounded-xl outline-none text-sm text-slate-600 font-medium focus:ring-2 focus:ring-slate-100"/>
                        </div>
                        
                        {/* 修改點：票根顏色選擇器 */}
                        <div className="relative w-14 h-12 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                            <input 
                                type="color" 
                                name="color" 
                                value={newTicketColor}
                                onChange={(e) => setNewTicketColor(e.target.value)}
                                className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer border-none" 
                            />
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white/80 mix-blend-difference">
                                <Palette size={18} />
                            </div>
                        </div>
                    </div>

                    {/* 座位資訊 (票夾模式) */}
                    {activeTab === 'wallet' && (
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
                            <input name="location" placeholder="地點與座位 (例如: TAIPEI ARENA A1區 18號)" className="w-full p-3 pl-9 bg-slate-50 rounded-xl outline-none text-sm focus:ring-2 focus:ring-slate-100" />
                        </div>
                    )}

                    <textarea name="content" rows={3} placeholder="備註內容..." className="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm resize-none focus:ring-2 focus:ring-slate-100"></textarea>
                    
                    <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm cursor-pointer hover:border-slate-300 transition">
                            <ImageIcon size={18} />
                            <span>選擇照片 (顯示在票根底部)</span>
                            <input type="file" name="image" className="hidden" accept="image/*" />
                        </label>
                    </div>
                    
                    {/* 按鈕顏色跟隨選擇的【票根顏色】，讓用戶預覽效果 */}
                    <button disabled={isUploading} className="w-full py-3.5 rounded-xl text-white font-bold shadow-lg active:scale-[0.98] transition-transform" style={{ backgroundColor: newTicketColor }}>
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