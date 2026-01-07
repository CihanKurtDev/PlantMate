export default function ClimateTab({ climate, history }) {
  return (
    <section>
      {/* hier später Chart oder so mus noch schauen was ich da machen kann mit history */}
      <div>Ø Temp: {climate.temp.value}{climate.temp.unit}</div>
    </section>
  );
}
