import React, { useState } from 'react';
import { MaintenanceRecord, EquipmentStatus, MaintenancePriority, EquipmentType } from '../types';
import { Badge, BadgeVariant } from '../components/common/Badge';
import {
  Wrench,
  Plus,
  Edit2,
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface MaintenancePageProps {
  maintenanceList: MaintenanceRecord[];
  onUpdateRecord: (record: MaintenanceRecord) => void;
  onAddRecord: (record: MaintenanceRecord) => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  maintenanceList,
  onUpdateRecord,
  onAddRecord
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({});

  const filtered = filterStatus === 'ALL'
    ? maintenanceList
    : maintenanceList.filter((m) => m.currentStatus === filterStatus);

  const getStatusBadge = (status: EquipmentStatus): BadgeVariant => {
    switch (status) {
      case 'OPERATIONAL':
        return 'success';
      case 'MAINTENANCE DUE':
        return 'warning';
      case 'UNDER MAINTENANCE':
        return 'danger';
    }
  };

  const getPriorityBadge = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-950/70 text-rose-300 border-rose-800';
      case 'MEDIUM':
        return 'bg-amber-950/70 text-amber-300 border-amber-800';
      case 'LOW':
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleOpenEdit = (rec: MaintenanceRecord) => {
    setFormData(rec);
    setIsNew(false);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setFormData({
      id: `MNT-${Date.now().toString().slice(-4)}`,
      equipmentName: 'Conveyor',
      equipmentTag: 'CNV-04',
      currentStatus: 'MAINTENANCE DUE',
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      nextMaintenanceDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      maintenanceType: 'Preventive',
      priority: 'MEDIUM',
      assignedTechnician: 'Mechanical Maintenance Team',
      downtimeHoursEstimate: 2.0,
      notes: ''
    });
    setIsNew(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentName) return;

    const payload = formData as MaintenanceRecord;
    if (isNew) {
      onAddRecord(payload);
    } else {
      onUpdateRecord(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Plant Asset Management
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Equipment Maintenance & Preventive Schedules
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Track work orders, scheduled inspections, overhaul downtimes, and equipment availability across 6 primary cement manufacturing nodes.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Maintenance
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {['ALL', 'OPERATIONAL', 'MAINTENANCE DUE', 'UNDER MAINTENANCE'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === st
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {st} ({st === 'ALL' ? maintenanceList.length : maintenanceList.filter((m) => m.currentStatus === st).length})
          </button>
        ))}
      </div>

      {/* Equipment Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {item.equipmentName}
                    </h3>
                    <span className="font-mono text-xs text-amber-400 font-semibold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {item.equipmentTag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {item.maintenanceType} Service · Assigned: {item.assignedTechnician}
                  </div>
                </div>

                <Badge variant={getStatusBadge(item.currentStatus)}>
                  {item.currentStatus}
                </Badge>
              </div>

              {/* Maintenance Dates */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">
                    Last Maintained
                  </span>
                  <span className="text-slate-300 font-medium">
                    {item.lastMaintenanceDate}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">
                    Next Due Date
                  </span>
                  <span className="text-amber-400 font-medium">
                    {item.nextMaintenanceDate}
                  </span>
                </div>
              </div>

              {/* Priority & Downtime */}
              <div className="flex items-center justify-between mt-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Priority:</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getPriorityBadge(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>

                <div className="text-slate-400 font-mono text-[11px]">
                  Est. Downtime: <strong className="text-white font-medium">{item.downtimeHoursEstimate}h</strong>
                </div>
              </div>

              {/* Engineering Notes */}
              {item.notes && (
                <div className="mt-3 p-2.5 rounded bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5 font-semibold">
                    Technician Notes:
                  </span>
                  {item.notes}
                </div>
              )}
            </div>

            {/* Action */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => handleOpenEdit(item)}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Work Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isNew ? 'New Maintenance Work Order' : `Edit ${formData.equipmentName} (${formData.equipmentTag})`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Equipment Node</label>
                  <select
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value as EquipmentType })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="Kiln">Kiln (Rotary Pyroprocessing)</option>
                    <option value="Crusher">Crusher (Primary Hammer)</option>
                    <option value="Conveyor">Conveyor (Belt Transport)</option>
                    <option value="Raw Mill">Raw Mill (Vertical Roller Mill)</option>
                    <option value="Cement Mill">Cement Mill (Ball Mill)</option>
                    <option value="Packing Machine">Packing Machine (Rotary Packer)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Equipment Tag</label>
                  <input
                    type="text"
                    required
                    value={formData.equipmentTag || ''}
                    onChange={(e) => setFormData({ ...formData, equipmentTag: e.target.value })}
                    placeholder="e.g. KLN-01, RM-VRM-01"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Current Status</label>
                  <select
                    value={formData.currentStatus}
                    onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value as EquipmentStatus })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="MAINTENANCE DUE">MAINTENANCE DUE</option>
                    <option value="UNDER MAINTENANCE">UNDER MAINTENANCE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as MaintenancePriority })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Next Maintenance Date</label>
                  <input
                    type="date"
                    required
                    value={formData.nextMaintenanceDate || ''}
                    onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Assigned Technician</label>
                  <input
                    type="text"
                    required
                    value={formData.assignedTechnician || ''}
                    onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
                    placeholder="e.g. John Doe (Mechanical Lead)"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Work Order / Inspection Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe scope of work, wear measurements, or replacement parts..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/10"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
