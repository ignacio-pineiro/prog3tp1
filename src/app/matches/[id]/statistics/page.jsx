export default async function MatchStatsPage({ params }) {
  const { id } = await params;

  return (
    <div className="bg-purple-500 w-full h-screen mt-4">
      <p>Estadísticas {id}</p>
    </div>
  )
}