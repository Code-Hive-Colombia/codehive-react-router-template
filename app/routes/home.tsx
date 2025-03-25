import React from "react";
import { Await } from "react-router";

import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "CodeHive" },
    { name: "description", content: "CodeHive Template" },
  ];
}

export function loader({ request, context }: Route.LoaderArgs) {
  // Express context
  const { EXPRESS_CONTEXT_EXAMPLE: express } = context;

  // Search Params
  const url = new URL(request.url);
  const name = url.searchParams.get("name") ?? 'Use "?name=<string>" in url';

  // Async operation
  const getAsyncOperation = async () => {
    await new Promise((res) => setTimeout(res, 5000));
    return "Promised value";
  };

  const asyncValue = getAsyncOperation();

  return { name, express, asyncValue };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { name, express, asyncValue } = loaderData;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">Index Page</h1>

      <ul className="list-disc list-inside mt-4 font-mon">
        <li>URL SearchParams: {name}</li>
        <li>Express Context: {express}</li>
        <li>
          Async Value:{" "}
          <React.Suspense
            fallback={
              <span className="animate-pulse">
                <span className="bg-gray-300 text-gray-500 min-h-2 px-8 rounded-lg">
                  Cargando
                </span>
              </span>
            }
          >
            <Await resolve={asyncValue}>
              {(value) => <span>{value}</span>}
            </Await>
          </React.Suspense>
        </li>
      </ul>
    </main>
  );
}
