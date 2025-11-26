'use client';

import React, { useState } from 'react';
import { Heart, Calendar, Settings, MapPin, Plus, Trash2, X, Image as ImageIcon, Clock, Palette, Pencil, Check, Armchair, Ticket, Type } from 'lucide-react'; // ✨ 加了 Type 圖示
import { createPost, updateConfig, deletePost } from '@/app/actions';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export default function StarLogClient({ posts, config }: { posts: any[], config: any }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'wallet'>('timeline');
  const [showSettings, setShowSettings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const appThemeColor = config?.themeColor || '#ec4899';
  const coverImage = config?.coverImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';
  // ✨ 讀取設定的標題，如果沒有就用預設值
  const siteTitle = config?.siteTitle || "Concert Log ꒰ᐢ. .ᐢ꒱✧";
  const siteSubtitle = config?.siteSubtitle || "紀錄美好時刻";

  const [newTicketColor, setNewTicketColor] = useState(appThemeColor);

  const currentPosts = posts.filter((p: any) => p.type === activeTab);

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    if (activeTab === 'wallet') {
        const venue = formData.get('venue_input') as string;
        const zone = formData.get('zone_input') as string;
        const seat = formData.get('seat_input') as string;
        formData.set('location', `${venue} | ${zone} | ${seat}`);
    }
    const rawDate = formData.get('eventDate') as string;
    if (rawDate) formData.set('eventDate', new Date(rawDate).toISOString());

    await createPost(formData);
    setIsUploading(false);
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
      if (confirm('確定要移除這個珍貴的回憶嗎？')) {
        await deletePost(id);
        if (currentPosts.length <= 1) setIsEditMode(false);
      }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} • ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const openModal = () => {
    setNewTicketColor(appThemeColor);
    setIsModalOpen(true);
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    wiggle: (i: number) => ({
        opacity: 1, y: 0, scale: 0.98,
        rotate: [-0.5, 0.5, -0.3, 0.3, 0],
        transition: { rotate: { repeat: Infinity, repeatType: "mirror", duration: 0.2 + Math.random() * 0.05, delay: i * 0.02, ease: "easeInOut" }, scale: { duration: 0.2 } }
    })
  };

  const panelVariants: Variants = {
      closed: { height: 0, opacity: 0, transition: { height: { type: "spring", stiffness: 400, damping: 30 }, opacity: { duration: 0.1 } } },
      open: { height: "auto", opacity: 1, transition: { height: { type: "spring", stiffness: 300, damping: 20 }, opacity: { duration: 0.2, delay: 0.1 } } }
  };
  
  const modalVariants: Variants = {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
      exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-0 md:pt-10 transition-colors duration-500 touch-action-manipulation overscroll-y-none"
         style={{ backgroundColor: `${appThemeColor}15` }}>
      
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[850px] md:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* --- Header --- */}
        <div className="relative h-64 shrink-0">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
          
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <AnimatePresence mode="popLayout">
                {!isEditMode && (
                    <motion.button layout initial={{ opacity: 0, x: 20, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={() => setShowSettings(!showSettings)} className="bg-black/30 text-white backdrop-blur-md p-2 rounded-full hover:bg-black/50 transition-colors">
                        <Settings size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
            {currentPosts.length > 0 && (
                <motion.button layout onClick={() => setIsEditMode(!isEditMode)} className={`backdrop-blur-md p-2 rounded-full transition-all relative z-20 ${isEditMode ? 'bg-white text-red-500 shadow-lg scale-110' : 'bg-black/30 text-white hover:bg-black/50'}`} whileTap={{ scale: 0.9 }}>
                    <motion.div key={isEditMode ? "check" : "pencil"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        {isEditMode ? <Check size={20} strokeWidth={3} /> : <Pencil size={20} />}
                    </motion.div>
                </motion.button>
            )}
          </div>
        </div>

        {/* --- 設定面板 --- */}
        <AnimatePresence initial={false}>
            {showSettings && (
            <motion.div variants={panelVariants} initial="closed" animate="open" exit="closed" className="bg-white border-b border-gray-100 overflow-hidden">
                <form action={updateConfig} className="px-5 py-5 space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><Settings size={16}/> 全域設定</h3>
                    
                    {/* ✨ 新增：標題與副標題設定 */}
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-bold">APP 名稱</label>
                        <div className="relative">
                            <Type size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input name="siteTitle" defaultValue={siteTitle} placeholder="輸入你的標題..." className="w-full p-2 pl-9 bg-slate-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200" />
                        </div>
                        <input name="siteSubtitle" defaultValue={siteSubtitle} placeholder="輸入副標題..." className="w-full p-2 pl-9 bg-slate-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 font-bold block mb-1">主題色</label>
                            <input type="color" name="color" defaultValue={appThemeColor} className="block w-full h-10 rounded cursor-pointer border-2 border-slate-100"/>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 font-bold block mb-1">封面圖</label>
                            <label className="flex items-center justify-center w-full h-10 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400 text-xs cursor-pointer hover:bg-slate-100 transition">
                                <ImageIcon size={14} className="mr-1"/> 上傳
                                <input type="file" name="coverImage" className="hidden"/>
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" onClick={() => setShowSettings(false)} className="w-full py-2.5 rounded-xl text-white font-bold text-sm active:scale-95 transition-transform shadow-md" style={{ backgroundColor: appThemeColor }}>保存變更</button>
                </form>
            </motion.div>
            )}
        </AnimatePresence>

        {/* --- 內容區 --- */}
        <div className="flex-1 px-6 pt-6 pb-24 bg-slate-50/50 overflow-x-hidden overflow-y-auto overscroll-contain">
          <div className="flex justify-between items-end mb-6">
            <div>
                {/* ✨ 顯示自定義標題 */}
                <h1 className={`${fredoka.className} text-2xl font-bold text-slate-800 transition-colors line-clamp-1`} style={{ color: appThemeColor }}>
                    {siteTitle}
                </h1>
                
                {/* ✨ 顯示自定義副標題 */}
                <p className="text-xs text-slate-400 mt-1 transition-all line-clamp-1">
                    {isEditMode ? <span className="text-red-500 font-bold animate-pulse">輕點紅色按鈕以移除</span> : siteSubtitle}
                </p>
            </div>
            <div className={`flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 transition-all duration-300 ${isEditMode ? 'opacity-30 grayscale pointer-events-none scale-95' : ''}`}>
                <button onClick={() => setActiveTab('timeline')} className={`p-2.5 rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}><Calendar size={18}/></button>
                <button onClick={() => setActiveTab('wallet')} className={`p-2.5 rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}><Heart size={18}/></button>
            </div>
          </div>

          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
                {currentPosts.map((post: any, index: number) => {
                    const ticketColor = post.color || appThemeColor;
                    const locationString = post.location || '';
                    const parts = locationString.split('|').map((s: string) => s.trim());
                    let venueDisplay = 'EVENT LOCATION', zoneDisplay = '-', seatDisplay = '-';
                    if (parts.length >= 3) { venueDisplay = parts[0]; zoneDisplay = parts[1]; seatDisplay = parts[2]; } 
                    else if (parts.length === 2) { zoneDisplay = parts[0]; seatDisplay = parts[1]; } 
                    else { venueDisplay = locationString; }

                    return (
                    <motion.div key={post.id} layout variants={cardVariants} initial="hidden" animate={isEditMode ? "wiggle" : "visible"} exit="exit" custom={index} className="relative group will-change-transform">
                        <AnimatePresence>
                        {isEditMode && (
                            <motion.button initial={{ scale: 0, opacity: 0, rotate: -45 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} whileTap={{ scale: 0.85 }} onClick={() => handleDelete(post.id)} className="absolute -top-2 -left-2 z-50 bg-red-500 text-white p-2 rounded-full shadow-sm hover:bg-red-600 transition-colors" style={{ boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)' }}>
                                <Trash2 size={14} strokeWidth={2.5} />
                            </motion.button>
                        )}
                        </AnimatePresence>

                        <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-300`}>
                            {activeTab === 'wallet' ? (
                                <div className="flex bg-white items-stretch">
                                    <div className="flex-1 p-4 pr-5 border-r-2 border-dashed border-slate-100 relative flex flex-col justify-center">
                                        <div className="absolute -right-[7px] -top-[7px] w-3 h-3 bg-white rounded-full z-10 border-l border-b border-slate-100/50"></div>
                                        <div className="absolute -right-[7px] -bottom-[7px] w-3 h-3 bg-white rounded-full z-10 border-l border-t border-slate-100/50"></div>
                                        <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 line-clamp-2">{post.title}</h3>
                                        <p className="font-bold text-sm tracking-wider uppercase truncate flex items-center gap-1" style={{ color: ticketColor }}>
                                            <MapPin size={12} className="shrink-0" />
                                            {venueDisplay}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1"><Clock size={12} />{formatDate(post.eventDate || post.createdAt)}</p>
                                        {post.content && (
                                            <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-dashed border-slate-100 leading-relaxed whitespace-pre-wrap line-clamp-3">{post.content}</p>
                                        )}
                                        {post.imageUrl && (<div className="mt-3 pt-2 border-t border-slate-50"><img src={post.imageUrl} className="rounded-lg w-full h-32 object-cover" /></div>)}
                                    </div>
                                    <div className="min-w-[5.5rem] flex flex-col shrink-0">
                                        <div className="flex-1 flex flex-col justify-center items-center px-1 border-b border-white/50" style={{ backgroundColor: `${ticketColor}10` }}>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-80 mb-0.5">ZONE</span>
                                            <span className="text-sm font-bold text-slate-700 text-center leading-tight">{zoneDisplay === '-' ? '-' : zoneDisplay}</span>
                                        </div>
                                        <div className="flex-[1.2] flex flex-col justify-center items-center px-1" style={{ backgroundColor: `${ticketColor}20` }}>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 opacity-70">SEAT</span>
                                            <span className="font-black text-slate-800 text-lg text-center break-words leading-tight px-1">{seatDisplay}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ticketColor }}></span>
                                        <span className="text-xs text-slate-400">{formatDate(post.eventDate || post.createdAt).split(' • ')[0]}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">{post.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-3 line-clamp-3">{post.content}</p>
                                    {post.imageUrl && (<img src={post.imageUrl} alt="post" className="rounded-xl w-full h-40 object-cover pointer-events-none" />)}
                                </div>
                            )}
                        </div>
                    </motion.div>
                    );
                })}
            </AnimatePresence>

            {currentPosts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 opacity-50">
                 <p className="text-slate-400 text-sm">還沒有內容，按右下角新增吧！</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* ... FAB & Modal 不用動，直接使用上面的完整代碼 ... */}
        {/* 省略 FAB 和 Modal 程式碼以節省篇幅，請使用上一則回應的完整版，或直接保留你原本的 */ }
        <AnimatePresence>
            {!isEditMode && (
                <motion.button initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} onClick={openModal} className="absolute bottom-8 right-6 h-14 w-14 rounded-full shadow-xl shadow-black/20 flex items-center justify-center text-white z-20" whileTap={{ scale: 0.9 }} style={{ backgroundColor: appThemeColor }}>
                <Plus size={28} strokeWidth={3} />
                </motion.button>
            )}
        </AnimatePresence>

        <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
             <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
             <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white w-full md:w-[90%] rounded-t-3xl md:rounded-3xl p-6 shadow-2xl relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"><X size={20} /></button>
                <h3 className="text-lg font-bold text-slate-800 mb-1">新增{activeTab === 'timeline' ? '回憶日記' : '演唱會票根'}</h3>
                
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <input type="hidden" name="type" value={activeTab} />
                    <input name="title" required placeholder="標題 (例如: WORLD TOUR)" className="w-full p-3 bg-slate-50 rounded-xl outline-none font-bold focus:ring-2 focus:ring-slate-100 transition-shadow" />
                    
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <div className="absolute left-3 top-3.5 text-slate-400"><Clock size={16}/></div>
                            <input type="datetime-local" name="eventDate" defaultValue={getCurrentDateTimeLocal()} className="w-full p-3 pl-9 bg-slate-50 rounded-xl outline-none text-sm text-slate-600 font-medium focus:ring-2 focus:ring-slate-100 transition-shadow"/>
                        </div>
                        <div className="relative w-14 h-12 overflow-hidden rounded-xl border border-slate-100 shadow-sm shrink-0">
                            <input type="color" name="color" value={newTicketColor} onChange={(e) => setNewTicketColor(e.target.value)} className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer border-none" />
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white/80 mix-blend-difference"><Palette size={18} /></div>
                        </div>
                    </div>

                    {activeTab === 'wallet' && (
                        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 mb-1">票根資訊</p>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                <input name="venue_input" placeholder="地點 (例如：高雄巨蛋)" className="w-full p-3 pl-9 bg-white rounded-xl outline-none text-sm focus:ring-2 focus:ring-pink-200 transition-shadow border border-slate-200" />
                            </div>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Ticket size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                    <input name="zone_input" placeholder="區域 (例如：1樓 E10區)" className="w-full p-3 pl-9 bg-white rounded-xl outline-none text-sm focus:ring-2 focus:ring-pink-200 transition-shadow border border-slate-200" />
                                </div>
                                <div className="relative flex-1">
                                    <Armchair size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                    <input name="seat_input" placeholder="座位 (例如：9排 20號)" className="w-full p-3 pl-9 bg-white rounded-xl outline-none text-sm focus:ring-2 focus:ring-pink-200 transition-shadow border border-slate-200" />
                                </div>
                            </div>
                        </div>
                    )}

                    <textarea name="content" rows={3} placeholder="備註內容..." className="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm resize-none focus:ring-2 focus:ring-slate-100 transition-shadow"></textarea>
                    <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm cursor-pointer hover:border-slate-300 hover:text-slate-600 transition-all active:scale-95"><ImageIcon size={18} /><span>選擇照片 (顯示在底部)</span><input type="file" name="image" className="hidden" accept="image/*" /></label>
                    </div>
                    <button disabled={isUploading} className="w-full py-3.5 rounded-xl text-white font-bold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100" style={{ backgroundColor: newTicketColor }}>{isUploading ? '處理中...' : '確定發布'}</button>
                </form>
             </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}