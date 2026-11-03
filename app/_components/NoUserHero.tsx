import {panelClass} from "@/app/_lib/tailwind";
import LoginButton from "@/app/user/_components/LoginButton";

type NoUserHeroProps = {
  text: string;
};

export default function NoUserHero({text}: NoUserHeroProps) {
  return (
    <section className={`${panelClass} p-6 sm:p-8`}>
      <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
        Anmeldung erforderlich
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
        {text}
      </p>
      <div className="mt-5">
        <LoginButton defaultIndex={1} />
      </div>
    </section>
  );
}
