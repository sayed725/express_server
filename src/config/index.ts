import dotenv from "dotenv";
import Path from "path";

dotenv.config({ path: Path.join(process.cwd(), ".env") });

const config = {
    connection_str : process.env.CONNECTION_STR,
    port : process.env.PORT
}

export default config;