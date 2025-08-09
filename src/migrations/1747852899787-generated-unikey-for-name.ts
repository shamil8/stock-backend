import { MigrationInterface, QueryRunner } from 'typeorm';

export class generatedUnikeyForName1747852899787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system"."countries" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."countries" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" ADD CONSTRAINT "uq_categories__name" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP CONSTRAINT "fk_products__categories__category_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "category_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD CONSTRAINT "fk_products__categories__category_id__id" FOREIGN KEY ("category_id") REFERENCES "stock"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP CONSTRAINT "fk_products__categories__category_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "category_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD CONSTRAINT "fk_products__categories__category_id__id" FOREIGN KEY ("category_id") REFERENCES "stock"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" DROP CONSTRAINT "uq_categories__name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."countries" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."countries" ADD "deleted_at" TIMESTAMP`,
    );
  }
}
