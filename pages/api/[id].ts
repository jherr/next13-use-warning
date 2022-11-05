import type { NextApiRequest, NextApiResponse } from "next";

import pokemon from "../../data/pokemon.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | (typeof pokemon[0] & {
        image: string;
      })
    | undefined
  >
) {
  const p = pokemon.find((p) => p.id === Number(req.query.id));
  res.status(200).json(
    p
      ? {
          ...p,
          image: `/${p.name.toLowerCase()}.jpg`,
        }
      : undefined
  );
}
