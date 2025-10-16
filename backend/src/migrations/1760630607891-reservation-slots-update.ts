import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationSlotsUpdate1760630607891 implements MigrationInterface {
    name = 'ReservationSlotsUpdate1760630607891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "slots" integer NOT NULL DEFAULT '4'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "slots"`);
    }

}
