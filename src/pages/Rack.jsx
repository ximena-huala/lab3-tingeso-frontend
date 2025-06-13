import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import dayjs from "dayjs";

function Rack() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
    .get(`${import.meta.env.VITE_API_URL}/api/reservations`)
      .then((response) => {
        const fetchedEvents = response.data.map((res) => {
          const start = dayjs(`${res.reservationDate}T${res.reservationTime}`);

          // Asignar duración real según el trackTime
          let durationMinutes = 0;
          switch (res.trackTime) {
            case "10 minutes":
              durationMinutes = 30;
              break;
            case "15 minutes":
              durationMinutes = 35;
              break;
            case "20 minutes":
              durationMinutes = 40;
              break;
            default:
              durationMinutes = 30;
          }

          const end = start.add(durationMinutes, "minute");

          return {
            title: `${res.numberOfPeople} people - ${res.trackTime}`,
            start: start.toISOString(),
            end: end.toISOString(),
          };
        });

        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Weekly Rack</h2>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        slotDuration="00:30:00"
        slotLabelInterval="01:00"
        slotMinTime="10:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        events={events}
      />
    </div>
  );
}

export default Rack;
