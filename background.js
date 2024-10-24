const tabData = {};

// Função para inicializar os dados de uma aba
function initializeTabData(tabId) {
  if (!tabData[tabId]) {
    tabData[tabId] = {
      thirdPartyConnections: new Set(),
      cookies: [],
      localStorage: [],
      canvasFingerprinting: false,
      hijackingThreats: {},  // Incluímos a detecção de hijacking
      score: 100 // Pontuação inicial
    };
    console.log(`Inicializando dados para a aba ${tabId}`);
  }
}

// Conexões a domínios de terceira parte
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const currentTabHostname = new URL(details.originUrl).hostname;
    const tabId = details.tabId;

    if (url.hostname !== currentTabHostname) {
      initializeTabData(tabId);
      tabData[tabId].thirdPartyConnections.add(url.hostname);
      console.log('Conexão a domínio de terceira parte:', url.hostname);
    }
  },
  { urls: ["<all_urls>"] }
);

// Coletar cookies
function getCookies(tabId) {
  browser.cookies.getAll({}).then((cookies) => {
    let firstParty = 0;
    let thirdParty = 0;

    // Redefinir o array de cookies para evitar duplicação
    tabData[tabId].cookies = [];

    cookies.forEach(cookie => {
      if (cookie.firstPartyDomain) {
        firstParty++;
      } else {
        thirdParty++;
      }
    });

    initializeTabData(tabId);
    tabData[tabId].cookies.push(`Primeira Parte: ${firstParty}, Terceira Parte: ${thirdParty}`);
    console.log(`Cookies de primeira parte: ${firstParty}, Cookies de terceira parte: ${thirdParty}`);
  });
}

// Armazenamento Local
function checkLocalStorage(tabId) {
  const code = `
    (() => {
      return localStorage.length;
    })();
  `;
  browser.tabs.executeScript(tabId, { code }).then((results) => {
    const storageSize = results[0];

    // Redefinir o array de localStorage para evitar duplicação
    tabData[tabId].localStorage = [];

    if (storageSize > 0) {
      initializeTabData(tabId);
      tabData[tabId].localStorage.push(`Local Storage: ${storageSize} itens`);
      console.log("Dados armazenados no local storage:", storageSize);
    }
  }).catch((error) => console.error('Erro ao verificar localStorage:', error));
}

// Canvas Fingerprinting
function checkCanvasFingerprinting(tabId) {
  const code = `
    (() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillText('test', 50, 50);
      return canvas.toDataURL() ? true : false;
    })();
  `;
  browser.tabs.executeScript(tabId, { code }).then((results) => {
    const isFingerprinting = results[0];
    if (isFingerprinting) {
      initializeTabData(tabId);
      tabData[tabId].canvasFingerprinting = true;
      console.log("Possível Canvas Fingerprint detectado.");
    }
  }).catch((error) => console.error('Erro ao verificar Canvas Fingerprinting:', error));
}

// Função para detectar hijacking e hooks
function detectHijackingAndHook(tabId) {
  const code = `
    (() => {
      const detectInjectedScripts = () => {
        const scripts = document.querySelectorAll('script');
        let thirdPartyScripts = [];
        scripts.forEach(script => {
          if (script.src && !script.src.includes(window.location.hostname)) {
            thirdPartyScripts.push(script.src);
          }
        });
        return thirdPartyScripts;
      };

      const detectHooking = () => {
        const originalOnload = window.onload;
        return window.onload !== originalOnload;
      };

      const detectEventHooks = () => {
        let hookedEvents = [];
        document.querySelectorAll('*').forEach((element) => {
          if (element.onclick || element.onsubmit) {
            hookedEvents.push(element);
          }
        });
        return hookedEvents.length > 0;
      };

      return {
        injectedScripts: detectInjectedScripts(),
        onloadHijacked: detectHooking(),
        eventHooks: detectEventHooks()
      };
    })();
  `;

  // Executar o código de detecção na página
  browser.tabs.executeScript(tabId, { code }).then((results) => {
    const hijackingData = results[0];

    if (hijackingData.injectedScripts.length > 0 || hijackingData.onloadHijacked || hijackingData.eventHooks) {
      console.warn("Possível sequestro de navegador detectado:", hijackingData);
      initializeTabData(tabId);  // Assegura que a aba está inicializada
      tabData[tabId].hijackingThreats = hijackingData;  // Salva os dados de ameaças
    }
  }).catch((error) => console.error('Erro ao detectar sequestro de navegador:', error));
}

function calculateScore(tabId) {
  let score = 100;  // Pontuação inicial

  // Reduzir a pontuação com base nas ameaças detectadas
  const thirdPartyConnectionsCount = tabData[tabId].thirdPartyConnections.size || 0;
  score -= thirdPartyConnectionsCount * 10;

  const thirdPartyCookies = tabData[tabId].cookies.filter(cookie => cookie.includes("Terceira Parte")).length;
  score -= thirdPartyCookies * 5;

  if (tabData[tabId].canvasFingerprinting) {
      score -= 15;
  }

  const hijackingThreats = tabData[tabId].hijackingThreats;
  if (hijackingThreats && (hijackingThreats.injectedScripts.length > 0 || hijackingThreats.onloadHijacked || hijackingThreats.eventHooks)) {
      score -= 20;
  }

  // Garantir que a pontuação não seja negativa
  score = Math.max(score, 0);

  tabData[tabId].score = score;
  return score;
}

// Atualizar coleta de dados para incluir cálculo da pontuação
function collectDataForTab(tabId) {
  initializeTabData(tabId);
  getCookies(tabId);
  checkLocalStorage(tabId);
  checkCanvasFingerprinting(tabId);
  detectHijackingAndHook(tabId);
  calculateScore(tabId);  // Chamar o cálculo de pontuação após coletar os dados
}


// Listener para quando o popup pedir dados
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tabId = tabs[0].id;
      collectDataForTab(tabId);

      const data = tabData[tabId] || {
        thirdPartyConnections: Array.from(tabData[tabId].thirdPartyConnections || new Set()),
        cookies: tabData[tabId].cookies || [],
        localStorage: tabData[tabId].localStorage || [],
        canvasFingerprinting: tabData[tabId].canvasFingerprinting || false,
        hijackingThreats: tabData[tabId].hijackingThreats || {},
        score: tabData[tabId].score || 100
      };
      
      console.log('Dados enviados ao popup:', data);
      sendResponse(data);
    });
    return true; // Para manter a conexão aberta até sendResponse ser chamado
  }
});
