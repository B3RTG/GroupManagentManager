import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOldGroupRelations1760008961196 implements MigrationInterface {
    name = 'RemoveOldGroupRelations1760008961196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_72981b11a59b579570139b96097"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "mainAdministratorId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "mainAdministratorId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_72981b11a59b579570139b96097" FOREIGN KEY ("mainAdministratorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
