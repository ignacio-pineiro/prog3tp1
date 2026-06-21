import Incident from '@/app/components/matches/Incident';
// to replace with fetch GET /api/match/{matchId}
import incidents from '@/lib/match-id-incidents.json'

export default async function MatchDetailPage({ params }) {
  const { id } = await params;

  const resumen = incidents.data.result.data.incidents

  return (
    <div className="bg-green-200 w-full">
      {resumen.map((incident, key) =>
        <Incident incident={incident} key={key} />
      )}
    </div>
  )
}