import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      socket.on("join", (roomId: string) => {
        socket.join(roomId);
      });
      socket.on("draw", ({ roomId, x, y }) => {
        socket.to(roomId).emit("draw", { x, y });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
