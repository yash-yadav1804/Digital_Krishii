import { Link } from "react-router-dom";

const EmptyState = ({
  icon = "🌱",
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-slate-200">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>

      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}

      {actionTo && actionLabel && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
        >
          {actionLabel}
        </Link>
      )}

      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
