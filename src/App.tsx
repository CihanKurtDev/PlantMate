import './App.css'
import { PlantOverview } from './pages/PlantOverview/PlantOverwiev'
import { PlantView } from './pages/PlantView/PlantView'
import { PlantProvider } from './context/PlantProvider'
import { plants } from './data/plant'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { NotFound } from './pages/NotFound/NotFound'
import { Layout } from './components/Layout/Layout'


function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />, 
      children: [
        {path: "/", element: <PlantOverview />},
        {path: "/plant/:id", element: <PlantView />},
        {path: "*", element: <NotFound />},
      ]
    },
  ])
  
  return (
    <PlantProvider plants={plants}>
      <RouterProvider router={router} />
    </PlantProvider>
  )
}

export default App
