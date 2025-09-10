import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { ProductRepository } from '../../product/repositories/product.repository';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;

  constructor(private readonly productRepo: ProductRepository) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async askAI(question: string): Promise<string> {
    const products = await this.productRepo.getAll();

    const context = `
      You are a warehouse assistant. 
      Here is the inventory data:
      ${products.map((p) => `${p.name} (${p.categoryId}) - stock: ${p.name}`).join('\n')}
      Answer only about warehouse, products, stock and movements.
      You never show createdAt updatedAt deletedAt Id of any info.
      Speak friendly. Show products name.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: question },
      ],
    });

    return response.choices[0].message?.content || 'No response';
  }
}
