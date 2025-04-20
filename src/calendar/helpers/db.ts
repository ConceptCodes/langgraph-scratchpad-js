import "reflect-metadata";
import { DataSource, Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "events" })
export class Event {
  @PrimaryColumn("text")
  id!: string;

  @Column("text", { nullable: true })
  title?: string;

  @Column("integer", { name: "start_time", nullable: true })
  startTime?: number;

  @Column("integer", { name: "end_time", nullable: true })
  endTime?: number;

  @Column("integer", { name: "all_day", nullable: true })
  allDay?: number;

  constructor(
    id: string,
    title: string,
    startTime: number,
    endTime: number,
    allDay: boolean
  ) {
    this.id = id;
    this.title = title;
    this.startTime = startTime;
    this.endTime = endTime;
    this.allDay = allDay ? 1 : 0;
  }
}

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "../events.sqlite",
  entities: [Event],
  synchronize: true,
  logging: ["query", "error"],
});

let isInitialized = false;
export const initializeDataSource = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      isInitialized = true;
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      throw err;
    }
  }
  return AppDataSource;
};

export const getTableNames = async (): Promise<string[]> => {
  const dataSource = await initializeDataSource();
  try {
    const entityMetadatas = dataSource.entityMetadatas;
    return entityMetadatas.map((metadata) => metadata.tableName);
  } catch (error) {
    console.error("Error fetching table names:", error);
    return [];
  }
};

export const getTableSchema = async (
  tableName: string
): Promise<Record<string, string>> => {
  const dataSource = await initializeDataSource();
  try {
    const entityMetadata = dataSource.entityMetadatas.find(
      (metadata) => metadata.tableName === tableName
    );
    if (!entityMetadata) {
      console.error(`No entity metadata found for table ${tableName}`);
      return {};
    }
    const schema: Record<string, string> = {};
    entityMetadata.columns.forEach((column) => {
      const columnType =
        typeof column.type === "function"
          ? column.type.name
          : String(column.type);
      schema[column.databaseName] = columnType.toUpperCase();
    });
    return schema;
  } catch (error) {
    console.error(`Error fetching schema for table ${tableName}:`, error);
    return {};
  }
};

export const getAllTableSchemas = async (): Promise<
  Record<string, Record<string, string>>
> => {
  const dataSource = await initializeDataSource();
  const allSchemas: Record<string, Record<string, string>> = {};
  try {
    const entityMetadatas = dataSource.entityMetadatas;
    for (const metadata of entityMetadatas) {
      const schema: Record<string, string> = {};
      metadata.columns.forEach((column) => {
        const columnType =
          typeof column.type === "function"
            ? column.type.name
            : String(column.type);
        schema[column.databaseName] = columnType.toUpperCase();
      });
      allSchemas[metadata.tableName] = schema;
    }
    return allSchemas;
  } catch (error) {
    console.error("Error fetching all table schemas:", error);
    return {};
  }
};

export const executeQuery = async (query: string): Promise<Event[]> => {
  const dataSource = await initializeDataSource();
  try {
    const queryRunner = dataSource.createQueryRunner();
    try {
      const result = await queryRunner.query(query);

      if (Array.isArray(result)) {
        return result.map(
          (row: any) =>
            new Event(
              row.id,
              row.title,
              row.start_time,
              row.end_time,
              Boolean(row.all_day)
            )
        );
      } else {
        console.log(
          `Non-select query executed successfully. Result: ${JSON.stringify(
            result
          )}`
        );
        return [];
      }
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const closeDb = async () => {
  if (isInitialized && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    isInitialized = false;
    console.log("Database connection closed.");
  } else {
    console.log("Database connection was not initialized or already closed.");
  }
};
