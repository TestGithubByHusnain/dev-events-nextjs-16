import EventCard from "@/components/EventCard";
import sampleEvents from "@/lib/constants";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type CardEvent = Pick<IEvent, "title" | "image" | "slug" | "location" | "date" | "time">;

const EventsList = async () => {
  const url = BASE_URL ? `${BASE_URL}/api/events` : `/api/events`;
  let events: CardEvent[] = [];

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      const dbEvents: IEvent[] = data?.events ?? [];
      events = dbEvents.map((e) => ({
        title: e.title,
        image: e.image,
        slug: e.slug,
        location: e.location,
        date: e.date,
        time: e.time,
      }));
    }
  } catch {}

  if (!events || events.length === 0) {
    events = sampleEvents as unknown as CardEvent[];
  }

  return (
    <ul className="events">
      {events &&
        events.length > 0 &&
        events.map((event) => (
          <li key={event.slug} className="list-none">
            <EventCard {...event} />
          </li>
        ))}
    </ul>
  );
};

export default EventsList;
