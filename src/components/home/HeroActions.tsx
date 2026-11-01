
import { Button } from "@heroui/react";

export default function HeroActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="primary">
        Get Started
      </Button>

      <Button variant="secondary">
        Explore Dashboard
      </Button>

      <Button variant="outline">
        Learn More
      </Button>
    </div>
  );
}
