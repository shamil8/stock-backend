import { MigrationInterface, QueryRunner } from 'typeorm';

export class changedProductSupplier1757332849071 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "supplier" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "supplier" DROP DEFAULT`,
    );
  }
}
