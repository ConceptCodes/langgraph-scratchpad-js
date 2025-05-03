import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  DataSource,
  EntityMetadata,
} from "typeorm";

import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryId!: number;

  @Column("varchar", { length: 100, unique: true })
  name!: string;

  @Column("text", { nullable: true })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}

@Entity() 
export class Product {
  @PrimaryGeneratedColumn() 
  productId!: number;

  @Column("varchar", { length: 255 }) 
  name!: string;

  @Column("text", { nullable: true }) 
  description?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  basePrice!: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: "SET NULL",
    nullable: true, 
  })
  @JoinColumn({ name: "category_id" })
  category?: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @ManyToMany(() => ModifierGroup, (group) => group.products)
  @JoinTable()
  modifierGroups!: ModifierGroup[];
}

@Entity()
export class ModifierGroup {
  @PrimaryGeneratedColumn()
  modifierGroupId!: number;

  @Column("varchar", { length: 100 })
  name!: string;

  @Column("boolean", { default: true })
  defaultOptionsChargePrice!: boolean;

  @Column("int", { default: 1 })
  minSelections!: number;

  @Column("int", { nullable: true })
  maxSelections?: number;

  @OneToMany(() => Modifier, (modifier) => modifier.modifierGroup)
  modifiers!: Modifier[];

  @ManyToMany(() => Product, (product) => product.modifierGroups)
  products!: Product[];
}

@Entity()
export class Modifier {
  @PrimaryGeneratedColumn()
  modifierId!: number;

  @Column("varchar", { length: 100 })
  name!: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  priceAdjustment!: number;

  @ManyToOne(() => ModifierGroup, (group) => group.modifiers, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "modifier_group_id" })
  modifierGroup!: ModifierGroup;

  @OneToMany(
    () => OrderItemModifier,
    (orderItemModifier) => orderItemModifier.modifier
  )
  orderItemModifiers!: OrderItemModifier[];
}

type OrderStatusType =
  | "Pending"
  | "Confirmed"
  | "In Kitchen"
  | "Ready"
  | "Completed"
  | "Canceled";

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  orderStatusId!: number;

  @Index({ unique: true })
  @Column("varchar", { length: 50 })
  statusName!: OrderStatusType;

  @OneToMany(() => Order, (order) => order.orderStatus)
  orders!: Order[];

  @OneToMany(() => StatusHistory, (history) => history.orderStatus)
  statusHistories!: StatusHistory[];
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId!: number;

  @CreateDateColumn({
    type: "datetime", // Change from "timestamp" to "datetime"
    default: () => "CURRENT_TIMESTAMP", // SQLite understands CURRENT_TIMESTAMP
  })
  orderDate!: Date;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  totalAmount!: number;

  @Column("int")
  orderStatusId!: number;

  @ManyToOne(() => OrderStatus, (status) => status.orders, {
    eager: true,
  })
  @JoinColumn()
  orderStatus!: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: ["insert"] })
  orderItems!: OrderItem[];

  @OneToMany(() => StatusHistory, (history) => history.order)
  statusHistory!: StatusHistory[];

  @UpdateDateColumn({
    type: "datetime", // Change from "timestamp" to "datetime"
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  lastUpdated!: Date;
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  orderItemId!: number;

  @Column("int")
  orderId!: number;

  @Column("int")
  productId!: number;

  @Column("int", { default: 1 })
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  itemPrice!: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE" })
  @JoinColumn()
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    eager: true,
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn()
  product?: Product;

  @OneToMany(() => OrderItemModifier, (modifier) => modifier.orderItem, {
    cascade: ["insert"],
    eager: true,
  })
  appliedModifiers!: OrderItemModifier[];
}

@Entity()
export class OrderItemModifier {
  @PrimaryGeneratedColumn()
  orderItemModifierId!: number;

  @Column("int")
  orderItemId!: number;

  @Column("int")
  modifierId!: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  modifierPriceAdjustment!: number;

  @ManyToOne(() => OrderItem, (item) => item.appliedModifiers, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  orderItem!: OrderItem;

  @ManyToOne(() => Modifier, (modifier) => modifier.orderItemModifiers, {
    eager: true,
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn()
  modifier?: Modifier;
}

@Entity()
export class StatusHistory {
  @PrimaryGeneratedColumn()
  historyId!: number;

  @Column("int")
  orderId!: number;

  @Column("int")
  orderStatusId!: number;

  @CreateDateColumn({
    type: "datetime", // Change from "timestamp" to "datetime"
    default: () => "CURRENT_TIMESTAMP",
  })
  changedAt!: Date;

  @ManyToOne(() => Order, (order) => order.statusHistory, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  order!: Order;

  @ManyToOne(() => OrderStatus, (status) => status.statusHistories, {
    onDelete: "RESTRICT",
  })
  @JoinColumn()
  orderStatus!: OrderStatus;
}

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "../db.sqlite",
  entities: [
    Category,
    Product,
    ModifierGroup,
    Modifier,
    OrderStatus,
    Order,
    OrderItem,
    OrderItemModifier,
    StatusHistory,
  ],
  synchronize: true,
  logging: ["query", "error"],
  namingStrategy: new SnakeNamingStrategy(),
});

let isInitialized = false;

export const initializeDatabase = async (): Promise<DataSource> => {
  if (isInitialized && AppDataSource.isInitialized) {
    console.log("Database connection already established.");
    return AppDataSource;
  }
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully.");
    isInitialized = true;
    return AppDataSource;
  } catch (error) {
    console.error("Error establishing database connection:", error);
    isInitialized = false;
    throw error;
  }
};

export const closeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    console.log("Database connection is not open.");
    return;
  }
  try {
    await AppDataSource.destroy();
    console.log("Database connection closed successfully.");
    isInitialized = false;
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
};

export const executeQuery = async (query: string, parameters?: any[]) => {
  if (!AppDataSource.isInitialized) {
    throw new Error(
      "Database is not initialized. Call initializeDatabase first."
    );
  }
  try {
    const result = await AppDataSource.query(query, parameters);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const getTableDefinitions = (): string => {
  if (!AppDataSource.isInitialized) {
    throw new Error(
      "Database is not initialized. Call initializeDatabase first."
    );
  }

  const entityMetadatas = AppDataSource.entityMetadatas;
  let schemaString = "Database Schema:\n\n";

  entityMetadatas.forEach((entity: EntityMetadata) => {
    schemaString += `Table: ${entity.tableName}\n`;
    schemaString += "Columns:\n";

    entity.columns.forEach((col) => {
      schemaString += `  - ${col.databaseName} (${col.type})`;
      if (col.isPrimary) schemaString += " [PRIMARY KEY]";
      if (!col.isNullable) schemaString += " [NOT NULL]";
      const fk = entity.foreignKeys.find((fk) =>
        fk.columnNames.includes(col.databaseName)
      );
      if (fk) {
        schemaString += ` [FOREIGN KEY references ${
          fk.referencedTablePath
        }(${fk.referencedColumnNames.join(", ")})]`;
      }
      schemaString += "\n";
    });

    schemaString += "\n";
  });

  return schemaString;
};
