import { Connection, createConnection, getConnection, getConnectionOptions } from 'typeorm';

export default async (host = "fin_api") : Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaultOptions, {
            host: process.env.NODE_ENV === "test" ? "localhost" : host,
            database: process.env.NODE_ENV === "test" ? "test_financial_statement" : defaultOptions.database
        })
    );
}

