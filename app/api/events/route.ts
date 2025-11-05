import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event: Record<string, unknown>;

    try {
      event = Object.fromEntries(formData.entries());
    } catch {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    const imageField = formData.get("image");
    if (!imageField) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const parseMaybeJSON = (val: FormDataEntryValue | null) => {
      if (val == null) return [] as string[];
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return []; }
      }
      return [] as string[];
    };

    const tags = parseMaybeJSON(formData.get("tags"));
    const agenda = parseMaybeJSON(formData.get("agenda"));

    let secureUrl: string | undefined;

    if (typeof imageField === 'string') {
      // Accept remote URL or data URI
      const upload = await cloudinary.uploader.upload(imageField, { folder: 'DevEvent', resource_type: 'image' });
      secureUrl = upload.secure_url;
    } else if (imageField instanceof Blob) {
      const arrayBuffer = await imageField.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "DevEvent" },
            (error, results) => {
              if (error) return reject(error);
              resolve(results);
            }
          )
          .end(buffer);
      });
      secureUrl = (uploadResult as { secure_url: string }).secure_url;
    } else {
      return NextResponse.json(
        { message: "Invalid image field" },
        { status: 400 }
      );
    }

    const createdEvent = await Event.create({
      ...event,
      image: secureUrl,
      tags,
      agenda,
    });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}
