import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { identificador } = await req.json();
  console.log(identificador);

  const res = await fetch(
    "https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/get_info_curp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.X_API_KEY ?? "",
      },
      body: JSON.stringify({ identificador }),
    },
  );

  const data = await res.json();
  return NextResponse.json(data);
}
