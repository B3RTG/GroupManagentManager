import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1759477688441 implements MigrationInterface {
    name = 'InitialSchema1759477688441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "username" character varying NOT NULL, "email" character varying NOT NULL, "googleId" character varying, "facebookId" character varying, "provider" character varying, "password" character varying NOT NULL, "preferredSports" text array, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
