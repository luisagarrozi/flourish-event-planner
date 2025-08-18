import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users, Check, X, Clock } from "lucide-react"

export default function Guests() {
  const guests = [
    { id: 1, name: "John Smith", email: "john@example.com", rsvp: "attending", plusOne: true },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", rsvp: "attending", plusOne: false },
    { id: 3, name: "Mike Davis", email: "mike@example.com", rsvp: "declined", plusOne: false },
    { id: 4, name: "Emily Brown", email: "emily@example.com", rsvp: "pending", plusOne: true },
    { id: 5, name: "David Wilson", email: "david@example.com", rsvp: "attending", plusOne: true },
    { id: 6, name: "Lisa Anderson", email: "lisa@example.com", rsvp: "pending", plusOne: false },
  ]

  const attendingCount = guests.filter(g => g.rsvp === "attending").length
  const pendingCount = guests.filter(g => g.rsvp === "pending").length
  const declinedCount = guests.filter(g => g.rsvp === "declined").length

  const getRsvpBadge = (rsvp: string) => {
    switch (rsvp) {
      case "attending":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Check className="w-3 h-3 mr-1" />Attending</Badge>
      case "declined":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><X className="w-3 h-3 mr-1" />Declined</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <PageHeader 
        title="Guest List" 
        subtitle="Manage your wedding guest list and RSVPs"
      >
        <Button className="gradient-primary text-white hover:shadow-elegant">
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </PageHeader>

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Guest Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Guests
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {guests.length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Attending
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {attendingCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Declined
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {declinedCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <X className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guest List */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>All Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guests.map((guest) => (
                <div 
                  key={guest.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {guest.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{guest.name}</h3>
                      <p className="text-sm text-muted-foreground">{guest.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {guest.plusOne && (
                      <Badge variant="outline" className="text-xs">
                        +1
                      </Badge>
                    )}
                    {getRsvpBadge(guest.rsvp)}
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