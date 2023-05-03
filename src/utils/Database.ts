

import { connect } from "mongoose";
import Constants from "../utils/Constants"

class Database {
    static async connect() {
        await connect(Constants.database.url);
    }
}

export default Database;
