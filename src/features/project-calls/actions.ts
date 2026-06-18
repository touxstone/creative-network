'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { callStatusValues } from './constants';

const callSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().trim().min(3).max(140),
  role: z.string().trim().min(2).max(120),
  discipline: z.string().trim().max(120).optional(),
  description: z.string().trim().min(20).max(4000),
  language: z.string().trim().max(80).optional(),
  location: z.string().trim().max(120).optional(),
  status: z.enum(callStatusValues),
  deadline: z.string().optional(),
});

const applicationSchema = z.object({
  callId: z.string().min(1),
  message: z.string().trim().min(20).max(2000),
});

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return session.user.id;
}

function parseDeadline(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function createProjectCallAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = callSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/calls?error=call');
  }

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: { id: true, slug: true, ownerId: true },
  });

  if (!project || project.ownerId !== userId) {
    redirect('/calls?error=permission');
  }

  const call = await prisma.projectCall.create({
    data: {
      projectId: parsed.data.projectId,
      creatorId: userId,
      title: parsed.data.title,
      role: parsed.data.role,
      discipline: parsed.data.discipline || null,
      description: parsed.data.description,
      language: parsed.data.language || null,
      location: parsed.data.location || null,
      status: parsed.data.status,
      deadline: parseDeadline(parsed.data.deadline),
    },
    select: { id: true },
  });

  revalidatePath('/calls');
  revalidatePath(`/projects/${project.slug}`);
  redirect(`/calls/${call.id}`);
}

export async function applyToProjectCallAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = applicationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/calls?error=apply');
  }

  const call = await prisma.projectCall.findUnique({
    where: { id: parsed.data.callId },
    select: {
      id: true,
      creatorId: true,
      status: true,
      project: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!call || call.status !== 'OPEN' || call.creatorId === userId || call.project.ownerId === userId) {
    redirect(`/calls/${parsed.data.callId}?error=apply`);
  }

  await prisma.projectApplication.upsert({
    where: {
      callId_applicantId: {
        callId: parsed.data.callId,
        applicantId: userId,
      },
    },
    update: {
      message: parsed.data.message,
      status: 'SUBMITTED',
    },
    create: {
      callId: parsed.data.callId,
      applicantId: userId,
      message: parsed.data.message,
    },
  });

  revalidatePath('/calls');
  revalidatePath(`/calls/${parsed.data.callId}`);
  redirect(`/calls/${parsed.data.callId}`);
}
