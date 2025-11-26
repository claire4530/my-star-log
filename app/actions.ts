'use server';

import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('請先登入');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as string;
  const location = formData.get('location') as string;
  const imageFile = formData.get('image') as File;
  const dateStr = formData.get('eventDate') as string;
  const eventDate = dateStr ? new Date(dateStr) : new Date();
  const color = formData.get('color') as string;

  // ✨ 新增：獲取票價 (轉成數字，如果沒填就是 0)
  const price = Number(formData.get('price') || 0);
  // ✨ Level 4 新增：獲取歌單
  const setlist = formData.get('setlist') as string;
  
  let imageUrl = null;
  if (imageFile && imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, { access: 'public', addRandomSuffix: true });
    imageUrl = blob.url;
  }

  await prisma.post.create({
    data: { 
      title, content, type, location, imageUrl, eventDate, color, 
      mood: '😍',
      userId, // 寫入當前用戶 ID
      price, // ✨ 寫入資料庫
      setlist, // ✨ Level 4 寫入資料庫
    },
  });
  revalidatePath('/');
}

export async function updateConfig(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('請先登入');

  const color = formData.get('color') as string;
  const imageFile = formData.get('coverImage') as File;
  
  // ✨ 新增：獲取標題與副標題
  const siteTitle = formData.get('siteTitle') as string;
  const siteSubtitle = formData.get('siteSubtitle') as string;
  
  const dataToUpdate: any = {};
  if (color) dataToUpdate.themeColor = color;
  
  // ✨ 如果有輸入，就更新
  if (siteTitle) dataToUpdate.siteTitle = siteTitle;
  if (siteSubtitle) dataToUpdate.siteSubtitle = siteSubtitle;

  if (imageFile && imageFile.size > 0) {
    const blob = await put('cover-image', imageFile, { 
        access: 'public', 
        allowOverwrite: true 
    } as any); 
    dataToUpdate.coverImage = blob.url;
  }

  await prisma.siteConfig.upsert({
    where: { userId }, 
    update: dataToUpdate, 
    create: { userId, ...dataToUpdate },
  });
  revalidatePath('/');
}

export async function deletePost(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('請先登入');
  try { 
    await prisma.post.deleteMany({ where: { id, userId } }); 
    revalidatePath('/'); 
  } catch (e) { console.error(e); }
}