import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  MoreHorizontalIcon, 
  FilterIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon,
  SearchIcon,
  XIcon,
  ImageIcon,
  FileIcon,
  VideoIcon,
  FileTextIcon,
  DownloadIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type AssetInterface from "@/interfaces/asset.interface";
import type Filters from "@/interfaces/categories.filters.interface";
import type AssetType from "@/interfaces/asset.interface";
import { SelectType } from "@/components/app/select-type";

export default function Asset() {
  const [assets, setAssets] = useState<AssetInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<AssetInterface | null>(null);
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
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    if (mimeType.startsWith("video/"))
      return <VideoIcon className="w-4 h-4 text-red-500" />;
    if (mimeType === "application/pdf")
      return <FileTextIcon className="w-4 h-4 text-red-600" />;
    return <FileIcon className="w-4 h-4 text-gray-500" />;
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "bg-blue-100 text-blue-800";
    if (mimeType.startsWith("video/")) return "bg-red-100 text-red-800";
    if (mimeType === "application/pdf") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const fetchAssets = async (
    page: number = 1,
    currentFilters: Filters = filters
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder,
      });

      if (currentFilters.search) params.append("search", currentFilters.search);
      if (currentFilters.mimeType)
        params.append("mimeType", currentFilters.mimeType);

      const response = await axios.get(
        `http://localhost:3000/api/assets?${params.toString()}`
      );

      setAssets(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
      setCurrentPage(page);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to load assets: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(currentPage);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchAssets(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchAssets(1, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      mimeType: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    fetchAssets(1, clearedFilters);
  };

  const handleCreateAsset = async () => {
    try {
      await axios.post("http://localhost:3000/api/assets", formData);
      toast.success("Asset created successfully");
      setShowCreateDialog(false);
      setFormData({
        filePath: "",
        mimeType: "",
      });
      fetchAssets(currentPage);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create asset: ${error.message}`);
    }
  };

  const handleEditAsset = async () => {
    if (!editingAsset) return;

    try {
      await axios.put(
        `http://localhost:3000/api/assets/${editingAsset.id}`,
        formData
      );
      toast.success("Asset updated successfully");
      setShowEditDialog(false);
      setEditingAsset(null);
      setFormData({
        filePath: "",
        mimeType: "",
      });
      fetchAssets(currentPage);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update asset: ${error.message}`);
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/assets/${id}`);
      toast.success("Asset deleted successfully");
      fetchAssets(currentPage);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete asset: ${error.message}`);
    }
  };

  const openEditDialog = (asset: AssetType) => {
    setEditingAsset(asset);
    setFormData({
      filePath: asset.filePath,
      mimeType: asset.mimeType,
    });
    setShowEditDialog(true);
  };

  if (loading && assets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-500">Loading assets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assets</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Filters */}
      <div className="border rounded-lg p-4 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FilterIcon className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <XIcon className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by file path..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
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

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="filePath">File Path</SelectItem>
                  <SelectItem value="mimeType">MIME Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
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
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length > 0 ? (
              assets.map((asset) => (
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
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
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
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-600"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No assets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(page)}
                    className={
                      page === currentPage ? "bg-blue-600 text-white" : ""
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Asset Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Asset</DialogTitle>
            <DialogDescription>
              Add a new asset to your media library.
            </DialogDescription>
          </DialogHeader>
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
              <Select
                value={formData.mimeType}
                onValueChange={(value) =>
                  setFormData({ ...formData, mimeType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select MIME type" />
                </SelectTrigger>
                <SelectContent>
                  {mimeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value || "none"}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAsset}>Create Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update asset information.</DialogDescription>
          </DialogHeader>
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
              <Select
                value={formData.mimeType}
                onValueChange={(value) =>
                  setFormData({ ...formData, mimeType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select MIME type" />
                </SelectTrigger>
                <SelectContent>
                  {mimeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value || "none"}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAsset}>Update Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
