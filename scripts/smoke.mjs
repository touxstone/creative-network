import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checks = [
  ['users', () => prisma.user.count(), 4],
  ['posts', () => prisma.post.count(), 2],
  ['comments', () => prisma.comment.count(), 2],
  ['likes', () => prisma.like.count(), 2],
  ['connections', () => prisma.connection.count(), 3],
  ['conversations', () => prisma.conversation.count(), 1],
  ['messages', () => prisma.message.count(), 2],
  ['projects', () => prisma.project.count(), 5],
  ['project links', () => prisma.projectLink.count(), 6],
  ['project calls', () => prisma.projectCall.count(), 3],
  ['project applications', () => prisma.projectApplication.count(), 1],
  ['learning items', () => prisma.learningItem.count(), 6],
  ['learning bookmarks', () => prisma.learningBookmark.count(), 2],
  ['service listings', () => prisma.serviceListing.count(), 4],
  ['service inquiries', () => prisma.serviceInquiry.count(), 1],
];

async function main() {
  const results = [];

  for (const [label, countFn, minimum] of checks) {
    const count = await countFn();
    results.push({ label, count, minimum, ok: count >= minimum });
  }

  const failed = results.filter((result) => !result.ok);

  for (const result of results) {
    const status = result.ok ? 'ok' : 'fail';
    console.log(`${status.padEnd(4)} ${result.label}: ${result.count} / expected >= ${result.minimum}`);
  }

  if (failed.length > 0) {
    throw new Error(`Smoke check failed: ${failed.map((result) => result.label).join(', ')}`);
  }

  console.log('Smoke check passed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
