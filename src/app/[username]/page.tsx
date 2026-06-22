import Profile from '@/components/Profile/Profile'
import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const user = await prisma.user.findUnique({
    where: { username: params.username.toLowerCase() },
  })

  if (!user) {
    notFound()
  }

  return (
    <div>
      <Profile username={user.username} />
    </div>
  )
}