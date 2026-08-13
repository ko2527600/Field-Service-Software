import { Logo } from "./Logo.js";

export function FooterBand() {
  return (
    <div className="rounded-2xl bg-brand-50 border border-brand-100 p-5 flex items-center gap-4">
      <Logo className="h-12 w-12 shrink-0" />
      <div>
        <p className="font-bold text-brand-dark">Protecting what matters</p>
        <p className="text-sm text-gray-600">Fire Armour — every extinguisher, tracked and on time.</p>
      </div>
    </div>
  );
}
