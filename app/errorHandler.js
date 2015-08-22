const handleError = (obj, error) => {
  console.log(`ERROR: ${error.message}`);
  switch (error.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut();
      break;

    default:
      alert(error.message); // eslint-disable-line
  }
};
export default handleError;