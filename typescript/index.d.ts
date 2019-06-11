import * as React from 'react';
import {
  FormApi,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldState,
  FieldSubscription,
  FieldValidator
} from 'final-form';
import { Omit } from 'ts-essentials';

type SupportedInputs = 'input' | 'select' | 'textarea';

export interface ReactContext<FormValues> {
  reactFinalForm: FormApi<FormValues>;
}

export type FieldMetaState = Omit<
  FieldState,
  'blur' | 'change' | 'focus' | 'name' | 'value'
>;

interface FieldInputProps<T extends HTMLElement> {
  name: string;
  onBlur: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus: (event?: React.FocusEvent<T>) => void;
  type?: string;
  value: any;
  checked?: boolean;
  multiple?: boolean;
}

interface AnyObject {
  [key: string]: any;
}

export interface FieldRenderProps<T extends HTMLElement> {
  input: FieldInputProps<T>;
  meta: FieldMetaState;
}

export interface FormRenderProps<FormValues> extends FormState<FormValues> {
  form: FormApi<FormValues>;
  handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<AnyObject | undefined> | undefined;
}

export interface FormSpyRenderProps<FormValues> extends FormState<FormValues> {
  form: FormApi<FormValues>;
}

export interface RenderableProps<T> {
  children?: ((props: T) => React.ReactNode) | React.ReactNode;
  component?: React.ComponentType<T> | SupportedInputs;
  render?: (props: T) => React.ReactNode;
}

export interface FormProps<FormValues = AnyObject>
  extends Config<FormValues>,
    RenderableProps<FormRenderProps<FormValues>> {
  subscription?: FormSubscription;
  decorators?: Decorator[];
  form?: FormApi<FormValues>;
  initialValuesEqual?: (a?: AnyObject, b?: AnyObject) => boolean;
}

export interface UseFieldConfig {
  afterSubmit?: () => void;
  allowNull?: boolean;
  beforeSubmit?: () => void | boolean;
  defaultValue?: any;
  format?: (value: any, name: string) => any;
  formatOnBlur?: boolean;
  initialValue?: any;
  isEqual?: (a: any, b: any) => boolean;
  multiple?: boolean;
  parse?: (value: any, name: string) => any;
  subscription?: FieldSubscription;
  type?: string;
  validate?: FieldValidator;
  validateFields?: string[];
  value?: any;
}

export interface FieldProps<T extends HTMLElement>
  extends UseFieldConfig,
    RenderableProps<FieldRenderProps<T>> {
  name: string;
  [otherProp: string]: any;
}

export interface UseFormStateParams<FormValues = AnyObject> {
  onChange?: (formState: FormState<FormValues>) => void;
  subscription?: FormSubscription;
}

export interface FormSpyProps<FormValues>
  extends UseFormStateParams<FormValues>,
    RenderableProps<FormSpyRenderProps<FormValues>> {}

export const Field: React.FC<FieldProps<any>>;
export const Form: React.FC<FormProps<AnyObject>>;
export const FormSpy: React.FC<FormSpyProps<AnyObject>>;
export function useField<T extends HTMLElement>(
  name: string,
  config?: UseFieldConfig
): FieldRenderProps<T>;
export function useForm<FormValues = AnyObject>(
  componentName?: string
): FormApi<FormValues>;
export function useFormState<FormValues = AnyObject>(
  params?: UseFormStateParams
): FormState<FormValues>;
export function withTypes<FormValues>(): {
  Form: React.FC<FormProps<FormValues>>;
  FormSpy: React.FC<FormSpyProps<FormValues>>;
};
export const version: string;
