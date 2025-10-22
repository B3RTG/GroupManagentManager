import { MigrationInterface, QueryRunner } from "typeorm";

export class UnifiedReservatioDeleteResourceId1761152145344 implements MigrationInterface {
    name = 'UnifiedReservatioDeleteResourceId1761152145344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "resourceId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "resourceId" character varying NOT NULL`);
    }

}
