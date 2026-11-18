'use client'

import { useParams, useRouter } from 'next/navigation'
import { ClientDetail } from '@/screens/ClientDetail'

export default function Page() {
  const { id } = useParams()
  const router = useRouter()
  // Client IDs are numbers in the store; the address gives a string
  return <ClientDetail clientId={Number(id)} onBack={() => router.push('/clients')} />
}
