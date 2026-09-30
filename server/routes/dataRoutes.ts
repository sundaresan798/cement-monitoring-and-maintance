/**
 * Industrial Telemetry & Operations Data Routes
 * 
 * Protected endpoints for cement plant monitoring.
 * Enforces JWT authentication and RBAC roles:
 * - Admin: Full read/write access
 * - Plant Manager: Read monitoring, write maintenance and production
 * - Operator: Read monitoring, update permitted operational data
 */

import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// Apply authMiddleware to all operational endpoints
router.use(authMiddleware as any);

/**
 * @route   GET /api/dashboard
 * @desc    Get aggregated plant overview & KPIs
 * @access  Private (All authenticated roles)
 */
router.get('/dashboard', (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Aggregated SCADA dashboard telemetry',
    userRole: req.user?.role
  });
});

/**
 * @route   GET /api/kiln
 * @desc    Get live rotary kiln telemetry
 * @access  Private (All authenticated roles)
 */
router.get('/kiln', (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Kiln telemetry retrieved successfully'
  });
});

/**
 * @route   POST /api/kiln
 * @desc    Update kiln operational parameters
 * @access  Private (admin, plant_manager, operator)
 */
router.post('/kiln', authorizeRoles('admin', 'plant_manager', 'operator') as any, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Kiln operational parameters updated',
    updatedBy: req.user?.name
  });
});

/**
 * @route   GET /api/energy
 * @desc    Get energy consumption records
 * @access  Private (All authenticated roles)
 */
router.get('/energy', (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Energy records retrieved successfully'
  });
});

/**
 * @route   GET /api/materials
 * @desc    Get raw material inventory
 * @access  Private (All authenticated roles)
 */
router.get('/materials', (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Raw material inventory retrieved'
  });
});

/**
 * @route   POST /api/materials
 * @desc    Add raw material stock
 * @access  Private (admin, plant_manager, operator)
 */
router.post('/materials', authorizeRoles('admin', 'plant_manager', 'operator') as any, (req: AuthRequest, res: Response) => {
  res.status(201).json({
    success: true,
    message: 'Raw material entry recorded'
  });
});

/**
 * @route   GET /api/maintenance
 * @desc    Get equipment maintenance records
 * @access  Private (admin, plant_manager, operator)
 */
router.get('/maintenance', (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Maintenance records retrieved'
  });
});

/**
 * @route   POST /api/maintenance
 * @desc    Create maintenance work order
 * @access  Private (admin, plant_manager only)
 */
router.post('/maintenance', authorizeRoles('admin', 'plant_manager') as any, (req: AuthRequest, res: Response) => {
  res.status(201).json({
    success: true,
    message: 'Maintenance work order created',
    scheduledBy: req.user?.name
  });
});

/**
 * @route   GET /api/production
 * @desc    Get production KPIs
 * @access  Private (All authenticated roles)
 */
router.get('/production', (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Production KPI data retrieved'
  });
});

/**
 * @route   POST /api/production
 * @desc    Update production targets & shifts
 * @access  Private (admin, plant_manager only)
 */
router.post('/production', authorizeRoles('admin', 'plant_manager') as any, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Production targets updated',
    modifiedBy: req.user?.name
  });
});

export default router;
