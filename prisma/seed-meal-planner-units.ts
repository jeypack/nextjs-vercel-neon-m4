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
  {name: "Petersilie", categorySlug: "herbs"},
  {name: "Koriander", categorySlug: "herbs"},

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
  {name: "Kidneybohnen", categorySlug: "legumes"},
  {name: "Kichererbse", categorySlug: "legumes"},
  {name: "Sojagranulat", categorySlug: "legumes"},
  {name: "Bulgur", categorySlug: "grains"},
  {name: "Spaghetti", categorySlug: "grains"},
  {name: "Arborio-Reis", categorySlug: "grains"},
  {name: "Makkaroni", categorySlug: "grains"},
  {name: "Mais", categorySlug: "canned-goods"},
  {name: "Rote Currypaste", categorySlug: "spices"},
  {name: "Chiliflocken", categorySlug: "spices"},
  {name: "Kreuzkümmel", categorySlug: "spices"},
  {name: "Paprikapulver", categorySlug: "spices"},
  {name: "Pfeffer", categorySlug: "spices"},
  {name: "Schwarzer Pfeffer", categorySlug: "spices"},
  {name: "Oregano", categorySlug: "herbs"},
  {name: "Thymian", categorySlug: "herbs"},
  {name: "Spinat", categorySlug: "vegetables"},
  {name: "Champignon", categorySlug: "vegetables"},
  {name: "Erbse", categorySlug: "vegetables"},
  {name: "Hokkaido-Kürbis", categorySlug: "vegetables"},
  {name: "Stangensellerie", categorySlug: "vegetables"},
  {name: "Brokkoli", categorySlug: "vegetables"},
  {name: "Ingwer", categorySlug: "vegetables"},
  {name: "Limette", categorySlug: "fruit"},
  {name: "Guanciale", categorySlug: "meat"},
  {name: "Speck", categorySlug: "meat"},
  {name: "Rindfleisch", categorySlug: "meat"},
  {name: "Hackfleisch", categorySlug: "meat"},
  {name: "Eigelb", categorySlug: "dairy"},
  {name: "Pecorino", categorySlug: "dairy"},
  {name: "Parmesan", categorySlug: "dairy"},
  {name: "Ziegenkäse", categorySlug: "dairy"},
  {name: "Geriebener Käse", categorySlug: "dairy"},
  {name: "Sahne", categorySlug: "dairy"},
  {name: "Weißwein", categorySlug: "canned-goods"},
  {name: "Tomatenmark", categorySlug: "canned-goods"},
  {name: "Stückige Tomaten", categorySlug: "canned-goods"},
  {name: "Sojasauce", categorySlug: "canned-goods"},
  {name: "Speisestärke", categorySlug: "baking"},
];

