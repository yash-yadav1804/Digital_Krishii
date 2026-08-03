import DashboardStatCard from "./DashboardStatCard.jsx";

const DashboardStatsGrid = ({ cards, columns = "xl:grid-cols-4" }) => {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${columns}`}>
      {cards.map((card) => (
        <DashboardStatCard
          key={card.label}
          label={card.label}
          value={card.value}
          helperText={card.helperText}
        />
      ))}
    </div>
  );
};

export default DashboardStatsGrid;
