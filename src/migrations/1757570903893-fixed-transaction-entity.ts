import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixedTransactionEntity1757570903893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."transaction" ADD "profit" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."transaction" ALTER COLUMN "payment_method" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."transaction" ALTER COLUMN "payment_method" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."transaction" DROP COLUMN "profit"`,
    );
  }
}
