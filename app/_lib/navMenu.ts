export type NavigationItem = {
  label: string;
  href: string;
};

const navigation: NavigationItem[] = [
  {label: "Koch dir was", href: "/cook"},
  {label: "Rezepte", href: "/recipes"},
  {label: "Vorrat", href: "/pantry"},
  {label: "Einkauf", href: "/shopping-list"},
  {label: "Planen", href: "/meal-plan"},
];
const footerLinks = [
  {href: "/cook", label: "Was kann ich kochen?"},
  {href: "/recipes", label: "Rezepte"},
  {href: "/pantry", label: "Vorrat"},
  {href: "/shopping-list", label: "Einkaufsliste"},
  {href: "/meal-plan", label: "Wochenplan"},
  {href: "/impressum", label: "Impressum"},
];

export default navigation;
export { footerLinks };
