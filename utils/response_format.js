const successReponse = (data) => {
  return {
    success: true,
    data: data,
  };
};

const errorResponse = (statusCode, message) => {
  return {
    success: false,
    error: {
      code: statusCode,
      message: message,
    },
  };
};

export { successReponse, errorResponse };
