const statusStyles = {
  AVAILABLE: "bg-green-50 text-green-700 ring-green-200",
  PRE_BOOKED: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  UNDER_CONTRACT: "bg-blue-50 text-blue-700 ring-blue-200",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-200",

  PENDING: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  ACCEPTED: "bg-green-50 text-green-700 ring-green-200",
  APPROVED: "bg-green-50 text-green-700 ring-green-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
  COMPLETED: "bg-purple-50 text-purple-700 ring-purple-200",
};

const formatStatus = (status) => {
  return status?.replaceAll("_", " ") || "UNKNOWN";
};

const StatusBadge = ({ status }) => {
  const style =
    statusStyles[status] || "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
