import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { CarItem } from "../models/CarItem";
import { CarUpdate } from "../models/CarUpdate";

const client = new AWS.DynamoDB.DocumentClient({
  service: new AWS.DynamoDB({
    region: "us-east-1",
  }),
  region: "us-east-1",
});

AWSXRay.captureAWSClient((client as any).service);

const logger = createLogger("TodosAccess");

export class CarsAccess {
  constructor(
    private readonly docClient: DocumentClient = client,
    private readonly cardTable: string = process.env.CARS_TABLE,
    private readonly cardTableIndex: string = process.env.CARS_CREATED_AT_INDEX
  ) {}

  async getCarList(userId: string) {
    const params = {
      TableName: this.cardTable,
      IndexName: this.cardTableIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    try {
      return await this.docClient.query(params).promise();
    } catch (err) {
      logger.error("Unable to get Cars from database", {
        methodName: "todosAccess.getCarsList",
        userId,
        error: err,
      });
      return err;
    }
  }

  async getCarIdItem(carId: string, userId: string) {
    var params = {
      TableName: this.cardTable,
      Key: {
        userId,
        carId,
      },
    };
    try {
      await this.docClient.query(params).promise();
    } catch (err) {
      logger.error("Unable to delete Cars in database", {
        methodName: "todosAccess.getCarIdItem",
        carId: carId,
        error: err,
      });
      return err;
    }
  }

  async insertCarItem(carItem: CarItem) {
    let input = {
      userId: carItem.userId,
      carId: carItem.carId,
      createdAt: carItem.createdAt,
      done: carItem.done,
      name: carItem.name,
      attachmentUrl: carItem.attachmentUrl,
      dueDate: carItem.dueDate,
    };
    const params: DocumentClient.PutItemInput = {
      TableName: this.cardTable,
      Item: input,
    };

    try {
      await this.docClient.put(params).promise();
    } catch (err) {
      logger.error("Unable to insert Car into database", {
        methodName: "todosAccess.insertcarItem",
        carId: carItem.carId,
        error: err,
      });
      return err;
    }
  }

  async updateCarItem(
    carId: string,
    userId: string,
    updatedCarItem: CarUpdate
  ) {
    const params = {
      TableName: this.cardTable,
      Key: {
        carId,
        userId,
      },
      UpdateExpression: "set #nm = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeNames: { "#nm": "name" },
      ExpressionAttributeValues: {
        ":name": updatedCarItem.name,
        ":dueDate": updatedCarItem.dueDate,
        ":done": updatedCarItem.done,
      },
    };
    try {
      await this.docClient
        .update(params, function (err) {
          if (err) {
            console.log(err);
          }
        })
        .promise();
    } catch (err) {
      logger.error("Unable to update Car in database", {
        methodName: "todosAccess.updateCarItem",
        carId: carId,
        error: err,
      });
      return err;
    }
  }

  async deleteCarItem(carId: string, userId: string) {
    var params = {
      TableName: this.cardTable,
      Key: {
        userId,
        carId,
      },
    };
    try {
      await this.docClient
        .delete(params, function (err) {
          if (err) {
            console.log(err);
          }
        })
        .promise();
    } catch (err) {
      logger.error("Unable to delete Car in database", {
        methodName: "todosAccess.deleteCarItem",
        carId: carId,
        error: err,
      });
      return err;
    }
  }

  async updateCarItemAttachmentUrl(
    carId: string,
    userId: string,
    imageId: string
  ) {
    const params = {
      TableName: this.cardTable,
      Key: {
        carId,
        userId,
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${imageId}`,
      },
    };
    try {
      await this.docClient
        .update(params, function (err) {
          if (err) {
            console.log(err);
          }
        })
        .promise();
    } catch (err) {
      logger.error("Unable to Car attachmentUrl in database", {
        methodName: "todosAccess.updateCarItemAttachmentUrl",
        carId: carId,
        error: err,
      });
      return err;
    }
  }
}
