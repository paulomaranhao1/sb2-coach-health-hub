
// Utilitário para limpar scripts não utilizados e evitar console errors

export const cleanupUnusedScripts = () => {
  // Remove scripts de tracking não utilizados que podem estar causando erros
  const scriptsToRemove = [
    'facebook-jssdk',
    'fbq', // Facebook Pixel
    'gtag', // Google Analytics se não configurado
  ];

  scriptsToRemove.forEach(scriptId => {
    const element = document.getElementById(scriptId);
    if (element) {
      element.remove();
    }
  });

  // Remove elementos de tracking do Facebook se não estão sendo usados
  const fbElements = document.querySelectorAll('[id*="facebook"], [class*="fb-"]');
  fbElements.forEach(element => {
    if (!element.hasChildNodes() && !element.textContent?.trim()) {
      element.remove();
    }
  });
};

// Função para verificar e limpar recursos preload não utilizados
export const cleanupUnusedPreloads = () => {
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  
  preloadLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Remove preloads que não são essenciais ou que causam warnings
    if (href && (href.includes('favicon') || href.includes('unused'))) {
      link.remove();
    }
  });
};

// Função para otimizar console output
export const optimizeConsoleOutput = () => {
  // Silenciar warnings específicos que não são críticos
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Filtrar warnings não críticos
    if (
      message.includes('preloaded but not used') ||
      message.includes('UTS') ||
      message.includes('Facebook Pixel')
    ) {
      return; // Não exibir esses warnings
    }
    
    originalWarn.apply(console, args);
  };
};
