import { MigrationInterface, QueryRunner } from "typeorm";

export class GroupEntityFieldsUpdate1760466302999 implements MigrationInterface {
    name = 'GroupEntityFieldsUpdate1760466302999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "group" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "group" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "group" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "group" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "description"`);
    }

}
