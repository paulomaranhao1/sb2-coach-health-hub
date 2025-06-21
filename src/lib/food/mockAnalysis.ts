
import { FoodAnalysis } from './types';

export const analyzeFoodImageMock = async (imageData: string): Promise<FoodAnalysis> => {
  console.log('🎭 Usando análise mock aprimorada...');
  
  // Simulate realistic processing delay
  await new Promise(resolve => setTimeout(resolve, 1800));

  // Enhanced food combinations for more realistic mock data
  const brazilianMeals = [
    {
      name: "Refeição Brasileira Tradicional",
      foods: [
        { name: "Arroz Branco", quantity: "100g (1/2 xícara)", calories: 130, confidence: 0.85 },
        { name: "Feijão Carioca", quantity: "80g (1/3 xícara)", calories: 76, confidence: 0.82 },
        { name: "Frango Grelhado", quantity: "120g", calories: 195, confidence: 0.88 },
        { name: "Salada Verde", quantity: "80g", calories: 12, confidence: 0.75 }
      ],
      totalCalories: 413,
      macros: { protein: 28, carbs: 48, fat: 8, fiber: 6 },
      recommendations: [
        "Refeição bem balanceada seguindo o padrão brasileiro tradicional.",
        "Considere adicionar mais vegetais coloridos para aumentar vitaminas.",
        "Ótima combinação de arroz e feijão que forma proteína completa."
      ]
    },
    {
      name: "Prato Executivo",
      foods: [
        { name: "Picanha Grelhada", quantity: "100g", calories: 250, confidence: 0.90 },
        { name: "Batata Portuguesa", quantity: "120g", calories: 103, confidence: 0.78 },
        { name: "Farofa de Bacon", quantity: "30g", calories: 118, confidence: 0.85 },
        { name: "Vinagrete", quantity: "50g", calories: 25, confidence: 0.80 }
      ],
      totalCalories: 496,
      macros: { protein: 32, carbs: 35, fat: 22, fiber: 4 },
      recommendations: [
        "Refeição rica em proteínas de alta qualidade.",
        "Considere reduzir a farofa para diminuir calorias.",
        "Adicione mais salada para equilibrar os macronutrientes."
      ]
    },
    {
      name: "Almoço Fitness",
      foods: [
        { name: "Peito de Frango", quantity: "150g", calories: 248, confidence: 0.92 },
        { name: "Batata Doce", quantity: "100g", calories: 86, confidence: 0.87 },
        { name: "Brócolis Refogado", quantity: "100g", calories: 34, confidence: 0.85 },
        { name: "Azeite Extra Virgem", quantity: "1 colher de sopa", calories: 119, confidence: 0.70 }
      ],
      totalCalories: 487,
      macros: { protein: 42, carbs: 28, fat: 18, fiber: 5 },
      recommendations: [
        "Excelente escolha para quem busca ganho de massa muscular.",
        "Batata doce fornece energia de liberação lenta.",
        "Brócolis é rico em antioxidantes e fibras."
      ]
    },
    {
      name: "Prato Vegetariano",
      foods: [
        { name: "Quinoa Cozida", quantity: "100g", calories: 120, confidence: 0.83 },
        { name: "Grão de Bico", quantity: "80g", calories: 134, confidence: 0.86 },
        { name: "Abóbora Assada", quantity: "100g", calories: 26, confidence: 0.88 },
        { name: "Espinafre Refogado", quantity: "80g", calories: 18, confidence: 0.82 }
      ],
      totalCalories: 298,
      macros: { protein: 15, carbs: 52, fat: 4, fiber: 8 },
      recommendations: [
        "Combinação rica em proteínas vegetais completas.",
        "Excelente fonte de ferro e folatos do espinafre.",
        "Considere adicionar uma fonte de gordura saudável como abacate."
      ]
    }
  ];

  // Select meal based on timestamp for variety
  const timestamp = Date.now();
  const selectedMeal = brazilianMeals[timestamp % brazilianMeals.length];
  
  // Add slight calorie variation for realism
  const calorieVariation = (Math.random() - 0.5) * 50; // ±25 calories
  const adjustedTotalCalories = Math.round(selectedMeal.totalCalories + calorieVariation);
  
  const mockAnalysis: FoodAnalysis = {
    foods: selectedMeal.foods,
    totalCalories: adjustedTotalCalories,
    macros: {
      ...selectedMeal.macros,
      // Slightly adjust macros to match calorie variation
      protein: Math.round(selectedMeal.macros.protein + (calorieVariation * 0.25 / 4)),
      carbs: Math.round(selectedMeal.macros.carbs + (calorieVariation * 0.5 / 4)),
      fat: Math.round(selectedMeal.macros.fat + (calorieVariation * 0.25 / 9))
    },
    recommendations: [
      "⚠️ Análise simulada - Serviço de IA temporariamente indisponível.",
      ...selectedMeal.recommendations,
      "💡 Para análise precisa, aguarde a restauração do serviço de IA."
    ],
    timestamp: new Date().toISOString(),
    isAnalysisUnavailable: true,
    analysisType: 'mock_fallback'
  };

  console.log('🎭 Análise mock concluída:', {
    meal: selectedMeal.name,
    foods: mockAnalysis.foods.length,
    totalCalories: mockAnalysis.totalCalories
  });
  
  return mockAnalysis;
};
