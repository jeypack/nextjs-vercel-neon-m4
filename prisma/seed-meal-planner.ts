import {prisma} from "../lib/prisma";

const recipes = [
  {
    title: "Tomaten-Pasta",
    description: "Ein einfacher italienischer Nudelklassiker.",
    instructions:
      "Nudeln in Salzwasser kochen. Knoblauch in Olivenöl anbraten, Tomaten hinzufügen und köcheln lassen. Nudeln mit der Sauce vermengen und mit Parmesan servieren.",
    prepTime: 25,
    servings: 2,
    ingredients: [
      {name: "Pasta", amount: 200, unit: "g"},
      {name: "Tomaten", amount: 400, unit: "g"},
      {name: "Knoblauch", amount: 2, unit: "Zehen"},
      {name: "Olivenöl", amount: 2, unit: "EL"},
      {name: "Parmesan", amount: 40, unit: "g"},
    ],
  },
  {
    title: "Gemüse-Curry",
    description: "Cremiges Curry mit Kokosmilch und Gemüse.",
    instructions:
      "Reis nach Packungsanleitung kochen. Gemüse schneiden und mit Currypaste anbraten. Kokosmilch hinzufügen und etwa 15 Minuten köcheln lassen. Mit Reis servieren.",
    prepTime: 30,
    servings: 2,
    ingredients: [
      {name: "Reis", amount: 150, unit: "g"},
      {name: "Kokosmilch", amount: 400, unit: "ml"},
      {name: "Paprika", amount: 1, unit: "Stück"},
      {name: "Zucchini", amount: 1, unit: "Stück"},
      {name: "Currypaste", amount: 2, unit: "EL"},
    ],
  },
  {
    title: "Pfannkuchen",
    description: "Klassische Pfannkuchen für ein süßes Frühstück.",
    instructions:
      "Mehl, Milch, Eier und Salz zu einem glatten Teig verrühren. Kurz ruhen lassen. In einer leicht gefetteten Pfanne portionsweise goldbraun ausbacken.",
    prepTime: 20,
    servings: 2,
    ingredients: [
      {name: "Mehl", amount: 150, unit: "g"},
      {name: "Milch", amount: 250, unit: "ml"},
      {name: "Eier", amount: 2, unit: "Stück"},
      {name: "Salz", amount: 1, unit: "Prise"},
      {name: "Butter", amount: 20, unit: "g"},
    ],
  },
  {
    title: "Griechischer Salat",
    description: "Frischer Salat mit Feta und Oliven.",
    instructions:
      "Gurke, Tomaten und Paprika schneiden. Mit roten Zwiebeln, Oliven und gewürfeltem Feta vermengen. Olivenöl und Zitronensaft darübergeben und würzen.",
    prepTime: 15,
    servings: 2,
    ingredients: [
      {name: "Gurke", amount: 1, unit: "Stück"},
      {name: "Tomaten", amount: 250, unit: "g"},
      {name: "Feta", amount: 150, unit: "g"},
      {name: "Oliven", amount: 50, unit: "g"},
      {name: "Olivenöl", amount: 2, unit: "EL"},
    ],
  },
  {
    title: "Ofenkartoffeln mit Kräuterquark",
    description: "Ein unkompliziertes Ofengericht.",
    instructions:
      "Kartoffeln waschen, in Spalten schneiden und mit Öl sowie Gewürzen vermengen. Bei 200 °C etwa 35–40 Minuten backen. Quark mit Kräutern und etwas Wasser cremig rühren.",
    prepTime: 50,
    servings: 2,
    ingredients: [
      {name: "Kartoffeln", amount: 500, unit: "g"},
      {name: "Quark", amount: 250, unit: "g"},
      {name: "Olivenöl", amount: 2, unit: "EL"},
      {name: "Schnittlauch", amount: 1, unit: "Bund"},
      {name: "Knoblauch", amount: 1, unit: "Zehe"},
    ],
  },
  {
    title: "Linsensuppe",
    description: "Herzhafte Suppe mit roten Linsen und Gemüse.",
    instructions:
      "Zwiebel, Karotte und Knoblauch klein schneiden und anbraten. Linsen, Gemüsebrühe und Gewürze hinzufügen. Etwa 20 Minuten köcheln lassen, bis die Linsen weich sind.",
    prepTime: 30,
    servings: 2,
    ingredients: [
      {name: "Rote Linsen", amount: 150, unit: "g"},
      {name: "Karotten", amount: 2, unit: "Stück"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Gemüsebrühe", amount: 600, unit: "ml"},
      {name: "Knoblauch", amount: 1, unit: "Zehe"},
    ],
  },
];

async function seedMealPlanner() {
  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.ALLOW_PRODUCTION_SEED !== "true"
  ) {
    console.log("Meal Planner seed disabled for production.");
    return;
  }

  for (const recipe of recipes) {
    const {ingredients, ...recipeData} = recipe;

    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        title: recipe.title,
        userId: null,
        isPublic: true,
      },
      select: {id: true},
    });

    if (existingRecipe) {
      await prisma.recipe.update({
        where: {id: existingRecipe.id},
        data: {
          ...recipeData,
          ingredients: {
            deleteMany: {},
            create: ingredients,
          },
        },
      });

      console.log(`Updated recipe: ${recipe.title}`);
    } else {
      await prisma.recipe.create({
        data: {
          ...recipeData,
          userId: null,
          isPublic: true,
          ingredients: {
            create: ingredients,
          },
        },
      });

      console.log(`Created recipe: ${recipe.title}`);
    }
  }

  console.log("Meal Planner seed completed.");
}

seedMealPlanner()
  .catch((error) => {
    console.error("Meal Planner seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
