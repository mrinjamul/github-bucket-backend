var express = require("express");
var router = express.Router();

const constants = require("../../constants");

const config = require("../../config").getConfig();

const tokenGenerator = require("../../helpers/token");

const {
  GetTokens,
  CreateToken,
  DelteAllToken,
  DeleteTokenByID,
} = require("../../controllers/tokens");
const authenticated = require("../../middlewares/authenticated");

router.get("/list", authenticated("user"), async (req, res) => {
  // list all tokens and who it is belongs to
  const user = req.user;
  var tokens;
  if (user.role == "admin") {
    tokens = await GetTokens(req);
  } else {
    tokens = await GetTokens(req, user.username);
  }
  res.status(constants.http.StatusOK).json({
    status: true,
    data: tokens,
  });
});

router.post("/generate", authenticated("admin"), async (req, res) => {
  const { scope, expireIn } = req.body;

  const user = req.user;

  if (!scope) {
    return res
      .status(constants.http.StatusBadRequest)
      .json({ error: "Scope is missing" });
    return;
  }
  const permissions = scope.split(",");
  // generate token to access endpoints
  const token = await tokenGenerator.generateToken(
    permissions,
    expireIn,
    user.username
  );
  const tokenDB = await CreateToken(req, user.username, token, expireIn);
  console.log(tokenDB);
  res.status(constants.http.StatusOK).json({
    status: true,
    data: tokenDB,
  });
});

router.delete("/:id", authenticated("admin"), async (req, res) => {
  const id = req.params.id;
  const resp = await DeleteTokenByID(id);
  if (!resp) {
    return res
      .status(constants.http.StatusInternalServerError)
      .json({ error: "failed to delete" });
    return;
  }
  res.status(constants.http.StatusOK).json({
    status: true,
    data: resp,
  });
});

router.get("/prune", authenticated("admin"), async (req, res) => {
  const resp = await DelteAllToken();
  if (!resp) {
    return res
      .status(constants.http.StatusInternalServerError)
      .json({ error: "failed to delete" });
    return;
  }
  res.status(constants.http.StatusOK).json({
    status: true,
    data: resp,
  });
});

module.exports = router;
