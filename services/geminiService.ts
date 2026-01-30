import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a hero image for the landing page using Nano Banana model.
 */
export const generateHeroImage = async (): Promise<string | null> => {
  if (!apiKey) {
    console.warn("API Key is missing for image generation");
    return null;
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'Uma imagem profissional, realista e artística representando um cartório de notas moderno, com livros de escrituras antigos, uma caneta tinteiro elegante sobre uma mesa de madeira, e um ambiente iluminado e organizado, transmitindo confiança e segurança jurídica. Estilo fotográfico.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating hero image:", error);
    return null;
  }
};

/**
 * Generates a custom deed draft based on user prompt and optional context (NotebookLM simulation).
 * Supports text context and file attachments (images/PDFs) via RAG-like prompting.
 */
export const generateDeedDraft = async (
  prompt: string,
  contextText?: string,
  files?: { mimeType: string; data: string }[]
): Promise<string> => {
  if (!apiKey) {
    console.error("API Key not found in process.env.API_KEY");
    return "Erro Crítico: Chave da API do Google Gemini não foi encontrada. Verifique as variáveis de ambiente.";
  }

  const systemInstruction = `Você é um tabelião experiente e assistente jurídico especializado em escrituras públicas no Brasil. 
  Sua tarefa é redigir minutas de escrituras públicas com precisão técnica, linguagem formal e aderência estrita às leis notariais.`;

  let userContentParts: any[] = [{ text: `SOLICITAÇÃO DO ESCREVENTE: "${prompt}"` }];

  // Add text context if provided
  if (contextText) {
    userContentParts.push({ text: `\n\nCONTEXTO/MODELO BASE (IMPORTANTE):\nUtilize o texto abaixo como MODELO ESTRUTURAL. Mantenha as cláusulas, o estilo e a formatação deste modelo, alterando apenas os dados das partes (compradores/vendedores) e do imóvel conforme a solicitação acima.\n\n--- INÍCIO DO MODELO ---\n${contextText}\n--- FIM DO MODELO ---` });
  }

  // Add file attachments if provided (Local NotebookLM)
  if (files && files.length > 0) {
    userContentParts.push({ text: `\n\nDOCUMENTOS ANEXOS (FONTE DE INFORMAÇÃO):\nUtilize as informações contidas nos documentos anexos para compor a escritura. Se houver discrepância entre o modelo em texto e os documentos, priorize os dados específicos (nomes, valores, datas) dos documentos, mas mantenha a estrutura jurídica do modelo.` });

    files.forEach(file => {
      userContentParts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      });
    });
  }

  try {
    console.log("Enviando solicitação para o Gemini...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using Flash for better context window handling with files
      contents: {
        parts: userContentParts
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });

    if (response.text) {
      return response.text;
    } else {
      console.warn("Resposta vazia da API", response);
      return "A IA processou o pedido mas não retornou texto. Tente reformular a solicitação.";
    }

  } catch (error: any) {
    console.error("Erro detalhado ao gerar minuta:", error);

    // Tratamento de erros comuns para feedback ao usuário
    if (error.status === 403 || error.status === 401) {
      return "Erro de Permissão: A chave da API é inválida ou expirou.";
    }
    if (error.status === 429) {
      return "Erro de Cota: Limite de requisições excedido. Aguarde um momento.";
    }
    if (error.message && error.message.includes("payload")) {
      return "Erro de Tamanho: Os arquivos anexados são muito grandes. Tente enviar menos arquivos ou arquivos menores.";
    }

    return `Ocorreu um erro técnico: ${error.message || "Erro desconhecido"}. Verifique o console para mais detalhes.`;
  }
};

/**
 * Analyzes a property deed (matrícula) image/PDF.
 */
