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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MoreHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  sku: string;
  type: string;
}

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data.data);
    } catch (err: any) {
      toast.error(`Failed to load messages: ${err.message}`); // ✅ Show error toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-blue-500">Loading messages...</p>;
  console.log(products);

  return (
    <div className="max-w-full p-2">
      <div className="border p-2 rounded">
        <Input
          placeholder="search ..."
          className={`ml-2 bg-transparent outline-none text-sm w-100 h-8  transition-all duration-200 ease-in-out${
            isFocused ? "opacity-100 w-[calc(100%-1rem)] h-10" : "opacity-50"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.target.value) setIsFocused(false);
          }}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Type</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination className="flex justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
