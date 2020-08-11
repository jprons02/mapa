//Validates the number inputed. Only accepts numbers.
const validateNumber = (number) => {
  if (number === "") {
    return true;
  } else if (parseFloat(number) === 0) {
    return false;
  } else {
    //Need to keep == in stead of === so you can compare string number to int number.
    //If you parseInt a non number you get NaN.
    //If you parseInt(123aaa) you will get 123.
    const numberInt = parseFloat(number);
    if (number == numberInt) {
      if (isNaN(numberInt)) {
        return false;
      } else {
        return true;
      }
    }
  }
};

export default validateNumber;
