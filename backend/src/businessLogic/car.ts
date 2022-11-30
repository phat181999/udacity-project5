import { CarsAccess } from "../helpers/carsAcess";
import { AttachmentUtils } from "../helpers/attachmentUtils";
import { CarItem } from "../models/CarItem";
import { CreateCarRequest } from "../requests/CreateCarRequest";
import { UpdateCarRequest } from "../requests/UpdateCarRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
import { CarUpdate } from "../models/CarUpdate";

const carAccess: CarsAccess = new CarsAccess();

const attachmentUtils = new AttachmentUtils();
const logger = createLogger("businessLayerLogger");
export async function getCarsForUser(userId: string) {
  try {
    let cars = await carAccess.getCarList(userId);
    return cars;
  } catch (err) {
    logger.error("Unable to get list of Cars", {
      userId,
      error: err,
    });
    return err;
  }
}

export async function getCarId(carId: string, userId: string) {
  try {
    await carAccess.getCarIdItem(carId, userId);
  } catch (err) {
    return err;
  }
}

export async function createCar(carRequest: CreateCarRequest, userId: string) {
  const carId = uuid.v4();
  const carItem: CarItem = {
    userId: userId,
    carId: carId,
    createdAt: new Date().toLocaleString(),
    name: carRequest.name,
    dueDate: carRequest.dueDate,
    done: false,
    attachmentUrl: carRequest.attachmentUrl,
  };

  try {
    await carAccess.insertCarItem(carItem);
    return carItem;
  } catch (err) {
    logger.error("Unable to save car Item", {
      methodName: "todos.intertCarItem",
      userId,
      error: err,
    });
    return err;
  }
}

export async function updateCar(
  carId: string,
  userId: string,
  updatedCarItem: UpdateCarRequest
) {
  const carUpdate: CarUpdate = {
    ...updatedCarItem,
  };

  try {
    await carAccess.updateCarItem(carId, userId, carUpdate);
  } catch (err) {
    return err;
  }
}

export async function deleteCar(carId: string, userId: string) {
  try {
    await carAccess.deleteCarItem(carId, userId);
  } catch (err) {
    return err;
  }
}

export async function createAttachmentPresignedUrl(
  carId: string,
  userId: string
) {
  try {
    const imageId = uuid.v4();
    let url = await attachmentUtils.generateSignedUrl(imageId);
    await carAccess.updateCarItemAttachmentUrl(carId, userId, imageId);
    return url;
  } catch (err) {
    logger.error("Unable to update Car Item attachment Url", {
      methodName: "todos.createAttachmentPresignedUrl",
      userId,
      error: err,
    });
    return err;
  }
}
