import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users, Check, X, Clock } from "lucide-react"
import { t } from "@/lib/translations"

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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Check className="w-3 h-3 mr-1" />{t("attending")}</Badge>
      case "declined":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><X className="w-3 h-3 mr-1" />{t("declined")}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />{t("pending")}</Badge>
      default:
        return <Badge variant="secondary">{t("unknown")}</Badge>
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">{t("guestList")}</h1>
          <p className="text-charcoal-soft mt-1">{t("manageYourWeddingGuestListAndRSVPs")}</p>
        </div>
        <Button className="bg-brand text-white hover:bg-brand/90 shadow-elegant w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {t("addGuest")}
        </Button>
      </div>

      {/* Guest Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft mb-1">
                  {t("totalGuests")}
                </p>
                <p className="text-2xl font-bold text-charcoal">
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
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft mb-1">
                  {t("attending")}
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
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft mb-1">
                  {t("pending")}
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
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal-soft mb-1">
                  {t("declined")}
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
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-charcoal">{t("allGuests")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {guests.map((guest) => (
              <div 
                key={guest.id} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg bg-stone hover:bg-beige transition-all duration-200 gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-white">
                      {guest.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-charcoal text-sm sm:text-base">{guest.name}</h3>
                    <p className="text-sm text-charcoal-soft">{guest.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
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
    </div>
  )
}