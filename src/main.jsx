import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import DirectedUnweightedGraph from './Components/Graph/DirectedUnweightedGraph'
import UndirectedUnweightedGraph from './Components/Graph/UndirectedUnweightedGraph'
import DirectedWeightedGraph from './Components/Graph/DirectedWeightedGraph'
import UndirectedWeightedGraph from './Components/Graph/UndirectedWeightedGraph'
import { DirectedUnweightedGraphProvider } from './context/DirectedUnweighted/DirectedUnweightedProvider'
import { DirectedWeightedGraphProvider } from './context/DirectedWeighted/DirectedWeightedProvider'
import { UndirectedUnweightedGraphProvider } from './context/UndirectedUnweighted/UndirectedUnweightedProvider'
import { UndirectedWeightedGraphProvider } from './context/UndirectedWeighted/UndirectedWeightedProvider'
import { PageProvider } from './context/PageTracker/PageProvider'
import { TrackProvider } from './context/Track/TrackProvider'
import TrackDashboard from './Components/Dashboard/TrackDashboard'
import SystemDesignWorkspace from './Components/Workspace/SystemDesignWorkspace'
import DSAWorkspace from './Components/Workspace/DSAWorkspace'
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout/>,
//     children: [
//       {
//         path: "",
//         element: <App/>
//       },
//       {
//         path: "Undirected-Unweighted-Graph",
//         element: <Graph/>
//       }
//     ]
//   }
// ])
// UndirectedUnweightedGraph
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<TrackDashboard />} />
      <Route path='system-design' element={<SystemDesignWorkspace />} />
      <Route path='dsa' element={<DSAWorkspace />} />
      <Route path='graphs/directed-unweighted' element={<DirectedUnweightedGraph />} />
      <Route path='Directed-Unweighted-Graph' element={<DirectedUnweightedGraph />} />
      <Route path='Undirected-Unweighted-Graph' element={<UndirectedUnweightedGraph />} />
      <Route path='Undirected-Weighted-Graph' element={<UndirectedWeightedGraph />} />
      <Route path='Directed-Weighted-Graph' element={<DirectedWeightedGraph />} />
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrackProvider>
      <PageProvider>
        <DirectedUnweightedGraphProvider>
          <DirectedWeightedGraphProvider>
            <UndirectedUnweightedGraphProvider>
              <UndirectedWeightedGraphProvider>
                <RouterProvider router={router} />
              </UndirectedWeightedGraphProvider>
            </UndirectedUnweightedGraphProvider>
          </DirectedWeightedGraphProvider>
        </DirectedUnweightedGraphProvider>
      </PageProvider>
    </TrackProvider>
  </StrictMode >
)
