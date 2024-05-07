//v7 imports
import admin from "./api/v1/controllers/admin/routes";
import user from "./api/v1/controllers/user/routes";
import bot from "./api/v1/controllers/bot/routes";


/**
 *
 *
 * @export
 * @param {any} app
 */

export default function routes(app) {
  app.use("/api/v1/admin", admin);
  app.use("/api/v1/user", user);
  app.use("/api/v1/bot", bot);

  return app;
}
