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
  EyeIcon,
  GlobeIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StoreView {
  id: number;
  storeId: number;
  code: string;
  name: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  store?: Store;
}

interface Store {
  id: number;
  code: string;
  name: string;
}

interface Filters {
  search: string;
  storeId: string;
  locale: string;
  sortBy: string;
  sortOrder: string;
}

export default function StoreView() {
  const [storeViews, setStoreViews] = useState<StoreView[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editingStoreView, setEditingStoreView] = useState<StoreView | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    storeId: '',
    locale: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [formData, setFormData] = useState({
    storeId: '',
    code: '',
    name: '',
    locale: ''
  });

  const limit = 10;

  const locales = [
    { value: 'en_US', label: 'English (US)' },
    { value: 'en_GB', label: 'English (UK)' },
    { value: 'es_ES', label: 'Spanish (Spain)' },
    { value: 'fr_FR', label: 'French (France)' },
    { value: 'de_DE', label: 'German (Germany)' },
    { value: 'it_IT', label: 'Italian (Italy)' },
    { value: 'pt_BR', label: 'Portuguese (Brazil)' },
    { value: 'ja_JP', label: 'Japanese (Japan)' },
    { value: 'ko_KR', label: 'Korean (Korea)' },
    { value: 'zh_CN', label: 'Chinese (China)' }
  ];

  const fetchStoreViews = async (page: number = 1, currentFilters: Filters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      });

      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.storeId) params.append('storeId', currentFilters.storeId);
      if (currentFilters.locale) params.append('locale', currentFilters.locale);

      const response = await axios.get(
        `http://localhost:3000/api/store-views?${params.toString()}`
      );
      
      setStoreViews(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / limit));
      setCurrentPage(page);
    } catch (err: any) {
      toast.error(`Failed to load store views: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/stores?limit=100');
      setStores(response.data.data);
    } catch (err: any) {
      console.error('Failed to load stores:', err);
    }
  };

  useEffect(() => {
    fetchStoreViews(currentPage);
    fetchStores();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchStoreViews(page);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchStoreViews(1, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      storeId: '',
      locale: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    fetchStoreViews(1, clearedFilters);
  };

  const handleCreateStoreView = async () => {
    try {
      const storeViewData = {
        storeId: parseInt(formData.storeId),
        code: formData.code,
        name: formData.name,
        locale: formData.locale
      };
      
      await axios.post('http://localhost:3000/api/store-views', storeViewData);
      toast.success('Store view created successfully');
      setShowCreateDialog(false);
      setFormData({ storeId: '', code: '', name: '', locale: '' });
      fetchStoreViews(currentPage);
    } catch (err: any) {
      toast.error(`Failed to create store view: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditStoreView = async () => {
    if (!editingStoreView) return;
    
    try {
      const storeViewData = {
        storeId: parseInt(formData.storeId),
        code: formData.code,
        name: formData.name,
        locale: formData.locale
      };
      
      await axios.put(`http://localhost:3000/api/store-views/${editingStoreView.id}`, storeViewData);
      toast.success('Store view updated successfully');
      setShowEditDialog(false);
      setEditingStoreView(null);
      setFormData({ storeId: '', code: '', name: '', locale: '' });
      fetchStoreViews(currentPage);
    } catch (err: any) {
      toast.error(`Failed to update store view: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteStoreView = async (id: number) => {
    if (!confirm('Are you sure you want to delete this store view?')) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/store-views/${id}`);
      toast.success('Store view deleted successfully');
      fetchStoreViews(currentPage);
    } catch (err: any) {
      toast.error(`Failed to delete store view: ${err.response?.data?.message || err.message}`);
    }
  };

  const openEditDialog = (storeView: StoreView) => {
    setEditingStoreView(storeView);
    setFormData({
      storeId: storeView.storeId.toString(),
      code: storeView.code,
      name: storeView.name,
      locale: storeView.locale
    });
    setShowEditDialog(true);
  };

  if (loading && storeViews.length === 0) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-blue-500">Loading store views...</p>
    </div>;
  }

  return (
    <div className="max-w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Store Views</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Store View
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
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
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
                placeholder="Search by code or name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.storeId} onValueChange={(value) => handleFilterChange('storeId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString() || "none"}>
                    {store.name || store.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Select value={filters.locale} onValueChange={(value) => handleFilterChange('locale', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locales</SelectItem>
                {locales.map((locale) => (
                  <SelectItem key={locale.value} value={locale.value || "none"}>
                    {locale.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Sort By</Label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="code">Code</option>
                <option value="name">Name</option>
                <option value="locale">Locale</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-sm font-medium">Order</Label>
              <select 
                value={filters.sortOrder} 
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
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
              <TableHead>Store</TableHead>
              <TableHead>Locale</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeViews.length > 0 ? (
              storeViews.map((storeView) => (
                <TableRow key={storeView.id}>
                  <TableCell className="font-medium">{storeView.id}</TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      {storeView.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="w-4 h-4 text-blue-500" />
                      <span>{storeView.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {storeView.store?.name || storeView.store?.code || `Store ${storeView.storeId}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <GlobeIcon className="w-4 h-4 text-green-500" />
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {storeView.locale}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(storeView.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => openEditDialog(storeView)}>
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteStoreView(storeView.id)}
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
                  No store views found
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
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(page)}
                    className={page === currentPage ? "bg-blue-600 text-white" : ""}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Store View Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Store View</DialogTitle>
            <DialogDescription>
              Add a new store view for multi-language support.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeId">Store</Label>
              <Select value={formData.storeId} onValueChange={(value) => setFormData({ ...formData, storeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString() || "none"}>
                      {store.name || store.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="code">Store View Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="store_view_code"
              />
            </div>
            <div>
              <Label htmlFor="name">Store View Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Store View Name"
              />
            </div>
            <div>
              <Label htmlFor="locale">Locale</Label>
              <Select value={formData.locale} onValueChange={(value) => setFormData({ ...formData, locale: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value || "none"}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateStoreView}>
              Create Store View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Store View Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Store View</DialogTitle>
            <DialogDescription>
              Update store view information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-storeId">Store</Label>
              <Select value={formData.storeId} onValueChange={(value) => setFormData({ ...formData, storeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString() || "none"}>
                      {store.name || store.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-code">Store View Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="store_view_code"
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Store View Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Store View Name"
              />
            </div>
            <div>
              <Label htmlFor="edit-locale">Locale</Label>
              <Select value={formData.locale} onValueChange={(value) => setFormData({ ...formData, locale: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value || "none"}>
                      {locale.label}
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
            <Button onClick={handleEditStoreView}>
              Update Store View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
