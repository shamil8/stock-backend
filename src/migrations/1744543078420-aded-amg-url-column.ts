import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1744543078420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" RENAME COLUMN "picture" TO "img_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "img_url" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "img_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" RENAME COLUMN "img_url" TO "picture"`,
    );
  }
}
