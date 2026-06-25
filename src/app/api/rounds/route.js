import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  try {
    const url = 'https://v2.football.sportsapipro.com/api/world-cup-2026/rounds'
    const apiKey = process.env.SPORTS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Configuracion incompleta: FALTA API KEY!' }, { status: 500 })
    }

    const response = await axios.get(url, {
      headers: { 'x-api-key': apiKey }
    })

    const data = await response.data

    if (!data.success) {
      console.error('Error en la API de deportes')
      return NextResponse.json(
        { error: `Error en la API de deportes ${data.error?.message}` || 'Peticion invalida' },
        { status: response.status || 400 }
      )
    }

    const roundData = data.data || []

    return NextResponse.json({ success: true, result: roundData })

  } catch (error) {
    console.error('Error critico en la ruta /api/rounds')
    return NextResponse.json(
      { error: 'Error interno en el servidor al procesar la solicitud' },
      { status: 500 }
    )
  }
}