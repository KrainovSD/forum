import { useEffect } from "react";

interface form {
  [key: string]: any;
}

export const useValidation = (
  form: form,
  error: form,
  setError: React.Dispatch<React.SetStateAction<form>>,
  validation: (
    field: string,
    fieldData: string,
    error: form,
    setError: React.Dispatch<React.SetStateAction<form>>,
    form: form
  ) => void
) => {
  for (let key in form) {
    useEffect(() => {
      const field = key;
      const fieldData = form[key];
      if (key in error && error[key]?.length > 0)
        validation(field, fieldData, error, setError, form);
    }, [form[key]]);
  }
};
