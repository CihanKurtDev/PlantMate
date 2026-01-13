import EmptyState from "./shared/EmptyState";
import TabContent from "./TabContent";

export default function ClimateTab({ climate, history, hidden }) {
  if (hidden) return null
  return (
    <TabContent title="Klima">
      {Object.keys(climate).length === 0 ? (
        <EmptyState message="Keine Klimadaten vorhanden"/>
        ) : (
          <div>Ø Temp: {climate.temp.value}{climate.temp.unit}</div>
        )}
      {/* hier später Chart oder so mus noch schauen was ich da machen kann mit history */}
    </TabContent>
  );
}
