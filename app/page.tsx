"use client";

import { use, useState } from "react";

type Pokemon = { id: number; name: string; image?: string };

function makeQueryClient() {
  const fetchMap = new Map<string, Promise<any>>();
  return function queryClient<QueryResult>(
    name: string,
    query: () => Promise<QueryResult>
  ): Promise<QueryResult> {
    if (!fetchMap.has(name)) {
      fetchMap.set(name, query());
    }
    return fetchMap.get(name)!;
  };
}

const queryClient = makeQueryClient();

export default function Home() {
  const pokemon = use(
    queryClient(
      "pokemon",
      () =>
        fetch("http://localhost:3000/api/pokemon").then((res) =>
          res.json()
        ) as Promise<Pokemon[]>
    )
  );

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();

  const pokemonDetail = selectedPokemon
    ? use(
        queryClient(
          ["pokemon", selectedPokemon.id].join("-"),
          () =>
            fetch(`http://localhost:3000/api/${selectedPokemon.id}`).then(
              (res) => res.json()
            ) as Promise<Pokemon>
        )
      )
    : null;

  return (
    <div>
      {pokemon.map((p) => (
        <button key={p.id} onClick={() => setSelectedPokemon(p)}>
          {p.name}
        </button>
      ))}
      <div>{pokemonDetail && <img src={pokemonDetail.image} />}</div>
    </div>
  );
}
