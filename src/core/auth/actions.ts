'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn, signOut, auth } from '@/core/auth/auth';
import { prisma } from '@/lib/db/prisma';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email.').transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Enter your full name.').max(80),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Use letters, numbers, and underscores only.')
    .transform((value) => value.toLowerCase()),
  profession: z.string().max(80).optional(),
  location: z.string().max(80).optional(),
});

const profileSchema = z.object({
  name: z.string().min(2, 'Enter your full name.').max(80),
  profession: z.string().max(80).optional(),
  location: z.string().max(80).optional(),
  website: z.string().url('Enter a valid URL.').optional().or(z.literal('')),
  bio: z.string().max(800, 'Bio must be 800 characters or fewer.').optional(),
});

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirectWithError('/login', parsed.error.errors[0].message);
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirectWithError('/login', 'Email or password is not correct.');
    }

    throw error;
  }
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirectWithError('/register', parsed.error.errors[0].message);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }],
    },
  });

  if (existingUser?.email === parsed.data.email) {
    redirectWithError('/register', 'That email is already registered.');
  }

  if (existingUser?.username === parsed.data.username) {
    redirectWithError('/register', 'That username is already taken.');
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      username: parsed.data.username,
      password: hashedPassword,
      name: parsed.data.name,
      profession: parsed.data.profession || null,
      location: parsed.data.location || null,
    },
  });

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirectWithError('/login', 'Profile created, but sign in failed. Try signing in manually.');
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect('/profile/edit?error=invalid-profile');
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      profession: parsed.data.profession || null,
      location: parsed.data.location || null,
      website: parsed.data.website || null,
      bio: parsed.data.bio || null,
    },
  });

  redirect(`/profile/${session.user.id}`);
}
