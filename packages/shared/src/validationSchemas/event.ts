import { z } from "zod";

// Event schema
export const eventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  from_date: z.string({message: 'From date is required'}).transform((val) => new Date(val)).refine((date) => date > new Date(), {
    message: 'From date must be in the future',
  }),
  from_time: z.string().min(1, { message: 'From time is required' }),
  to_date: z.string({message: 'To date is required'}).transform((val) => new Date(val)).refine((date) => date > new Date(), {
    message: 'To date must be in the future',
  }),
  to_time: z.string().min(1, { message: 'To time is required' }),
  venue: z.string().min(1, { message: 'Venue is required' }),
  latitude: z.number().min(-90).max(90, { message: 'Latitude must be between -90 and 90' }),
  longitude: z.number().min(-180).max(180, { message: 'Longitude must be between -180 and 180' }),
  category: z.string().min(1, { message: 'Category is required' }),
  price: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }).min(0, { message: 'Price must be a positive number' })),

  organizer_id: z.number(),
//   status: z.enum(['Accepted', 'Pending', 'Rejected'], {
//     required_error: 'Status is required',
//   }),
}).superRefine((data, ctx) => {
  // To date must be after from date
  if (data.to_date < data.from_date) {
    ctx.addIssue({
      path: ['to_date'],
      message: 'To date must be on or after from date',
      code: z.ZodIssueCode.custom,
    });
  }

  // Compare time if on same date
  if (data.from_date.toDateString() === data.to_date.toDateString()) {
    const [fromHour, fromMinute] = data.from_time.split(':').map(Number);
    const [toHour, toMinute] = data.to_time.split(':').map(Number);

    const fromTotalMinutes = Number(fromHour) * 60 + Number(fromMinute);
    const toTotalMinutes = Number(toHour) * 60 + Number(toMinute);

    if (fromTotalMinutes >= toTotalMinutes) {
      ctx.addIssue({
        path: ['to_time'],
        message: 'To time must be after from time if on the same day',
        code: z.ZodIssueCode.custom,
      });
    }
  }
});
