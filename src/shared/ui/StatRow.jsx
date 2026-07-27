const StatRow = ({ label, children }) => (
  <div className="flex items-start justify-between gap-2">
    <span className="shrink-0 text-gray-300">{label}</span>
    <div className="min-w-0 text-right">{children}</div>
  </div>
);

export default StatRow;
