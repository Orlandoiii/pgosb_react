// logger.js

import { ConsoleLogger } from "./ConsoleLogger";

// const isProduction = import.meta.env.PROD

const defaultLogLevel = import.meta.env.VITE_NODE_MIN_LOG_LEVEL;

const logger = new ConsoleLogger({ level: defaultLogLevel });

export default logger;
