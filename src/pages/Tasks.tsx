import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, AlertTriangle, CalendarDays } from "lucide-react";
import { t } from "@/lib/translations";
import { listEvents } from "@/services/events";
import { listTasks } from "@/services/tasks";
import type { Tables } from "@/integrations/supabase/types";

interface EventWithTasks {
  event: Tables<'weddings'>;
  pendingTasks: Tables<'tasks'>[];
  lateTasks: Tables<'tasks'>[];
  totalPending: number;
  totalLate: number;
}

export default function Tasks() {
  const [events, setEvents] = useState<Tables<'weddings'>[]>([]);
  const [eventsWithTasks, setEventsWithTasks] = useState<EventWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all events and their tasks
  useEffect(() => {
    const fetchEventsAndTasks = async () => {
      setLoading(true);
      try {
        const allEvents = await listEvents();
        setEvents(allEvents);

        // Filter out events that are already past their date
        const currentDate = new Date();
        const activeEvents = allEvents.filter(event => {
          if (!event.wedding_date) return false;
          const eventDate = new Date(event.wedding_date);
          return eventDate >= currentDate;
        });

        // Fetch tasks for each active event
        const eventsWithTasksData: EventWithTasks[] = [];
        
        for (const event of activeEvents) {
          const tasks = await listTasks(event.id);
          
          // Filter out completed tasks
          const pendingTasks = tasks.filter(task => !task.completed);
          
          if (pendingTasks.length === 0) continue; // Skip events with no pending tasks
          
          // Separate pending and late tasks
          const now = new Date();
          const lateTasks = pendingTasks.filter(task => {
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            return dueDate < now;
          });
          
          const onTimeTasks = pendingTasks.filter(task => {
            if (!task.due_date) return true; // Tasks without due date are considered on time
            const dueDate = new Date(task.due_date);
            return dueDate >= now;
          });

          eventsWithTasksData.push({
            event,
            pendingTasks: onTimeTasks,
            lateTasks,
            totalPending: onTimeTasks.length,
            totalLate: lateTasks.length
          });
        }

        setEventsWithTasks(eventsWithTasksData);
      } catch (error) {
        console.error("Error fetching events and tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndTasks();
  }, []);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}?tab=organization`);
  };

  const formatEventDate = (dateString: string | null) => {
    if (!dateString) return "Data não definida";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getEventDisplayName = (event: Tables<'weddings'>) => {
    if (event.bride_name && event.groom_name) {
      return `${event.bride_name} & ${event.groom_name}`;
    } else if (event.bride_name) {
      return event.bride_name;
    } else if (event.groom_name) {
      return event.groom_name;
    } else {
      return "Evento sem nome";
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-charcoal">{t("tasks")}</h1>
          <p className="text-charcoal-soft mt-1 sm:mt-2 text-sm sm:text-base">Carregando suas tarefas...</p>
        </div>
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="inline-flex items-center gap-2 text-charcoal-soft">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            <p className="text-sm sm:text-base">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (eventsWithTasks.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-charcoal">{t("tasks")}</h1>
          <p className="text-charcoal-soft mt-1 sm:mt-2 text-sm sm:text-base">Acompanhe o progresso do seu planejamento</p>
        </div>
        
        <Card className="border-charcoal-soft/20">
          <CardContent className="text-center py-8 sm:py-12 lg:py-16">
            <div className="max-w-md mx-auto px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Parabéns!</h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                {events.length === 0 
                  ? "Você ainda não tem eventos criados. Crie seu primeiro evento para começar a planejar!"
                  : "Todas as suas tarefas estão em dia! Não há tarefas pendentes no momento."
                }
              </p>
              {events.length === 0 && (
                <Button 
                  onClick={() => navigate("/")}
                  className="bg-brand text-white hover:bg-brand/90 shadow-elegant w-full sm:w-auto"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Criar Evento
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">{t("tasks")}</h1>
        <p className="text-charcoal-soft mt-2">Acompanhe o progresso do seu planejamento</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="shadow-card border-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-charcoal-soft mb-1 truncate">
                  Eventos com Tarefas
                </p>
                <p className="text-xl sm:text-2xl font-bold text-charcoal">
                  {eventsWithTasks.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-blue-50 flex-shrink-0 ml-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-charcoal-soft mb-1 truncate">
                  Tarefas Pendentes
                </p>
                <p className="text-xl sm:text-2xl font-bold text-charcoal">
                  {eventsWithTasks.reduce((sum, event) => sum + event.totalPending, 0)}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-yellow-50 flex-shrink-0 ml-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-charcoal-soft mb-1 truncate">
                  Tarefas Atrasadas
                </p>
                <p className="text-xl sm:text-2xl font-bold text-charcoal">
                  {eventsWithTasks.reduce((sum, event) => sum + event.totalLate, 0)}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-red-50 flex-shrink-0 ml-3">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {eventsWithTasks.map((eventWithTasks) => (
          <Card 
            key={eventWithTasks.event.id}
            className="shadow-card border-0 hover:shadow-lg transition-all duration-200 cursor-pointer group active:scale-95 touch-manipulation"
            onClick={() => handleEventClick(eventWithTasks.event.id)}
          >
            <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg font-semibold text-charcoal group-hover:text-brand transition-colors leading-tight">
                {getEventDisplayName(eventWithTasks.event)}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-soft">
                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{formatEventDate(eventWithTasks.event.wedding_date)}</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                {/* Pending Tasks */}
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-800 truncate">
                      Tarefas Pendentes
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-yellow-800 flex-shrink-0 ml-2">
                    {eventWithTasks.totalPending}
                  </span>
                </div>

                {/* Late Tasks */}
                {eventWithTasks.totalLate > 0 && (
                  <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-red-800 truncate">
                        Tarefas Atrasadas
                      </span>
                    </div>
                    <span className="text-base sm:text-lg font-bold text-red-800 flex-shrink-0 ml-2">
                      {eventWithTasks.totalLate}
                    </span>
                  </div>
                )}

                {/* Venue Info */}
                {eventWithTasks.event.venue && (
                  <div className="text-xs text-charcoal-soft pt-2 border-t border-gray-100 truncate">
                    📍 {eventWithTasks.event.venue}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}