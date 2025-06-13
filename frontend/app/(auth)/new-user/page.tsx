import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const createNewUser = async () => {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  try {
    const response = await fetch('http://localhost:8080/api/clerk-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    redirect('/branding');
  } catch (error) {
    console.error('Error creating user:', error);
    redirect('/sign-in');
  }
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