import { income } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import exportedMethods from "../helpers.js";
import { v4 as uuidv4 } from "uuid";

const incomeFunctions = {
  //returns an income object
  async getIncomeById(id) {
    let incomeId = exportedMethods.checkId(id);

    const incomeCollection = await income();
    const oneIncome = await incomeCollection.findOne({
      _id: new ObjectId(incomeId),
    });
    if (oneIncome === null)
      throw "Income ID does not have corresponding income.";
    oneIncome._id = oneIncome._id.toString();
    return oneIncome;
  },

  // takes in user, amount, date, and description and adds an income object to income collection
  async addIncome(userId, amount, date, description) {
    userId = exportedMethods.checkId(userId);
    amount = exportedMethods.checkAmount(amount);
    date = exportedMethods.checkDate(date);
    if (description) {
      description = exportedMethods.checkString(description);
    } else description = "";

    let newIncome = {
      _id: new ObjectId(),
      userId: userId,
      uuid: uuidv4(),
      amount: amount,
      date: date,
      description: description,
    };

    const incomeCollection = await income();
    const newIncomeInformation = await incomeCollection.insertOne(newIncome);
    if (!newIncomeInformation) throw "Insert failed!";
    return await this.getIncomeById(newIncomeInformation.insertedId.toString());
  },

  //returns them sorted by most recent
  async getAllIncomeByUserId(userId) {
    userId = exportedMethods.checkId(userId);
    const incomeCollection = await income();
    let incomeFromUserId = await incomeCollection
      .find({ userId: userId })
      .toArray();
    //if (incomeFromUserId.length == 0) throw "Could not fetch all incomes.";

    //sort
    if (incomeFromUserId.length !== 0) {
      incomeFromUserId.sort((x, y) => {
        const dateX = new Date(x.date);
        const dateY = new Date(y.date);
        return dateY - dateX;
      });

      incomeFromUserId = incomeFromUserId.map((element) => {
        element._id = element._id.toString();
        return element;
      });
    }

    return incomeFromUserId;
  },

  //returns them sorted by most recent
  async getIncomeByUserIdByMonthAndYear(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    //check month and year format

    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
    if (month.length != 2 || year.length != 4)
      throw "Invalid format for year and date";

    const pattern = `^${month}/\\d{2}/${year}`;
    const incomeCollection = await income();
    let incomeFromUserId = await incomeCollection
      .find({ $and: [{ userId: userId }, { date: { $regex: pattern } }] })
      .toArray();
    if (incomeFromUserId.length !== 0) {
      incomeFromUserId.sort((x, y) => {
        const dateX = new Date(x.date);
        const dateY = new Date(y.date);
        return dateY - dateX;
      });
      incomeFromUserId = incomeFromUserId.map((element) => {
        element._id = element._id.toString();
        return element;
      });
    }
    return incomeFromUserId;
  },

  //returns them sorted by most recent
  async getIncomeByUserIdByYear(userId, year) {
    userId = exportedMethods.checkId(userId);
    //check month and year format

    year = exportedMethods.checkNumber(year);
    if (year.length != 4) throw "Invalid format for year and date";

    const pattern = `^(0[1-9]|1[0-2])/\\d{2}/${year}`;
    const incomeCollection = await income();
    let incomeFromUserIdByYear = await incomeCollection
      .find({ $and: [{ userId: userId }, { date: { $regex: pattern } }] })
      .toArray();
    if (incomeFromUserIdByYear.length !== 0) {
      incomeFromUserIdByYear.sort((x, y) => {
        const dateX = new Date(x.date);
        const dateY = new Date(y.date);
        return dateY - dateX;
      });
      incomeFromUserIdByYear = incomeFromUserIdByYear.map((element) => {
        element._id = element._id.toString();
        return element;
      });
    }
    return incomeFromUserIdByYear;
  },

  async removeIncomeByIncomeId(incomeId) {
    incomeId = exportedMethods.checkId(incomeId);
    const incomeCollection = await income();
    const deletedIncome = await incomeCollection.findOneAndDelete({
      _id: new ObjectId(incomeId),
    });

    if (!deletedIncome) throw "Could not delete income.";
    return `${deletedIncome._id.toString()} has been deleted.`;
  },

  async getIncomeByUuid(uuid) {
    let incomeUuid = exportedMethods.checkString(uuid);

    const incomeCollection = await income();
    const oneIncome = await incomeCollection.findOne({
      uuid: uuid,
    });
    if (oneIncome === null)
      throw "Income uuid does not have corresponding income.";
    oneIncome._id = oneIncome._id.toString();
    return oneIncome;
  },

  async removeIncomeByUuid(uuid) {
    uuid = exportedMethods.checkString(uuid);
    const incomeCollection = await income();
    const deletedIncome = await incomeCollection.findOneAndDelete({
      uuid: uuid,
    });

    if (!deletedIncome) throw "Could not delete income.";
    return `${deletedIncome.userId.toString()} has been deleted.`;
  },

  async updateIncomeByUuid(uuid, amount, date, description) {
    //make transaction one if not made alr
    uuid = exportedMethods.checkString(uuid);
    amount = exportedMethods.checkAmount(amount);
    date = exportedMethods.checkDate(date);
    if (description) {
      description = exportedMethods.checkString(description);
    } else description = "";

    const incomeCollection = await income();
    const incomeToUpdate = await incomeCollection.findOne({
      uuid: uuid,
    });

    if (incomeToUpdate === null)
      throw "Income UUID does not have corresponding income.";

    let newIncome = {
      userId: incomeToUpdate.userId,
      uuid: incomeToUpdate.uuid,
      amount: amount,
      date: date,
      description: description,
    };

    const updatedIncome = await incomeCollection.findOneAndReplace(
      { uuid: uuid },
      newIncome,
      { returnDocument: "after" }
    );
    if (!updatedIncome)
      throw `Update failed! Could not update income with uuid ${uuid}`;
  },
};

export default incomeFunctions;
