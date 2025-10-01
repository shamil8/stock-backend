import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedFinance1757829900506 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" DROP CONSTRAINT "fk_borrows__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" DROP CONSTRAINT "fk_invoice__products__product_id__id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "finance"."salesItem" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "sale_id" character varying NOT NULL, "product_id" character varying NOT NULL, "discount" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "total" numeric(10,2) NOT NULL, CONSTRAINT "pk_salesItem__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_salesItem__created_at_id" ON "finance"."salesItem" ("created_at", "id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" DROP COLUMN "product_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" DROP COLUMN "borrow"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" ADD "amount" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" ADD "invoice_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" ADD "product_ids" text array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" ADD "is_borrow" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."salesItem" ADD CONSTRAINT "fk_salesItem__invoice__sale_id__id" FOREIGN KEY ("sale_id") REFERENCES "finance"."invoice"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."salesItem" ADD CONSTRAINT "fk_salesItem__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."salesItem" DROP CONSTRAINT "fk_salesItem__products__product_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."salesItem" DROP CONSTRAINT "fk_salesItem__invoice__sale_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" DROP COLUMN "is_borrow"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" DROP COLUMN "product_ids"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" DROP COLUMN "invoice_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" ADD "product_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" ADD "borrow" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" ADD "quantity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" ADD "product_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" ADD "product_id" character varying`,
    );
    await queryRunner.query(
      `DROP INDEX "finance"."idx_salesItem__created_at_id"`,
    );
    await queryRunner.query(`DROP TABLE "finance"."salesItem"`);
    await queryRunner.query(
      `ALTER TABLE "finance"."invoice" ADD CONSTRAINT "fk_invoice__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."borrows" ADD CONSTRAINT "fk_borrows__products__product_id__id" FOREIGN KEY ("product_id") REFERENCES "stock"."products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
