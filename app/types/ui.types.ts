export type UiTone = 'neutral' | 'primary' | 'success' | 'danger';

export type UiSize = 'sm' | 'md';

export type UiSurfaceVariant = 'default' | 'soft' | 'outlined';

export interface UiOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
  description?: string;
}
