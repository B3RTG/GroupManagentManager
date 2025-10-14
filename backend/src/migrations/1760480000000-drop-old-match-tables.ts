import { MigrationInterface, QueryRunner } from "typeorm";

export class DropOldMatchTables1760480000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "match_guest_guest"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "match_participant_user"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "match_sustitutes_user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No se recrean las tablas, ya que no forman parte del modelo actual
    }
}
