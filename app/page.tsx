import { prisma } from '@/lib/prisma';
import StarLogClient from '@/components/StarLogClient';
import { auth } from '@clerk/nextjs/server';
// ✨ 新增：引入登入按鈕組件
import { SignInButton } from "@clerk/nextjs";

export default async function Page() {
  const { userId } = await auth();

  // 如果沒登入，顯示歡迎畫面 + 直接給他按鈕
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-sm w-full border border-pink-100">
          <h1 className="text-4xl font-bold text-pink-500 mb-3">Orbit 💫</h1>
          <p className="text-slate-400 text-sm mb-8">專屬於你的追星紀錄</p>
          
          {/* ✨ 修改點：直接放一顆按鈕在這裡！ */}
          <SignInButton mode="modal">
            <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-200 hover:scale-105 active:scale-95 transition-transform">
                立即登入 / 註冊
            </button>
          </SignInButton>
          
        </div>
      </div>
    );
  }

  // 抓取屬於這個用戶的資料
  const posts = await prisma.post.findMany({
    where: { userId }, 
    orderBy: { eventDate: 'desc' },
  });

  // 抓取設定
  const config = await prisma.siteConfig.findUnique({
    where: { userId },
  });

  return <StarLogClient posts={posts} config={config} />;
}