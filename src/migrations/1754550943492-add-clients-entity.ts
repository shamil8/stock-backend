import { MigrationInterface, QueryRunner } from 'typeorm';

export class addClientEntity1754550943492 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users"."clients" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_name" character varying NOT NULL, "company" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "credit_limit" integer NOT NULL, "total_purchases" integer NOT NULL DEFAULT '0', "balance" integer NOT NULL DEFAULT '0', "last_order" TIMESTAMP, "notes" character varying NOT NULL, CONSTRAINT "uq_clients__email" UNIQUE ("email"), CONSTRAINT "pk_clients__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_clients__created_at_id" ON "users"."clients" ("created_at", "id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "users"."idx_clients__created_at_id"`);
    await queryRunner.query(`DROP TABLE "users"."clients"`);
  }
}
