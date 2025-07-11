var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({
    message: "CMS API",
    available_routes: {
      "/documents": "Documents Route",
      "/messages": "Messages Route",
      "/contacts": "Contacts Route",
    },
  });
});

module.exports = router;
