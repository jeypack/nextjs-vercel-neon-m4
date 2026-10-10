"use client";

import type {IPokemonResults} from "@/app/pokemon/_lib/types";
import getPokemonPage from "@/app/pokemon/_lib/actions";
import {useState} from "react";
import PokemonCard from "@/app/pokemon/_components/PokemonCard";

export default function PokemonPage({result}: {result: IPokemonResults}) {
  
  const [index, setIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState<IPokemonResults>(result);
  const pageSize = 20;
  const prevUrl = currentPage.previous;
  const nextUrl = currentPage.next;

  const handlePageChange = (url: string) => {
    console.log("Page changed to:", url);
    getPokemonPage(url).then(setCurrentPage);
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-auto w-full">
        {currentPage.data.map(({id, name, url}) => (
          <PokemonCard key={id} id={id} name={name} url={url} />
        ))}
      </div>
      <div className="mt-8 flex gap-4 justify-around items-center mx-auto">
        <button
          className={
            "px-4 py-2 bg-blue-500 text-white rounded" +
            (index === 1 ? " opacity-50 cursor-not-allowed" : " cursor-pointer")
          }
          disabled={index === 1}
          onClick={() => {
            setIndex((prev) => Math.max(prev - 1, 1));
            handlePageChange(prevUrl ?? "");
          }}
        >
          Previous
        </button>
        <div className="flex-1 flex flex-row items-center justify-center text-center">
          <p className="text-center">
            Page {index} of {Math.ceil(currentPage.count / pageSize)}
          </p>
        </div>
        <button
          className={
            "px-4 py-2 bg-blue-500 text-white rounded" +
            (index === Math.ceil(currentPage.count / pageSize)
              ? " opacity-50 cursor-not-allowed"
              : " cursor-pointer")
          }
          disabled={index === Math.ceil(currentPage.count / pageSize)}
          onClick={() => {
            setIndex((prev) => prev + 1);
            handlePageChange(nextUrl ?? "");
          }}
        >
          Next
        </button>
      </div>
    </>
  );
}
