import Map from '@/components/map/Map'
import { createClient } from '@/lib/supabase-server'
import AboutUsModal from '@/components/AboutUsModal'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* Header Overlay */}
      <header className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-[90%] max-w-4xl">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg px-6 py-3 flex justify-between items-center border border-white/50">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <span>🗺️</span> Portal UMKM
          </h1>
          <nav className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-600 hidden sm:block">Halo, {user.email?.split('@')[0]}</span>
                <AboutUsModal />
                <a href="/dashboard" className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 hover:shadow-md transition">Dashboard</a>
              </>
            ) : (
              <>
                <AboutUsModal />
                <a href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition">Login</a>
                <a href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 hover:shadow-md transition">Daftar UMKM</a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Map Component */}
      <Map />
    </main>
  )
}
