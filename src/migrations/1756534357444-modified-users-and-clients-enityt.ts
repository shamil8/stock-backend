import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifiedUsersAndClientsEnityt1756534357444
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users"."users" ADD "avatar" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."clients" ADD "last_purchase" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users"."clients" DROP COLUMN "last_purchase"`,
    );
    await queryRunner.query(`ALTER TABLE "users"."users" DROP COLUMN "avatar"`);
  }
}
