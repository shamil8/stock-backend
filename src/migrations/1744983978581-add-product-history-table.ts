import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductHistoryTable1744983978581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" RENAME COLUMN "picture" TO "img_url"`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock"."product_histories" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "diff" integer NOT NULL, "description" text, "is_confirm" boolean NOT NULL DEFAULT false, "product_id" character varying NOT NULL, "user_id" character varying NOT NULL, "target_id" character varying, CONSTRAINT "pk_product_histories__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_histories__created_at_id" ON "stock"."product_histories" ("created_at", "id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "img_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__users__user_id__id" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__users__target_id__id" FOREIGN KEY ("target_id") REFERENCES "users"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__users__target_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__users__user_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "img_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "stock"."idx_product_histories__created_at_id"`,
    );
    await queryRunner.query(`DROP TABLE "stock"."product_histories"`);
    await queryRunner.query(
      `ALTER TABLE "stock"."products" RENAME COLUMN "img_url" TO "picture"`,
    );
  }
}
