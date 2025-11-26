import { prisma } from '@/lib/prisma';
import StarLogClient from '@/components/StarLogClient';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();

  // 如果沒登入，顯示歡迎畫面
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm w-full">
          <h1 className="text-3xl font-bold text-pink-500 mb-2">Orbit 💫</h1>
          <p className="text-slate-400 text-sm mb-6">專屬於你的追星紀錄</p>
          <p className="text-slate-600 font-bold animate-pulse">↖ 請點擊左上角登入</p>
        </div>
      </div>
    );
  }

  // 抓取屬於這個用戶的資料
  const posts = await prisma.post.findMany({
    where: { userId }, 
    orderBy: { eventDate: 'desc' },
  });

  // 抓取設定 (如果找不到就用預設值)
  const config = await prisma.siteConfig.findUnique({
    where: { userId },
  });

  return <StarLogClient posts={posts} config={config} />;
}