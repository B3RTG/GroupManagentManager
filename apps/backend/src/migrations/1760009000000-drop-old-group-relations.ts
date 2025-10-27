import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropOldGroupRelations1760009000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Elimina tablas intermedias antiguas si existen
    await queryRunner.query(`DROP TABLE IF EXISTS "group_members_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "group_administrators_user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Si necesitas revertir, puedes recrear las tablas/columnas aquí
  }
}
