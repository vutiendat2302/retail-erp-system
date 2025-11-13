import { ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Input } from "../components/ui/input";

interface PageControlProp {
  currentPage: number;
  totalPage: number;
  goToPage: (pageNumber: number) => void;
}

export const PageControl: React.FC<PageControlProp> = ({
  currentPage,
  totalPage,
  goToPage,
}) => {

  const [pageInput, setPageInput] = useState('');

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page > 0 && page <= totalPage) {
      goToPage(page - 1);
      setPageInput('');
    }
  }

  const generatePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rageWithDots = [];

    for (let i = Math.max(2, currentPage -delta); i < Math.min(totalPage-1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rageWithDots.push(1, "...");
    } else {
      rageWithDots.push(1);
    }

    rageWithDots.push(...range);

    if (currentPage + delta < totalPage - 1) {
      rageWithDots.push('...', totalPage);
    } else {
      rageWithDots.push(totalPage);
    }

    return rageWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-4">
      <div className="w-36 h-8 text-center" />
      <div className="flex items-center gap-2">
        {/* tro ve trang dau tien */}
        <Button
          variant="secondary"
          size = "icon"
          onClick={() => goToPage(0)}
          disabled = {currentPage === 0}
          className="size-8 px-3 py-1 bg-gray-500 rounded disabled:opacity-50"
        >
        <ChevronsLeft />
        </Button>

        {/* Previous */}
        <Button
          variant = "secondary"
          size = "sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled = {currentPage === 0}
          className="size-8 px-3 py-1 bg-gray-400 rounded disabled:opacity-50"
        >
        <ChevronLeft  />
        </Button>

        
        <Button
          variant="outline"
          className="size-8 w-50 px-3 py-1 rounded"
        >
        <span className="font-weight-semibold font-inter font-size-sm">
          <strong>{totalPage === 0 ? 0 : currentPage + 1}</strong> / <strong>{totalPage}</strong>
        </span>
        </Button>


        {/* Next page */}
        <Button
          variant = "secondary"
          size = "sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled = {currentPage === totalPage - 1}
          className="size-8 px-3 py-1 bg-gray-400 rounded disabled:opacity-50"
        >
        <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Next page */}
        <Button
          variant = "outline"
          size = "sm"
          onClick={() => goToPage(totalPage - 1)}
          disabled = {currentPage === totalPage}
          className="size-8 px-3 py-1 bg-gray-500 rounded disabled:opacity-50"
        >
        <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Đi đến trang:
          </span>
          <Input
            type = "text"
            min = "1"
            max = {totalPage}
            value = {pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder={(currentPage + 1).toString()}
            className="w-15 h-8 text-center"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePageInputSubmit(e);
              }
            }}
          />
          <Button type = "submit" size = "sm" className="h-8 size-8 w-11 bg-black text-white rounded text-sm font-weight-semibold items-center">
            Đi
          </Button>
        </form>
      </div>
    </div>
  )
}