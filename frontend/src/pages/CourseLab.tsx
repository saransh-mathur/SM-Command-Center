import { PlusCircle, Book, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

const mockCourses = [
  { id: 1, title: "Advanced React Patterns", platform: "Frontend Masters", status: "In Progress", progress: "60%" },
  { id: 2, title: "Distributed Systems Engineering", platform: "MIT OpenCourseWare", status: "Not Started", progress: "0%" },
  { id: 3, title: "Machine Learning A-Z", platform: "Udemy", status: "Completed", progress: "100%" },
  { id: 4, title: "System Design Interview Prep", platform: "Educative", status: "In Progress", progress: "30%" },
]

export default function CourseLab() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header Area */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Skill Tracker</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track your active learning courses.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <PlusCircle className="w-4 h-4" /> Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="course-name" className="text-sm font-medium text-slate-700">Course Name</label>
                  <Input id="course-name" placeholder="e.g. Advanced System Design" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="platform" className="text-sm font-medium text-slate-700">Platform / URL</label>
                  <Input id="platform" placeholder="e.g. Coursera or https://..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="focus" className="text-sm font-medium text-slate-700">Course Focus / Details</label>
                  <Textarea id="focus" placeholder="What will you learn?" className="min-h-[100px]" />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700">Save Course</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {mockCourses.map((course) => (
            <Card key={course.id} className="bg-white shadow-sm border-slate-200 rounded-xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2">{course.title}</CardTitle>
                  <Book className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
                </div>
                <p className="text-sm text-indigo-600 font-medium mt-1">{course.platform}</p>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  {course.status === "Completed" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="font-medium">{course.status}</span>
                  <span className="text-slate-300">•</span>
                  <span>{course.progress}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${course.status === "Completed" ? "bg-emerald-500" : "bg-indigo-500"}`} 
                    style={{ width: course.progress }}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}
