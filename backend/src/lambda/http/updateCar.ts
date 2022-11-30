import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { updateCar } from "../../businessLogic/car";
import { UpdateCarRequest } from "../../requests/UpdateCarRequest";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const carId = event.pathParameters.carId;
    const updatedCar: UpdateCarRequest = JSON.parse(event.body);
    try {
      await updateCar(carId, getUserId(event), updatedCar);
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
