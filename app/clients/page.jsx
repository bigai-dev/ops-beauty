'use client'

import { useRouter } from 'next/navigation'
import { Clients } from '@/screens/Clients'

export default function Page() {
  const router = useRouter()
  return <Clients onViewClient={(id) => router.push(`/clients/${id}`)} />
}
