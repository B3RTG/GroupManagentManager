import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationModuleReworkUpdate1760478114947 implements MigrationInterface {
    name = 'ReservationModuleReworkUpdate1760478114947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."match_participant_type_enum" AS ENUM('principal', 'substitute', 'eliminado')`);
        await queryRunner.query(`CREATE TYPE "public"."match_participant_status_enum" AS ENUM('active', 'promoted', 'removed')`);
        await queryRunner.query(`CREATE TABLE "match_participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."match_participant_type_enum" NOT NULL DEFAULT 'principal', "status" "public"."match_participant_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "matchId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_deab53592edf83accdc8110a0f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."match_status_enum" AS ENUM('scheduled', 'ongoing', 'finished', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "match" ADD "status" "public"."match_status_enum" NOT NULL DEFAULT 'scheduled'`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."unified_reservation_status_enum" AS ENUM('active', 'cancelled', 'finished')`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "status" "public"."unified_reservation_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."guest_status_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "status" "public"."guest_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."guest_type_enum" AS ENUM('principal', 'substitute')`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "type" "public"."guest_type_enum" NOT NULL DEFAULT 'principal'`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_3b5377a36874098ead4e735a421" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participant" ADD CONSTRAINT "FK_d35237ec97bb55766c12c5a2126" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participant" ADD CONSTRAINT "FK_ba41099e11079b459570fa75aad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_participant" DROP CONSTRAINT "FK_ba41099e11079b459570fa75aad"`);
        await queryRunner.query(`ALTER TABLE "match_participant" DROP CONSTRAINT "FK_d35237ec97bb55766c12c5a2126"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_3b5377a36874098ead4e735a421"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."guest_type_enum"`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "type" character varying NOT NULL DEFAULT 'principal'`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."guest_status_enum"`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."unified_reservation_status_enum"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."match_status_enum"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "status" character varying NOT NULL DEFAULT 'scheduled'`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "createdById"`);
        await queryRunner.query(`DROP TABLE "match_participant"`);
        await queryRunner.query(`DROP TYPE "public"."match_participant_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."match_participant_type_enum"`);
    }

}
