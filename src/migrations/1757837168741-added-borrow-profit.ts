import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedBorrowProfit1757837168741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" ADD "profit" double precision NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" DROP COLUMN "profit"`,
    );
  }
}
