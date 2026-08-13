import { UploadCloud, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MBAStudy() {
  const modules = Array.from({ length: 6 }).map((_, i) => `Module ${i + 1}`)
  const units = Array.from({ length: 12 }).map((_, i) => `Unit ${i + 1}`)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column (Ingestion Engine) */}
        <div className="flex flex-col gap-6">
          <Card className="bg-white shadow-sm border-slate-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-500" /> Ingestion Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer w-full">
                <input type="file" className="hidden" multiple accept=".pdf,.docx,.xlsx,.csv" />
                <UploadCloud className="w-10 h-10 mb-4 text-slate-400" />
                <p className="font-medium text-slate-700">Drag & drop knowledge here, or click to browse</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <span className="px-2 py-1 bg-slate-200 text-xs rounded-md text-slate-600 font-medium">PDF</span>
                  <span className="px-2 py-1 bg-slate-200 text-xs rounded-md text-slate-600 font-medium">DOCX</span>
                  <span className="px-2 py-1 bg-slate-200 text-xs rounded-md text-slate-600 font-medium">XLSX</span>
                  <span className="px-2 py-1 bg-slate-200 text-xs rounded-md text-slate-600 font-medium">CSV</span>
                  <span className="px-2 py-1 bg-slate-200 text-xs rounded-md text-slate-600 font-medium">WSL</span>
                </div>
              </label>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Custom AI Generation Rules</label>
                <Textarea 
                  placeholder="e.g., Break this document down into 6 modules, 12 units each. Generate detailed notes using bullets and paragraph explanations."
                  className="min-h-[120px] bg-slate-50 border-slate-200"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Vault Navigator) */}
        <div className="flex flex-col gap-6">
          <Card className="bg-white shadow-sm border-slate-200 rounded-xl h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" /> Knowledge Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <Accordion type="single" collapsible className="w-full px-4">
                {modules.map((mod, modIdx) => (
                  <AccordionItem value={`item-${modIdx}`} key={modIdx} className="border-slate-100">
                    <AccordionTrigger className="text-slate-700 hover:text-slate-900 font-semibold hover:no-underline">{mod}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="pl-4 space-y-2 border-l-2 border-slate-100 ml-2 mb-4">
                        {units.map((unit, unitIdx) => (
                          <li key={unitIdx} className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer py-1">
                            {unit}
                          </li>
                        ))}
                      </ul>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <h4 className="font-medium text-slate-800 mb-2">Generated Notes Preview</h4>
                        <ScrollArea className="h-[400px]">
                          <div className="text-sm text-slate-600 space-y-4 pr-4">
                            <p><strong>Overview:</strong> This section covers the fundamental principles...</p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Key concept 1: Detailed explanation goes here.</li>
                              <li>Key concept 2: Further elaboration on the topic.</li>
                              <li>Key concept 3: Important formulas and definitions.</li>
                            </ul>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                          </div>
                        </ScrollArea>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