export const analyzeMatricula = async (base64Data: string, mimeType: string): Promise<string> => {
  if (!apiKey) return "Erro: Chave API não configurada.";

  const prompt = `Analise a imagem da matrícula de imóvel anexa e extraia as seguintes informações.

  1. **Indisponibilidade, Gravames ou Alienações Vigentes:**
     (Liste se há alguma penhora, hipoteca, alienação fiduciária ou indisponibilidade vigente. Se não houver, diga "Nada consta").

  2. **Descrição Completa e Atualizada do Imóvel:**
     (Copie a descrição do imóvel).

  3. **Proprietários Atuais:**
     Liste cada proprietário iniciando OBRIGATORIAMENTE pela **fração ideal ou porcentagem** de propriedade antes do nome (Ex: "100% - Nome" ou "50% - Nome").
     
     **REGRAS ESTRITAS DE QUALIFICAÇÃO (PARA TODOS OS CASOS):**
     * **Regime de Bens:** Sempre especificar se é "anteriormente a Lei Federal 6.515/77" ou "na vigência da Lei 6.515/77", dependendo da data do casamento.
     * **Pacto Antenupcial:** Se houver menção a pacto antenupcial (comum na Separação Total ou Comunhão Universal pós-77), citar OBRIGATORIAMENTE da seguinte forma: "na vigência da Lei 6.515/77, conforme Escritura de Pacto Antenupcial registrada sob o nº [número do registro] no Livro 3 - Registro Auxiliar do [Nome do Cartório onde foi registrado]".

     **CASO 1: SOLTEIRO**
     * Formato: [Fração] - [Nome], [RG/RNE], CPF [CPF], [nacionalidade], solteiro, [profissão], residente e domiciliado em [endereço].

     **CASO 2: CASADO - COMUNHÃO UNIVERSAL**
     * O cônjuge SEMPRE é co-proprietário.
     * Formato: [Fração] - [Nome], [RG], CPF [CPF], [nacionalidade], [profissão], e seu cônjuge [Nome], [RG], CPF [CPF], [nacionalidade], [profissão], casados sob o regime da Comunhão Universal de Bens ([CITAR SE ANTES OU DEPOIS DA LEI 6.515/77 E PACTO SE HOUVER]), residentes em [endereço].

     **CASO 3: CASADO - COMUNHÃO PARCIAL OU SEPARAÇÃO OBRIGATÓRIA (LEGAL)**
     * **Se a aquisição foi ONEROSA (Compra e Venda):** O cônjuge tem direito sobre o imóvel.
       * Formato: [Fração] - [Nome], [RG], CPF [CPF], [nacionalidade], [profissão], e seu cônjuge [Nome], [RG], CPF [CPF], [nacionalidade], [profissão], casados sob o regime [Regime] (na vigência da Lei 6.515/77), residentes em [endereço].
     * **Se a aquisição foi GRATUITA (Doação ou Herança/Inventário):** O cônjuge NÃO tem direito, apenas assiste.
       * Formato: [Fração] - [Nome], [RG], CPF [CPF], [nacionalidade], [profissão], assistido por seu cônjuge [Nome], [RG], CPF [CPF], [nacionalidade], [profissão], casados sob o regime [Regime] (na vigência da Lei 6.515/77), residentes em [endereço].

     **CASO 4: CASADO - SEPARAÇÃO TOTAL (CONVENCIONAL/COM PACTO)**
     * O cônjuge não precisa assinar e nem assistir, apenas ser mencionado.
     * Formato: [Fração] - [Nome], [RG], CPF [CPF], [nacionalidade], [profissão], **casado com** [Nome do Cônjuge] sob o regime da Separação Total de Bens (na vigência da Lei 6.515/77, conforme Escritura de Pacto Antenupcial registrada sob o nº [Nº] no Livro 3 - Registro Auxiliar do [CARTÓRIO]), residente e domiciliado em [endereço].
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });
    return response.text || "Não foi possível analisar o documento.";
  } catch (error: any) {
    console.error("Error analyzing matricula:", error);
    return `Erro ao analisar a matrícula: ${error.message}`;
  }
};