// Solicitar dados ao background.js quando o popup for aberto
browser.runtime.sendMessage({ action: "getData" }).then((response) => {
    if (response) {
        // Redefinir os elementos para garantir que não haja duplicação
        document.getElementById('thirdPartyConnections').textContent = "";
        document.getElementById('cookies').textContent = "";
        document.getElementById('localStorage').textContent = "";
        document.getElementById('canvasFingerprinting').textContent = "";
        document.getElementById('hijacking').textContent = "";
        document.getElementById('score').textContent = "";

        // Atualizar o texto do popup com os dados recebidos
        document.getElementById('thirdPartyConnections').textContent = response.thirdPartyConnections.size > 0 ? 
            Array.from(response.thirdPartyConnections).join(", ") : "Nenhuma conexão de terceira parte detectada";
        
        document.getElementById('cookies').textContent = response.cookies.length > 0 ? 
            response.cookies.join(", ") : "Nenhum cookie detectado";

        document.getElementById('localStorage').textContent = response.localStorage.length > 0 ? 
            response.localStorage.join(", ") : "Nenhum dado de armazenamento local encontrado";

        document.getElementById('canvasFingerprinting').textContent = response.canvasFingerprinting ? 
            "Detectado" : "Não detectado";

        // Exibir possíveis ameaças de hijacking
        const hijackingThreats = response.hijackingThreats;
        if (hijackingThreats && (hijackingThreats.injectedScripts.length > 0 || hijackingThreats.onloadHijacked || hijackingThreats.eventHooks)) {
            document.getElementById('hijacking').textContent = "Ameaça de sequestro detectada!";
        } else {
            document.getElementById('hijacking').textContent = "Nenhuma ameaça detectada";
        }

        document.getElementById('score').textContent = `Pontuação de privacidade: ${response.score}`;
    } else {
        console.log("Nenhuma resposta do background.js");
    }
}).catch((error) => {
    console.error("Erro ao receber dados do background:", error);
    document.getElementById('thirdPartyConnections').textContent = "Erro ao carregar dados.";
    document.getElementById('cookies').textContent = "Erro ao carregar dados.";
    document.getElementById('localStorage').textContent = "Erro ao carregar dados.";
    document.getElementById('canvasFingerprinting').textContent = "Erro ao carregar dados.";
    document.getElementById('hijacking').textContent = "Erro ao carregar dados.";
    document.getElementById('score').textContent = "Erro ao carregar dados.";
});
