import 'server-only';

import { AUTH_COOKIE } from '@/features/auth/constant';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from "hono/factory";
import { Account, Client, Databases, Models, Storage, Users } from 'node-appwrite';

type AdditionalContext = {
  Variables: {
    account: Account;
    databases: Databases;
    storage: Storage;
    users: Users;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

  const session = getCookie(c, AUTH_COOKIE);
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    client.setSession(session);
    const account = new Account(client);

    // Verify session is valid by getting user
    const user = await account.get();

    const databases = new Databases(client);
    const storage = new Storage(client);
    const users = new Users(client);

    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("users", users);
    c.set("user", user);

    return next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Session is invalid or expired
    return c.json({ error: "Invalid or expired session" }, 401);
  }
});
