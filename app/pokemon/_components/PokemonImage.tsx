//import Image from "next/image";
import type {IPokemonImage} from "@/app/pokemon/_lib/types";

/* const imageStyle = {
  width: "64px",
  height: "auto",
}; */

export default function PokemonImage({url, alt, className}: IPokemonImage) {
  return (
    <img
      loading="eager"
      src={url}
      alt={alt}
      className={className}
    />
  );
}
