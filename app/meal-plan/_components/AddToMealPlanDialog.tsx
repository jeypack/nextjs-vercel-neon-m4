"use client";

import {useEffect, useState, useActionState} from "react";
import {
  CalendarPlus2,
  Check,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  RefreshCw,
  X,
} from "lucide-react";

import {
  addDays,
  formatDateForQuery,
  formatRangeLabel,
  parseAnchorDate,
} from "@/app/meal-plan/_lib/date-utils";

import {
  createMealPlanEntry,
  fetchOccupiedMealPlanSlots,
} from "@/app/meal-plan/_lib/actions";

import type {MealPlanFormState} from "@/app/meal-plan/_lib/types";

import {neutralButton, primaryButton} from "@/app/_lib/tailwind";

type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

type OccupiedSlot = {
  date: string;
  mealType: MealType;
};

type Props = {
  recipeId: number;
  onCancel: () => void;
  initialDate?: string;
};

const meals: {value: MealType; label: string}[] = [
  {value: "BREAKFAST", label: "Frühstück"},
  {value: "LUNCH", label: "Mittagessen"},
  {value: "DINNER", label: "Abendessen"},
];

const initialState: MealPlanFormState = {
  success: false,
  message: "",
};

export default function AddToMealPlanDialog({
  recipeId,
  onCancel,
  initialDate,
}: Props) {
  // Server Action für das Anlegen eines Meal-Plan-Eintrags
  const [state, formAction, isPending] = useActionState(
    createMealPlanEntry,
    initialState,
  );

  // Aktueller Zeitraum
  const [rangeStart, setRangeStart] = useState(() =>
    parseAnchorDate(initialDate),
  );

  // Ausgewählter Platz
  const [selected, setSelected] = useState<{
    date: string;
    mealType: MealType;
  } | null>(null);

  // Belegte Plätze
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Sichtbare vier Tage
  const visibleDays = Array.from({length: 4}, (_, index) => {
    const current = addDays(rangeStart, index);
    const isoKey = formatDateForQuery(current);

    return {
      date: current,
      isoKey,
      weekday: new Intl.DateTimeFormat("de-DE", {
        weekday: "short",
      }).format(current),
      label: new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
      }).format(current),
      isToday: isoKey === formatDateForQuery(new Date()),
    };
  });

  const rangeLabel = formatRangeLabel(visibleDays[0].date, visibleDays[3].date);

  const today = formatDateForQuery(new Date());

  // Belegte Plätze als Set für eine schnelle Prüfung
  const occupiedKeys = new Set(
    occupiedSlots.map((slot) => `${slot.date}_${slot.mealType}`),
  );

  // Belegte Plätze für den aktuellen Zeitraum laden
  useEffect(() => {
    let cancelled = false;

    async function loadOccupiedSlots() {
      setIsLoadingSlots(true);
      setLoadError("");

      const startDate = formatDateForQuery(rangeStart);
      const endDate = formatDateForQuery(addDays(rangeStart, 4));

      try {
        const slots = await fetchOccupiedMealPlanSlots(startDate, endDate);

        if (!cancelled) {
          setOccupiedSlots(slots);
        }
      } catch {
        if (!cancelled) {
          setOccupiedSlots([]);
          setLoadError("Die belegten Plätze konnten nicht geladen werden.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSlots(false);
        }
      }
    }

    void loadOccupiedSlots();

    return () => {
      cancelled = true;
    };
  }, [rangeStart, reloadKey]);

  // Dialog nach erfolgreichem Speichern schließen
  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [state.success, onCancel]);

  // Vier Tage vor oder zurück
  function handleNavigation(direction: number) {
    setRangeStart((current) => addDays(current, direction * 4));
    setSelected(null);
  }

  // Platz auswählen oder Auswahl aufheben
  function handleSelect(date: string, mealType: MealType) {
    setSelected((current) =>
      current?.date === date && current?.mealType === mealType
        ? null
        : {date, mealType},
    );
  }

  // Prüfen, ob eine Mahlzeit zeitlich nicht mehr verfügbar ist
  function isMealTimeExpired(date: Date, mealType: MealType) {
    const selectedDate = formatDateForQuery(date);

    // Vergangene Tage
    if (selectedDate < today) return true;

    // Zukünftige Tage
    if (selectedDate > today) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const deadlines: Record<MealType, number | null> = {
      BREAKFAST: 12 * 60,
      LUNCH: 17 * 60,
      DINNER: null,
    };

    const deadline = deadlines[mealType];

    return deadline !== null && currentMinutes >= deadline;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
        Wann möchtest du dieses Rezept einplanen?
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        {/* Daten für die Server Action */}
        <input type="hidden" name="recipeId" value={recipeId} />
        <input type="hidden" name="date" value={selected?.date ?? ""} />
        <input type="hidden" name="mealType" value={selected?.mealType ?? ""} />

        {/* Navigation */}
        <div className="flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigation(-1)}
            disabled={rangeStart <= parseAnchorDate(undefined)}
            className={neutralButton}
            aria-label="Vier Tage zurück"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm font-medium text-center">{rangeLabel}</span>

          <button
            type="button"
            onClick={() => handleNavigation(1)}
            className={neutralButton}
            aria-label="Vier Tage weiter"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Wochentage */}
        <div className="grid grid-cols-4 gap-2">
          {visibleDays.map((day) => (
            <div key={day.isoKey} className="text-center">
              <p className="font-medium">{day.weekday}</p>
              <p className="text-xs text-neutral-500">{day.label}</p>
              {day.isToday && (
                <span className="text-[10px] text-emerald-600">Heute</span>
              )}
            </div>
          ))}
        </div>

        {/* Mahlzeiten */}
        {meals.map((meal) => (
          <fieldset key={meal.value} disabled={isLoadingSlots || !!loadError}>
            <legend className="mb-2 text-sm font-medium">{meal.label}</legend>

            <div className="grid grid-cols-4 gap-2">
              {visibleDays.map((day) => {
                const value = `${day.isoKey}_${meal.value}`;

                const isSelected =
                  selected?.date === day.isoKey &&
                  selected?.mealType === meal.value;

                const isOccupied = occupiedKeys.has(value);
                const isExpired = isMealTimeExpired(day.date, meal.value);

                const isDisabled =
                  isOccupied || isExpired || isLoadingSlots || !!loadError;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelect(day.isoKey, meal.value)}
                    aria-label={`${meal.label}, ${day.weekday} ${day.label}${
                      isOccupied
                        ? ", bereits belegt"
                        : isExpired
                          ? ", nicht mehr verfügbar"
                          : ""
                    }`}
                    aria-pressed={isSelected}
                    className={`flex flex-col justify-center items-center gap-1 min-h-14 p-2 rounded-lg border transition-colors
                      ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                          : isOccupied || isExpired
                            ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-900"
                            : "border-neutral-300 hover:border-emerald-500 dark:border-neutral-700"
                      }`}
                  >
                    {isOccupied ? (
                      <LockKeyhole size={16} />
                    ) : isExpired ? (
                      <X
                        size={18}
                        className="text-neutral-400 dark:text-neutral-500"
                      />
                    ) : isSelected ? (
                      <Check size={18} className="text-emerald-600" />
                    ) : (
                      <CalendarPlus2 size={16} />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        {/* Ladezustand – Platz bleibt immer reserviert */}
        <p className="min-h-5 text-sm text-neutral-500" role="status">
          {isLoadingSlots ? "Belegte Plätze werden geladen …" : "\u00A0"}
        </p>

        {/* Ladefehler mit erneuter Abfrage */}
        {loadError && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className={neutralButton}
            >
              <RefreshCw size={14} />
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Rückmeldung der Server Action */}
        {state.message && !state.success && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.message}
          </p>
        )}

        {/* Aktionen */}
        <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <button
            type="button"
            className={neutralButton}
            onClick={onCancel}
            disabled={isPending}
          >
            Abbrechen
          </button>

          <button
            type="submit"
            className={primaryButton}
            disabled={!selected || isPending || isLoadingSlots || !!loadError}
          >
            <span className="inline-flex items-center gap-1.5">
              <CalendarPlus2 size={14} />
              {isPending ? "Wird eingeplant ..." : "Zum Wochenplan hinzufügen"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
