import { GraphQLError } from "graphql";
import logger from "../utils/logger";

export const formatError = (err: GraphQLError) => {
    logger.error(`${err.message} - Path: ${err.path}`);
    return {
        message: err.message,
        path: err.path,
        code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
    };
};
