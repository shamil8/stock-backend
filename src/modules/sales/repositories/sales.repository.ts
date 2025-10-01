import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { SalesEntity } from '../entities/sales.entity';
import { SalesItemEntity } from '../entities/sales-item.entity';
import { InvoiceStatus } from '../enums/invoice.enum';

@Injectable()
export class SalesRepository {
  constructor(
    @InjectRepository(SalesEntity)
    private readonly salesRepository: Repository<SalesEntity>,

    @InjectRepository(SalesItemEntity)
    private readonly salesItemRepository: Repository<SalesItemEntity>,
  ) {}

  async addInvoice(
    command: DeepPartial<SalesEntity>,
    queryRunner?: QueryRunner,
  ): Promise<SalesEntity> {
    const insetToSales = this.salesRepository.create(command);
    const result = await this.salesRepository
      .createQueryBuilder('i', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(SalesEntity)
      .values(insetToSales)
      .returning('*')
      .execute();

    const sale = result.raw[0];

    if (command.items && command.items.length > 0) {
      const itemsToInsert = command.items.map((item) => ({
        ...item,
        saleId: sale.id,
      }));

      const insertSalesItem =
        await this.salesItemRepository.create(itemsToInsert);

      await this.salesItemRepository
        .createQueryBuilder('si', queryRunner)
        .useTransaction(!!queryRunner)
        .insert()
        .into(SalesItemEntity)
        .values(insertSalesItem)
        .execute();
    }

    return sale;
  }

  async findById(id: string) {
    const sale = await this.salesRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.items', 'it')
      .where('s.id = :id', { id })
      .getOne();

    if (!sale) {
      throw new AppHttpException(
        ExceptionMessage.INVOICE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.INVOICE_NOT_FOUND,
      );
    }

    return sale;
  }

  async getAllInvoices() {
    const invoices = await this.salesRepository
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.items', 'it')
      .orderBy('i.createdAt', 'DESC')
      .getMany();

    return invoices;
  }

  async updateInvoiceStatus(
    id: string,
    status: InvoiceStatus,
    cancellationReason?: string,
  ) {
    const invoice = await this.findById(id);

    invoice.status = status;

    if (cancellationReason) {
      invoice.cancellationReason = cancellationReason;
    }

    return await this.salesRepository.save(invoice);
  }

  // async updateInvoice(id: string, command: UpdateInvoiceStatusCommand) {
  //   await this.invoiceRepository
  //     .createQueryBuilder()
  //     .update()
  //     .set({ status: command.status })
  //     .where('id = :id', { id })
  //     .execute();
  //
  //   return true;
  // }
}
