import { Link } from "react-router-dom";

const numberFormatter = new Intl.NumberFormat("en-IN");

const toneStyles = {
  green: {
    icon: "bg-green-100 text-green-700",
    border: "hover:ring-green-200",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700",
    border: "hover:ring-blue-200",
  },
  yellow: {
    icon: "bg-yellow-100 text-yellow-700",
    border: "hover:ring-yellow-200",
  },
  purple: {
    icon: "bg-purple-100 text-purple-700",
    border: "hover:ring-purple-200",
  },
  red: {
    icon: "bg-red-100 text-red-700",
    border: "hover:ring-red-200",
  },
  slate: {
    icon: "bg-slate-100 text-slate-700",
    border: "hover:ring-slate-300",
  },
};

const DashboardStatCard = ({
  label,
  value,
  helperText,
  icon = "📊",
  tone = "green",
  to,
}) => {
  const displayValue =
    typeof value === "number" ? numberFormatter.format(value) : (value ?? 0);

  const style = toneStyles[tone] || toneStyles.green;

  const content = (
    <article
      className={`group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md ${style.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <h3 className="mt-3 text-3xl font-bold text-slate-950">
            {displayValue}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${style.icon}`}
        >
          {icon}
        </div>
      </div>

      {helperText && (
        <p className="mt-3 text-sm leading-5 text-slate-500">{helperText}</p>
      )}

      {to && (
        <p className="mt-4 text-sm font-semibold text-green-700 transition group-hover:translate-x-1">
          View details →
        </p>
      )}
    </article>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default DashboardStatCard;
