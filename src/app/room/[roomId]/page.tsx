import DraggableWhiteboard from "@/components/DraggableWhiteboard";

interface RoomPageProps {
  params: { roomId: string };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)]">
      <DraggableWhiteboard roomId={params.roomId} />
    </div>
  );
}
