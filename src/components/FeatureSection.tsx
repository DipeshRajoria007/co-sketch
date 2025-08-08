import { Card, CardContent } from "@/components/ui/card";
import {
  Palette,
  Users,
  Video,
  Zap,
  Shield,
  Globe,
  LucideIcon,
} from "lucide-react";

// Types
interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
}

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

// Feature data configuration
const DEFAULT_FEATURES: Feature[] = [
  {
    id: "drawing-tools",
    icon: Palette,
    title: "Advanced Drawing Tools",
    description:
      "Professional drawing tools with customizable colors, brush sizes, and shapes for all your creative needs.",
  },
  {
    id: "real-time-collaboration",
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "See changes instantly as your team draws and edits. Perfect synchronization across all connected users.",
  },
  {
    id: "video-chat",
    icon: Video,
    title: "Integrated Video Chat",
    description:
      "Communicate face-to-face while collaborating with built-in video chat powered by WebRTC technology.",
  },
  {
    id: "lightning-fast",
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with Next.js and WebSockets for ultra-fast performance and real-time updates without lag.",
  },
  {
    id: "secure-auth",
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Enterprise-grade security with Clerk authentication to keep your collaborative sessions safe and private.",
  },
  {
    id: "room-management",
    icon: Globe,
    title: "Room Management",
    description:
      "Create private rooms, invite team members, and manage access controls for organized collaboration.",
  },
];

// Reusable FeatureCard component
const FeatureCard = ({ feature }: FeatureCardProps) => {
  const IconComponent = feature.icon;

  return (
    <Card className="group border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300 dark:hover:border-gray-700">
      <CardContent className="p-8">
        <div className="w-14 h-14 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
          <IconComponent className="w-7 h-7 text-white dark:text-gray-900" />
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};

// Main FeatureSection component
const FeatureSection = ({
  title = "Everything you need for seamless collaboration",
  subtitle = "CoSketch combines powerful drawing tools with real-time collaboration features to enhance your team's productivity.",
  features = DEFAULT_FEATURES,
}: FeatureSectionProps) => {
  return (
    <section
      id="features"
      className="py-24 bg-gray-50 dark:bg-gray-950 relative"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-100/20 to-transparent dark:from-transparent dark:via-gray-900/20 dark:to-transparent"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
