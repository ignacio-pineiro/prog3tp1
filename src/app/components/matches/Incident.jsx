export default function Incident({ incident }) {
  const side = (incident.isHome) ? ('flex-row') : ('flex-row-reverse')


  switch (incident.incidentType) {
    case 'injuryTime':
      return (
        <section className="flex justify-center">
          <p>+{incident.length}'</p>
        </section>
      )
    case 'period':
      return (
        <section className="flex justify-center gap-2 items-center mx-3 my-2">
          <p>{incident.text}</p>
        </section>
      )
    case 'card':
      return (
        <section className={`flex gap-2 items-center ${side} mx-3 my-2`}>
          <p>{incident.time}{(incident.addedTime) && (`+ ${incident.addedTime}`)}'</p>
          <div className="border rounded p-1">
            <svg width="16" height="16" fill={incident.incidentClass} className="bi bi-file-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2" />
            </svg>
          </div>
          <p className="font-semibold">{incident.playerName}</p>
          <p>({incident.reason})</p>
        </section>
      )
    case 'goal':
      return (
        <section className={`flex gap-2 items-center ${side} mx-3 my-2`}>
          <p>{incident.time}{(incident.addedTime) && (`+ ${incident.addedTime}`)}'</p>
          <div className="flex items-center gap-1 border rounded p-1">
            <svg aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 48 48">
              <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
                <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"></path>
                <path d="M30.0926 6.5L24.0693 10.859V15.2179L31.8135 21.3205L36.1158 19.5769L38.6972 12.6026"></path>
                <path d="M18.0461 6.5L24.0693 10.859V15.2179L16.3251 21.3205L12.0228 19.5769L9.44141 12.6026"></path>
                <path d="M6 22.1923L12.0233 19.5769L16.3256 21.3205L18.907 30.9102L16.3256 34.3974H8.5814"></path>
                <path d="M16.3252 40.4999V34.3973L18.9066 30.9102H29.2322L31.8136 34.3973V40.4999"></path>
                <path d="M39.558 34.3974H31.8138L29.2324 30.9102L31.8138 21.3205L36.1161 19.5769L42.9999 23.0641"></path>
              </g>
            </svg>
            <p className="text-xs font-bold">{incident.homeScore} - {incident.awayScore}</p>
          </div>
          <p className="font-semibold">{incident.player.shortName}</p>
          <p>({incident.assist1.shortName})</p>
        </section>
      )
    case 'substitution':
      return (
        <section className={`flex gap-2 items-center ${side} mx-3 my-2`}>
          <p>{incident.time}'</p>
          <div className="flex items-center gap-1 border rounded p-1">
            <svg width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5" />
            </svg>
          </div>
          <p className="font-semibold">{incident.playerIn.shortName}</p>
          <p>{incident.playerOut.shortName}</p>
        </section>
      )

      case 'varDecision':
        return (
          <></>
        )

    default:
      console.log(incident);
      
      return (
        <section className="bg-red-600 flex justify-between w-1/4">
          <p className="font-black">{incident.incidentType}'</p>
        </section>
      )
  }

}