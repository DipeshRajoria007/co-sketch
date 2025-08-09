import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends HTTPServer {
  io?: Server;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

type NextApiResponseWithSocket = NextApiResponse & {
  socket: SocketWithIO;
};

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: [Point, Point];
  tool?: string;
  color?: string;
  width?: number;
  opacity?: number;
}

interface User {
  id: string;
  name: string;
  initials: string;
  cursor?: Point;
  tool?: string;
  isDrawing?: boolean;
  color?: string;
  size?: number;
  opacity?: number;
}

const rooms: Record<string, Line[]> = {};
const roomUsers: Record<string, Record<string, User>> = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      socket.on("join", ({ roomId, user }: { roomId: string; user: User }) => {
        socket.join(roomId);

        // Initialize room users if not exists
        if (!roomUsers[roomId]) {
          roomUsers[roomId] = {};
        }

        // Add user to room
        roomUsers[roomId][socket.id] = { ...user, id: socket.id };

        // Send existing drawings to new user
        const lines = rooms[roomId] || [];
        socket.emit("init", lines);

        // Send existing users to new user
        const existingUsers = Object.values(roomUsers[roomId]).filter(
          (u) => u.id !== socket.id
        );
        socket.emit("users", existingUsers);

        // Notify other users about new user
        socket.to(roomId).emit("user-joined", roomUsers[roomId][socket.id]);
      });

      socket.on(
        "stroke",
        ({ roomId, line }: { roomId: string; line: Line }) => {
          if (!rooms[roomId]) rooms[roomId] = [];
          rooms[roomId].push(line);
          socket.to(roomId).emit("stroke", line);
        }
      );

      socket.on("clear", ({ roomId }: { roomId: string }) => {
        if (rooms[roomId]) {
          rooms[roomId] = [];
        }
        socket.to(roomId).emit("clear");
      });

      socket.on(
        "cursor-move",
        ({
          roomId,
          cursor,
          tool,
          isDrawing,
          color,
          size,
          opacity,
        }: {
          roomId: string;
          cursor: Point;
          tool: string;
          isDrawing: boolean;
          color: string;
          size: number;
          opacity: number;
        }) => {
          if (roomUsers[roomId] && roomUsers[roomId][socket.id]) {
            roomUsers[roomId][socket.id].cursor = cursor;
            roomUsers[roomId][socket.id].tool = tool;
            roomUsers[roomId][socket.id].isDrawing = isDrawing;
            roomUsers[roomId][socket.id].color = color;
            roomUsers[roomId][socket.id].size = size;
            roomUsers[roomId][socket.id].opacity = opacity;
            socket.to(roomId).emit("cursor-update", {
              userId: socket.id,
              user: roomUsers[roomId][socket.id],
            });
          }
        }
      );

      socket.on("cursor-hide", ({ roomId }: { roomId: string }) => {
        if (roomUsers[roomId] && roomUsers[roomId][socket.id]) {
          roomUsers[roomId][socket.id].cursor = undefined;
          roomUsers[roomId][socket.id].tool = undefined;
          roomUsers[roomId][socket.id].isDrawing = false;
          roomUsers[roomId][socket.id].color = undefined;
          roomUsers[roomId][socket.id].size = undefined;
          roomUsers[roomId][socket.id].opacity = undefined;
          socket.to(roomId).emit("cursor-hide", { userId: socket.id });
        }
      });

      socket.on("disconnect", () => {
        // Find and remove user from all rooms
        Object.keys(roomUsers).forEach((roomId) => {
          if (roomUsers[roomId][socket.id]) {
            socket.to(roomId).emit("user-left", { userId: socket.id });
            delete roomUsers[roomId][socket.id];

            // Clean up empty rooms
            if (Object.keys(roomUsers[roomId]).length === 0) {
              delete roomUsers[roomId];
            }
          }
        });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
