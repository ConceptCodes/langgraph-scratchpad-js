# Order-entry Agent Module

This module implements a conversational agent designed for taking food orders, potentially via voice interaction. It uses LangGraph to manage the conversation flow and interacts with a database for menu items and order persistence.

## Architecture

The agent is built using LangGraph's `StateGraph`. The core flow is defined in [`src/order-entry/agent/graph.ts`](agent/graph.ts).

*   **State Management:** The conversation state ([`AgentStateAnnotation`](agent/state.ts)) tracks messages, the draft order, query results, and flow control flags. Configuration like `businessName` or `language` are passed via [`ConfigurationAnnotation`](agent/state.ts).
*   **Nodes:** The graph consists of several nodes representing different stages of the order process (defined in [`src/order-entry/helpers/constants.ts`](helpers/constants.ts)):
    *   `WELCOME_MESSAGE`: Greets the user.
    *   `AUDIO_INPUT`: Captures user input (likely voice).
    *   `PARSE_INTENT`: Determines the user's goal (add item, modify, confirm).
    *   `CHECK_INVENTORY`: Queries the database for menu items or modifiers.
    *   `ITEM_SELECTION`: Adds items to the draft order based on inventory check.
    *   `MODIFY_ORDER`: Updates the draft order (e.g., adds modifiers, changes quantity).
    *   `REVIEW_ORDER`: Summarizes the draft order for the user.
    *   `CONFIRM_ORDER`: Finalizes the order and provides a sign-off message.
    *   `AUDIO_OUTPUT`: Sends responses back to the user (likely voice).
*   **Flow:**
    1.  Starts with `WELCOME_MESSAGE`.
    2.  Cycles through `AUDIO_INPUT` -> `PARSE_INTENT`.
    3.  `PARSE_INTENT` routes to `ITEM_SELECTION`, `MODIFY_ORDER`, or `CONFIRM_ORDER`.
    4.  `ITEM_SELECTION` and `MODIFY_ORDER` may call `CHECK_INVENTORY` before updating the draft order.
    5.  `ITEM_SELECTION` and `MODIFY_ORDER` typically lead to `REVIEW_ORDER`.
    6.  `REVIEW_ORDER` and `CONFIRM_ORDER` lead to `AUDIO_OUTPUT`.
    7.  The loop continues until `CONFIRM_ORDER` is reached or the user exits.
*   **Persistence:** Uses `MemorySaver` for in-memory check-pointing of the conversation state.
*   **Database:** Interacts with a SQLite database via TypeORM ([`src/order-entry/helpers/db.ts`](helpers/db.ts)) to manage categories, products, modifiers, and orders.

![Order-entry Agent Architecture](/src/order-entry/assets/graph.png)

## Functionality

1.  **Initialization:** Connects to the database ([`initializeDatabase`](helpers/db.ts)).
2.  **Greeting:** Welcomes the user ([`welcomeMessageNode`](nodes/welcome-message.ts)).
3.  **Interaction Loop:**
    *   Receives user input ([`audioInputNode`](nodes/audio-input.ts)).
    *   Determines intent ([`parseIntentNode`](nodes/parse-intent.ts)).
    *   **Adding Items:** If intent is to add items, checks inventory ([`checkInventoryNode`](nodes/check-inventory.ts)) and updates the draft order ([`itemSelectionNode`](nodes/item-selection.ts)).
    *   **Modifying Order:** If intent is to modify, may check available modifiers ([`checkInventoryNode`](nodes/check-inventory.ts)) and updates the draft order ([`modifyOrderNode`](nodes/modify-order.ts)).
    *   **Reviewing Order:** Summarizes the current draft order ([`reviewOrderNode`](nodes/review-order.ts)) and asks for confirmation or changes.
    *   **Confirming Order:** If intent is to confirm, generates a final sign-off message ([`confirmOrderNode`](nodes/confirm-order.ts)).
    *   Sends responses back to the user ([`audioOutputNode`](nodes/audio-output.ts)).
4.  **Termination:** The loop ends when the order is confirmed or the user indicates they want to exit.

## Core Components

*   **Graph Definition:** [`src/order-entry/agent/graph.ts`](agent/graph.ts)
*   **State Management:** [`src/order-entry/agent/state.ts`](agent/state.ts)
*   **Nodes:** [`src/order-entry/nodes/`](nodes) (Contains logic for each step)
*   **Prompts:** [`src/order-entry/agent/prompts.ts`](agent/prompts.ts) (LLM prompts for various tasks)
*   **Helpers:** [`src/order-entry/helpers/`](helpers) (Database setup, constants, types, utility functions)
*   **Database Schema:** Defined using TypeORM entities in [`src/order-entry/helpers/db.ts`](helpers/db.ts)
*   **Database Seeding:** [`src/order-entry/helpers/seed.ts`](helpers/seed.ts)

## Prerequisites

*   Node.js and Bun installed.
*   Environment variables set (if needed, e.g., API keys for LLMs or speech services).
*   Database seeded with initial data.

## Setup

1.  **Install Dependencies:**
    ```bash
    bun install
    ```
2.  **Seed Database:** 
    ```bash
    bun run src/order-entry/helpers/seed.ts
    ```

## Usage

