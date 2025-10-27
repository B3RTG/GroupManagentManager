import { MigrationInterface, QueryRunner } from "typeorm";

export class GroupInvitationCreate1760216611145 implements MigrationInterface {
    name = 'GroupInvitationCreate1760216611145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."group_invitation_status_enum" AS ENUM('pending', 'accepted', 'declined', 'expired')`);
        await queryRunner.query(`CREATE TABLE "group_invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."group_invitation_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP, "groupId" uuid NOT NULL, "invitedUserId" uuid, CONSTRAINT "PK_355b6961ab356c14344bf323764" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_invitation" ADD CONSTRAINT "FK_5bc81ed8db5ea55003455aed33f" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_invitation" ADD CONSTRAINT "FK_50732baa2649c4faaadac8e53ae" FOREIGN KEY ("invitedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_invitation" DROP CONSTRAINT "FK_50732baa2649c4faaadac8e53ae"`);
        await queryRunner.query(`ALTER TABLE "group_invitation" DROP CONSTRAINT "FK_5bc81ed8db5ea55003455aed33f"`);
        await queryRunner.query(`DROP TABLE "group_invitation"`);
        await queryRunner.query(`DROP TYPE "public"."group_invitation_status_enum"`);
    }

}
