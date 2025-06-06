import {ObjectId} from 'mongodb';

const exportedMethods = {
  checkId(id) {
    if (!id) throw `You must provide a input`;
    if (typeof id !== "string") throw `Input must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Input cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Input invalid object ID`;
    return id;
  },

  checkFirstName(firstName){
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      throw 'You must provide a valid firstName to search.';
    }
  
    if(!(firstName.trim().match(/^[a-zA-Z]+$/))) throw `Your firstName must only contain letters.`;
  
    if(firstName.trim().length<2 || firstName.trim().length>20 ) throw `Your firstName should be more than 2 and less than 20 characters`  
    
    return firstName.trim();
  },
  checkLastName(lastName){
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      throw 'You must provide a valid lastName to search.';
    }
    if(!(lastName.trim().match(/^[a-zA-Z]+$/))) throw `Your lastName must only contain letters.`;
  
    if(lastName.trim().length<2 || lastName.trim().length>20 ) throw `Your lastName should be more than 2 and less than 20 characters`  
    
    return lastName.trim();
  },
  checkString(strVal) {
    //trims
    if (!strVal) throw `  You must supply an input!`;
    if (typeof strVal !== "string") throw `  input must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `  input cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `  ${strVal} is not a valid value for input as it only contains digits.`;
    return strVal;
  },
  checkAmount(amount) {
    let stringamount = amount;
    if (!amount) throw `  You must supply an amount`;
    if (typeof stringamount !== "string")
      throw `  Inputted amount should be a string.`;
    amount = amount.trim();
    if (amount.length === 0) {
      throw `  Given amount cannot be an empty string or string with just spaces.`;
    }

    //checking if all numerical or .
    let decimalPoints = 0;
    let amountArray = amount.split("");
    if (
      !amountArray.every((char) => {
        if (char.charCodeAt(0) == 46) decimalPoints = decimalPoints + 1;
        return (
          (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) ||
          char.charCodeAt(0) == 46
        );
      })
    )
      throw "  Invalid characters in amount. There should only be numbers and . for a decimal place.";

    if (decimalPoints > 1)
      throw "  There should only be 1 or none decimal points.";

    // make sure format is correct
    amount = parseFloat(amount);
    if (isNaN(amount)) throw `  amount cannot be converted to a decimal.`;
    if (decimalPoints == 1) {
      if (stringamount.split(".")[1].length > 2)
        throw "  Amount must be 2 decimals places or less.";
    }

    return amount;
  },
  checkDate(date) {
    if (!date) throw `  You must supply a date`;
    if (typeof date !== "string")
      throw `  Inputted date should be a string.`;
    date = date.trim();
    if (date.length === 0) {
      throw `  Given date cannot be an empty string or string with just spaces.`;
    }

    let dateSplit = date.split("/");
    if (dateSplit.length < 3) throw "  Incorrect date format";
    if (
      dateSplit[0].length != 2 ||
      dateSplit[1].length != 2 ||
      dateSplit[2].length != 4
    )
      throw "  Date format should be mm/dd/yyyy";
    if (parseInt(dateSplit[0]) < 1 || parseInt(dateSplit[0]) > 12)
      throw "  Month should be between 1 and 12 inclusive.";

    //make sure date is only for today and before
    if (parseInt(dateSplit[2]) > new Date().getFullYear())
      throw "  Year should be before " + new Date().getFullYear();

    if (
      (parseInt(dateSplit[2]) == new Date().getFullYear() &&
        parseInt(dateSplit[0]) > new Date().getMonth() + 1) ||
      (parseInt(dateSplit[2]) == new Date().getFullYear() &&
        parseInt(dateSplit[0]) == new Date().getMonth() + 1 &&
        parseInt(dateSplit[1]) > new Date().getDate())
    )
      throw "  Date must be today or a date before.";

    let days = {
      "01": "31",
      "02": "28",
      "03": "31",
      "04": "30",
      "05": "31",
      "06": "30",
      "07": "31",
      "08": "31",
      "09": "30",
      10: "31",
      11: "30",
      12: "31",
    };

    if (!(parseInt(dateSplit[1]) <= parseInt(days[dateSplit[0]])))
      throw "  Invalid day for dateReleased";

    return date;
  },
  //checks if string is all numerical
  checkNumber(input) {
    if (!input) throw `  You must supply an input`;
    if (typeof input !== "string") throw `  Input should be a string.`;
    input = input.trim();
    if (input.length === 0) {
      throw `  Given date cannot be an empty string or string with just spaces.`;
    }
    let inputArr = input.split("");
    if (
      !inputArr.every((char) => {
        return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;
      })
    ) {
      throw "  Invalid characters in input. There should only be numbers.";
    }
    return input;
  },
  //checks if a password passes restrictions
  checkPassword(password) {
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      throw "You must provide a valid password to search.";
    }
    if (password.trim().length != password.length)
      throw ` Your password shouldn't contain spaces.`;
    if (password.trim().length < 8)
      throw `Your password must be at least 8 characters`;
    if (!/[A-Z]/.test(password)) {
      throw `Your password must contain at least one uppercase letter.`;
    }
    if (!/[0-9]/.test(password)) {
      throw `Your password must contain at least one number.`;
    }
    if (!/[!@#$%^&*(),.?":{}|<>[\]\\;'/\-=_+`~]/.test(password)) {
      throw `Your password must contain at least one special character.`;
    }

    return password.trim();
  },
  //checks if its a valid email address
  checkEmail(email) {
    if (!email) throw `  You must provide an email.`;
    if (typeof email !== "string") throw `  Email must be a string.`;

    email = email.trim().toLowerCase();
    if (email.length === 0)
      throw `  Email cannot be an empty string or just spaces.`;

    // This regex matches most real-world emails
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) throw `  Invalid email format.`;

    return email;
  },
  //gets the current month so the dropdown doesnt let the user pick a date past today
  getMonthYearForFormMax() {
    let year = this.getCurrentYear();
    let month = this.getCurrentMonth();

    return year + "-" + month;
  },
  //gets the current date so the dropdown doesnt let the user pick a date past today
  getFullDateForFormMax() {
    let date = new Date();
    let partialDate = this.getMonthYearForFormMax();
    let day =
      date.getDate().toString().length < 2
        ? "0" + date.getDate().toString()
        : date.getDate().toString();

    return partialDate + "-" + day;
  },
   //gets current month as string
   getCurrentMonth() {
    let date = new Date();
    let month =
      date.getMonth().toString().length < 2
        ? "0" + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString();
    return month;
  },

  //gets current year as string
  getCurrentYear() {
    let date = new Date();
    let year = date.getFullYear().toString();
    return year;
  },

  checkYear(input) {
    if (!input) throw `  You must supply a year`;
    if (typeof input !== "string") {input = input.toString()};
    input = input.trim();
    if (input.length === 0) {
      throw `  Given year cannot be an empty string or string with just spaces.`;
    }
    let regex = /^[0-9]{4}$/;
    if (!(regex.test(input))) throw `invalid year: ${input}`;
    const date = new Date();
    input = parseInt(input);
    if (input > date.getFullYear() || input < 2000) throw `invalid year[2000-current]: ${input}`; //year in the future 
    return input;
  },  

  checkTotalPerCategory(input, categoryList) {
    if (!input) throw '  You must supply a year';
    if (typeof input !== 'object' || Array.isArray(input) || input === null) throw `must provide a valid object`;
    let categories = Object.keys(input);
    let amounts = Object.values(input);
    //check each amount is a number 
    for (amt in amounts) {
      checkAmount(amt);
    }

  },

  checkObject(input) {
    if (typeof input !== 'object' || Array.isArray(input) || input === null) throw `must provide a valid object`;
    return input;
  },

  //the input for the input="date" is YYYY/MM/DD so we need to flip it
  //flips from YYYY-MM-DD to MM/DD/YYYY
  flipDate(date) {
    if (!date) throw `  You must supply a date`;
    if (typeof date !== "string")
      throw `  Inputted date should be a string.`;
    date = date.trim();
    if (date.length === 0) {
      throw `  Given date cannot be an empty string or string with just spaces.`;
    }

    let dateSplit = date.split("-");
    if (dateSplit.length < 3) throw "  Incorrect date format";
    if (
      dateSplit[0].length != 4 ||
      dateSplit[1].length != 2 ||
      dateSplit[2].length != 2
    )
      throw "  Date format should be yyyy/mm/dd";

    return dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0];
  },

  //changes date format from MM/DD/YYYY -> YYYY-MM-DD
  unflipDate(date) {
    if (!date) throw `  You must supply a date`;
    if (typeof date !== "string")
      throw `  Inputted date should be a string.`;
    date = date.trim();
    if (date.length === 0) {
      throw `  Given date cannot be an empty string or string with just spaces.`;
    }

    let dateSplit = date.split("/");
    if (dateSplit.length < 3) throw "  Incorrect date format";
    if (
      dateSplit[0].length != 2 ||
      dateSplit[1].length != 2 ||
      dateSplit[2].length != 4
    )
      throw "  Date format is incorrect";

    return dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];
  },

  // mm/dd/yyyy
  checkDate(date) {
    if (!date) throw `  You must supply a date`;
    if (typeof date !== "string")
      throw `  Inputted date should be a string.`;
    date = date.trim();
    if (date.length === 0) {
      throw `  Given date cannot be an empty string or string with just spaces.`;
    }

    let dateSplit = date.split("/");
    if (dateSplit.length < 3) throw "  Incorrect date format";
    if (
      dateSplit[0].length != 2 ||
      dateSplit[1].length != 2 ||
      dateSplit[2].length != 4
    )
      throw "  Date format should be mm/dd/yyyy";
    if (parseInt(dateSplit[0]) < 1 || parseInt(dateSplit[0]) > 12)
      throw "  Month should be between 1 and 12 inclusive.";

    //make sure date is only for today and before
    if (parseInt(dateSplit[2]) > new Date().getFullYear())
      throw "  Year should be before " + new Date().getFullYear();

    if (
      (parseInt(dateSplit[2]) == new Date().getFullYear() &&
        parseInt(dateSplit[0]) > new Date().getMonth() + 1) ||
      (parseInt(dateSplit[2]) == new Date().getFullYear() &&
        parseInt(dateSplit[0]) == new Date().getMonth() + 1 &&
        parseInt(dateSplit[1]) > new Date().getDate())
    )
      throw "  Date must be today or a date before.";

    let days = {
      "01": "31",
      "02": "28",
      "03": "31",
      "04": "30",
      "05": "31",
      "06": "30",
      "07": "31",
      "08": "31",
      "09": "30",
      10: "31",
      11: "30",
      12: "31",
    };

    if (!(parseInt(dateSplit[1]) <= parseInt(days[dateSplit[0]])))
      throw "  Invalid day for dateReleased";

    return date;
  },
  
};

export default exportedMethods;