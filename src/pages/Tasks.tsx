import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Plus, Calendar, Flag } from "lucide-react"

export default function Tasks() {
  const tasks = [
    { id: 1, title: "Book wedding venue", completed: true, priority: "high", dueDate: "2024-02-15", category: "Venue" },
    { id: 2, title: "Send save the dates", completed: true, priority: "medium", dueDate: "2024-02-20", category: "Invitations" },
    { id: 3, title: "Order wedding dress", completed: false, priority: "high", dueDate: "2024-03-01", category: "Attire" },
    { id: 4, title: "Book photographer", completed: false, priority: "high", dueDate: "2024-03-05", category: "Photography" },
    { id: 5, title: "Choose wedding cake", completed: false, priority: "medium", dueDate: "2024-03-10", category: "Catering" },
    { id: 6, title: "Book DJ/Band", completed: false, priority: "medium", dueDate: "2024-03-15", category: "Entertainment" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "low": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <PageHeader 
        title="Tasks" 
        subtitle="Keep track of your wedding planning progress"
      >
        <Button className="gradient-primary text-white hover:shadow-elegant">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </PageHeader>

      <main className="p-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-foreground">
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-foreground">
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Remaining
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {tasks.filter(t => !t.completed).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary-soft">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 group"
                >
                  <button 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {task.completed && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {task.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                    <Flag className="h-3 w-3 inline mr-1" />
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}