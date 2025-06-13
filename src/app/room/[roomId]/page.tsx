import Whiteboard from "@/components/Whiteboard";

interface RoomPageProps {
  params: { roomId: string };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="flex-1 h-[calc(100vh-4rem)]">
      <Whiteboard roomId={params.roomId} />
    </div>
  );
}
