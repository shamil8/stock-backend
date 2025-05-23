import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixLib1748022762133 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system"."countries" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."countries" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."countries" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."countries" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
  }
}
