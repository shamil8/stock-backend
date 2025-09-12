//
// @Injectable()
// export class ChatService {
//   private readonly openai: OpenAI;
//
//   constructor(
//     private readonly productRepo: ProductRepository,
//     private readonly http: HttpService,
//     private readonly filialSerivce: FilialsService,
//     private readonly workersService: WorkersService,
//     private readonly clientService: ClientsService,
//     private readonly transactions: TransactionService,
//     private readonly movements: StockMovementService,
//     private readonly histories: HistoryService,
//     private readonly catigories: CategoryService,
//     private readonly userService: UserService,
//   ) {
//     this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//   }
//
//   async askAI(question: string): Promise<string> {
//     const filials = await this.filialSerivce.getAllFilials();
//     const workers = await this.workersService.getAllWorkers();
//     const clients = await this.clientService.getAllClients();
//     const transactions = await this.transactions.getAll();
//     const movements = await this.movements.getAll();
//     const histories = await this.histories.gelAll();
//     const products = await this.productRepo.getAll();
//     const categories = await this.catigories.find();
//     const users = await this.userService.getAllUsers();
//
//     const context = `
// You are an AI warehouse and business assistant.
// You only can speak in Tajik, Russian and English.
// You have access to the following datasets:
// - Filials (branches)
// - Workers (employees)
// - Clients (customers)
// - Transactions (sales/purchases)
// - Stock Movements (product movements)
// - Product Histories (updates/changes to products)
// - Products (inventory items)
// - Categories (product categories)
// - Users (system users)
//
// Important rules:
// 1. You fully understand relationships between tables. Use IDs internally to connect data, but NEVER show IDs directly to the user.
// 2. Fields like "createdAt", "updatedAt", "deletedAt", and technical IDs are only used internally by you for reasoning. Do NOT expose them unless the user specifically asks about dates or history (e.g., "when was this sold?", "when was this product updated?").
// 3. Always answer in a business-friendly way, focusing on: product names, categories, stock amounts, sales, branches, clients, and workers.
// 4. You can summarize sales, predict trends, and suggest improvements for the business.
// 5. Be friendly and clear. Do not overload the user with raw data — instead, give meaningful insights.
//
// Here is the raw business data:
// - Filials: ${JSON.stringify(filials)}
// - Workers: ${JSON.stringify(workers)}
// - Clients: ${JSON.stringify(clients)}
// - Transactions: ${JSON.stringify(transactions)}
// - Movements: ${JSON.stringify(movements)}
// - Histories: ${JSON.stringify(histories)}
// - Products: ${JSON.stringify(products)}
// - Categories: ${JSON.stringify(categories)}
// - Users: ${JSON.stringify(users)}
//
// Now answer the user's question.
// `;
//     const response = await this.openai.chat.completions.create({
//       model: 'gpt-5-mini',
//       messages: [
//         { role: 'system', content: context },
//         { role: 'user', content: question },
//       ],
//     });
//
//     return response.choices[0].message?.content || 'No response';
//   }
// }
import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CategoryService } from '../../category/services/category.service';
import { ClientsService } from '../../clients/services/clients.service';
import { FilialsService } from '../../filials/services/filials.service';
import { TransactionService } from '../../finance/services/transaction.service';
import { ProductRepository } from '../../product/repositories/product.repository';
import { HistoryService } from '../../product/services/history.service';
import { StockMovementService } from '../../product/services/stock-movement.service';
import { UserService } from '../../users/services/user.service';
import { WorkersService } from '../../workers/services/workers.service';

@Injectable()
export class ChatService {
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly API_KEY = process.env.OPENROUTER_API_KEY;

  private conversationHistory: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[] = [];

  constructor(
    private readonly productRepo: ProductRepository,
    private readonly filialService: FilialsService,
    private readonly workersService: WorkersService,
    private readonly clientService: ClientsService,
    private readonly transactions: TransactionService,
    private readonly movements: StockMovementService,
    private readonly histories: HistoryService,
    private readonly categories: CategoryService,
    private readonly userService: UserService,
  ) {}

  async askAIStream(
    question: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const filials = await this.filialService.getAllFilials();
    const workers = await this.workersService.getAllWorkers();
    const clients = await this.clientService.getAllClients();
    const transactions = await this.transactions.getAll();
    const movements = await this.movements.getAll();
    const histories = await this.histories.getAll();
    const products = await this.productRepo.getAll();
    const categories = await this.categories.find();
    const users = await this.userService.getAllUsers();

    const context = `
You are an AI warehouse and business assistant.

🌐 Language rules:
- You only speak in Tajik, Russian, or English.
- Always detect user’s input language and reply in the same language.

📊 Knowledge rules:
- You have access to the following datasets (DO NOT expose raw IDs unless user explicitly asks):
  - Filials (branches): ${JSON.stringify(filials)}
  - Workers (employees): ${JSON.stringify(workers)}
  - Clients (customers): ${JSON.stringify(clients)}
  - Transactions (sales/purchases): ${JSON.stringify(transactions)}
  - Stock Movements (product movements): ${JSON.stringify(movements)}
  - Product Histories (updates/changes to products): ${JSON.stringify(histories)}
  - Products (inventory items): ${JSON.stringify(products)}
  - Categories (product categories): ${JSON.stringify(categories)}
  - Users (system users): ${JSON.stringify(users)}

⚖️ Rules:
1. Understand relations between tables internally (via IDs) but NEVER show raw IDs or system fields like createdAt, updatedAt, deletedAt unless user explicitly asks.
2. Always give business-friendly answers: talk about products, categories, stock, sales, branches, clients, workers.
3. Be friendly, short, and clear. If needed, you can summarize, explain trends, or give recommendations.
4. If the user asks about something you don’t know, admit it politely and suggest possible related data.
5. Remember context of conversation: connect follow-up questions with previous ones.
`;

    if (!this.conversationHistory) {
      this.conversationHistory = [];
    }

    this.conversationHistory.push({ role: 'user', content: question });
    console.log('histtoryyyy', this.conversationHistory);
    console.log(
      { role: 'system', content: context },
      ...this.conversationHistory,
    );
    const payload = {
      model: 'deepseek/deepseek-chat-v3.1:free',
      messages: [
        { role: 'system', content: context },
        ...this.conversationHistory,
      ],
      stream: true,
    };

    const response = await axios.post(this.API_URL, payload, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    });

    for await (const chunk of response.data) {
      const lines = chunk
        .toString('utf8')
        .split('\n')
        .filter((l: any) => l.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.replace(/^data:\s*/, '');

          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed?.choices?.[0]?.delta?.content;

            if (content) {
              onChunk(content);

              this.conversationHistory.push({
                role: 'assistant',
                content,
              });
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }
  }

  resetHistory(): boolean {
    this.conversationHistory = [];

    return true;
  }
}
