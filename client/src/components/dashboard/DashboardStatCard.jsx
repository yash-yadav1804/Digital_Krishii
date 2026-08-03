const numberFormatter = new Intl.NumberFormat("en-IN");

const DashboardStatCard = ({ label, value, helperText }) => {
  const displayValue =
    typeof value === "number" ? numberFormatter.format(value) : (value ?? 0);

  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <h3 className="mt-3 text-3xl font-bold text-slate-900">{displayValue}</h3>

      {helperText && (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      )}
    </article>
  );
};

export default DashboardStatCard;