const units = [
  {name: "Gramm", symbol: "g", type: "WEIGHT", sortOrder: 1},
  {name: "Kilogramm", symbol: "kg", type: "WEIGHT", sortOrder: 2},

  {name: "Milliliter", symbol: "ml", type: "VOLUME", sortOrder: 3},
  {name: "Liter", symbol: "l", type: "VOLUME", sortOrder: 4},
  {name: "Esslöffel", symbol: "EL", type: "VOLUME", sortOrder: 5},
  {name: "Teelöffel", symbol: "TL", type: "VOLUME", sortOrder: 6},

  {name: "Stück", symbol: "Stück", type: "COUNT", sortOrder: 7},
  {name: "Zehe", symbol: "Zehe", type: "COUNT", sortOrder: 8},
  {name: "Stange", symbol: "Stange", type: "COUNT", sortOrder: 9},
  {name: "Bund", symbol: "Bund", type: "COUNT", sortOrder: 10},
  {name: "Scheibe", symbol: "Scheibe", type: "COUNT", sortOrder: 11},
  {name: "Dose", symbol: "Dose", type: "COUNT", sortOrder: 12},
  {name: "Packung", symbol: "Pck.", type: "COUNT", sortOrder: 13},
  {name: "Flasche", symbol: "Fl.", type: "COUNT", sortOrder: 14},
  {name: "Glas", symbol: "Gl.", type: "COUNT", sortOrder: 15},
  {name: "Handvoll", symbol: "Handvoll", type: "OTHER", sortOrder: 16},
  {name: "Prise", symbol: "Prise", type: "OTHER", sortOrder: 17},
] as const;

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
  {
    title: "Chili sin Carne",
    categorySlug: "soups-stews",
    description:
      "Deftiger vegetarischer Chili-Eintopf mit Kidneybohnen, Mais, Paprika und würzigem Sojagranulat.",
    instructions:
      "Zwiebel und Paprika würfeln, Knoblauch fein hacken. Sojagranulat nach Packungsanleitung vorbereiten. Zwiebel in Olivenöl anbraten, Knoblauch, Paprika und Sojagranulat einige Minuten mitbraten. Tomatenmark, Kreuzkümmel, Paprikapulver und Chiliflocken einrühren. Stückige Tomaten, abgespülte Kidneybohnen und Mais dazugeben und 20–25 Minuten köcheln lassen. Mit Salz und Pfeffer abschmecken. Alternativ kann Sojagranulat durch Bulgur ersetzt werden; dann etwas zusätzliche Gemüsebrühe zugeben.",
    prepTime: 40,
    servings: 2,
    ingredients: [
      {name: "Kidneybohnen", amount: 240, unit: "g"},
      {name: "Mais", amount: 150, unit: "g"},
      {name: "Paprika", amount: 1, unit: "Stück"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 2, unit: "Zehen"},
      {name: "Sojagranulat", amount: 100, unit: "g"},
      {name: "Stückige Tomaten", amount: 400, unit: "g"},
      {name: "Tomatenmark", amount: 1, unit: "EL"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Kreuzkümmel", amount: 1, unit: "TL"},
      {name: "Paprikapulver", amount: 1, unit: "TL"},
      {name: "Chiliflocken", amount: null, unit: null},
      {name: "Salz", amount: null, unit: null},
      {name: "Pfeffer", amount: null, unit: null},
    ],
  },
  {
    title: "Thailändisches Curry mit Kichererbsen",
    categorySlug: "main-dishes",
    description:
      "Schnelles, cremiges Thai-Curry mit Kichererbsen, Kokosmilch und frischem Spinat.",
    instructions:
      "Zwiebel würfeln, Knoblauch und Ingwer fein hacken. Öl erhitzen und Zwiebel glasig anbraten. Knoblauch, Ingwer und rote Currypaste kurz mitbraten. Kokosmilch und abgespülte Kichererbsen hinzufügen und 10–15 Minuten sanft köcheln lassen. Spinat unterheben und zusammenfallen lassen. Mit Limettensaft und Salz abschmecken. Dazu passt Reis.",
    prepTime: 25,
    servings: 2,
    ingredients: [
      {name: "Kichererbse", amount: 240, unit: "g"},
      {name: "Kokosmilch", amount: 400, unit: "ml"},
      {name: "Rote Currypaste", amount: 2, unit: "EL"},
      {name: "Spinat", amount: 150, unit: "g"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 2, unit: "Zehen"},
      {name: "Ingwer", amount: 1, unit: "Stück"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Limette", amount: 1, unit: "Stück"},
      {name: "Salz", amount: null, unit: null},
    ],
  },
  {
    title: "Klassische Spaghetti Carbonara",
    categorySlug: "pasta",
    description:
      "Italienische Carbonara mit Guanciale, Eigelb und Pecorino – ganz ohne Sahne.",
    instructions:
      "Spaghetti in Salzwasser al dente kochen und etwas Kochwasser auffangen. Guanciale in Streifen schneiden und in einer Pfanne langsam knusprig auslassen. Eigelb mit fein geriebenem Pecorino und reichlich schwarzem Pfeffer verrühren. Spaghetti mit dem Guanciale vermengen und die Pfanne vom Herd nehmen. Eigelbmischung mit etwas Nudelwasser unterrühren, bis eine cremige Sauce entsteht. Nicht mehr kochen lassen. Guanciale kann durch Speck ersetzt werden.",
    prepTime: 25,
    servings: 2,
    ingredients: [
      {name: "Spaghetti", amount: 200, unit: "g"},
      {name: "Guanciale", amount: 100, unit: "g"},
      {name: "Eigelb", amount: 3, unit: "Stück"},
      {name: "Pecorino", amount: 50, unit: "g"},
      {name: "Schwarzer Pfeffer", amount: null, unit: null},
      {name: "Salz", amount: null, unit: null},
    ],
  },
  {
    title: "Cremiges Pilz-Risotto",
    categorySlug: "main-dishes",
    description:
      "Cremiges Risotto mit Arborio-Reis, Champignons, Erbsen, Weißwein und Parmesan.",
    instructions:
      "Zwiebel würfeln und Champignons in Scheiben schneiden. Gemüsebrühe erhitzen. Zwiebel in Olivenöl und etwas Butter glasig dünsten, Reis zugeben und kurz mitrösten. Mit Weißwein ablöschen. Heiße Brühe nach und nach zugießen und unter Rühren einkochen lassen. Nach etwa 10 Minuten Champignons und Erbsen zugeben. Weitergaren, bis der Reis cremig und bissfest ist. Vom Herd nehmen, Parmesan und Butter einrühren und abschmecken.",
    prepTime: 40,
    servings: 2,
    ingredients: [
      {name: "Arborio-Reis", amount: 180, unit: "g"},
      {name: "Champignon", amount: 250, unit: "g"},
      {name: "Erbse", amount: 100, unit: "g"},
      {name: "Weißwein", amount: 100, unit: "ml"},
      {name: "Gemüsebrühe", amount: 600, unit: "ml"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Butter", amount: 20, unit: "g"},
      {name: "Parmesan", amount: 50, unit: "g"},
      {name: "Salz", amount: null, unit: null},
      {name: "Pfeffer", amount: null, unit: null},
    ],
  },
  {
    title: "Kürbis-Ziegenkäse-Quiche",
    categorySlug: "main-dishes",
    description:
      "Herzhafte Quiche mit Hokkaido-Kürbis, Zwiebeln und würzigem Ziegenkäse.",
    instructions:
      "Backofen auf 190 °C Ober-/Unterhitze vorheizen. Mehl, kalte Butter, ein Ei und Salz zu einem Mürbeteig verkneten, kalt stellen und in eine Quicheform drücken. Kürbis entkernen und grob raspeln, Zwiebel würfeln. Beides kurz anbraten und auf dem Teig verteilen. Sahne mit zwei Eiern, Salz, Pfeffer und Thymian verrühren und darübergeben. Ziegenkäse in Scheiben darauflegen. 35–40 Minuten backen, bis die Füllung gestockt und der Rand goldbraun ist.",
    prepTime: 60,
    servings: 4,
    ingredients: [
      {name: "Mehl", amount: 200, unit: "g"},
      {name: "Butter", amount: 100, unit: "g"},
      {name: "Ei", amount: 3, unit: "Stück"},
      {name: "Hokkaido-Kürbis", amount: 400, unit: "g"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Ziegenkäse", amount: 150, unit: "g"},
      {name: "Sahne", amount: 150, unit: "ml"},
      {name: "Thymian", amount: 1, unit: "TL"},
      {name: "Salz", amount: null, unit: null},
      {name: "Pfeffer", amount: null, unit: null},
    ],
  },
  {
    title: "Linsen-Bolognese",
    categorySlug: "pasta",
    description:
      "Vegetarische Bolognese mit roten Linsen, feinem Gemüse und aromatischer Tomatensauce.",
    instructions:
      "Zwiebel, Karotte, Sellerie und Knoblauch fein würfeln. In Olivenöl etwa 8 Minuten anschwitzen. Tomatenmark und Oregano einrühren. Rote Linsen, passierte Tomaten und Gemüsebrühe hinzufügen. Bei niedriger Hitze 30–40 Minuten köcheln lassen, bei Bedarf Wasser ergänzen, bis die Linsen weich und die Sauce sämig sind. Mit Salz und Pfeffer abschmecken und mit Pasta servieren.",
    prepTime: 50,
    servings: 2,
    ingredients: [
      {name: "Rote Linse", amount: 150, unit: "g"},
      {name: "Passierte Tomaten", amount: 400, unit: "g"},
      {name: "Karotte", amount: 1, unit: "Stück"},
      {name: "Stangensellerie", amount: 1, unit: "Stange"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 2, unit: "Zehen"},
      {name: "Tomatenmark", amount: 1, unit: "EL"},
      {name: "Gemüsebrühe", amount: 200, unit: "ml"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
      {name: "Oregano", amount: 1, unit: "TL"},
      {name: "Salz", amount: null, unit: null},
      {name: "Pfeffer", amount: null, unit: null},
    ],
  },
  {
    title: "Klassisches Rindergulasch",
    categorySlug: "main-dishes",
    description:
      "Herzhaftes Rindergulasch mit reichlich Zwiebeln und Paprika, langsam geschmort.",
    instructions:
      "Rindfleisch trocken tupfen und portionsweise in heißem Öl kräftig anbraten. Zwiebeln grob würfeln und im selben Topf goldbraun schmoren. Paprika würfeln und kurz mitbraten. Tomatenmark und Paprikapulver einrühren, mit Brühe ablöschen. Fleisch zurückgeben und zugedeckt bei niedriger Hitze etwa 1,5–2 Stunden schmoren, bis es zart ist. Bei Bedarf Flüssigkeit nachgießen und abschmecken.",
    prepTime: 130,
    servings: 4,
    ingredients: [
      {name: "Rindfleisch", amount: 600, unit: "g"},
      {name: "Zwiebel", amount: 500, unit: "g"},
      {name: "Paprika", amount: 2, unit: "Stück"},
      {name: "Tomatenmark", amount: 2, unit: "EL"},
      {name: "Paprikapulver", amount: 2, unit: "EL"},
      {name: "Gemüsebrühe", amount: 400, unit: "ml"},
      {name: "Olivenöl", amount: 2, unit: "EL"},
      {name: "Salz", amount: null, unit: null},
      {name: "Pfeffer", amount: null, unit: null},
    ],
  },
  {
    title: "Makkaroni-Hackfleisch-Auflauf",
    categorySlug: "main-dishes",
    description:
      "Nudelauflauf mit Hackfleisch, Tomatensauce, Erbsen und goldbrauner Käsekruste.",
    instructions:
      "Backofen auf 200 °C vorheizen. Makkaroni knapp al dente kochen. Zwiebel und Knoblauch hacken und mit Hackfleisch anbraten. Passierte Tomaten zugeben, würzen und 10 Minuten köcheln lassen. Erbsen und Nudeln untermischen und in eine Auflaufform geben. Sahne darüber verteilen, mit geriebenem Käse bestreuen und etwa 20 Minuten goldbraun backen.",
    prepTime: 45,
    servings: 3,
    ingredients: [
      {name: "Makkaroni", amount: 250, unit: "g"},
      {name: "Hackfleisch", amount: 300, unit: "g"},
      {name: "Passierte Tomaten", amount: 300, unit: "g"},
      {name: "Erbse", amount: 100, unit: "g"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 1, unit: "Zehe"},
      {name: "Sahne", amount: 100, unit: "ml"},
      {name: "Geriebener Käse", amount: 150, unit: "g"},
      {name: "Salz", amount: null, unit: null},
      {name: "Pfeffer", amount: null, unit: null},
    ],
  },
  {
    title: "Rindergeschnetzeltes mit Brokkoli",
    categorySlug: "main-dishes",
    description:
      "Zarte Rinderstreifen mit Brokkoli in würziger Sojasauce-Knoblauch-Sauce.",
    instructions:
      "Rindfleisch in dünne Streifen schneiden und Brokkoli in kleine Röschen teilen. Sojasauce mit etwas Wasser und Speisestärke verrühren. Öl in einer großen Pfanne stark erhitzen und das Fleisch portionsweise scharf anbraten, dann herausnehmen. Brokkoli mit etwas Wasser 3–4 Minuten bissfest garen. Knoblauch und Ingwer kurz mitbraten. Fleisch zurückgeben, Sauce zugießen und unter Rühren köcheln lassen, bis sie bindet. Dazu passt Reis.",
    prepTime: 25,
    servings: 2,
    ingredients: [
      {name: "Rindfleisch", amount: 300, unit: "g"},
      {name: "Brokkoli", amount: 300, unit: "g"},
      {name: "Sojasauce", amount: 3, unit: "EL"},
      {name: "Knoblauch", amount: 2, unit: "Zehen"},
      {name: "Ingwer", amount: 1, unit: "Stück"},
      {name: "Speisestärke", amount: 1, unit: "TL"},
      {name: "Olivenöl", amount: 1, unit: "EL"},
    ],
  },
  {
    title: "Shakshuka",
    categorySlug: "main-dishes",
    description:
      "Würzige Tomaten-Paprika-Pfanne mit pochierten Eiern, optional mit Feta und frischen Kräutern.",
    instructions:
      "Zwiebel und Paprika klein schneiden. Olivenöl in einer großen Pfanne erhitzen und beides etwa 5 Minuten anbraten. Knoblauch fein hacken und zusammen mit Tomatenmark, Kreuzkümmel, Paprikapulver und optional Chiliflocken etwa 1 Minute mitbraten. Stückige Tomaten hinzufügen, mit Salz und Pfeffer würzen und etwa 10 Minuten köcheln lassen. Vier kleine Mulden in die Sauce drücken und die Eier hineinschlagen. Zugedeckt bei niedriger Hitze 5–8 Minuten garen, bis das Eiweiß gestockt ist. Mit Petersilie oder Koriander und optional zerbröseltem Feta garnieren. Dazu Fladenbrot, Baguette oder Pita servieren.",
    prepTime: 30,
    servings: 2,
    ingredients: [
      {name: "Ei", amount: 4, unit: "Stück"},
      {name: "Stückige Tomaten", amount: 400, unit: "g"},
      {name: "Zwiebel", amount: 1, unit: "Stück"},
      {name: "Paprika", amount: 1, unit: "Stück"},
      {name: "Knoblauch", amount: 2, unit: "Zehen"},
      {name: "Olivenöl", amount: 2, unit: "EL"},
      {name: "Tomatenmark", amount: 1, unit: "EL"},
      {name: "Kreuzkümmel", amount: 1, unit: "TL"},
      {name: "Paprikapulver", amount: 1, unit: "TL"},
      {name: "Chiliflocken", amount: null, unit: null},
      {name: "Salz", amount: null, unit: null},
      {name: "Pfeffer", amount: null, unit: null},
      {name: "Petersilie", amount: null, unit: null},
      {name: "Koriander", amount: null, unit: null},
      {name: "Feta", amount: null, unit: null},
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

  // 4. Einheiten zentral anlegen oder aktualisieren.
  const unitIds = new Map<string, number>();

  for (const unit of units) {
    const savedUnit = await prisma.unit.upsert({
      where: {symbol: unit.symbol},
      create: unit,
      update: {
        name: unit.name,
        type: unit.type,
        sortOrder: unit.sortOrder,
      },
    });

    unitIds.set(unit.symbol, savedUnit.id);
  }

  // Unterschiedliche Schreibweisen werden auf dieselbe Einheit abgebildet.
  const normalizeUnitSymbol = (symbol: string) =>
    symbol === "Zehen" ? "Zehe" : symbol;

  // 5. Öffentliche Seed-Rezepte samt Kategorie und Zutaten synchronisieren.
  for (const recipeData of recipes) {
    const ingredientConnections = recipeData.ingredients.map((ingredient) => {
      const unitSymbol = ingredient.unit
        ? normalizeUnitSymbol(ingredient.unit)
        : null;
      const unitId = unitSymbol ? unitIds.get(unitSymbol) : null;

      if (unitSymbol && unitId === undefined) {
        throw new Error(
          `Unknown unit "${ingredient.unit}" in recipe "${recipeData.title}"`,
        );
      }

      return {
        amount: ingredient.amount,
        unit: unitId === null ? undefined : {connect: {id: unitId}},
        ingredient: {
          connect: {name: ingredient.name},
        },
      };
    });

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
