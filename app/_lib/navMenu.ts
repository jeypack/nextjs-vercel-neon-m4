export type NavigationItem = {
  name: string;
  href: string;
};

const navigation: NavigationItem[] = [
  {name: "Koch dir was", href: "/cook"},
  {name: "Rezepte", href: "/recipes"},
  {name: "Vorrat", href: "/pantry"},
  {name: "Einkauf", href: "/shopping-list"},
  {name: "Planen", href: "/meal-plan"},
];

export default navigation;
