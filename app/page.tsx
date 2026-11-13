import {
  getPublicRecipesCount,
  getPantryCount,
  getMealPlanCount,
  getShoppingItemCount,
} from "@/app/recipes/_lib/queries";
import {getCurrentUser} from "@/lib/auth/session";
import CookingHero from "@/app/_components/CookingHero";
import PersonalDashboard from "@/app/_components/PersonalDashboard";
import GuestDashboard from "@/app/_components/GuestDashboard";

export default async function HomePage() {
  const user = await getCurrentUser();
  const [recipeCount, pantryCount, mealCount, shoppingCount] =
    await Promise.all([
      getPublicRecipesCount(),
      user ? getPantryCount(user.id) : null,
      user ? getMealPlanCount(user.id) : null,
      user ? getShoppingItemCount(user.id) : null,
    ]);

  return (
    <main className="flex-1 mx-auto w-full h-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-8">
        {!user ? (
          <CookingHero />
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex">
            {/* <CalendarDays size={16} aria-hidden="true" /> */}
            Dashboard
          </h1>
        )}
      </section>

      {/* Main features */}
      {user ? (
        <PersonalDashboard
          recipeCount={recipeCount}
          pantryCount={pantryCount}
          mealCount={mealCount}
          shoppingCount={shoppingCount}
        />
      ) : (
        <GuestDashboard recipeCount={recipeCount} />
      )}

      {/* {user && <MealPlanBanner />} */}
    </main>
  );
}
