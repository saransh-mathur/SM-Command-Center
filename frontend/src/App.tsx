import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Cockpit from "./pages/Cockpit"
import MBAStudy from "./pages/MBAStudy"
import CourseLab from "./pages/CourseLab"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Cockpit />} />
          <Route path="mba-study" element={<MBAStudy />} />
          <Route path="course-lab" element={<CourseLab />} />
          <Route path="career" element={
            <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
              <h2 className="text-2xl text-slate-500 font-semibold">Career Dashboard coming soon...</h2>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
