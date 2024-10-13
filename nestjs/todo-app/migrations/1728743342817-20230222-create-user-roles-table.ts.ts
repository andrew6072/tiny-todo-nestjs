import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUserRolesTable implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users_roles",
            columns: [
                {
                    name: "userId",
                    type: "int",
                },
                {
                    name: "roleId",
                    type: "int",
                }
            ],
        }), true);

        await queryRunner.createPrimaryKey("users_roles", ["userId", "roleId"]);

        await queryRunner.createForeignKey("users_roles", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("users_roles", new TableForeignKey({
            columnNames: ["roleId"],
            referencedColumnNames: ["id"],
            referencedTableName: "roles",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users_roles");
        const foreignKeys = table.foreignKeys;
        await queryRunner.dropForeignKeys("users_roles", foreignKeys);
        await queryRunner.dropTable("users_roles");
    }

}
