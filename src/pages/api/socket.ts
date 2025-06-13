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

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: [Point, Point];
}

const rooms: Record<string, Line[]> = {};

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
        const lines = rooms[roomId] || [];
        socket.emit("init", lines);
      });

      socket.on(
        "stroke",
        ({ roomId, line }: { roomId: string; line: Line }) => {
          if (!rooms[roomId]) rooms[roomId] = [];
          rooms[roomId].push(line);
          socket.to(roomId).emit("stroke", line);
        }
      );
    });

    res.socket.server.io = io;
  }
  res.end();
}
