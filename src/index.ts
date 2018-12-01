import "reflect-metadata";
import queryComplexity, { simpleEstimator, fieldConfigEstimator } from "graphql-query-complexity";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import expressPlayground from "graphql-playground-middleware-express";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./recipe-resolver";
async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP(async (req, res, params) => ({
      schema,
      validationRules: [
        queryComplexity({
          maximumComplexity: 20,
          variables: params!.variables!,
          onComplete: (complexity: number) => {
            console.log("Query Complexity:", complexity);
          },
          estimators: [
            fieldConfigEstimator(),
            simpleEstimator({
              defaultComplexity: 1,
            }),
          ],
        }),
      ],
    })),
  );
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
  app.listen(4000, () => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:4000/playground`,
    );
  });
}

bootstrap();
