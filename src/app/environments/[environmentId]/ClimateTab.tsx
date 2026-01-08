import EmptyState from "./EmptyState";
import TabContent from "./TabContent";

export default function ClimateTab({ climate, history }) {
  return (
    <TabContent title="Klima">
      {!climate ? (
        <EmptyState message="Keine Klimadaten vorhanden"/>
        ) : (
          <div>Ø Temp: {climate.temp.value}{climate.temp.unit}</div>
        )}
      {/* hier später Chart oder so mus noch schauen was ich da machen kann mit history */}
    </TabContent>
  );
}
