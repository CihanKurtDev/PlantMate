import { useMemo } from "react";
import { EventFormData, EventTypeConfig } from "@/types/events";
import { EventFormErrors, validateEventForm } from "@/helpers/validationUtils";

export type { EventFormErrors };

export function useEventValidation(formData: EventFormData, eventFormConfig: EventTypeConfig[]) {
  const errors = useMemo(
    () => validateEventForm(formData, eventFormConfig),
    [formData, eventFormConfig]
  );

  const hasErrors = useMemo(() => {
    if (errors.timestamp || errors.type || errors.notes) {
      return true;
    }

    return Object.values(errors.extra).some(Boolean);
  }, [errors]);

  return { errors, hasErrors };
}
