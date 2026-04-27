"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, X, ChevronDown, Check, Globe } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";

interface LocationPickerProps {
  selectedLocations: string[]; // Array of "City, Country"
  onChange: (locations: string[]) => void;
}

export function LocationPicker({ selectedLocations = [], onChange }: LocationPickerProps) {
  const [countries, setCountries] = useState<string[]>([]);
  const [citiesMap, setCitiesMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/locations?type=countries");
        const countriesData = await res.json();
        setCountries(countriesData);
        
        // Pre-fetch cities for selected countries or major ones
        const map: Record<string, string[]> = {};
        for (const country of countriesData) {
          const cRes = await fetch(`/api/locations?type=cities&country=${encodeURIComponent(country)}`);
          map[country] = await cRes.json();
        }
        setCitiesMap(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleLocation = (city: string, country: string) => {
    const loc = `${city}, ${country}`;
    if (selectedLocations.includes(loc)) {
      onChange(selectedLocations.filter(l => l !== loc));
    } else {
      onChange([...selectedLocations, loc]);
    }
  };

  const removeLocation = (loc: string) => {
    onChange(selectedLocations.filter(l => l !== loc));
  };

  return (
    <div className="space-y-3">
      {/* Selection Display */}
      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl border border-border bg-muted/10 backdrop-blur-sm">
        {selectedLocations.length === 0 && (
          <span className="text-sm text-muted-foreground py-1.5 px-3 italic">Select one or more locations...</span>
        )}
        {selectedLocations.map((loc) => (
          <Badge 
            key={loc} 
            variant="secondary" 
            className="pl-3 pr-2 py-1.5 gap-2 bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 transition-all group animate-in fade-in zoom-in duration-200 rounded-lg"
          >
            <span className="text-xs font-bold">{loc}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeLocation(loc);
              }}
              className="text-muted-foreground hover:text-destructive transition-colors group-hover:scale-110"
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Hierarchical Picker */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="w-full justify-between h-11 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
              <span className="flex items-center gap-2.5 font-medium">
                <Globe className="h-4 w-4 text-primary" />
                Add Location
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          }
        />
        <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto p-1.5 shadow-2xl border-primary/10">
          <div className="px-2 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            Available Countries
          </div>
          <DropdownMenuSeparator className="my-1.5 opacity-50" />
          
          {loading ? (
            <div className="p-4 text-center text-xs text-muted-foreground italic">Loading locations...</div>
          ) : (
            countries.map((country) => (
              <DropdownMenuSub key={country}>
                <DropdownMenuSubTrigger className="rounded-md py-2.5 hover:bg-primary/5 focus:bg-primary/5">
                  <MapPin className="mr-2.5 h-4 w-4 text-primary/60" />
                  <span className="font-medium">{country}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56 p-1.5 shadow-xl border-primary/10 ml-1">
                  <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                    Cities in {country}
                  </div>
                  <DropdownMenuSeparator className="my-1.5 opacity-50" />
                  <div className="max-h-60 overflow-auto">
                    {citiesMap[country]?.map((city) => (
                      <DropdownMenuItem 
                        key={city} 
                        onClick={() => toggleLocation(city, country)}
                        className="rounded-md py-2 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{city}</span>
                          {selectedLocations.includes(`${city}, ${country}`) && (
                            <Check className="h-4 w-4 text-primary animate-in zoom-in duration-300" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
