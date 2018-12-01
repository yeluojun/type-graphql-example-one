import { Resolver, Query, FieldResolver, Root, ResolverInterface, Arg } from "type-graphql";

import { Recipe } from "./recipe-type";
import { createRecipeSamples } from "./recipe-samples";

@Resolver(of => Recipe)
export class RecipeResolver{
  private readonly items: Recipe[] = createRecipeSamples();

  @Query(returns => [Recipe], {
    complexity: ({ childComplexity, args }) => args.count * childComplexity,
  })
  async recipes(@Arg("count") count: number): Promise<Recipe[]> {
    return await this.items.slice(0, count);
  }

  /* Complexity in field resolver overrides complexity of equivalent field type */
  // @FieldResolver(returns => Number,{ complexity: 5 })
  // ratingsCount(@Root() recipe: Recipe): number {
  //   return recipe.ratings.length;
  // }
}
