import Parse from "parse/dist/parse.min.js";

Parse.initialize(process.env.REACT_APP_PARSE_SERVER_APPLICATION_ID);
Parse.serverURL = process.env.REACT_APP_PARSE_SERVER_URL;

export default Parse;
