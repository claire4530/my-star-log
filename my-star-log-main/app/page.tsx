import { prisma } from '@/lib/prisma';
import StarLogClient from '@/components/StarLogClient';

// 這是一個 Server Component，它直接在伺服器讀取資料庫
// 這樣做對 SEO 好，而且速度快
export default async function Page() {
  // 1. 抓取所有貼文 (按時間倒序)
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // 2. 抓取設定 (如果沒有就用 null，Client 端會處理預設值)
  const config = await prisma.siteConfig.findUnique({
    where: { id: 1 },
  });

  return (
    <main>
      <StarLogClient posts={posts} config={config} />
    </main>
  );
}