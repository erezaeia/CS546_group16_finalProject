import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers.js";
import bcrypt from "bcryptjs";
const saltRounds = 16;

let exportedMethods = {
  async getUserById(id) {
    id = validation.checkId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) throw "Error: User not found";
    return user;
  },
  async register(
    firstName,
    lastName,
    email,
    gender,
    city,
    state,
    age,
    password,
    balance
  ) {
    firstName = validation.checkFirstName(firstName);
    lastName = validation.checkLastName(lastName);
    email = validation.checkEmail(email);
    gender = validation.checkString(gender);
    city = validation.checkString(city);
    state = validation.checkString(state);
    age = validation.checkNumber(age);
    balance = validation.checkAmount(balance);
    password = validation.checkPassword(password);


    if (parseInt(age) < 13) {
      throw `Users must be at least 13 years old to sign up.`;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser) {
      throw `A user with the email '${email}' already exists.`;
    }
    let newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      gender: gender.trim(),
      city: city.trim(),
      state: state.trim(),
      age: parseInt(age),
      password: hashedPassword,
      categories: [
        "Groceries",
        "Shopping",
        "Restaurant",
        "Transportation",
        "Rent",
      ],
      fixedExpenses: [],

      balance: parseFloat(balance),

    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not register user due to a database error.";
    }
    return { registrationCompleted: true, userId: insertInfo.insertedId.toString()};
  },
  async login(email, password) {
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);
    email = email.toLowerCase();

    const usersCollection = await users();

    const existingUser = await usersCollection.findOne({ email: email });
    if (!existingUser) {
      throw `Either the email or password is invalid`;
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      throw `Either the email or password is invalid`;
    }

    return {
      id: existingUser._id.toString(),
      firstName: existingUser.firstName.trim(),
      lastName: existingUser.lastName.trim(),
      email: existingUser.email.trim(),
      gender: existingUser.gender.trim(),
      city: existingUser.city.trim(),
      state: existingUser.state.trim(),
      age: existingUser.age,
      balance: existingUser.balance,
      categories: existingUser.categories,
      fixedExpenses: existingUser.fixedExpenses,
    };
  },

  async updateUserPut(
    id,
    firstName,
    lastName,
    email,
    gender,
    city,
    state,
    age,
    balance
  ) {

    id = validation.checkId(id);
    firstName = validation.checkFirstName(firstName);
    lastName = validation.checkLastName(lastName);
    email = validation.checkEmail(email);
    gender = validation.checkString(gender);
    city = validation.checkString(city);
    state = validation.checkString(state);
    age = validation.checkNumber(age);
    balance = validation.checkAmount(balance);

    const usersCollection = await users();
    const usersCol = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (usersCol === null) throw "No user with that id";

    if(usersCol.email !== email){
      const existingUser = await usersCollection.findOne({email:email});
      if(existingUser) {
        throw `A user with the email already exists.`;
      }
    }

    if (parseInt(age) < 13) {
      throw `Users must be at least 13 years old to sign up.`;
    }

    const userUpdateInfo = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      gender: gender.trim(),
      city: city.trim(),
      state: state.trim(),
      age: parseInt(age),
      password: usersCol.password,
      categories: usersCol.categories,
      fixedExpenses: usersCol.fixedExpenses,
      balance: parseFloat(balance),
    };

    const updateInfo = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: userUpdateInfo },
      { returnOriginal: false }
    );


    return true;
  },
  async addCategoryById(userID, newCategory) {
    userID = validation.checkId(userID);
    newCategory = validation.checkString(newCategory);

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userID) });
    if (!user) throw "User not found";

    // Check for duplicates
    if (user.categories.includes(newCategory.trim())) {
      throw `Error: Category '${newCategory}' already exists`;
    }

    const updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userID) },
      { $push: { categories: newCategory.trim() } },
      { returnDocument: "after" }
    );

    return true;
  },
  async deleteCategoryById(userID, categoryToDelete) {
    userID = validation.checkId(userID);
    categoryToDelete = validation.checkString(categoryToDelete).trim();

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userID) });
    if (!user) throw "User not found";

    if (!user.categories.includes(categoryToDelete.trim())) {
      throw `Error: Category '${categoryToDelete}' not found`;
    }

    const updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userID) },
      { $pull: { categories: categoryToDelete } },
      { returnDocument: "after" }
    );
    return true;
  },
  async addFixedExpensesById(userID, title, category, amount) {
    userID = validation.checkId(userID);
    title = validation.checkString(title).trim();
    category = validation.checkString(category).trim();
    amount = validation.checkAmount(amount);

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userID) });
    if (!user) throw "User not found";

    if (!user) {
      console.error("User not found with ID:", userID);
    }

    if (!user) {
      console.error("User not found with ID:", userID);
    }

    const newFixedExpense = {
      _id: new ObjectId(),
      title: title.trim(),
      category: category.trim(),
      amount: parseFloat(amount),

    };

    console.log("Inserting fixed expense:", newFixedExpense);

    const updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userID) },
      { $push: { fixedExpenses: newFixedExpense } },
      { returnDocument: "after" }
    );

    return newFixedExpense;
  },
  async deleteFixedExpenseById(userID, expenseID) {
    userID = validation.checkId(userID);
    expenseID = validation.checkId(expenseID);

    const userCollection = await users();

    const updateResult = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userID) },
      {
        $pull: {
          fixedExpenses: { _id: new ObjectId(expenseID) },
        },
      },
      { returnDocument: "after" }
    );
    return updateResult.value;
  },
  async updateFixedExpenseById(userID, expenseID, title, category, amount) {
    
    userID = validation.checkId(userID);
    expenseID = validation.checkId(expenseID);
    title = validation.checkString(title).trim();
    category = validation.checkString(category).trim();
    amount = parseFloat(validation.checkAmount(amount));


    const userCollection = await users();


    const updateResult = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userID),
        "fixedExpenses._id": new ObjectId(expenseID),
      },
      {
        $set: {
          "fixedExpenses.$.title": title,
          "fixedExpenses.$.category": category,
          "fixedExpenses.$.amount": amount,
        },

      },
      { returnDocument: "after" }
    );

    return true;
  },

};
export default exportedMethods;
