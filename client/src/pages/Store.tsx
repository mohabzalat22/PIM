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

import { useState } from "react";
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
  StoreIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type StoreInterface from "@/interfaces/store.interface";
import type Filters from "@/interfaces/store/filters.interface";
import { useStores } from "@/hooks/useStores";

export default function Store() {
  const limit = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [stores, storesLoading, storesErrors] = useStores(
    currentPage,
    limit,
    filters
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingStore, setEditingStore] = useState<StoreInterface | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
  };

  const handleCreateStore = async () => {
    try {
      await axios.post("http://localhost:3000/api/stores", formData);
      toast.success("Store created successfully");
      setShowCreateDialog(false);
      setFormData({ code: "", name: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to create store: ${error.message}`);
    }
  };

  const handleEditStore = async () => {
    if (!editingStore) return;

    try {
      await axios.put(
        `http://localhost:3000/api/stores/${editingStore.id}`,
        formData
      );
      toast.success("Store updated successfully");
      setShowEditDialog(false);
      setEditingStore(null);
      setFormData({ code: "", name: "" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to update store: ${error.message}`);
    }
  };

  const handleDeleteStore = async (id: number) => {
    if (!confirm("Are you sure you want to delete this store?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/stores/${id}`);
      toast.success("Store deleted successfully");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(`Failed to delete store: ${error.message}`);
    }
  };

  const openEditDialog = (store: StoreInterface) => {
    setEditingStore(store);
    setFormData({
      code: store.code,
      name: store.name || "",
    });
    setShowEditDialog(true);
  };

  return (
    <div className="max-w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Store
        </Button>
      </div>

      {/* Filters */}
      <div className="border rounded-lg p-4 bg-muted/60">
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
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by code or name..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="createdAt">Created Date</option>
                <option value="code">Code</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Order</Label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Store Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.length > 0 ? (
              stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.id}</TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      {store.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <StoreIcon className="w-4 h-4 text-blue-500" />
                      <span>{store.name || "No name"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {store.storeViews?.length || 0} views
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(store.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => openEditDialog(store)}>
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteStore(store.id)}
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
                <TableCell colSpan={6} className="text-center py-8">
                  No stores found
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
                      page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : ""
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

      {/* Create Store Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Store</DialogTitle>
            <DialogDescription>
              Add a new store to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Store Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="store_code"
              />
            </div>
            <div>
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Store Name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStore}>Create Store</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>Update store information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-code">Store Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="store_code"
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Store Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Store Name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStore}>Update Store</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
