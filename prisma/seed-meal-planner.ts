import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({connectionString});
const prisma = new PrismaClient({adapter});

const ingredientCategories = [
  {name: "Vegetables", slug: "vegetables", sortOrder: 1},
  {name: "Fruit", slug: "fruit", sortOrder: 2},
  {name: "Herbs", slug: "herbs", sortOrder: 3},
  {name: "Grains", slug: "grains", sortOrder: 4},
  {name: "Legumes", slug: "legumes", sortOrder: 5},
  {name: "Dairy", slug: "dairy", sortOrder: 6},
  {name: "Meat", slug: "meat", sortOrder: 7},
  {name: "Fish", slug: "fish", sortOrder: 8},
  {name: "Oils", slug: "oils", sortOrder: 9},
  {name: "Spices", slug: "spices", sortOrder: 10},
  {name: "Canned goods", slug: "canned-goods", sortOrder: 11},
  {name: "Baking", slug: "baking", sortOrder: 12},
  {name: "Broths", slug: "broths", sortOrder: 13},
];

const recipeCategories = [
  {name: "Pasta", slug: "pasta", sortOrder: 1},
  {name: "Soups & Stews", slug: "soups-stews", sortOrder: 2},
  {name: "Salads", slug: "salads", sortOrder: 3},
  {name: "Main Dishes", slug: "main-dishes", sortOrder: 4},
  {name: "Side Dishes", slug: "side-dishes", sortOrder: 5},
  {name: "Desserts", slug: "desserts", sortOrder: 6},
];

const ingredientCatalog = [
  {name: "Tomate", categorySlug: "vegetables"},
  {name: "Zwiebel", categorySlug: "vegetables"},
  {name: "Karotte", categorySlug: "vegetables"},
  {name: "Zucchini", categorySlug: "vegetables"},
  {name: "Paprika", categorySlug: "vegetables"},
  {name: "Gurke", categorySlug: "vegetables"},
  {name: "Rote Zwiebel", categorySlug: "vegetables"},
  {name: "Kartoffel", categorySlug: "vegetables"},
  {name: "Knoblauch", categorySlug: "vegetables"},

  {name: "Basilikum", categorySlug: "herbs"},
  {name: "Schnittlauch", categorySlug: "herbs"},

  {name: "Pasta", categorySlug: "grains"},
  {name: "Reis", categorySlug: "grains"},

  {name: "Rote Linse", categorySlug: "legumes"},

  {name: "Milch", categorySlug: "dairy"},
  {name: "Ei", categorySlug: "dairy"},
  {name: "Butter", categorySlug: "dairy"},
  {name: "Feta", categorySlug: "dairy"},
  {name: "Quark", categorySlug: "dairy"},
  {name: "Saure Sahne", categorySlug: "dairy"},

  {name: "Olivenöl", categorySlug: "oils"},

  {name: "Currypulver", categorySlug: "spices"},
  {name: "Salz", categorySlug: "spices"},

  {name: "Passierte Tomaten", categorySlug: "canned-goods"},
  {name: "Kokosmilch", categorySlug: "canned-goods"},
  {name: "Olive", categorySlug: "canned-goods"},

  {name: "Mehl", categorySlug: "baking"},

  {name: "Gemüsebrühe", categorySlug: "broths"},
];

