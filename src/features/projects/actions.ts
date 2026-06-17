'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { projectStatusValues } from './constants';

const projectSchema = z.object({
  projectId: z.string().optional(),
  title: z.string().trim().min(2).max(120),
  logline: z.string().trim().max(240).optional(),
  description: z.string().trim().min(20).max(5000),
  status: z.enum(projectStatusValues),
  language: z.string().trim().max(80).optional(),
  location: z.string().trim().max(120).optional(),
  ownerRole: z.string().trim().max(120).optional(),
  linkLabel: z.string().trim().max(80).optional(),
  linkUrl: z.string().trim().url().optional().or(z.literal('')),
});

const deleteProjectSchema = z.object({
  projectId: z.string().min(1),
});

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

async function createUniqueSlug(title: string, existingProjectId?: string) {
  const baseSlug = slugify(title) || 'project';
  let candidate = baseSlug;
  let index = 2;

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === existingProjectId) {
      return candidate;
    }

    candidate = `${baseSlug}-${index}`;
    index += 1;
  }
}

export async function saveProjectAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/projects/new?error=project');
  }

  const existingProject = parsed.data.projectId
    ? await prisma.project.findUnique({
        where: { id: parsed.data.projectId },
        select: { id: true, ownerId: true },
      })
    : null;

  if (parsed.data.projectId && (!existingProject || existingProject.ownerId !== userId)) {
    redirect('/projects?error=permission');
  }

  const slug = await createUniqueSlug(parsed.data.title, existingProject?.id);
  const linkLabel = parsed.data.linkLabel || 'Project link';
  const linkUrl = parsed.data.linkUrl || undefined;

  const project = existingProject
    ? await prisma.project.update({
        where: { id: existingProject.id },
        data: {
          title: parsed.data.title,
          slug,
          logline: parsed.data.logline || null,
          description: parsed.data.description,
          status: parsed.data.status,
          language: parsed.data.language || null,
          location: parsed.data.location || null,
          ownerRole: parsed.data.ownerRole || null,
          links: {
            deleteMany: {},
            create: linkUrl ? [{ label: linkLabel, url: linkUrl }] : [],
          },
        },
        select: { slug: true },
      })
    : await prisma.project.create({
        data: {
          title: parsed.data.title,
          slug,
          logline: parsed.data.logline || null,
          description: parsed.data.description,
          status: parsed.data.status,
          language: parsed.data.language || null,
          location: parsed.data.location || null,
          ownerRole: parsed.data.ownerRole || null,
          ownerId: userId,
          members: {
            create: {
              userId,
              role: parsed.data.ownerRole || 'Creator',
            },
          },
          links: {
            create: linkUrl ? [{ label: linkLabel, url: linkUrl }] : [],
          },
        },
        select: { slug: true },
      });

  revalidatePath('/projects');
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath(`/profile/${userId}`);
  redirect(`/projects/${project.slug}`);
}

export async function deleteProjectAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = deleteProjectSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/projects?error=delete');
  }

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: { id: true, ownerId: true },
  });

  if (!project || project.ownerId !== userId) {
    redirect('/projects?error=delete');
  }

  await prisma.project.delete({
    where: { id: project.id },
  });

  revalidatePath('/projects');
  revalidatePath(`/profile/${userId}`);
  redirect('/projects');
}
