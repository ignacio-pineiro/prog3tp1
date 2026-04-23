import Link from "next/link";

export default async function MatchDetailPage({ params }) {
    
    const { id } = await params;

    const match = {
        id: params.id,
        team1: "Los Tigres",
        team2: "Los Leones",
        date: "2026-04-15",
        location: "Estadio Central"
    }

    return (
    <div className="p-10">

        <Link href="/matches" className="self-start mb-4 text-white font-semibold">
            &larr; Volver a Partidos
        </Link>

        <h1 className="text-3xl mb-4">Detalle del Partido</h1>

        <div className="p-6 border rounded">
            <p className="text-xl font-semibold mb-2">
            {match.team1} vs {match.team2}
            </p>
            <p>Fecha: {match.date}</p>
            <p>Estadio: {match.location}</p>
        </div>
    </div>
    )
}