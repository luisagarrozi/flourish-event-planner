import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  CheckCircle, 
  DollarSign, 
  Users, 
  Heart,
  CalendarDays,
  Plus
} from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [weddingInfo, setWeddingInfo] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
  })

  const stats = [
    {
      title: "Days Until Wedding",
      value: "127",
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary-soft"
    },
    {
      title: "Tasks Completed",
      value: "24/45",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Budget Used",
      value: "$12,500",
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Guests RSVP'd",
      value: "78/120",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ]

  const recentTasks = [
    { id: 1, title: "Book wedding venue", completed: true, dueDate: "2024-02-15" },
    { id: 2, title: "Send save the dates", completed: true, dueDate: "2024-02-20" },
    { id: 3, title: "Order wedding dress", completed: false, dueDate: "2024-03-01" },
    { id: 4, title: "Book photographer", completed: false, dueDate: "2024-03-05" },
  ]

  return (
    <div className="min-h-screen bg-gradient-warm">
      <PageHeader 
        title="Wedding Planner Dashboard" 
        subtitle="Welcome to your wedding planning central hub"
      />

      <main className="p-6 space-y-8 animate-fade-in">
        {/* Welcome Card */}
        <Card className="shadow-elegant border-0 bg-gradient-soft">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Welcome to Your Wedding Planner!</CardTitle>
            </div>
            <p className="text-muted-foreground text-sm">
              Let's start by setting your wedding date in the settings below. This will help us create a personalized planning timeline for you.
            </p>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="shadow-card border-0 hover:shadow-elegant transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wedding Information */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">Wedding Information</CardTitle>
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  Clear All Data
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the couple's names and wedding date.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName" className="text-sm font-medium">
                    Bride's Name
                  </Label>
                  <Input
                    id="brideName"
                    placeholder="Enter bride's name"
                    value={weddingInfo.brideName}
                    onChange={(e) => setWeddingInfo(prev => ({ ...prev, brideName: e.target.value }))}
                    className="transition-smooth focus:shadow-soft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomName" className="text-sm font-medium">
                    Groom's Name
                  </Label>
                  <Input
                    id="groomName"
                    placeholder="Enter groom's name"
                    value={weddingInfo.groomName}
                    onChange={(e) => setWeddingInfo(prev => ({ ...prev, groomName: e.target.value }))}
                    className="transition-smooth focus:shadow-soft"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate" className="text-sm font-medium">
                  Wedding Date
                </Label>
                <div className="relative">
                  <Input
                    id="weddingDate"
                    type="date"
                    value={weddingInfo.weddingDate}
                    onChange={(e) => setWeddingInfo(prev => ({ ...prev, weddingDate: e.target.value }))}
                    className="transition-smooth focus:shadow-soft"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <Button className="w-full gradient-primary text-white font-medium hover:shadow-elegant transition-all duration-300">
                Save All Information
              </Button>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">Recent Tasks</CardTitle>
                <Button size="sm" className="gradient-primary text-white hover:shadow-elegant">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {task.completed && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}