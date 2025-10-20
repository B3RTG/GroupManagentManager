import { MigrationInterface, QueryRunner } from "typeorm";

export class UnifiedReservationMatchRefactor1760984648129 implements MigrationInterface {
    name = 'UnifiedReservationMatchRefactor1760984648129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_f2a008aae8712b3f22c5223bb25"`);
        await queryRunner.query(`CREATE TYPE "public"."player_type_enum" AS ENUM('user', 'guest')`);
        await queryRunner.query(`CREATE TABLE "player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."player_type_enum" NOT NULL, "team" character varying, "stats" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "matchId" uuid NOT NULL, "userId" uuid, "guestId" uuid, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."participant_type_enum" AS ENUM('principal', 'substitute', 'eliminado')`);
        await queryRunner.query(`CREATE TYPE "public"."participant_status_enum" AS ENUM('active', 'promoted', 'removed')`);
        await queryRunner.query(`CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."participant_type_enum" NOT NULL DEFAULT 'principal', "status" "public"."participant_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "unifiedReservationId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "sport"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "maxParticipants"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "maxSubstitutes"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "matchId"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "result" character varying`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "unifiedReservationId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_3b5377a36874098ead4e735a421"`);
        await queryRunner.query(`ALTER TABLE "guest" ALTER COLUMN "createdById" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_38629dfe5bdd2e7ad57a6b29070" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7687919bf054bf262c669d3ae21" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_271dcf31ceeab88714c587b02b9" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_c241f0089d264f9ecef4f7818e3" FOREIGN KEY ("unifiedReservationId") REFERENCES "unified_reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_3694d7d0388418293f32f0e674c" FOREIGN KEY ("unifiedReservationId") REFERENCES "unified_reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_3b5377a36874098ead4e735a421" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE IF EXISTS "match_participant"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_3b5377a36874098ead4e735a421"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_3694d7d0388418293f32f0e674c"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_c241f0089d264f9ecef4f7818e3"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_271dcf31ceeab88714c587b02b9"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7687919bf054bf262c669d3ae21"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_38629dfe5bdd2e7ad57a6b29070"`);
        await queryRunner.query(`ALTER TABLE "guest" ALTER COLUMN "createdById" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_3b5377a36874098ead4e735a421" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "unifiedReservationId"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "result"`);
        await queryRunner.query(`ALTER TABLE "guest" ADD "matchId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD "maxSubstitutes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match" ADD "maxParticipants" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match" ADD "sport" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "participant"`);
        await queryRunner.query(`DROP TYPE "public"."participant_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."participant_type_enum"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TYPE "public"."player_type_enum"`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_f2a008aae8712b3f22c5223bb25" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // Si quieres recrear la tabla match_participant en el down, agrega aquí el SQL correspondiente. Si no, puedes dejarlo así.
    }

}
