export const PANTRY_UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "Stück",
  "Bund",
  "Dose",
  "Packung",
  "Flasche",
  "Glas",
] as const;

export type PantryUnit = (typeof PANTRY_UNITS)[number];

export const PACKAGE_SIZE_UNITS = ["g", "kg", "ml", "l"] as const;

export type PackageUnit = (typeof PACKAGE_SIZE_UNITS)[number];

export type UnitGroup = "mass" | "volume" | "count";

type UnitDefinition = {
  group: UnitGroup;
  baseUnit: PantryUnit;
  factorToBase: number;
  convertible: boolean;
};

const UNIT_DEFINITIONS: Record<PantryUnit, UnitDefinition> = {
  g: {
    group: "mass",
    baseUnit: "g",
    factorToBase: 1,
    convertible: true,
  },
  kg: {
    group: "mass",
    baseUnit: "g",
    factorToBase: 1000,
    convertible: true,
  },
  ml: {
    group: "volume",
    baseUnit: "ml",
    factorToBase: 1,
    convertible: true,
  },
  l: {
    group: "volume",
    baseUnit: "ml",
    factorToBase: 1000,
    convertible: true,
  },
  Stück: {
    group: "count",
    baseUnit: "Stück",
    factorToBase: 1,
    convertible: false,
  },
  Bund: {
    group: "count",
    baseUnit: "Bund",
    factorToBase: 1,
    convertible: false,
  },
  Dose: {
    group: "count",
    baseUnit: "Dose",
    factorToBase: 1,
    convertible: false,
  },
  Packung: {
    group: "count",
    baseUnit: "Packung",
    factorToBase: 1,
    convertible: false,
  },
  Flasche: {
    group: "count",
    baseUnit: "Flasche",
    factorToBase: 1,
    convertible: false,
  },
  Glas: {
    group: "count",
    baseUnit: "Glas",
    factorToBase: 1,
    convertible: false,
  },
};

export function isPantryUnit(value: string): value is PantryUnit {
  return PANTRY_UNITS.some((unit) => unit === value);
}

export function getUnitGroup(unit: PantryUnit): UnitGroup {
  return UNIT_DEFINITIONS[unit].group;
}

export function isPackageUnit(value: string): value is PackageUnit {
  return PACKAGE_SIZE_UNITS.some((unit) => unit === value);
}

export function canConvertUnits(from: PantryUnit, to: PantryUnit): boolean {
  if (from === to) {
    return true;
  }

  const fromDef = UNIT_DEFINITIONS[from];
  const toDef = UNIT_DEFINITIONS[to];

  if (fromDef.group !== toDef.group) {
    return false;
  }

  return fromDef.convertible && toDef.convertible;
}

export function normalizeQuantity(quantity: number, unit: PantryUnit) {
  if (!Number.isFinite(quantity)) {
    return null;
  }

  const definition = UNIT_DEFINITIONS[unit];

  if (!definition.convertible) {
    return {
      unit,
      group: definition.group,
      value: quantity,
      baseUnit: definition.baseUnit,
      baseValue: quantity,
      convertible: false,
    } as const;
  }

  return {
    unit,
    group: definition.group,
    value: quantity,
    baseUnit: definition.baseUnit,
    baseValue: quantity * definition.factorToBase,
    convertible: true,
  } as const;
}

export function convertUnit(
  quantity: number,
  from: PantryUnit,
  to: PantryUnit,
): number | null {
  if (!Number.isFinite(quantity) || !canConvertUnits(from, to)) {
    return null;
  }

  // Gleiche Einheit: keine Umrechnung notwendig.
  if (from === to) {
    return quantity;
  }

  const normalized = normalizeQuantity(quantity, from);

  if (!normalized || !normalized.convertible) {
    return null;
  }

  const target = UNIT_DEFINITIONS[to];

  return normalized.baseValue / target.factorToBase;
}

const RECIPE_UNIT_ALIASES: Record<string, string> = {
  gramm: "g",
  kilogramm: "kg",
  milliliter: "ml",
  liter: "l",
  stücke: "Stück",
  zehen: "Zehe",
  stangen: "Stange",
  bünde: "Bund",
  scheiben: "Scheibe",
  dosen: "Dose",
  packungen: "Pck.",
  packung: "Pck.",
  flaschen: "Fl.",
  flasche: "Fl.",
  gläser: "Gl.",
  glas: "Gl.",
  esslöffel: "EL",
  teelöffel: "TL",
  prisen: "Prise",
};

export function resolveRecipeUnit(
  value: string,
  availableSymbols: readonly string[],
): string | null {
  const normalize = (input: string) =>
    input.trim().replace(/\s+/g, " ").toLocaleLowerCase("de-DE");

  const symbolsByKey = new Map(
    availableSymbols.map((symbol) => [normalize(symbol), symbol]),
  );

  const key = normalize(value);
  const canonicalValue = RECIPE_UNIT_ALIASES[key] ?? value;

  return symbolsByKey.get(normalize(canonicalValue)) ?? null;
}
