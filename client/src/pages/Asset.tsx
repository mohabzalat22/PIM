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

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  MoreHorizontalIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon,
  SearchIcon,
  ImageIcon,
  FileIcon,
  VideoIcon,
  FileTextIcon,
  DownloadIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/app/PageLayout";
import { FilterPanel } from "@/components/app/FilterPanel";
import { DataTable } from "@/components/app/DataTable";
import { EntityDialog } from "@/components/app/EntityDialog";
import Loading from "@/components/app/loading";
import { DeleteConfirmDialog } from "@/components/app/DeleteConfirmDialog";
import type AssetInterface from "@/interfaces/asset.interface";
import type Filters from "@/interfaces/categories.filters.interface";
import type AssetType from "@/interfaces/asset.interface";
import { SelectType } from "@/components/app/select-type";
import { AssetService } from "@/services/asset.service";
import { useAssets } from "@/hooks/useAssets";
import { asyncWrapper } from "@/utils/asyncWrapper";

export default function Asset() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<AssetInterface | null>(null);
  const [assetIdToDelete, setAssetIdToDelete] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    mimeType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [formData, setFormData] = useState({
    filePath: "",
    mimeType: "",
  });

  const limit = 10;

  const [
    assets,
    assetsLoading,
    assetsError,
    totalPages,
    refetchAssets,
  ] = useAssets(currentPage, limit, filters);

  const isLoading = assetsLoading;

  const mimeTypes = [
    { value: "image/jpeg", label: "JPEG Image" },
    { value: "image/png", label: "PNG Image" },
    { value: "image/gif", label: "GIF Image" },
    { value: "image/webp", label: "WebP Image" },
    { value: "video/mp4", label: "MP4 Video" },
    { value: "video/webm", label: "WebM Video" },
    { value: "application/pdf", label: "PDF Document" },
    { value: "text/plain", label: "Text File" },
    { value: "application/json", label: "JSON File" },
  ];

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/"))
      return <ImageIcon className="w-4 h-4 text-primary" />;
    if (mimeType.startsWith("video/"))
      return <VideoIcon className="w-4 h-4 text-destructive" />;
    if (mimeType === "application/pdf")
      return <FileTextIcon className="w-4 h-4 text-destructive" />;
    return <FileIcon className="w-4 h-4 text-muted-foreground" />;
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "bg-primary/10 text-primary";
    if (mimeType.startsWith("video/")) return "bg-destructive/10 text-destructive";
    if (mimeType === "application/pdf")
      return "bg-destructive/10 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (assetsError) {
      toast.error(`Failed to load assets: ${assetsError.message}`);
    }
  }, [assetsError]);

  useEffect(() => {
    if (!isLoading) {
      setShowPageLoader(false);
    }
  }, [isLoading]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      mimeType: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handleCreateAsset = async () => {
    await asyncWrapper(async () => {
      await AssetService.create(formData);
      toast.success("Asset created successfully");
      setShowCreateDialog(false);
      setFormData({
        filePath: "",
        mimeType: "",
      });
      await refetchAssets();
    });
  };

  const handleEditAsset = async () => {
    if (!editingAsset) return;

    await asyncWrapper(async () => {
      await AssetService.update(editingAsset.id, formData);
      toast.success("Asset updated successfully");
      setShowEditDialog(false);
      setEditingAsset(null);
      setFormData({
        filePath: "",
        mimeType: "",
      });
      refetchAssets();
    });
  };

  const handleDeleteAsset = async (id: number) => {
    await asyncWrapper(async () => {
      await AssetService.remove(id);
      toast.success("Asset deleted successfully");
      await refetchAssets();
    });
  };

  const openEditDialog = (asset: AssetType) => {
    setEditingAsset(asset);
    setFormData({
      filePath: asset.filePath,
      mimeType: asset.mimeType,
    });
    setShowEditDialog(true);
  };

  if (showPageLoader && isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout
      title="Assets"
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      }
    >
      {/* Filters */}
      <FilterPanel
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClear={clearFilters}
        mainFilters={
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by file path..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange("search", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <SelectType
                initialValue={filters.mimeType}
                options={[
                  { value: "all", name: "All File Types" },
                  ...mimeTypes.map((type) => ({
                    value: type.value,
                    name: type.label,
                  })),
                ]}
                onValueChange={(value) =>
                  handleFilterChange("mimeType", value === "all" ? "" : value)
                }
              />
            </div>
          </div>
        }
        advancedFilters={
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <SelectType
                initialValue={filters.sortBy}
                options={[
                  { value: "createdAt", name: "Created Date" },
                  { value: "filePath", name: "File Path" },
                  { value: "mimeType", name: "MIME Type" },
                ]}
                onValueChange={(value) =>
                  handleFilterChange("sortBy", value)
                }
              />
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Order</Label>
              <SelectType
                initialValue={filters.sortOrder}
                options={[
                  { value: "asc", name: "Ascending" },
                  { value: "desc", name: "Descending" },
                ]}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
              />
            </div>
          </div>
        }
      />

      {/* Table */}
      <DataTable
        headerCells={
          <>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </>
        }
        rows={
          <>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getFileIcon(asset.mimeType)}
                    <span className="truncate max-w-[200px]">
                      {asset.filePath.split("/").pop() || asset.filePath}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getFileTypeColor(
                      asset.mimeType
                    )}`}
                  >
                    {asset.mimeType}
                  </span>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-muted/70 px-2 py-1 rounded">
                    {asset.filePath}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    {asset.productAssets?.length || 0}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(asset.createdAt).toLocaleDateString()}
                </TableCell>
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
                      <DropdownMenuItem onClick={() => openEditDialog(asset)}>
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setAssetIdToDelete(asset.id)}
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
        isEmpty={assets.length === 0}
        emptyMessage="No assets found"
      />

      {/* Pagination */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Create Asset Dialog */}
      <EntityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Asset"
        description="Add a new asset to your media library."
        primaryLabel="Create Asset"
        onPrimary={handleCreateAsset}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="filePath">File Path</Label>
            <Input
              id="filePath"
              value={formData.filePath}
              onChange={(e) =>
                setFormData({ ...formData, filePath: e.target.value })
              }
              placeholder="/uploads/images/product.jpg"
            />
          </div>
          <div>
            <Label htmlFor="mimeType">MIME Type</Label>
            <SelectType
              options={mimeTypes.map((type) => ({
                value: type.value || "none",
                name: type.label,
              }))}
              onValueChange={(value) =>
                setFormData({ ...formData, mimeType: value })
              }
            />
          </div>
        </div>
      </EntityDialog>

      {/* Edit Asset Dialog */}
      <EntityDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Asset"
        description="Update asset information."
        primaryLabel="Update Asset"
        onPrimary={handleEditAsset}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-filePath">File Path</Label>
            <Input
              id="edit-filePath"
              value={formData.filePath}
              onChange={(e) =>
                setFormData({ ...formData, filePath: e.target.value })
              }
              placeholder="/uploads/images/product.jpg"
            />
          </div>
          <div>
            <Label htmlFor="edit-mimeType">MIME Type</Label>
            <SelectType
              options={mimeTypes.map((type) => ({
                value: type.value || "none",
                name: type.label,
              }))}
              onValueChange={(value) =>
                setFormData({ ...formData, mimeType: value })
              }
            />
          </div>
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={assetIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setAssetIdToDelete(null);
        }}
        title="Delete Asset"
        description="Are you sure you want to delete this asset? This action cannot be undone."
        primaryLabel="Delete Asset"
        onConfirm={() => {
          if (assetIdToDelete !== null) {
            void handleDeleteAsset(assetIdToDelete);
          }
        }}
      />
    </PageLayout>
  );
}
