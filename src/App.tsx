import './App.css'
import { PlantOverview } from './pages/PlantOverview/PlantOverwiev'
import { PlantView } from './pages/PlantView/PlantView'
import { PlantProvider } from './context/PlantProvider'
import { usePlantContext } from './context/UsePlantContext'
import { plants } from './data/plant'

export const Content = () => {
  const { selectedPlantId } = usePlantContext();

  return selectedPlantId ? (
    <PlantView plantId={selectedPlantId} />
  ) : (
    <PlantOverview />
  );
}


function App() {

  // need router 
  return (
    <PlantProvider plants={plants}>
      <Content />
    </PlantProvider>
  )
}

export default App
