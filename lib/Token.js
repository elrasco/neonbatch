const app_tokens = ["1818338545123865|tbo0D8DHR16LM5sCqQ87K_4WjlY", "1469389876476930|sAOqnY7VbSjKNikXCw3cFvqcHBw", "287518918415375|XthcEDlZtDlJNj2BfkGKoMp4bnA"];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
  page_access_token: "1469389876476930|sAOqnY7VbSjKNikXCw3cFvqcHBw",
  access_token:
    "EAAU4ZAv2fvAIBAAOnkc9u2cZBCbSJHZAIbufI1D23CYd4q0TWFWIC8mgevj3Lze8sv5nhZBYHqmRnvagTuXZA5yXXmDOGpW5xpvTBWV6e9gkarxfKiandF9k5j2plLFCKcttYZBEZCt1VNsdBwDta4TFlWA3ZAAGne8ZD",
  getAppAccessToken: () => app_tokens[getRandomInt(0, app_tokens.length)]
};
