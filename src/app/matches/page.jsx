import Link from "next/link";

export default function page() {

  const matches = [
    { id: 1, team1: "Tigres", team2: "Leones", date: "2026-04-20" },
    { id: 2, team1: "Águilas", team2: "Lobos", date: "2026-04-22" },
  ];

  return (
    <>
      <div className="w-full">
        <h1 className="p-10 text-4xl">Partidos</h1>
      </div>
      
      <div>
        <p className="p-10 text-2xl">Aquí se podran registrar los partidos.</p>
      </div>

      <Link
        href="/matches/create_match" className="inline-block mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        + Crear partido
      </Link>

      <div className="space-y-4 w-full mx-auto">
        {matches.map((match) => (
          <Link key={match.id} href={`/matches/${match.id}`} className="block p-4 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <p className="font-semibold">
              {match.team1} vs {match.team2}
            </p>
            <p className="text-sm text-zinc-500">{match.date}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
