const Hello = (req, res) => {
  try {
    return res.status(200).json(
        {
          EM: 'Server is living ',
          EC: '0',
          DT: ''
        }
      );
  } catch (error) {
    return res.status(500).json(
        {
          EM: 'Internal Server Error',
          EC: '-1',
          DT: error
        }
      );
  }
};

module.exports = {
  Hello,
};
