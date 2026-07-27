/** Label on the left, value on the right — the row shape every stat list uses. */
const StatRow = ({ label, children }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-300">{label}</span>
    {children}
  </div>
);

export default StatRow;
