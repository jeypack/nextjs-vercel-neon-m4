export type NavigationItem = {
  name: string;
  href: string;
};

const navigation: NavigationItem[] = [
  {name: "Startseite", href: "/"},
  {name: "Users", href: "/users"},
  {name: "Blog", href: "/blog"},
  {name: "Pokemon", href: "/pokemon"},
  {name: "Dogs", href: "/dogs"},
];

export default navigation;
