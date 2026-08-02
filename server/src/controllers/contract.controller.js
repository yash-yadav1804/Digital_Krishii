const asyncHandler = require("../utils/asyncHandler");

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

const getTemplates = asyncHandler(async (req, res) => {
  const templates = await getActiveContractTemplates();

  res.status(200).json({
    success: true,
    count: templates.length,
    data: templates,
  });
});

const getTemplateById = asyncHandler(async (req, res) => {
  const template = await getContractTemplateById(req.params.id);

  res.status(200).json({
    success: true,
    data: template,
  });
});

const createRequest = asyncHandler(async (req, res) => {
  const contractRequest = await createContractRequest(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Contract request created successfully",
    data: contractRequest,
  });
});

const getSentRequests = asyncHandler(async (req, res) => {
  const requests = await getMySentContractRequests(req.user.id);

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

const getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await getMyReceivedContractRequests(req.user.id);

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await getContractRequestById(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    data: request,
  });
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await updateContractRequestStatus(
    req.params.id,
    req.user.id,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "Contract request status updated successfully",
    data: request,
  });
});

const cancelRequest = asyncHandler(async (req, res) => {
  const request = await cancelContractRequest(
    req.params.id,
    req.user.id,
    req.body.reason,
  );

  res.status(200).json({
    success: true,
    message: "Contract request cancelled successfully",
    data: request,
  });
});

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
