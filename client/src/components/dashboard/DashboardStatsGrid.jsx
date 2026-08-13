import DashboardStatCard from "./DashboardStatCard.jsx";

const DashboardStatsGrid = ({ cards, columns = "xl:grid-cols-4" }) => {
  return (
    <div className={`grid gap-5 md:grid-cols-2 ${columns}`}>
      {cards.map((card) => (
        <DashboardStatCard
          key={card.label}
          label={card.label}
          value={card.value}
          helperText={card.helperText}
          icon={card.icon}
          tone={card.tone}
          to={card.to}
        />
      ))}
    </div>
  );
};

export default DashboardStatsGrid;
