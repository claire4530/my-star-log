// app/actions.ts
'use server';

import { prisma } from '@/lib/prisma'; // 等下會建這個
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

// 1. 新增貼文/票根
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as string; // 'timeline' or 'wallet'
  const location = formData.get('location') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl = null;

  // 如果有上傳圖片，傳到 Vercel Blob
  if (imageFile && imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    });
    imageUrl = blob.url;
  }

  await prisma.post.create({
    data: {
      title,
      content,
      type,
      location,
      imageUrl,
      mood: '😍', // 暫時寫死，你可以自己擴充
    },
  });

  revalidatePath('/'); // 通知首頁更新數據
}

// 2. 更新主題設定 (顏色/封面)
export async function updateConfig(formData: FormData) {
  const color = formData.get('color') as string;
  const imageFile = formData.get('coverImage') as File;

  const dataToUpdate: any = {};
  if (color) dataToUpdate.themeColor = color;

  if (imageFile && imageFile.size > 0) {
    const blob = await put('cover-image', imageFile, { access: 'public' });
    dataToUpdate.coverImage = blob.url;
  }

  // 更新 ID 為 1 的設定，如果不存在就建立
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: dataToUpdate,
    create: { id: 1, ...dataToUpdate },
  });

  revalidatePath('/');
}