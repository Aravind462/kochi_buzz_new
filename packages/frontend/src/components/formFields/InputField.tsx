"use client";

import { UseFormReturn, useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const InputField: React.FC<IProps> = (props) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(fieldState.error ? "hasError" : "", props.className)}
        >
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              readOnly={props.readOnly}
              {...field}
            />
          </FormControl>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface IProps {
  form: UseFormReturn;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}
