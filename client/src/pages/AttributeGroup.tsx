import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
} from "lucide-react";

import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationBar } from "@/components/app/PaginationBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/app/PageLayout";
import { FilterPanel } from "@/components/app/FilterPanel";
import { DataTable } from "@/components/app/DataTable";
import { EntityDialog } from "@/components/app/EntityDialog";
import Loading from "@/components/app/loading";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";
import { MultiSelectType } from "@/components/app/multiselect-type";

import type AttributeGroup from "@/interfaces/attributeGroup.interface";
import type AttributeSet from "@/interfaces/attributeSet.interface";
import type Attribute from "@/interfaces/attribute.interface";
import type { AttributeGroupFilters } from "@/interfaces/attributeGroup.filters.interface";

import { useAttributeGroups } from "@/hooks/useAttributeGroups";
import { useAttributeSets } from "@/hooks/useAttributeSets";
import { useAttributes } from "@/hooks/useAttributes";
import { AttributeGroupService } from "@/services/attributeGroup.service";

export default function AttributeGroupPage() {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialAttributeSetId = queryParams.get("attributeSetId") || "";

  const limit = 10;

  const [filters, setFilters] = useState<AttributeGroupFilters>({
    search: "",
    attributeSetId: initialAttributeSetId,
    sortBy: "sortOrder",
    sortOrder: "asc",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [groups, groupsLoading, groupsError, groupsTotalPages, refetchGroups] =
    useAttributeGroups(currentPage, limit, filters);
  const [attributeSets, attributeSetsLoading] = useAttributeSets(1, 100);
  const [attributes, attributesLoading, attributesError] = useAttributes<Attribute>(1, 200);

  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);

  const [editingGroup, setEditingGroup] = useState<AttributeGroup | null>(null);
  const [viewGroup, setViewGroup] = useState<AttributeGroup | null>(null);
  const [groupIdToDelete, setGroupIdToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    attributeSetId: "",
    code: "",
    label: "",
    sortOrder: 0,
  });

  const [attributeSelection, setAttributeSelection] = useState<string[]>([]);

  const isLoading = groupsLoading || attributeSetsLoading || attributesLoading;
  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowPageLoader(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (groupsError) {
      toast.error(`Failed to load attribute groups: ${groupsError.message}`);
    }
  }, [groupsError]);

  useEffect(() => {
    if (attributesError) {
      toast.error(`Failed to load attributes: ${attributesError.message}`);
    }
  }, [attributesError]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= groupsTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof AttributeGroupFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters: AttributeGroupFilters = {
      search: "",
      attributeSetId: "",
      sortBy: "sortOrder",
      sortOrder: "asc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setFormData({
      attributeSetId: filters.attributeSetId || "",
      code: "",
      label: "",
      sortOrder: 0,
    });
  };

  if (showPageLoader && isLoading) {
    return <Loading />;
  }

  const handleCreateGroup = async () => {
    if (!formData.attributeSetId) {
      toast.error("Please select an attribute set");
      return;
    }

    try {
      const created = await AttributeGroupService.create({
        attributeSetId: Number(formData.attributeSetId),
        code: formData.code,
        label: formData.label,
        sortOrder: formData.sortOrder,
      });

      // Sync selected attributes for the newly created group
      if (attributeSelection.length > 0 && created?.data) {
        const group = created.data as AttributeGroup;
        const setId = group.attributeSet?.id;

        if (setId) {
          for (let index = 0; index < attributeSelection.length; index++) {
            const id = attributeSelection[index];
            await AttributeGroupService.addAttributeToGroup(
              setId,
              group.id,
              Number(id),
              index
            );
          }
        }
      }

      await refetchGroups();
      toast.success("Attribute group created successfully");
      setShowCreateDialog(false);
      resetForm();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create attribute group: ${error.message}`);
    }
  };

  const handleEditGroup = async () => {
    if (!editingGroup) return;

    const newAttributeSetId = Number(
      formData.attributeSetId || editingGroup.attributeSet?.id || 0
    );
    const isAttributeSetChanged =
      !!editingGroup.attributeSet &&
      editingGroup.attributeSet.id !== newAttributeSetId;

    try {
      await AttributeGroupService.update(editingGroup.id, {
        attributeSetId: newAttributeSetId || undefined,
        code: formData.code,
        label: formData.label,
        sortOrder: formData.sortOrder,
      });

      // Sync attributes for existing group using diff between
      // current DB state and attributeSelection
      if (!isAttributeSetChanged && editingGroup.attributeSet) {
        const setId = newAttributeSetId || editingGroup.attributeSet.id;
        const groupId = editingGroup.id;
        const currentAttributes = editingGroup.groupAttributes || [];
        const currentIds = currentAttributes.map((ga) => ga.attributeId.toString());

        const addedIds = attributeSelection.filter((id) => !currentIds.includes(id));
        const removed = currentAttributes.filter(
          (ga) => !attributeSelection.includes(ga.attributeId.toString())
        );

        for (const id of addedIds) {
          const sortOrder = attributeSelection.indexOf(id);
          await AttributeGroupService.addAttributeToGroup(
            setId,
            groupId,
            Number(id),
            sortOrder
          );
        }

        for (const rel of removed) {
          await AttributeGroupService.removeAttributeFromGroup(
            setId,
            groupId,
            rel.id
          );
        }
      }

      await refetchGroups();
      toast.success("Attribute group updated successfully");
      setShowEditDialog(false);
      setEditingGroup(null);
      resetForm();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update attribute group: ${error.message}`);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      await AttributeGroupService.remove(id);
      await refetchGroups();
      toast.success("Attribute group deleted successfully");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete attribute group: ${error.message}`);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setAttributeSelection([]);
    setShowCreateDialog(true);
  };

  const openEditDialog = (group: AttributeGroup) => {
    setEditingGroup(group);
    setFormData({
      attributeSetId: group.attributeSet ? group.attributeSet.id.toString() : filters.attributeSetId || "",
      code: group.code,
      label: group.label,
      sortOrder: group.sortOrder,
    });
    const currentAttributes = group.groupAttributes || [];
    setAttributeSelection(currentAttributes.map((ga) => ga.attributeId.toString()));
    setShowEditDialog(true);
  };

  const openViewDialog = (group: AttributeGroup) => {
    setViewGroup(group);
    setShowViewDialog(true);
  };

  const renderAttributeSetSelect = (
    value: string,
    onChange: (val: string) => void
  ) => {
    if (!attributeSets) return null;

    return (
      <Select
        value={value || ""}
        onValueChange={(val) => onChange(val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select attribute set" />
        </SelectTrigger>
        <SelectContent>
          {attributeSets.map((set: AttributeSet) => (
            <SelectItem key={set.id} value={set.id.toString()}>
              {set.label} ({set.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderAttributeMultiSelect = () => {
    if (!attributes) return null;

    const options = attributes.map((attribute) => ({
      name: attribute.label || attribute.code,
      value: attribute.id.toString(),
    }));

    return (
      <MultiSelectType
        initialValue={attributeSelection}
        options={options}
        onValueChange={(values) => {
          setAttributeSelection(values);
        }}
      />
    );
  };

  return (
    <PageLayout
      title="Attribute Groups"
      actions={
        <Button onClick={openCreateDialog}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Attribute Group
        </Button>
      }
    >
      <FilterPanel
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClear={clearFilters}
        mainFilters={
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by code or label..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div className="min-w-[200px]">
              {renderAttributeSetSelect(filters.attributeSetId || "", (val) =>
                handleFilterChange("attributeSetId", val)
              )}
            </div>
          </div>
        }
        advancedFilters={
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[150px]">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select
                  value={filters.sortBy || "sortOrder"}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sortOrder">Sort Order</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="label">Label</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[150px]">
                <Label className="text-sm font-medium">Order</Label>
                <Select
                  value={filters.sortOrder || "asc"}
                  onValueChange={(value) => handleFilterChange("sortOrder", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        }
      />

      <DataTable
        headerCells={
          <>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Attribute Set</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead>Attributes</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {groups?.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.id}</TableCell>
                <TableCell>{group.code}</TableCell>
                <TableCell>{group.label}</TableCell>
                <TableCell>
                  {group.attributeSet
                    ? `${group.attributeSet.label} (${group.attributeSet.code})`
                    : "-"}
                </TableCell>
                <TableCell>{group.sortOrder}</TableCell>
                <TableCell>{group.groupAttributes?.length || 0} attributes</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openViewDialog(group)}>
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(group)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setGroupIdToDelete(group.id)}
                        className="text-red-600"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </>
        }
        colSpan={7}
        isEmpty={!groups || groups.length === 0}
        emptyMessage="No attribute groups found"
      />

      <PaginationBar
        currentPage={currentPage}
        totalPages={groupsTotalPages}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmDialog
        open={groupIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setGroupIdToDelete(null);
        }}
        title="Delete Attribute Group"
        description="Are you sure you want to delete this attribute group? This action cannot be undone."
        primaryLabel="Delete Attribute Group"
        onConfirm={() => {
          if (groupIdToDelete !== null) {
            void handleDeleteGroup(groupIdToDelete);
          }
        }}
      />

      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Attribute Group"
        description="Create a new attribute group for a specific attribute set."
        primaryLabel="Create Attribute Group"
        onPrimary={handleCreateGroup}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="create-attribute-set">Attribute Set</Label>
            {renderAttributeSetSelect(formData.attributeSetId, (val) =>
              setFormData({ ...formData, attributeSetId: val })
            )}
          </div>
          <div>
            <Label htmlFor="create-code">Code</Label>
            <Input
              id="create-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Enter group code"
            />
          </div>
          <div>
            <Label htmlFor="create-label">Label</Label>
            <Input
              id="create-label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Enter group label"
            />
          </div>
          <div>
            <Label htmlFor="create-sortOrder">Sort Order</Label>
            <Input
              id="create-sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({ ...formData, sortOrder: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label>Attributes</Label>
            {renderAttributeMultiSelect()}
          </div>
        </div>
      </EntityDialog>

      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Attribute Group"
        description="Update attribute group information and assigned attributes."
        primaryLabel="Update Attribute Group"
        onPrimary={handleEditGroup}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-attribute-set">Attribute Set</Label>
            {renderAttributeSetSelect(formData.attributeSetId, (val) =>
              setFormData({ ...formData, attributeSetId: val })
            )}
          </div>
          <div>
            <Label htmlFor="edit-code">Code</Label>
            <Input
              id="edit-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Enter group code"
            />
          </div>
          <div>
            <Label htmlFor="edit-label">Label</Label>
            <Input
              id="edit-label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Enter group label"
            />
          </div>
          <div>
            <Label htmlFor="edit-sortOrder">Sort Order</Label>
            <Input
              id="edit-sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({ ...formData, sortOrder: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label>Attributes</Label>
            {renderAttributeMultiSelect()}
          </div>
        </div>
      </EntityDialog>

      <EntityDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        title="Attribute Group Details"
        description="View details and assigned attributes for this group."
        primaryLabel="Close"
        onPrimary={() => setShowViewDialog(false)}
      >
        {viewGroup && (
          <div className="space-y-4">
            <div>
              <Label>Code</Label>
              <div className="mt-1 text-sm">{viewGroup.code}</div>
            </div>
            <div>
              <Label>Label</Label>
              <div className="mt-1 text-sm">{viewGroup.label}</div>
            </div>
            <div>
              <Label>Attribute Set</Label>
              <div className="mt-1 text-sm">
                {viewGroup.attributeSet
                  ? `${viewGroup.attributeSet.label} (${viewGroup.attributeSet.code})`
                  : "-"}
              </div>
            </div>
            <div>
              <Label>Sort Order</Label>
              <div className="mt-1 text-sm">{viewGroup.sortOrder}</div>
            </div>
            <div>
              <Label>Attributes</Label>
              <div className="mt-1 text-sm">
                {viewGroup.groupAttributes && viewGroup.groupAttributes.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {viewGroup.groupAttributes.map((ga) => (
                      <li key={ga.id}>
                        {ga.attribute.label || ga.attribute.code} (Sort: {ga.sortOrder})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">No attributes assigned</span>
                )}
              </div>
            </div>
          </div>
        )}
      </EntityDialog>
    </PageLayout>
  );
}
