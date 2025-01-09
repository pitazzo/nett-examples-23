import { Injectable } from '@nestjs/common';
import { AIService } from 'src/tasks/services/ai.service';

@Injectable()
export class TranslationService {
  constructor(private readonly aiService: AIService) {}

  async translate(summary: string): Promise<string> {
    const raw = await this.aiService.ask(
      `Vas recibir el resumen de una tarea. Quiero que traduzcas este resumen al inglés. El resumen es ${summary}. Dame la respuesta en formato JSON tal que así: {"translation": "task summary in English..."}`,
    );

    return JSON.parse(raw)['translation'];
  }
}
