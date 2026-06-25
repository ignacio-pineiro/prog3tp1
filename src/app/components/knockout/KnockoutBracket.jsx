import RoundColumn from "./RoundColumn";

const rondas = [
  "16avos",
  "Octavos",
  "Cuartos",
  "Semifinal",
  "Tercer puesto",
  "Final",
];

export default function KnockoutBracket({ partidos }) {
  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex min-w-max gap-8">
        {rondas.map((ronda) => {
          const partidosDeRonda = partidos.filter(
            (partido) => partido.ronda === ronda
          );

          return (
            <RoundColumn
              key={ronda}
              title={ronda}
              partidos={partidosDeRonda}
            />
          );
        })}
      </div>
    </div>
  );
}