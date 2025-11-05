import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import sampleEvents from "@/lib/constants";

export async function POST() {
  try {
    await connectDB();

    let inserted = 0;

    for (const item of sampleEvents) {
      const payload = {
        title: item.title,
        slug: item.slug,
        description: `${item.title} — a must-attend event for modern developers. Learn, network, and build.`,
        overview:
          "Join us for talks, workshops, and hands-on sessions led by industry experts.",
        image: item.image,
        venue: "Main Hall",
        location: item.location,
        date: item.date,
        time: item.time,
        mode: "online" as const,
        audience: "Developers",
        agenda: ["Introduction", "Talks", "Networking"],
        organizer: "DevEvent Org",
        tags: ["tech", "conference"],
      };

      const res = await Event.updateOne(
        { slug: payload.slug },
        { $setOnInsert: payload },
        { upsert: true }
      );

      // @ts-expect-error - Mongoose returns upsertedCount in UpdateResult
      if (res.upsertedCount === 1) inserted += 1;
    }

    const count = await Event.countDocuments();

    return NextResponse.json(
      {
        message: "Seed completed",
        inserted,
        total: count,
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Seed failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
