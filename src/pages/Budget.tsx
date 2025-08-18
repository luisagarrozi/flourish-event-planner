import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Budget() {
  const budgetItems = [
    { category: "Venue", estimated: 8000, actual: 7500, percentage: 35 },
    { category: "Catering", estimated: 6000, actual: 5800, percentage: 27 },
    { category: "Photography", estimated: 3000, actual: 0, percentage: 14 },
    { category: "Flowers", estimated: 2000, actual: 0, percentage: 9 },
    { category: "Music/DJ", estimated: 1500, actual: 0, percentage: 7 },
    { category: "Attire", estimated: 1500, actual: 800, percentage: 7 },
    { category: "Miscellaneous", estimated: 500, actual: 150, percentage: 2 },
  ]

  const totalBudget = 22500
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.actual, 0)
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimated, 0)

  return (
    <div className="min-h-screen bg-gradient-warm">
      <PageHeader 
        title="Budget" 
        subtitle="Track your wedding expenses and stay on budget"
      />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Total Budget
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ${totalBudget.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Amount Spent
                </p>
                <p className="text-3xl font-bold text-primary">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Remaining
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${(totalBudget - totalSpent).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Budget Used</span>
                  <span>{Math.round((totalSpent / totalBudget) * 100)}%</span>
                </div>
                <Progress value={(totalSpent / totalBudget) * 100} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Breakdown */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgetItems.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-foreground">{item.category}</h3>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${item.actual.toLocaleString()} / ${item.estimated.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.percentage}% of total budget
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={item.actual > 0 ? (item.actual / item.estimated) * 100 : 0} 
                    className="h-2" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {item.actual > 0 ? `${Math.round((item.actual / item.estimated) * 100)}% used` : 'Not started'}
                    </span>
                    <span>
                      ${(item.estimated - item.actual).toLocaleString()} remaining
                    </span>
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