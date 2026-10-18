export type NavigationItem = {
  name: string;
  href: string;
};

const navigation: NavigationItem[] = [
  {name: "Startseite", href: "/"},
  {name: "Blog", href: "/blog"},
  {name: "Pokemon", href: "/pokemon"},
  {name: "Dogs", href: "/dogs"},
  {name: "Settings", href: "/user"},
];

export default navigation;
