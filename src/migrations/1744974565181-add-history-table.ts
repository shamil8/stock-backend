import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHistoryTable1744974565181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."products" RENAME COLUMN "picture" TO "img_url"`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock"."product_histories" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "username" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "role" character varying(55) NOT NULL, "lang_code" character varying(3) NOT NULL DEFAULT 'EN', "is_email_verified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "country_id" character varying, "diff" integer NOT NULL, "description" text, "target_id" character varying, "is_confirm" boolean NOT NULL DEFAULT false, "product_id" character varying NOT NULL, "user_id" character varying, CONSTRAINT "uq_product_histories__email" UNIQUE ("email"), CONSTRAINT "uq_product_histories__username" UNIQUE ("username"), CONSTRAINT "pk_product_histories__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_histories__created_at_id" ON "stock"."product_histories" ("created_at", "id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."products" ALTER COLUMN "img_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__countries__country_id__id" FOREIGN KEY ("country_id") REFERENCES "system"."countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" ADD CONSTRAINT "fk_product_histories__users__user_id__id" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__users__user_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."product_histories" DROP CONSTRAINT "fk_product_histories__countries__country_id__id"`,
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
