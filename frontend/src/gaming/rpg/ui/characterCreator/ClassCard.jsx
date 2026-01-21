// Selectable class UI
export default function ClassCard({ data, selected, onSelect }) {
  return (
    <div
      className={`class-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <h3>{data.name}</h3>
      <p>{data.description}</p>

      <div className="stats">
        {Object.entries(data.baseStats).map(([key, val]) => (
          <div key={key}>
            <strong>{key.toUpperCase()}:</strong> {val}
          </div>
        ))}
      </div>
    </div>
  );
}
