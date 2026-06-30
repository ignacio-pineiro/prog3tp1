import MatchCard from "./MatchCard";

export default function RoundColumn({ title, partidos }) {
  const partidosOrdenados = [...partidos].sort((a, b) => a.orden - b.orden);

  return (
    <section className="flex min-w-72 flex-col gap-4">
      <h2 className="sticky top-0 z-10 rounded-lg bg-indigo-700 px-4 py-2 text-center text-lg font-bold text-white">
        {title}
      </h2>

      <div className="flex flex-col gap-4">
        {partidosOrdenados.map((partido) => (
          <MatchCard key={partido.id} partido={partido} />
        ))}
      </div>
    </section>
  );
}