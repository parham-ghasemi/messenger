
const validatePhoneNumber = (phoneNumber: string) => {
  // Define regular expressions for Latin and Persian numerals
  const latinRegex = /^09\d{9}$/;
  const persianRegex = /^۰۹[۰-۹]{9}$/;

  // Function to convert Persian numerals to Latin numerals
  const convertPersianToLatin = (input: string): string => {
    const persianToLatinMap: { [key: string]: string } = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
    };
    return input.replace(/[۰-۹]/g, (char) => persianToLatinMap[char]);
  };

  // Check if the phoneNumber number matches either pattern
  if (latinRegex.test(phoneNumber) || persianRegex.test(phoneNumber)) {
    return true;
  }

  // Convert Persian numerals to Latin numerals and validate
  const convertedphoneNumber = convertPersianToLatin(phoneNumber);
  return latinRegex.test(convertedphoneNumber);
}

export default validatePhoneNumber