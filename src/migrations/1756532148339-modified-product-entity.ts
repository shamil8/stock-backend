import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifiedProductEntity1756532148339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__users__user_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" DROP CONSTRAINT "fk_stock_movements__filials__filial_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" DROP CONSTRAINT "fk_stock_movements__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" DROP CONSTRAINT "fk_stock_movements__users__user_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP CONSTRAINT "fk_products__categories__category_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP COLUMN "weight"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD "weight" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "category_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ALTER COLUMN "product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ALTER COLUMN "filial_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__users__user_id__id" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD CONSTRAINT "fk_products__categories__category_id__id" FOREIGN KEY ("category_id") REFERENCES "stock"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ADD CONSTRAINT "fk_stock_movements__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ADD CONSTRAINT "fk_stock_movements__users__user_id__id" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ADD CONSTRAINT "fk_stock_movements__filials__filial_id__id" FOREIGN KEY ("filial_id") REFERENCES "filials"."filials"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" DROP CONSTRAINT "fk_stock_movements__filials__filial_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" DROP CONSTRAINT "fk_stock_movements__users__user_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" DROP CONSTRAINT "fk_stock_movements__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP CONSTRAINT "fk_products__categories__category_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__users__user_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ALTER COLUMN "filial_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ALTER COLUMN "product_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "category_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" DROP COLUMN "weight"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD "weight" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ADD CONSTRAINT "fk_products__categories__category_id__id" FOREIGN KEY ("category_id") REFERENCES "stock"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ADD CONSTRAINT "fk_stock_movements__users__user_id__id" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ADD CONSTRAINT "fk_stock_movements__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."stock_movements" ADD CONSTRAINT "fk_stock_movements__filials__filial_id__id" FOREIGN KEY ("filial_id") REFERENCES "filials"."filials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__users__user_id__id" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
