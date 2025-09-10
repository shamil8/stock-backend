import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedWorkersEntity1757408003836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workers"."workers" DROP CONSTRAINT "fk_workers__workers__manager_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workers"."workers" DROP COLUMN "manager_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workers"."workers" ADD "manager_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "workers"."workers" ADD CONSTRAINT "fk_workers__workers__manager_id__id" FOREIGN KEY ("manager_id") REFERENCES "workers"."workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
