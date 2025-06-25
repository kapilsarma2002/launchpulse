import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const createNewUser = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    console.log('No user or user id found, aborting user creation.');
    return;
  }
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    }
  })

  if (match) {
    console.log('User already exists in database', user.id);
  }

  if (!match) {
    console.log('Creating new user in database', user.id);
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress as string,
      }
    })
  }

  redirect('/branding');
}

const NewUser = async () => {
  await createNewUser();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader border-t-transparent border-4 border-white rounded-full w-8 h-8 animate-spin" />
    </div>
  );
}

export default NewUser;