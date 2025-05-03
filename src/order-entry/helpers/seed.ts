import { initializeDatabase, closeDatabase } from "./db";
import { Category, Product, ModifierGroup, Modifier, OrderStatus } from "./db";

const seedDatabase = async () => {
  let connection;
  try {
    console.log("Initializing database connection for seeding...");
    connection = await initializeDatabase();
    console.log("Database connection established.");

    console.log("Clearing existing data (optional)...");
    await connection.getRepository(Product).clear();
    await connection.getRepository(Modifier).clear();
    await connection.getRepository(Category).clear();
    await connection.getRepository(ModifierGroup).clear();
    await connection.getRepository(OrderStatus).clear();

    console.log("Seeding Order Statuses...");
    const orderStatusRepo = connection.getRepository(OrderStatus);
    const statuses = [
      "Pending",
      "Confirmed",
      "In Kitchen",
      "Ready",
      "Completed",
      "Canceled",
    ].map((statusName) =>
      orderStatusRepo.create({ statusName: statusName as any })
    );
    await orderStatusRepo.save(statuses);
    console.log(`${statuses.length} Order Statuses seeded.`);

    console.log("Seeding Categories...");
    const categoryRepo = connection.getRepository(Category);
    const categoriesData = [
      { name: "Burgers", description: "Classic and specialty burgers" },
      { name: "Sides", description: "Fries, rings, and more" },
      { name: "Drinks", description: "Sodas, juices, and water" },
      { name: "Desserts", description: "Sweet treats to finish your meal" },
    ];
    const categories = categoriesData.map((cat) => categoryRepo.create(cat));
    await categoryRepo.save(categories);
    console.log(`${categories.length} Categories seeded.`);

    console.log("Seeding Modifier Groups...");
    const modGroupRepo = connection.getRepository(ModifierGroup);
    const modGroupsData = [
      {
        name: "Burger Toppings",
        minSelections: 0,
        maxSelections: 5,
        defaultOptionsChargePrice: true,
      },
      {
        name: "Cheese Options",
        minSelections: 0,
        maxSelections: 1,
        defaultOptionsChargePrice: true,
      },
      {
        name: "Drink Size",
        minSelections: 1,
        maxSelections: 1,
        defaultOptionsChargePrice: false,
      },
      {
        name: "Side Sauce",
        minSelections: 0,
        maxSelections: 2,
        defaultOptionsChargePrice: true,
      },
    ];
    const modifierGroups = modGroupsData.map((group) =>
      modGroupRepo.create(group)
    );
    await modGroupRepo.save(modifierGroups);
    console.log(`${modifierGroups.length} Modifier Groups seeded.`);

    console.log("Seeding Modifiers...");
    const modifierRepo = connection.getRepository(Modifier);
    const modifiersData = [
      {
        modifierGroup: modifierGroups[0],
        name: "Lettuce",
        priceAdjustment: 0.0,
      },
      {
        modifierGroup: modifierGroups[0],
        name: "Tomato",
        priceAdjustment: 0.0,
      },
      {
        modifierGroup: modifierGroups[0],
        name: "Onions",
        priceAdjustment: 0.0,
      },
      {
        modifierGroup: modifierGroups[0],
        name: "Pickles",
        priceAdjustment: 0.0,
      },
      { modifierGroup: modifierGroups[0], name: "Bacon", priceAdjustment: 1.5 },
      {
        modifierGroup: modifierGroups[0],
        name: "Extra Patty",
        priceAdjustment: 2.5,
      },
      {
        modifierGroup: modifierGroups[1],
        name: "American Cheese",
        priceAdjustment: 0.75,
      },
      {
        modifierGroup: modifierGroups[1],
        name: "Cheddar Cheese",
        priceAdjustment: 0.75,
      },
      {
        modifierGroup: modifierGroups[1],
        name: "Swiss Cheese",
        priceAdjustment: 0.75,
      },
      {
        modifierGroup: modifierGroups[1],
        name: "No Cheese",
        priceAdjustment: 0.0,
      },
      { modifierGroup: modifierGroups[2], name: "Small", priceAdjustment: 0.0 },
      {
        modifierGroup: modifierGroups[2],
        name: "Medium",
        priceAdjustment: 0.5,
      },
      { modifierGroup: modifierGroups[2], name: "Large", priceAdjustment: 1.0 },
      {
        modifierGroup: modifierGroups[3],
        name: "Ketchup",
        priceAdjustment: 0.0,
      },
      { modifierGroup: modifierGroups[3], name: "Ranch", priceAdjustment: 0.5 },
      {
        modifierGroup: modifierGroups[3],
        name: "BBQ Sauce",
        priceAdjustment: 0.5,
      },
    ];
    const modifiers = modifiersData.map((mod) => modifierRepo.create(mod));
    await modifierRepo.save(modifiers);
    console.log(`${modifiers.length} Modifiers seeded.`);

    console.log("Seeding Products...");
    const productRepo = connection.getRepository(Product);
    const productsData = [
      {
        category: categories[0],
        name: "Classic Burger",
        description: "Beef patty, lettuce, tomato, onion, pickles",
        basePrice: 8.99,
        modifierGroups: [modifierGroups[0], modifierGroups[1]],
      },
      {
        category: categories[0],
        name: "Cheeseburger",
        description: "Beef patty with cheese",
        basePrice: 9.49,
        modifierGroups: [modifierGroups[0], modifierGroups[1]],
      },
      {
        category: categories[0],
        name: "Bacon Cheeseburger",
        description: "Beef patty, bacon, cheese",
        basePrice: 10.99,
        modifierGroups: [modifierGroups[0], modifierGroups[1]],
      },
      {
        category: categories[1],
        name: "French Fries",
        description: "Crispy golden fries",
        basePrice: 3.49,
        modifierGroups: [modifierGroups[3]],
      },
      {
        category: categories[1],
        name: "Onion Rings",
        description: "Battered onion rings",
        basePrice: 4.49,
        modifierGroups: [modifierGroups[3]],
      },
      {
        category: categories[2],
        name: "Cola",
        description: "Refreshing cola",
        basePrice: 2.49,
        modifierGroups: [modifierGroups[2]],
      },
      {
        category: categories[2],
        name: "Lemonade",
        description: "Tart and sweet lemonade",
        basePrice: 2.99,
        modifierGroups: [modifierGroups[2]],
      },
      {
        category: categories[2],
        name: "Water",
        description: "Bottled water",
        basePrice: 1.99,
        modifierGroups: [],
      },
      {
        category: categories[3],
        name: "Chocolate Chip Cookie",
        description: "Warm and gooey",
        basePrice: 1.99,
        modifierGroups: [],
      },
      {
        category: categories[3],
        name: "Brownie",
        description: "Fudgy chocolate brownie",
        basePrice: 2.99,
        modifierGroups: [],
      },
    ];
    const products = productsData.map((prod) => productRepo.create(prod));
    await productRepo.save(products);
    console.log(`${products.length} Products seeded.`);

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    if (connection && connection.isInitialized) {
      await closeDatabase();
      console.log("Database connection closed.");
    }
  }
};

seedDatabase();
