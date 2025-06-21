
import { Utensils, Users, Dumbbell, BarChart3, GraduationCap, Watch, ShoppingBag } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesGrid = () => {
  const newFeatures = [
    {
      icon: Utensils,
      title: "Planejador de Refeições",
      description: "Planos alimentares personalizados baseados em seus objetivos e preferências",
      benefits: ["Receitas adaptadas ao seu perfil", "Lista de compras automática", "Controle nutricional preciso"]
    },
    {
      icon: Users,
      title: "Recursos Sociais",
      description: "Compartilhe conquistas e participe de desafios em grupo",
      benefits: ["Comunidade motivacional", "Desafios em equipe", "Ranking de conquistas"]
    },
    {
      icon: Dumbbell,
      title: "Treinos Personalizados",
      description: "Sincronização com apps fitness e planos de treino adaptados",
      benefits: ["Integração com apps populares", "Treinos baseados em IA", "Progressão automática"]
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Relatórios detalhados e insights preditivos sobre sua evolução",
      benefits: ["Análises preditivas", "Relatórios personalizados", "Métricas avançadas"]
    },
    {
      icon: GraduationCap,
      title: "Cursos e Certificações",
      description: "Conteúdo educativo interativo com certificações",
      benefits: ["Cursos especializados", "Certificados oficiais", "Aprendizado gamificado"]
    },
    {
      icon: Watch,
      title: "Integração Wearables",
      description: "Conecte dispositivos vestíveis para monitoramento avançado",
      benefits: ["Sincronização automática", "Dados em tempo real", "Múltiplos dispositivos"]
    },
    {
      icon: ShoppingBag,
      title: "Marketplace SB2",
      description: "Marketplace exclusivo com produtos e serviços complementares",
      benefits: ["Produtos exclusivos", "Descontos especiais", "Suplementos verificados"]
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {newFeatures.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeaturesGrid;
