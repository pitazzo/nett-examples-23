import { Injectable } from '@nestjs/common';
import { AIService } from 'src/tasks/services/ai.service';

@Injectable()
export class SummaryService {
  constructor(private readonly aiService: AIService) {}

  async summarize(title: string): Promise<string> {
    const raw = await this.aiService.ask(
      `Quiero que hagas un resumen de tarea de unas 50 palabras a partir del siguiente título de tarea: ${title}. También quiero que estimes en minutos la duración de la tarea. Quiero que la respuesta me la des exclusivamente en formato JSON tal que así: {"summary": "aquí tu resumen", "minutes": 10}.`,
    );

    return JSON.parse(raw)['summary'];
  }
}
