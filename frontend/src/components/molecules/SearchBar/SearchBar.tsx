import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../atoms/Input';

export interface ISearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<ISearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Cari chat...',
}) => {
  return (
    <div className={"relative w-full flex items-center"}>
      <Search className={"absolute left-3 text-slate-500 pointer-events-none"} size={16} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={"pl-9"}
      />
    </div>
  );
};
