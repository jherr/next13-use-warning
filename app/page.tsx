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

const baseURL = 'https://rohanbagchi-orange-space-train-7w6xrqp7pvfrg-3000.preview.app.github.dev/';

export default function Home() {
  const pokemon = use(
    queryClient<Pokemon[]>(
      "pokemon",
      () =>
        fetch(`${baseURL}/api/pokemon`).then((res) =>
          res.json()
        )
    )
  );

  // return <pre>{JSON.stringify(pokemon, null, 2)}</pre>


  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();

  const pokemonDetail = selectedPokemon
    ? use(
        queryClient<Pokemon>(
          ["pokemon", selectedPokemon.id].join("-"),
          () =>
            fetch(`${baseURL}/api/${selectedPokemon.id}`).then(
              (res) => res.json()
            )
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
