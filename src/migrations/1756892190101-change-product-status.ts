import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeProductStatus1756892190101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "status" SET DEFAULT 'out-of-stock'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "status" SET DEFAULT 'Out of stock'`,
    );
  }
}
