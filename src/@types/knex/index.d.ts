import { Knex } from "knex";

declare module "knex/types/tables" {
  interface Transaction {
    id: string;
    session_id?: string;
    title: string;
    amount: number;
    created_at: string;
  }

  interface Tables {
    // Transactions table
    transactions: Knex.CompositeTableType<
      Transaction,
      Pick<Transaction, "id" | "title" | "amount"> &
        Partial<Pick<Transaction, "created_at" | "session_id">>,
      Partial<Omit<Transaction, "id">>
    >;
  }
}
