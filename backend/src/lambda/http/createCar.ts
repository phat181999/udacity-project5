import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateCarRequest } from "../../requests/CreateCarRequest";
import { getUserId } from "../utils";
import { createCar } from "../../businessLogic/car";
import { createLogger } from "../../utils/logger";

const logger = createLogger("createCar");
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newCar: CreateCarRequest = JSON.parse(event.body);
    const userId: string = getUserId(event);

    try {
      if (!newCar.name) {
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ msg: "Can not be blank!" }),
        };
      }
      const response = await createCar(newCar, userId);

      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          item: response,
        }),
      };
    } catch (err) {
      logger.error("Unable to complete the create Car Operation for user", {
        userId: userId,
        error: err,
      });
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
