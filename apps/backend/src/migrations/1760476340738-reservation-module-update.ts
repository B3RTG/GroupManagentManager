import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationModuleUpdate1760476340738 implements MigrationInterface {
    name = 'ReservationModuleUpdate1760476340738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_3b5377a36874098ead4e735a421"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP CONSTRAINT "FK_59453091d2242fa7f792a39a5c4"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_e62e811accbd820e4bac81f114d"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "totalSlots"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "courts"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "type" character varying NOT NULL DEFAULT 'principal'`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "matchId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD "time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD "status" character varying NOT NULL DEFAULT 'scheduled'`);
        await queryRunner.query(`ALTER TABLE "match" ADD "maxSubstitutes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "match" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "resourceId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "createdById" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "maxParticipants" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP CONSTRAINT "FK_9f27d96308a1be925d8e92bab48"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ALTER COLUMN "groupId" SET NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."reservation_status_enum" RENAME TO "reservation_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_status_enum" AS ENUM('pending', 'confirmed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "status" TYPE "public"."reservation_status_enum" USING "status"::"text"::"public"."reservation_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."reservation_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_f2a008aae8712b3f22c5223bb25" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD CONSTRAINT "FK_9f27d96308a1be925d8e92bab48" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_6dad31f02be56b0a81634603002" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_6dad31f02be56b0a81634603002"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP CONSTRAINT "FK_9f27d96308a1be925d8e92bab48"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_f2a008aae8712b3f22c5223bb25"`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_status_enum_old" AS ENUM('actv', 'canc', 'ended')`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "status" TYPE "public"."reservation_status_enum_old" USING "status"::"text"::"public"."reservation_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "status" SET DEFAULT 'actv'`);
        await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."reservation_status_enum_old" RENAME TO "reservation_status_enum"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ALTER COLUMN "groupId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD CONSTRAINT "FK_9f27d96308a1be925d8e92bab48" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "maxParticipants" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "resourceId"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "maxSubstitutes"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "matchId"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "creatorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "courts" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "creatorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "totalSlots" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_e62e811accbd820e4bac81f114d" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD CONSTRAINT "FK_59453091d2242fa7f792a39a5c4" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_3b5377a36874098ead4e735a421" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
