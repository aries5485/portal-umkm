import Map from '@/components/map/Map'
import { createClient } from '@/lib/supabase-server'
import AboutUsModal from '@/components/AboutUsModal'
import Navbar from '@/components/Navbar'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* Header Overlay */}
      <Navbar user={user} />

      {/* Map Component */}
      <Map />
    </main>
  )
}
