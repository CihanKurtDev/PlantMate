import './App.css'
import { TentOverview } from './pages/TentOverview/TentOverview'
import { TentView } from './pages/TentView/TentView'
import { TentProvider } from './context/TentProvider'
import { tents } from './data/tents'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { NotFound } from './pages/NotFound/NotFound'
import { Layout } from './components/Layout/Layout'
import { PlantView } from './pages/PlantView/PlantView'


function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />, 
      children: [
        {path: "/", element: <TentOverview />},
        {path: "/tent/:id", element: <TentView />},
        {path: "/plant/:id", element: <PlantView />},
        {path: "*", element: <NotFound />},
      ]
    },
  ])
  
  return (
    <TentProvider tents={tents}>
      <RouterProvider router={router} />
    </TentProvider>
  )
}

export default App
