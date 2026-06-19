export default async function MatchDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="bg-zinc-500 w-full h-screen mt-4">
      <p>Resumen {id}</p>
    </div>
  )
}