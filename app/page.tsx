import MealPlanBanner from "@/app/_components/MealPlanBanner";
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
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-12">
        <CookingHero />
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
