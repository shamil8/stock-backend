import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryTable1744539276242 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Create stock schemas */
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "stock";`);

    await queryRunner.query(
      `CREATE TABLE "stock"."categories" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text, "parent_id" character varying, CONSTRAINT "pk_categories__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_categories__created_at_id" ON "stock"."categories" ("created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "stock"."products" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text, "weight" integer, "price" numeric(10,2) NOT NULL, "picture" character varying NOT NULL, "count" integer NOT NULL, "category_id" character varying, CONSTRAINT "pk_products__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_products__created_at_id" ON "stock"."products" ("created_at", "id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "stock"."categories" ADD CONSTRAINT "fk_categories__categories__parent_id__id" FOREIGN KEY ("parent_id") REFERENCES "stock"."categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "stock"."categories" DROP CONSTRAINT "fk_categories__categories__parent_id__id"`,
    );
    await queryRunner.query(`DROP INDEX "stock"."idx_products__created_at_id"`);
    await queryRunner.query(`DROP TABLE "stock"."products"`);
    await queryRunner.query(
      `DROP INDEX "stock"."idx_categories__created_at_id"`,
    );
    await queryRunner.query(`DROP TABLE "stock"."categories"`);

    /** Drop stock schemas */
    await queryRunner.query(`DROP SCHEMA "stock" CASCADE;`);
  }
}
