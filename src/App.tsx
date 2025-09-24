import './App.css'
import { PlantOverview } from './pages/PlantOverview/PlantOverwiev'
import { PlantView } from './pages/PlantView/PlantView'
import { PlantProvider } from './context/PlantProvider'
import { plants } from './data/plant'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { NotFound } from './pages/NotFound/NotFound'


function App() {
  const router = createBrowserRouter([
    {path: "/", element: <PlantOverview />},
    {path: "/plant/:id", element: <PlantView />},
    {path: "*", element: <NotFound />},
  ])
  
  // need router 
  return (
    <PlantProvider plants={plants}>
      <RouterProvider router={router} />
    </PlantProvider>
  )
}

export default App
