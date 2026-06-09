import { auth } from '@/core/auth/auth';

export async function getCurrentSession() {
  return auth();
}
