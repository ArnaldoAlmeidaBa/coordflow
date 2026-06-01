import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: parse incoming JSON bodies
  app.use(express.json());

  // API Route: AI Text Purifier/Polisher/Refiner for Pedagogical Coordinators
  app.post("/api/refine", async (req, res) => {
    try {
      const { text, tone } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "O texto original é obrigatório e deve ser uma string." });
      }

      const selectedTone = tone || "acolhedor";

      // Lazy-initialization and graceful check of Gemini API Key
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY is not configured or still matches placeholder. Using local smart linguistic rules fallback.");
        
        // Return a realistic enhanced response but with a clear disclaimer
        let localFallback = text;
        if (selectedTone === "acolhedor") {
          localFallback = `[Ajuste Acolhedor / Humanizado]\n\nOlá! Esperamos que esta mensagem encontre você muito bem. Gostaríamos de propor um canal aberto de escuta:\n\n${text}\n\nEstamos sempre ao lado de vocês para apoiar e celebrar cada conquista da jornada escolar. Um forte e caloroso abraço de toda nossa equipe!`;
        } else if (selectedTone === "direto") {
          localFallback = `[Ajuste Direto / Objetivo]\n\nPrezados responsáveis,\n\nEntramos em contato para alinhar os seguintes pontos importantes:\n\n${text}\n\nSolicitamos sua devida leitura e retorno o quanto antes para continuarmos nosso cronograma escolar regular. Atenciosamente, Coordenação.`;
        } else if (selectedTone === "formal") {
          localFallback = `[Ajuste Formal / Protocolar]\n\nPrezados senhores e senhoras Co-responsáveis,\n\nPor meio deste instrumento de comunicação institucional, convocamos vossa atenção para as considerações expressas a seguir:\n\n${text}\n\nCertos de vossa valiosa compreensão pedagógica, colocamo-nos à inteira disposição oficial. Atenciosamente, Setor de Coordenação de Ensino.`;
        } else {
          localFallback = `[Ajuste Formativo / Pedagógico]\n\nOlá, equipe!\n\nVisando o aprimoramento didático contínuo e nossa reflexão metodológica diária, compartilhamos:\n\n${text}\n\nQue essa reflexão traga novos caminhos de mediação em sala de aula. Contem sempre com meu apoio formativo pedagógico!`;
        }

        return res.json({
          text: localFallback,
          isFallback: true,
          message: "Para ativar o refinamento real via Inteligência Artificial do Gemini 3.5, adicione uma GEMINI_API_KEY válida na aba Secrets do AI Studio."
        });
      }

      // Safe initialization of GoogleGenAI SDK with headers
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Assemble system instruction based on Selected Tone
      let toneGuidance = "";
      if (selectedTone === "acolhedor") {
        toneGuidance = "Use um tom acolhedor, caloroso, compreensivo e integrador. Ideal para mensagens a pais de alunos desanimados ou com dificuldades. Mostre empatia e parceria escola-família. Escreva em português elegante do Brasil.";
      } else if (selectedTone === "direto") {
        toneGuidance = "Use um tom claro, direto, sucinto e focado no alívio de dúvidas imediatas. Vá direto ao assunto de forma polida e pragmática, sem termos prolixos. Escreva em português elegante do Brasil.";
      } else if (selectedTone === "formal") {
        toneGuidance = "Use um tom formal, profissional, protocolar e altamente respeitoso. Ideal para convocações disciplinares em atas de reunião e relatórios para a diretoria. Escreva em português do Brasil padrão culto.";
      } else {
        toneGuidance = "Use um tom pedagógico-formativo, encorajador, focado em metodologias de ensino, reflexão e parceria profissional para coordenação orientando professores. Escreva em português do Brasil elegante e estimulante.";
      }

      const systemInstruction = `Você é o assistente inteligente oficial da plataforma CoordFlow, projetada especificamente para coordenadores pedagógicos escolares brasileiros. No cotidiano pedagógico, o coordenador precisa reescrever e polir rascunhos rápidos para que fiquem profissionais, acolhedores ou claros, sem erros ortográficos. 

Você receberá um rascunho de texto e receberá as seguintes diretrizes:
${toneGuidance}

Corrija imediatamente desvios de gramática e pontuação. Deixe o documento polido, fluido e pronto para uso real. Preserve as informações originais chave, como locais, nomes e datas. Mantenha os avisos em um tamanho adequado, sem gerar textos excessivamente longos. Retorne APENAS o texto polido/final formatado com parágrafos apropriados.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: text,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const refinedText = response.text || text;

      return res.json({
        text: refinedText,
        isFallback: false
      });

    } catch (error: any) {
      console.error("Erro na rota de refinamento com Gemini:", error);
      return res.status(500).json({
        error: "Ocorreu um erro interno de processamento ao refinar o texto.",
        details: error?.message || error
      });
    }
  });

  // API Route: Health status check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "CoordFlow Server Layer" });
  });

  // Setup Vite Middleware in development, or Static file serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Binding specifically to 0.0.0.0 and port 3000 mapping
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CoordFlow] Server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
