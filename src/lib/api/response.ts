
type ApiSuccessOptions<T> = {
  message: string;
  data: T;
  status?: number;
};

type ApiErrorOptions = {
  message: string;
  status: number;
  errors?: unknown;
};

export function apiSuccess<T>({
  message,
  data,
  status = 200,
}: ApiSuccessOptions<T>) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

export function apiError({
  message,
  status,
  errors,
}: ApiErrorOptions) {
  return Response.json(
    {
      success: false,
      message,
      ...(errors !== undefined && { errors }),
    },
    { status },
  );
}
