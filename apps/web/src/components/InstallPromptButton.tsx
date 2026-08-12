import { useInstallPrompt } from "../hooks/useInstallPrompt.js";

export function InstallPromptButton() {
  const { canInstall, isIosInstructions, installed, promptInstall } = useInstallPrompt();

  if (installed) return null;

  if (canInstall) {
    return (
      <button
        onClick={promptInstall}
        className="rounded-lg bg-brand text-white text-sm font-medium px-3 py-1.5 hover:bg-brand-dark"
      >
        Install App
      </button>
    );
  }

  if (isIosInstructions) {
    return (
      <p className="text-xs text-gray-500">
        Install: tap Share <span aria-hidden="true">⬆</span> then "Add to Home Screen"
      </p>
    );
  }

  return null;
}
