import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedClientsEntity1759910260850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" ALTER COLUMN "payment_method" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" ALTER COLUMN "payment_method" SET NOT NULL`,
    );
  }
}
