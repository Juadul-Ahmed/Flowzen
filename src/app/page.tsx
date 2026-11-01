

import HeroActions from "@/components/home/HeroActions";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Flowzen
        </h1>

        <p className="mt-3 text-default-500">
          Your AI-powered CRM and sales automation platform.
        </p>
      </div>

      <HeroActions />
   
     
    </main>
  );
}
