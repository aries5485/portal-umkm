import Map from '@/components/map/Map'
import { createClient } from '@/lib/supabase-server'
import AboutUsModal from '@/components/AboutUsModal'
import Navbar from '@/components/Navbar'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? null
  }

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* Header Overlay */}
      <Navbar user={user} role={role} />

      {/* Map Component */}
      <Map />
    </main>
  )
}
