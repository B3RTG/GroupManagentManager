import { MigrationInterface, QueryRunner } from "typeorm";

export class UsuariosGrupos1759754180631 implements MigrationInterface {
    name = 'UsuariosGrupos1759754180631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "allCanManageEvents" boolean NOT NULL DEFAULT false, "mainAdministratorId" uuid, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_administrators_user" ("groupId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_ab6130a480243aa0623f2622a01" PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_948e6c39392f43a7675d5ed44f" ON "group_administrators_user" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59f27cacc68d02e0347e457b1d" ON "group_administrators_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "group_members_user" ("groupId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_7170c9a27e7b823d391d9e11f2e" PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bfa303089d367a2e3c02b002b8" ON "group_members_user" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_427107c650638bcb2f1e167d2e" ON "group_members_user" ("userId") `);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_72981b11a59b579570139b96097" FOREIGN KEY ("mainAdministratorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_administrators_user" ADD CONSTRAINT "FK_948e6c39392f43a7675d5ed44f9" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "group_administrators_user" ADD CONSTRAINT "FK_59f27cacc68d02e0347e457b1d4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "group_members_user" ADD CONSTRAINT "FK_bfa303089d367a2e3c02b002b8f" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "group_members_user" ADD CONSTRAINT "FK_427107c650638bcb2f1e167d2e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_members_user" DROP CONSTRAINT "FK_427107c650638bcb2f1e167d2e5"`);
        await queryRunner.query(`ALTER TABLE "group_members_user" DROP CONSTRAINT "FK_bfa303089d367a2e3c02b002b8f"`);
        await queryRunner.query(`ALTER TABLE "group_administrators_user" DROP CONSTRAINT "FK_59f27cacc68d02e0347e457b1d4"`);
        await queryRunner.query(`ALTER TABLE "group_administrators_user" DROP CONSTRAINT "FK_948e6c39392f43a7675d5ed44f9"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_72981b11a59b579570139b96097"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_427107c650638bcb2f1e167d2e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfa303089d367a2e3c02b002b8"`);
        await queryRunner.query(`DROP TABLE "group_members_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59f27cacc68d02e0347e457b1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_948e6c39392f43a7675d5ed44f"`);
        await queryRunner.query(`DROP TABLE "group_administrators_user"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
