import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AddressInfo } from "net";
import HashManager from "./services/HashManager";
import { IdGenerator } from "./services/IdGenerator";
import { UserDatabase } from "./data/UserDatabase";
import { Authenticator } from "./services/Authenticator";
import { RecipeDatabase } from "./data/RecipeDatabase";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  try {
    if (!req.body.email || req.body.email.indexOf("@") === -1) {
      throw new Error("Invalid E-mail");
    }

    if (!req.body.password || req.body.length < 6) {
      throw new Error("Invalid Password");
    }

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const hashManager = new HashManager();
    const cipherText = await hashManager.hash(userData.password);

    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const userDatabase = new UserDatabase();
    await userDatabase.create(id, userData.name, userData.email, cipherText);

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({ id });

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getByEmail(userData.email);

    const hashManager = new HashManager();
    const passwordIsCorrect = await hashManager.compare(
      userData.password,
      user.password
    );

    if (!passwordIsCorrect) {
      throw new Error("Senha inválida");
    }

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({
      id: user.id,
    });

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/user/profile", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticatorData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getById(authenticatorData.id);

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/recipe", async (req: Request, res: Response) => {
  try {
    const recipeData = {
      title: req.body.title,
      description: req.body.description,
    };

    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticatorData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getById(authenticatorData.id);

    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const recipeDatabase = new RecipeDatabase();
    await recipeDatabase.create(
      id,
      recipeData.title,
      recipeData.description,
      user.id
    );

    res.status(200).send(recipeDatabase);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const server = app.listen(3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.log(`Falha ao rodar o servidor.`);
  }
});
