import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  CheckCircle, 
  Users, 
  Heart,
  CalendarDays,
  Plus
} from "lucide-react"
import { useEffect, useState } from "react"
import { t } from "@/lib/translations"
import { useParams } from "react-router-dom"
import { getEvent } from "@/services/events"

export default function Dashboard() {
  const { id } = useParams();
  const [weddingInfo, setWeddingInfo] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
  })

  useEffect(() => {
    if (!id) return;
    getEvent(id).then((evt) => {
      if (!evt) return;
      setWeddingInfo({
        brideName: evt.bride_name ?? "",
        groomName: evt.groom_name ?? "",
        weddingDate: evt.wedding_date ?? "",
      })
    })
  }, [id])

  const stats = [
    {
      title: t("daysUntilWedding"),
      value: "127",
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary-soft"
    },
    {
      title: t("tasksCompleted"),
      value: "24/45",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: t("guestsRSVPd"),
      value: "78/120",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ]

  const recentTasks = [
    { id: 1, title: t("bookWeddingVenue"), completed: true, dueDate: "2024-02-15" },
    { id: 2, title: t("sendSaveTheDates"), completed: true, dueDate: "2024-02-20" },
    { id: 3, title: t("orderWeddingDress"), completed: false, dueDate: "2024-03-01" },
    { id: 4, title: t("bookPhotographer"), completed: false, dueDate: "2024-03-05" },
  ]

  return (
    <div className="min-h-screen bg-gradient-warm">
      <PageHeader 
        title={t("weddingPlannerDashboard")} 
        subtitle={t("welcomeToYourWeddingPlanningCentralHub")}
      />

      <main className="p-6 space-y-8 animate-fade-in">
        {/* Welcome Card */}
        <Card className="shadow-elegant border-0 bg-gradient-soft">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">{t("welcomeToYourWeddingPlanner")}</CardTitle>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("welcomeDescription")}
            </p>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <CardTitle className="text-lg font-semibold text-foreground">{t("weddingInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    {t("bridesName")}
                  </Label>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-foreground">{weddingInfo.brideName || t("notSpecified")}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    {t("groomsName")}
                  </Label>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-foreground">{weddingInfo.groomName || t("notSpecified")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {t("weddingDate")}
                </Label>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-foreground">
                    {weddingInfo.weddingDate ? new Date(weddingInfo.weddingDate).toLocaleDateString('pt-BR') : t("notSpecified")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">{t("recentTasks")}</CardTitle>
                <Button size="sm" className="gradient-primary text-white hover:shadow-elegant">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("addTask")}
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
                        {t("due")}: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
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