import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SummaryService {
  async summarize(title: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Quiero que hagas un resumen de tarea de unas 50 palabras a partir del siguiente título de tarea: ${title}. También quiero que estimes en minutos la duración de la tarea. Quiero que la respuesta me la des exclusivamente en formato JSON tal que así: {"summary": "aquí tu resumen", "minutes": 10}.`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );

    const raw = response.data.choices[0].message.content;

    return JSON.parse(raw)['summary'];
  }
}
