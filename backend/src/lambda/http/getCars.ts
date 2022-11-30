import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getCarsForUser } from "../../businessLogic/car";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    try {
      const todos = await getCarsForUser(getUserId(event));
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          items: todos.Items,
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: err,
        }),
      };
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
