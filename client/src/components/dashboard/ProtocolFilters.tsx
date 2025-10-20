import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export interface FilterOptions {
  search?: string;
  riskLevel?: string;
  minTvl?: string;
  maxTvl?: string;
  minApy?: string;
  maxApy?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ProtocolFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function ProtocolFilters({ filters, onFiltersChange }: ProtocolFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync localFilters with applied filters when popover opens/closes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isFilterOpen]);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value || undefined };
    onFiltersChange(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Use applied filters for badge count, not local draft
  const activeFilterCount = [
    filters.riskLevel,
    filters.minTvl,
    filters.maxTvl,
    filters.minApy,
    filters.maxApy,
  ].filter(Boolean).length;

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search protocols by name, symbol, or address..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          data-testid="input-protocol-search"
        />
      </div>

      <Select
        value={filters.sortBy || "tvl"}
        onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
      >
        <SelectTrigger className="w-40" data-testid="select-sort-by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tvl">TVL</SelectItem>
          <SelectItem value="riskScore">Risk Score</SelectItem>
          <SelectItem value="trustIndex">Trust Index</SelectItem>
          <SelectItem value="apy">APY</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortOrder || "desc"}
        onValueChange={(value: "asc" | "desc") => onFiltersChange({ ...filters, sortOrder: value })}
      >
        <SelectTrigger className="w-32" data-testid="select-sort-order">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Desc</SelectItem>
          <SelectItem value="asc">Asc</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="default" 
            className="relative"
            data-testid="button-open-filters"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" data-testid="popover-filters">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Advanced Filters</h4>
            </div>

            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select
                value={localFilters.riskLevel || ""}
                onValueChange={(value) => setLocalFilters({ ...localFilters, riskLevel: value || undefined })}
              >
                <SelectTrigger data-testid="select-risk-level">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>TVL Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min TVL"
                  value={localFilters.minTvl || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, minTvl: e.target.value || undefined })}
                  data-testid="input-min-tvl"
                />
                <Input
                  type="number"
                  placeholder="Max TVL"
                  value={localFilters.maxTvl || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxTvl: e.target.value || undefined })}
                  data-testid="input-max-tvl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>APY Range (%)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min APY"
                  value={localFilters.minApy || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, minApy: e.target.value || undefined })}
                  data-testid="input-min-apy"
                />
                <Input
                  type="number"
                  placeholder="Max APY"
                  value={localFilters.maxApy || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxApy: e.target.value || undefined })}
                  data-testid="input-max-apy"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1"
                data-testid="button-clear-filters"
              >
                Clear
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="flex-1"
                data-testid="button-apply-filters"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
