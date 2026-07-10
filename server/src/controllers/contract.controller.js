const {
  getActiveContractTemplates,
  getContractTemplateById,
  createContractRequest,
  getMySentContractRequests,
  getMyReceivedContractRequests,
  getContractRequestById,
  updateContractRequestStatus,
  cancelContractRequest,
} = require("../services/contract.service");

const getErrorStatusCode = (message) => {
  if (message.includes("not found")) return 404;
  if (message.includes("own")) return 403;
  if (message.includes("only")) return 403;
  if (message.includes("not available")) return 409;
  return 400;
};

const getTemplates = async (req, res) => {
  try {
    const templates = await getActiveContractTemplates();

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const template = await getContractTemplateById(req.params.id);

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const createRequest = async (req, res) => {
  try {
    const request = await createContractRequest(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Contract request created successfully",
      data: request,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const requests = await getMySentContractRequests(req.user.id);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await getMyReceivedContractRequests(req.user.id);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await getContractRequestById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const request = await updateContractRequestStatus(
      req.params.id,
      req.user.id,
      req.body.status,
    );

    res.status(200).json({
      success: true,
      message: "Contract request updated successfully",
      data: request,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const request = await cancelContractRequest(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Contract request cancelled successfully",
      data: request,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
};
