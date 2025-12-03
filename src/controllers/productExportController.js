import * as productModel from "../models/productModel.js";
import {
  formatToJSON,
  formatToXML,
  formatToCSV,
  getContentType,
  getFileExtension,
} from "../utils/exportFormatter.js";

/**
 * Export products with all related data
 * @route GET /api/products/export
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const exportProducts = async (req, res) => {
  try {
    const format = (req.query.format || "json").toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Default to 1000 for export
    const skip = (page - 1) * limit;

    // Validate format
    const validFormats = ["json", "xml", "csv"];
    if (!validFormats.includes(format)) {
      return res.error(
        `Invalid format. Must be one of: ${validFormats.join(", ")}`,
        400
      );
    }

    // Build filters from query params
    const filters = {};
    if (req.query.search) filters.search = req.query.search;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.categoryId) filters.categoryId = req.query.categoryId;
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;

    // Get products with all relations
    const [products, total] = await productModel.findAll(skip, limit, filters);

    if (!products || products.length === 0) {
      return res.error("No products found to export", 404);
    }

    // Format data based on requested format
    let formattedData;
    try {
      switch (format) {
        case "json":
          formattedData = formatToJSON(products);
          break;
        case "xml":
          formattedData = formatToXML(products);
          break;
        case "csv":
          formattedData = await formatToCSV(products);
          break;
        default:
          formattedData = formatToJSON(products);
      }
    } catch (formatError) {
      return res.error(
        `Error formatting data: ${formatError.message}`,
        500
      );
    }

    // Set appropriate headers for file download
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `products-export-${timestamp}.${getFileExtension(format)}`;

    res.setHeader("Content-Type", getContentType(format));
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Total-Count", total.toString());
    res.setHeader("X-Page", page.toString());
    res.setHeader("X-Limit", limit.toString());

    // Send formatted data
    res.send(formattedData);
  } catch (error) {
    console.error("Export error:", error);
    return res.error(
      `Failed to export products: ${error.message}`,
      500
    );
  }
};
