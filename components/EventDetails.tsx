import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";
import { IEvent } from "../database/event.model";
import { getSimilarEventsBySlug } from "../lib/actions/event.actions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetails = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

    try {
    const res = await fetch(
      `${BASE_URL ? `${BASE_URL}/api/events/${slug}` : `/api/events/${slug}`}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error(`Failed to fetch event: ${res.statusText}`);
    }

    const data = await res.json();
    const event = data?.event;

    if (!event) return notFound();

    const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;
    if (!description) return notFound();

  const bookings = 10;
  const similarEvents = (await getSimilarEventsBySlug(slug)) as unknown as IEvent[];

    return (
      <section id="event">
        <div className="header">
          <h1>Event Description</h1>
          <p>{description}</p>
        </div>

        <div className="details">
          {/* Left Side */}
          <div className="content">
            <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

            <section className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{overview}</p>
            </section>

            <section className="flex-col-gap-2">
              <h2>Event Details</h2>
              <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
              <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
              <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
              <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
              <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
            </section>

            {agenda && <EventAgenda agendaItems={agenda ?? []} />}

            <section className="flex-col-gap-2">
              <h2>About the Organizer</h2>
              <p>{organizer}</p>
            </section>

            {tags && <EventTags tags={tags ?? []} />}
          </div>

          {/* Right Side */}
          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Spot</h2>
              {bookings > 0 ? (
                <p className="text-sm">Join {bookings} people who have already booked their spot!</p>
              ) : (
                <p className="text-sm">Be the first to book your spot!</p>
              )}
              <BookEvent eventId={event._id} slug={event.slug} />
            </div>
          </aside>
        </div>

        <div className="flex w-full flex-col gap-4 pt-20">
          <h2>Similar Events</h2>
          <div className="events">
              {similarEvents.length > 0 ? (
              similarEvents.map((similarEvent: IEvent) => (
                <EventCard key={String(similarEvent._id)} {...similarEvent} />
              ))
            ) : (
              <p>No similar events found.</p>
            )}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return notFound();
  }
};

export default EventDetails;
