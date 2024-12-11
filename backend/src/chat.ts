import OpenAI from "openai";
import { Building } from "../../models/Building";
import { environment } from "../environment";

const client = new OpenAI({ apiKey: environment.openaiKey });

const SYSTEM_PROMPT = `
You are a helpful assistant specializing in answering questions about building data. The data includes details about multiple buildings, their floors, rooms, attributes (e.g., capacity, amenities), and scheduled events with specific start and end times. Use your knowledge of this data to provide clear, concise, and accurate responses. When answering questions, present information naturally and intuitively as if you have direct knowledge of the buildings, without explicitly referencing or quoting the raw data. For example, if asked how many floors a building has, state 'The building has X floors' instead of 'According to the data, the building has X floors.' When interpreting time-sensitive queries, take into account the current date and time (${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}) If you cannot find the relevant information in the data, simply state that you do not know and that you suggest checking www.umass.edu.
`;

function generate_prompt(message: string, buildings: Building[]): string {
  const buildingData =
    buildings
      .map((building) => {
        const floors =
          building.floors
            ?.map((floor) => {
              const rooms =
                floor.rooms
                  ?.map((room) => {
                    const events =
                      room.events
                        ?.map((event) => {
                          const title = event.title || "No Title";
                          const start = event.start
                            ? new Date(event.start).toISOString()
                            : "No Start Date";
                          const end = event.end
                            ? new Date(event.end).toISOString()
                            : "No End Date";
                          return `Title: ${title}, Start: ${start}, End: ${end}`;
                        })
                        .join("; ") || "No Events";
                    const attributes =
                      room.attributes?.join(", ") || "No Attributes";
                    return `Room: ${
                      room.name || "Unnamed Room"
                    }, Attributes: [${attributes}], Events: [${events}]`;
                  })
                  .join("; ") || "No Rooms";
              return `Floor: ${
                floor.name || "Unnamed Floor"
              }, Rooms: [${rooms}]`;
            })
            .join("; ") || "No Floors";
        return `Building: ${building.name || "Unnamed Building"}, Address: ${
          building.address || "N/A"
        }, Location: (Lat: ${building.location?.lat || "Unknown"}, Lng: ${
          building.location?.lng || "Unknown"
        }), Floors: [${floors}]`;
      })
      .join("; ") || "No Buildings";

  return `
User Query: "${message}"
Building Data:
${buildingData}
  `;
}

async function chat(prompt: string, system_prompt: string = SYSTEM_PROMPT) {
  return (
    await client.chat.completions.create({
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o",
    })
  ).choices[0].message.content;
}

export async function buildings_chat(message: string, buildings: Building[]) {
  const prompt = generate_prompt(message, buildings);
  return chat(prompt);
}
