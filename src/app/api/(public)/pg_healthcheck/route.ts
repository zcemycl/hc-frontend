import { FASTAPI_URI } from "@/http/backend/constants";

export async function GET(request: Request) {
  const WS_URI = FASTAPI_URI!.replace("http", "ws");
  const ws = new WebSocket(`${WS_URI}/postgres-status`);

  return new Promise<Response>((resolve) => {
    ws.onopen = () => {};

    ws.onmessage = (event) => {
      // console.log("Received:", event.data);
      resolve(Response.json({ message: event.data })); // Send message as JSON
      ws.close(); // Close after receiving one message
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      resolve(
        Response.json(
          { error: "WebSocket Connection Failed" },
          { status: 500 },
        ),
      );
    };
  });
}
