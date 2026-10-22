import {uploadProfileImage} from "../_lib/actions";
import type {UserItem} from "@/app/user/_lib/types";
import {primaryButton, labelClass, borderedButton} from "@/app/_lib/tailwind";
import Avatar from "./Avatar";

export default function ProfileImageForm({user}: {user: UserItem}) {
  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
      <form action={uploadProfileImage} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="image"
            className="mb-2 block text-lg font-semibold text-gray-700 dark:text-gray-100"
          >
            Profilbild auswählen
          </label>

          <div className="flex justify-between items-start">
            <div>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                className={borderedButton + " w-66 sm:w-auto"}
              />
              <p className="mt-2 text-xs text-gray-500 w-auto">
                JPG, PNG oder WebP, maximal 2 MB.
              </p>
            </div>
            <div className="hidden sm:block">
              <Avatar user={user} size="lg" />
            </div>
            <div className="block ml-1 mt-1 sm:hidden">
              <Avatar user={user} size="sm" />
            </div>
          </div>
        </div>

        <button type="submit" className={"self-start w-full sm:w-auto " + primaryButton}>
          Bild hochladen
        </button>
      </form>
    </section>
  );
}
