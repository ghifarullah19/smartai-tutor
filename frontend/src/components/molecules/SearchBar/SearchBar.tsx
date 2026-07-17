import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../atoms/Input';
import styles from './SearchBar.module.css';

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
    <div className={styles['search-container']}>
      <Search className={styles['search-icon']} size={16} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles['search-input']}
      />
    </div>
  );
};
