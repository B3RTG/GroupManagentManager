import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationModuleCreate1760267906105 implements MigrationInterface {
    name = 'ReservationModuleCreate1760267906105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "guest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying, "createdById" uuid, CONSTRAINT "PK_57689d19445de01737dbc458857" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sport" character varying NOT NULL, "maxParticipants" integer NOT NULL, "unifiedReservationId" uuid, "groupId" uuid, "createdById" uuid, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "courts" integer NOT NULL, "unifiedReservationId" uuid NOT NULL, "groupId" uuid NOT NULL, "creatorId" uuid NOT NULL, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "unified_reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "totalSlots" integer NOT NULL, "groupId" uuid, CONSTRAINT "PK_1ed15d8f7ca6196d995f1bca391" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match_participants_user" ("matchId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_9efed7b99d768485d1a03999249" PRIMARY KEY ("matchId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0ab88faa9819dd49d03bdc933f" ON "match_participants_user" ("matchId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c75c2d27583293642a63c1ebcf" ON "match_participants_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "match_substitutes_user" ("matchId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b2a194f62086a51ee874430efa5" PRIMARY KEY ("matchId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0f8cb43d11555477f0299318d7" ON "match_substitutes_user" ("matchId") `);
        await queryRunner.query(`CREATE INDEX "IDX_202809fdef69c97d7920faeac8" ON "match_substitutes_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "match_guests_guest" ("matchId" uuid NOT NULL, "guestId" uuid NOT NULL, CONSTRAINT "PK_ddeb3d22828862a484e19a6df9b" PRIMARY KEY ("matchId", "guestId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c8375b72b142668d59671281b5" ON "match_guests_guest" ("matchId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c8497bb028acc2ed4e46702caa" ON "match_guests_guest" ("guestId") `);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_3b5377a36874098ead4e735a421" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_1e6c0988ea5282d26041a7300a3" FOREIGN KEY ("unifiedReservationId") REFERENCES "unified_reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_64e4b0003b6e0a10d1e388e2641" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_7915fcafea0732e87d7183d6825" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_2d0baef4634ee0c4cfbbc79bebb" FOREIGN KEY ("unifiedReservationId") REFERENCES "unified_reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_e52834144124290ce6eb7df02b6" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_e62e811accbd820e4bac81f114d" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD CONSTRAINT "FK_9f27d96308a1be925d8e92bab48" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_participants_user" ADD CONSTRAINT "FK_0ab88faa9819dd49d03bdc933f5" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "match_participants_user" ADD CONSTRAINT "FK_c75c2d27583293642a63c1ebcf7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "match_substitutes_user" ADD CONSTRAINT "FK_0f8cb43d11555477f0299318d74" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "match_substitutes_user" ADD CONSTRAINT "FK_202809fdef69c97d7920faeac87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "match_guests_guest" ADD CONSTRAINT "FK_c8375b72b142668d59671281b58" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "match_guests_guest" ADD CONSTRAINT "FK_c8497bb028acc2ed4e46702caa5" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_guests_guest" DROP CONSTRAINT "FK_c8497bb028acc2ed4e46702caa5"`);
        await queryRunner.query(`ALTER TABLE "match_guests_guest" DROP CONSTRAINT "FK_c8375b72b142668d59671281b58"`);
        await queryRunner.query(`ALTER TABLE "match_substitutes_user" DROP CONSTRAINT "FK_202809fdef69c97d7920faeac87"`);
        await queryRunner.query(`ALTER TABLE "match_substitutes_user" DROP CONSTRAINT "FK_0f8cb43d11555477f0299318d74"`);
        await queryRunner.query(`ALTER TABLE "match_participants_user" DROP CONSTRAINT "FK_c75c2d27583293642a63c1ebcf7"`);
        await queryRunner.query(`ALTER TABLE "match_participants_user" DROP CONSTRAINT "FK_0ab88faa9819dd49d03bdc933f5"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP CONSTRAINT "FK_9f27d96308a1be925d8e92bab48"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_e62e811accbd820e4bac81f114d"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_e52834144124290ce6eb7df02b6"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_2d0baef4634ee0c4cfbbc79bebb"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_7915fcafea0732e87d7183d6825"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_64e4b0003b6e0a10d1e388e2641"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_1e6c0988ea5282d26041a7300a3"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_3b5377a36874098ead4e735a421"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8497bb028acc2ed4e46702caa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8375b72b142668d59671281b5"`);
        await queryRunner.query(`DROP TABLE "match_guests_guest"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_202809fdef69c97d7920faeac8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f8cb43d11555477f0299318d7"`);
        await queryRunner.query(`DROP TABLE "match_substitutes_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c75c2d27583293642a63c1ebcf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ab88faa9819dd49d03bdc933f"`);
        await queryRunner.query(`DROP TABLE "match_participants_user"`);
        await queryRunner.query(`DROP TABLE "unified_reservation"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "guest"`);
    }

}
