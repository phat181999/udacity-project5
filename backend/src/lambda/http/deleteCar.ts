import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { deleteCar } from "../../businessLogic/car";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const carId = event.pathParameters.carId;
    const userId = getUserId(event);

    try {
      deleteCar(carId, userId);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({}),
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

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
