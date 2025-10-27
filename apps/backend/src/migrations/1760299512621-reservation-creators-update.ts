import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationCreatorsUpdate1760299512621 implements MigrationInterface {
    name = 'ReservationCreatorsUpdate1760299512621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservation_status_enum" AS ENUM('actv', 'canc', 'ended')`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "status" "public"."reservation_status_enum" NOT NULL DEFAULT 'actv'`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD "creatorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" ADD CONSTRAINT "FK_59453091d2242fa7f792a39a5c4" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP CONSTRAINT "FK_59453091d2242fa7f792a39a5c4"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "unified_reservation" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
    }

}
