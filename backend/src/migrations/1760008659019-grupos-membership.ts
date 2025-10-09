import { MigrationInterface, QueryRunner } from "typeorm";

export class GruposMembership1760008659019 implements MigrationInterface {
    name = 'GruposMembership1760008659019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."group_membership_role_enum" AS ENUM('owner', 'admin', 'member')`);
        await queryRunner.query(`CREATE TABLE "group_membership" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."group_membership_role_enum" NOT NULL DEFAULT 'member', "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "groupId" uuid, CONSTRAINT "PK_b631623cf04fa74513b975e7059" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_membership" ADD CONSTRAINT "FK_d59b6ccf0c6407b3fb9b7d321ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_membership" ADD CONSTRAINT "FK_b1411f07fafcd5ad93c6ee16424" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_membership" DROP CONSTRAINT "FK_b1411f07fafcd5ad93c6ee16424"`);
        await queryRunner.query(`ALTER TABLE "group_membership" DROP CONSTRAINT "FK_d59b6ccf0c6407b3fb9b7d321ec"`);
        await queryRunner.query(`DROP TABLE "group_membership"`);
        await queryRunner.query(`DROP TYPE "public"."group_membership_role_enum"`);
    }

}
