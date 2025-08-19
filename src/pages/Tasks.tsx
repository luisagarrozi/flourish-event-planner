import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Plus, Calendar, Flag } from "lucide-react"
import { t } from "@/lib/translations"

export default function Tasks() {
  const tasks = [
    { id: 1, title: t("bookWeddingVenue"), completed: true, priority: "high", dueDate: "2024-02-15", category: t("venue") },
    { id: 2, title: t("sendSaveTheDates"), completed: true, priority: "medium", dueDate: "2024-02-20", category: t("invitations") },
    { id: 3, title: t("orderWeddingDress"), completed: false, priority: "high", dueDate: "2024-03-01", category: t("attire") },
    { id: 4, title: t("bookPhotographer"), completed: false, priority: "high", dueDate: "2024-03-05", category: t("photography") },
    { id: 5, title: t("chooseWeddingCake"), completed: false, priority: "medium", dueDate: "2024-03-10", category: t("catering") },
    { id: 6, title: t("bookDJBand"), completed: false, priority: "medium", dueDate: "2024-03-15", category: t("entertainment") },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "low": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return t("high")
      case "medium": return t("medium")
      case "low": return t("low")
      default: return priority
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">{t("tasks")}</h1>
          <p className="text-charcoal-soft mt-1">{t("keepTrackOfYourWeddingPlanningProgress")}</p>
        </div>
        <Button className="bg-brand text-white hover:bg-brand/90 shadow-elegant w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {t("addTask")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft mb-1">
                  {t("totalTasks")}
                </p>
                <p className="text-2xl font-bold text-charcoal">
                  {tasks.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft mb-1">
                  {t("completed")}
                </p>
                <p className="text-2xl font-bold text-charcoal">
                  {tasks.filter(t => t.completed).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft mb-1">
                  {t("remaining")}
                </p>
                <p className="text-2xl font-bold text-charcoal">
                  {tasks.filter(t => !t.completed).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-charcoal-soft/10">
                <Calendar className="h-5 w-5 text-charcoal" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-0">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-charcoal">{t("allTasks")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-stone hover:bg-beige transition-all duration-200 group"
              >
                <button 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    task.completed 
                      ? 'bg-brand border-brand' 
                      : 'border-charcoal-soft hover:border-brand'
                  }`}
                >
                  {task.completed && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm sm:text-base ${
                    task.completed ? 'line-through text-charcoal-soft' : 'text-charcoal'
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                    <span className="text-xs text-charcoal-soft">
                      {task.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-charcoal-soft" />
                      <span className="text-xs text-charcoal-soft">
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)} shrink-0`}>
                  <Flag className="h-3 w-3 inline mr-1" />
                  {getPriorityText(task.priority)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}