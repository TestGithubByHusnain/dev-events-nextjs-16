import ExploreBtn from "@/components/ExploreBtn";
import EventsList from "@/components/EventsList";
import { Suspense } from "react";

const Page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7" id="events">
        <h3>Featured Events</h3>

        <Suspense fallback={<p>Loading events...</p>}>
          <EventsList />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
