import { supabase } from './utils/supabase'

export default async function Home() {
  const { data: usuarios, error } = await supabase.from('usuarios').select('*')

  if (error) {
    console.error('Error fetching usuarios:', error)
    return <div>Error fetching usuarios</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">My Items</h1>
      <ul>
        {usuarios?.map((usuario) => (
          <li key={usuario.id}>{usuario.nombre}</li>
        ))}
      </ul>
    </main>
  )
}
