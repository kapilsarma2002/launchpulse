import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const createNewUser = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    return;
  }
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    }
  })


  if (!match) {
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress as string,
      }
    })

    await prisma.app.create({
      data: {
        ownerId: newUser.id
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