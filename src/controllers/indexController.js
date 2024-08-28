const Hello = (req, res) => {
  try {
    return res.status(200).json(
        {
          EM: 'Hello successfully',
          EC: '0',
          DT: ''
        }
      );
  } catch (error) {
    return res.status(500).json(
        {
          EM: 'Internal Server Error',
          EC: '-1',
          DT: ''
        }
      );
  }
};

module.exports = {
  Hello,
};
