"use client";

import {useState} from "react";
import {CalendarPlus2, Check, ChevronLeft, ChevronRight} from "lucide-react";

import {neutralButton, primaryButton} from "@/app/_lib/tailwind";

type Props = {
  userId: number;
  onCancel: () => void;
};

const meals = [
  {value: "BREAKFAST", label: "Frühstück"},
  {value: "LUNCH", label: "Mittagessen"},
  {value: "DINNER", label: "Abendessen"},
];

export default function AddToMealPlanDialog({userId, onCancel}: Props) {
  const [startOffset, setStartOffset] = useState(0);
  const [selected, setSelected] = useState("");

  // Die jeweils angezeigten vier Tage
  const days = Array.from({length: 4}, (_, index) => {
    // Lokale Datumsberechnung ohne UTC-Verschiebung
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + startOffset + index);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return {
      date,
      value: `${year}-${month}-${day}`,
      weekday: new Intl.DateTimeFormat("de-DE", {
        weekday: "short",
      }).format(date),
      label: new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
      }).format(date),
    };
  });

  const handleNavigation = (direction: number) => {
    setStartOffset((prev) => prev + direction * 4);
    setSelected("");
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-neutral-700 dark:text-neutral-300">
        Wann möchtest du dieses Rezept einplanen?
      </p>

      <form action="/" className="flex flex-col gap-4" onSubmit={onCancel}>
        <input type="hidden" name="userId" value={userId} />

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => handleNavigation(-1)}
            disabled={startOffset <= 0}
            className={neutralButton}
            aria-label="Vier Tage zurück"
          >
            <ChevronLeft size={18} />
            Zurück
          </button>

          <span className="text-sm font-medium">
            {days[0].label} – {days[3].label}
          </span>

          <button
            type="button"
            onClick={() => handleNavigation(1)}
            className={neutralButton}
            aria-label="Vier Tage weiter"
          >
            Weiter
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Wochentage */}
        <div className="grid grid-cols-4 gap-2">
          {days.map((day) => (
            <div key={day.value} className="text-center">
              <p className="font-medium">{day.weekday}</p>
              <p className="text-xs text-neutral-500">{day.label}</p>
            </div>
          ))}
        </div>

        {/* Mahlzeiten */}
        {meals.map((meal) => (
          <fieldset key={meal.value}>
            <legend className="mb-2 text-sm font-medium">{meal.label}</legend>

            <div className="grid grid-cols-4 gap-2">
              {days.map((day) => {
                const value = `${day.value}_${meal.value}`;
                const isSelected = selected === value;

                return (
                  <label
                    key={value}
                    className={`flex justify-center items-center p-3
                      rounded-lg border cursor-pointer transition-colors
                      ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                          : "border-neutral-300 dark:border-neutral-700 hover:border-emerald-500"
                      }`}
                  >
                    <input
                      type="radio"
                      name="mealSlot"
                      value={value}
                      checked={isSelected}
                      onChange={() => setSelected(value)}
                      className="sr-only"
                    />

                    {isSelected ? (
                      <Check className="text-emerald-600" size={18} />
                    ) : (
                      <CalendarPlus2 size={18} />
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        {/* Aktionen */}
        <div className="flex justify-between gap-2 mt-4">
          <button type="button" className={neutralButton} onClick={onCancel}>
            Abbrechen
          </button>

          <button type="submit" className={primaryButton} disabled={!selected}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarPlus2 size={14} />
              Zum Wochenplan hinzufügen
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
