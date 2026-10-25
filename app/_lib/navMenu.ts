export type NavigationItem = {
  name: string;
  href: string;
};

const navigation: NavigationItem[] = [
  {name: "Koch dir was", href: "/cook"},
  {name: "Rezepte", href: "/recipes"},
  {name: "Settings", href: "/user"},
];

export default navigation;
