import { Outlet, NavLink } from "react-router-dom"
import { Zap, Briefcase, Code2, GraduationCap, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="font-bold text-lg tracking-tight">COMMAND CENTER</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavLink to="/" className={({isActive}) => isActive ? "block" : "block"} end>
            {({ isActive }) => (
              <Button 
                variant={isActive ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 shadow-none ${isActive ? "bg-slate-100 hover:bg-slate-200 text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              >
                <Zap className="w-4 h-4" /> Cockpit
              </Button>
            )}
          </NavLink>
          <NavLink to="/career" className={({isActive}) => isActive ? "block" : "block"}>
            {({ isActive }) => (
              <Button 
                variant={isActive ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 shadow-none ${isActive ? "bg-slate-100 hover:bg-slate-200 text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              >
                <Briefcase className="w-4 h-4" /> Career
              </Button>
            )}
          </NavLink>
          <NavLink to="/course-lab" className={({isActive}) => isActive ? "block" : "block"}>
            {({ isActive }) => (
              <Button 
                variant={isActive ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 shadow-none ${isActive ? "bg-slate-100 hover:bg-slate-200 text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              >
                <Code2 className="w-4 h-4" /> Course Lab
              </Button>
            )}
          </NavLink>
          <NavLink to="/mba-study" className={({isActive}) => isActive ? "block" : "block"}>
            {({ isActive }) => (
              <Button 
                variant={isActive ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 shadow-none ${isActive ? "bg-slate-100 hover:bg-slate-200 text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              >
                <GraduationCap className="w-4 h-4" /> MBA Study
              </Button>
            )}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* Omnibar */}
        <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm px-6 flex items-center justify-between z-10 sticky top-0">
          <div className="w-full max-w-md relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search or jump to... (Cmd+K)" 
              className="w-full pl-9 bg-slate-100/80 border-slate-200/60 rounded-lg shadow-none focus-visible:ring-slate-200"
            />
          </div>
          <div className="flex items-center gap-4">
             {/* Additional omnibar actions could go here */}
          </div>
        </header>

        {/* Dynamic Outlet */}
        <Outlet />

      </main>
    </div>
  )
}
