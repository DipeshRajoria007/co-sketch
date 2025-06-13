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

const rooms: Record<string, any> = {};

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
        const snapshot = rooms[roomId];
        if (snapshot) {
          socket.emit("sync", snapshot);
        }
      });

      socket.on("sync", ({ roomId, data }) => {
        rooms[roomId] = data;
        socket.to(roomId).emit("sync", data);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
