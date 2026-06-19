export default async function MatchLineupsPage({ params }) {
  const { id } = await params;

  return (
    <div className="bg-blue-500 w-full h-screen mt-4">
      <p>Alineacion {id}</p>
    </div>

  )
}