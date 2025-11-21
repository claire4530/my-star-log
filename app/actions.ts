// app/actions.ts
'use server';

import { prisma } from '@/lib/prisma'; // 等下會建這個
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

// 1. 新增貼文/票根
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as string;
  const location = formData.get('location') as string;
  const imageFile = formData.get('image') as File;
  const dateStr = formData.get('eventDate') as string;
  const eventDate = dateStr ? new Date(dateStr) : new Date();
  
  // 1. 獲取顏色 (如果沒選，就存 null)
  const color = formData.get('color') as string;

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
      addRandomSuffix: true,
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
      eventDate,
      color, // 2. 存入資料庫
      mood: '😍',
    },
  });

  revalidatePath('/');
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

// 新增：刪除貼文
export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath('/'); // 通知前端更新
  } catch (error) {
    console.error("Delete failed:", error);
  }
}