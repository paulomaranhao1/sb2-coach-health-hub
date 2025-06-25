import RoadmapSection from "@/components/RoadmapSection";
const Roadmap = () => {
  return <div className="max-w-6xl mx-auto py-8 px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Roadmap SB2coach.ai</h1>
        <p className="text-center text-muted-foreground">
          Acompanhe o desenvolvimento e as próximas funcionalidades da plataforma
        </p>
      </div>
      <RoadmapSection />
    </div>;
};
export default Roadmap;