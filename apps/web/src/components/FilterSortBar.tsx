import { UNIT_STATUSES, UNIT_STATUS_LABELS, type UnitStatus } from "@ledgio/shared";

export type SortOption = "renewalDate:asc" | "renewalDate:desc";

export function FilterSortBar({
  status,
  onStatusChange,
  sort,
  onSortChange,
}: {
  status: UnitStatus | "";
  onStatusChange: (status: UnitStatus | "") => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => onStatusChange("")}
          className={`rounded-full px-3 py-1 text-xs font-medium border ${
            status === "" ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600"
          }`}
        >
          All
        </button>
        {UNIT_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium border ${
              status === s ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600"
            }`}
          >
            {UNIT_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="ml-auto rounded-lg border border-gray-300 px-2 py-1 text-xs"
      >
        <option value="renewalDate:asc">Due date: soonest first</option>
        <option value="renewalDate:desc">Due date: latest first</option>
      </select>
    </div>
  );
}
