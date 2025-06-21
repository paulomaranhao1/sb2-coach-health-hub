
import { FoodAnalysis } from './types';

export const analyzeFoodImageMock = async (imageData: string): Promise<FoodAnalysis> => {
  console.log('Usando análise mock de fallback...');
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Gerar dados variados baseados no timestamp
  const timestamp = Date.now();
  const foodOptions = [
    {
      name: "Peito de Frango Grelhado",
      quantity: "150g",
      calories: 248,
      confidence: 0.75
    },
    {
      name: "Salmão Grelhado",
      quantity: "120g",
      calories: 206,
      confidence: 0.72
    },
    {
      name: "Filé de Tilápia",
      quantity: "130g",
      calories: 128,
      confidence: 0.70
    }
  ];

  const carbOptions = [
    {
      name: "Arroz Branco",
      quantity: "100g (1/2 xícara)",
      calories: 130,
      confidence: 0.68
    },
    {
      name: "Batata Doce",
      quantity: "80g",
      calories: 86,
      confidence: 0.65
    },
    {
      name: "Quinoa",
      quantity: "90g",
      calories: 120,
      confidence: 0.63
    }
  ];

  const vegOptions = [
    {
      name: "Brócolis Refogado",
      quantity: "80g",
      calories: 22,
      confidence: 0.60
    },
    {
      name: "Salada Verde",
      quantity: "100g",
      calories: 15,
      confidence: 0.58
    },
    {
      name: "Cenoura Refogada",
      quantity: "60g",
      calories: 25,
      confidence: 0.62
    }
  ];

  // Selecionar alimentos baseado no timestamp para variar
  const selectedProtein = foodOptions[timestamp % foodOptions.length];
  const selectedCarb = carbOptions[timestamp % carbOptions.length];
  const selectedVeg = vegOptions[timestamp % vegOptions.length];
  
  const totalCalories = selectedProtein.calories + selectedCarb.calories + selectedVeg.calories + 119;

  const mockAnalysis: FoodAnalysis = {
    foods: [
      selectedProtein,
      selectedCarb,
      selectedVeg,
      {
        name: "Azeite de Oliva",
        quantity: "1 colher de sopa",
        calories: 119,
        confidence: 0.55
      }
    ],
    totalCalories,
    macros: {
      protein: Math.round(totalCalories * 0.3 / 4),
      carbs: Math.round(totalCalories * 0.4 / 4),
      fat: Math.round(totalCalories * 0.3 / 9),
      fiber: Math.round(Math.random() * 8 + 2)
    },
    recommendations: [
      "⚠️ Análise simulada - Para resultados reais, verifique a conexão com OpenAI.",
      "Considere adicionar mais vegetais para aumentar a fibra.",
      "Ótima escolha de proteína magra!",
      "Para análise precisa, use o sistema de IA real."
    ],
    timestamp: new Date().toISOString()
  };

  console.log('Análise mock concluída:', mockAnalysis);
  return mockAnalysis;
};
