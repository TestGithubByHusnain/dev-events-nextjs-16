import { Suspense } from "react";
import EventDetails from "../../../components/EventDetails";

// The app router passes params as a plain object { slug: string }
const EventDetailsPage = ({ params }: { params: { slug: string } }) => {
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <EventDetails params={params} />
            </Suspense>
        </main>
    );
};

export default EventDetailsPage;