const recipes = [
  {
    title: "Tomaten-Pasta",
    categorySlug: "pasta",
    description: "Ein einfacher italienisch inspirierter Nudelklassiker.",
    instructions:
      "Pasta in Salzwasser kochen. Zwiebel und Knoblauch fein schneiden und in Olivenöl anbraten. Tomaten und passierte Tomaten hinzufügen und etwa 10 Minuten köcheln lassen. Mit Salz abschmecken, Pasta untermischen und mit Basilikum servieren.",
    prepTime: 25,
    servings: 2,
    ingredients: [
      {name: "Pasta", amount: 200, unit: "g"},
      {name: "Tomate", amount: 2, unit: "Stück"},
      {name: "Passierte Tomaten", amount: 200, unit: "g"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 1, unit: "Zehe"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Basilikum", amount: 1, unit: "Handvoll"},
      {name: "Salz", amount: null, unit: null},
    ],
  },
  {
    title: "Gemüse-Curry",
    categorySlug: "main-dishes",
    description: "Cremiges Curry mit Gemüse, Reis und Kokosmilch.",
    instructions:
      "Reis nach Packungsanleitung kochen. Zwiebel und Knoblauch schneiden und in etwas Olivenöl anbraten. Karotte, Zucchini und Paprika klein schneiden und dazugeben. Currypulver einrühren, Kokosmilch und Gemüsebrühe hinzufügen und köcheln lassen, bis das Gemüse gar ist. Mit Reis servieren.",
    prepTime: 35,
    servings: 2,
    ingredients: [
      {name: "Reis", amount: 150, unit: "g"},
      {name: "Karotte", amount: 1, unit: "Stück"},
      {name: "Zucchini", amount: 1, unit: "Stück"},
      {name: "Paprika", amount: 1, unit: "Stück"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 1, unit: "Zehe"},
      {name: "Kokosmilch", amount: 200, unit: "ml"},
      {name: "Currypulver", amount: 2, unit: "TL"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Gemüsebrühe", amount: 100, unit: "ml"},
    ],
  },
  {
    title: "Pfannkuchen",
    categorySlug: "desserts",
    description: "Klassische Pfannkuchen aus wenigen Grundzutaten.",
    instructions:
      "Mehl, Milch, Eier und eine Prise Salz zu einem glatten Teig verrühren. Kurz ruhen lassen. Etwas Butter in einer Pfanne erhitzen und den Teig portionsweise von beiden Seiten goldbraun ausbacken.",
    prepTime: 20,
    servings: 2,
    ingredients: [
      {name: "Mehl", amount: 125, unit: "g"},
      {name: "Milch", amount: 250, unit: "ml"},
      {name: "Ei", amount: 2, unit: "Stück"},
      {name: "Butter", amount: 1, unit: "EL"},
      {name: "Salz", amount: null, unit: null},
    ],
  },
  {
    title: "Griechischer Salat",
    categorySlug: "salads",
    description: "Frischer Salat mit Tomaten, Gurke, Feta und Oliven.",
    instructions:
      "Tomaten und Gurke in mundgerechte Stücke schneiden. Rote Zwiebel in feine Streifen schneiden. Feta zerbröseln und mit den Oliven zum Gemüse geben. Mit Olivenöl und Salz abschmecken.",
    prepTime: 15,
    servings: 2,
    ingredients: [
      {name: "Tomate", amount: 3, unit: "Stück"},
      {name: "Gurke", amount: 0.5, unit: "Stück"},
      {name: "Rote Zwiebel", amount: 0.5, unit: "Stück"},
      {name: "Feta", amount: 150, unit: "g"},
      {name: "Olive", amount: 50, unit: "g"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Salz", amount: null, unit: null},
    ],
  },
  {
    title: "Ofenkartoffeln mit Kräuterquark",
    categorySlug: "side-dishes",
    description: "Knusprige Kartoffeln mit frischem Schnittlauchquark.",
    instructions:
      "Backofen auf 200 °C Ober-/Unterhitze vorheizen. Kartoffeln waschen, in Spalten schneiden und mit Olivenöl und Salz vermengen. Auf einem Blech etwa 35–45 Minuten backen, bis sie knusprig sind. Quark mit etwas saurer Sahne, fein geschnittenem Schnittlauch und Salz verrühren und dazu servieren.",
    prepTime: 50,
    servings: 2,
    ingredients: [
      {name: "Kartoffel", amount: 500, unit: "g"},
      {name: "Quark", amount: 200, unit: "g"},
      {name: "Saure Sahne", amount: 2, unit: "EL"},
      {name: "Schnittlauch", amount: 1, unit: "Bund"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Salz", amount: null, unit: null},
    ],
  },
  {
    title: "Linsensuppe",
    categorySlug: "soups-stews",
    description: "Wärmende Suppe mit roten Linsen und Gemüse.",
    instructions:
      "Zwiebel, Karotte und Knoblauch klein schneiden und in etwas Olivenöl anbraten. Rote Linsen, Gemüsebrühe und Wasser hinzufügen. Etwa 15–20 Minuten köcheln lassen, bis die Linsen weich sind. Mit Salz abschmecken.",
    prepTime: 30,
    servings: 2,
    ingredients: [
      {name: "Rote Linse", amount: 150, unit: "g"},
      {name: "Karotte", amount: 1, unit: "Stück"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 1, unit: "Zehe"},
      {name: "Gemüsebrühe", amount: 500, unit: "ml"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Salz", amount: null, unit: null},
    ],
  },
];

async function main() {
  // 1. Rezeptkategorien anlegen oder aktualisieren.
  for (const category of recipeCategories) {
    await prisma.recipeCategory.upsert({
      where: {slug: category.slug},
      create: category,
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });
  }

  // 2. Zutatenkategorien anlegen oder aktualisieren.
  for (const category of ingredientCategories) {
    await prisma.ingredientCategory.upsert({
      where: {slug: category.slug},
      create: category,
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });
  }

  // 3. Zutaten zentral anlegen oder aktualisieren.
  for (const ingredient of ingredientCatalog) {
    await prisma.ingredient.upsert({
      where: {name: ingredient.name},
      create: {
        name: ingredient.name,
        category: {
          connect: {slug: ingredient.categorySlug},
        },
      },
      update: {
        category: {
          connect: {slug: ingredient.categorySlug},
        },
      },
    });
  }

  // 4. Öffentliche Seed-Rezepte samt Kategorie und Zutaten synchronisieren.
  for (const recipeData of recipes) {
    const ingredientConnections = recipeData.ingredients.map((ingredient) => ({
      amount: ingredient.amount,
      unit: ingredient.unit,
      ingredient: {
        connect: {name: ingredient.name},
      },
    }));

    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        title: recipeData.title,
        userId: null,
        isPublic: true,
      },
    });

    const recipeFields = {
      description: recipeData.description,
      instructions: recipeData.instructions,
      prepTime: recipeData.prepTime,
      servings: recipeData.servings,
      isPublic: true,
      category: {
        connect: {slug: recipeData.categorySlug},
      },
    };

    if (existingRecipe) {
      await prisma.recipe.update({
        where: {id: existingRecipe.id},
        data: {
          ...recipeFields,
          ingredients: {
            deleteMany: {},
            create: ingredientConnections,
          },
        },
      });

      console.log(`Updated recipe: ${recipeData.title}`);
    } else {
      await prisma.recipe.create({
        data: {
          title: recipeData.title,
          ...recipeFields,
          ingredients: {
            create: ingredientConnections,
          },
        },
      });

      console.log(`Created recipe: ${recipeData.title}`);
    }
  }

  console.log("Meal Planner seed completed.");
}

main()
  .catch((error: unknown) => {
    console.error("Meal Planner seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
